import express from 'express';
import path from 'node:path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import crypto from 'node:crypto';

// Load ecosystem variables
dotenv.config();

import {
  createUser,
  getUserByEmail,
  generateToken,
  verifyToken,
  getTripsByUserId,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
  verifyPassword
} from './src/db.js';
import { generateTripPlan, regenerateDayPlan } from './src/gemini.js';
import { Trip, Activity, PackingItem, ExpenseItem } from './src/types.js';

const PORT = Number(process.env.PORT) || 3000;

// Token validation middleware
function authenticate(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'Invalid or expired session token' });
  }

  req.userId = payload.userId;
  req.userEmail = payload.email;
  next();
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // HEALTH CHECK
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // AUTH ENDPOINTS
  app.post('/api/auth/register', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password || email.indexOf('@') === -1 || password.length < 5) {
      return res.status(400).json({ error: 'Valid email and password (min 5 characters) required.' });
    }

    try {
      const user = createUser(email, password);
      const token = generateToken({ userId: user.id, email: user.email });
      res.status(201).json({
        token,
        user: { id: user.id, email: user.email }
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Registration failed.' });
    }
  });

  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
      const user = getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      const valid = verifyPassword(password, user.passwordHash, user.salt);
      if (!valid) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      const token = generateToken({ userId: user.id, email: user.email });
      res.json({
        token,
        user: { id: user.id, email: user.email }
      });
    } catch (err: any) {
      res.status(500).json({ error: 'An unexpected internal error occurred.' });
    }
  });

  app.get('/api/auth/me', authenticate, (req: any, res) => {
    res.json({
      user: { id: req.userId, email: req.userEmail }
    });
  });

  // ITINERARY ENDPOINTS
  app.get('/api/trips', authenticate, (req: any, res) => {
    try {
      const trips = getTripsByUserId(req.userId);
      res.json({ trips });
    } catch (err: any) {
      res.status(500).json({ error: 'Could not fetch user trips.' });
    }
  });

  app.get('/api/trips/:id', authenticate, (req: any, res) => {
    try {
      const trip = getTripById(req.params.id);
      if (!trip) {
        return res.status(404).json({ error: 'Trip not found.' });
      }
      if (trip.userId !== req.userId) {
        return res.status(403).json({ error: 'Access forbidden: unauthorized trip owner.' });
      }
      res.json({ trip });
    } catch (err: any) {
      res.status(500).json({ error: 'Could not fetch details.' });
    }
  });

  app.delete('/api/trips/:id', authenticate, (req: any, res) => {
    try {
      deleteTrip(req.params.id, req.userId);
      res.json({ success: true, message: 'Trip itinerary deleted successfully.' });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Operation failed.' });
    }
  });

  // GENERATE NEW AI TRIP ITINERARY
  app.post('/api/trips/generate', authenticate, async (req: any, res) => {
    const { destination, numDays, budgetType, interests } = req.body;

    if (!destination || !numDays || !budgetType) {
      return res.status(400).json({ error: 'Missing required parameters: destination, days, or budget type.' });
    }

    const daysCount = parseInt(numDays, 10);
    if (isNaN(daysCount) || daysCount < 1 || daysCount > 14) {
      return res.status(400).json({ error: 'Duration must be between 1 and 14 days.' });
    }

    try {
      // 1. Calls Gemini generator to output full text/budget breakdown
      const aiResponse = await generateTripPlan(destination, daysCount, budgetType, interests || []);

      // 2. Map structure to our database contract, injecting unique element IDs
      const mappedDays = aiResponse.days.map(d => ({
        dayNumber: d.dayNumber,
        title: d.title,
        activities: d.activities.map(a => ({
          id: crypto.randomUUID(),
          timeOfDay: a.timeOfDay,
          name: a.name,
          description: a.description,
          category: a.category
        }))
      }));

      const mappedPackingList: PackingItem[] = aiResponse.suggestedPackingList.map(item => ({
        id: crypto.randomUUID(),
        name: item.name,
        category: item.category,
        packed: false
      }));

      // Seed initial estimated expenditures
      const b = aiResponse.budgetBreakdown;
      const initialExpenses: ExpenseItem[] = [
        { id: crypto.randomUUID(), category: 'Flights', name: 'Estimated Round-Trip Flight', amount: b.flights, isActual: false },
        { id: crypto.randomUUID(), category: 'Accommodation', name: 'Estimated Accommodation Package', amount: b.accommodation, isActual: false },
        { id: crypto.randomUUID(), category: 'Food', name: 'Estimated Meals Food allocation', amount: b.food, isActual: false },
        { id: crypto.randomUUID(), category: 'Activities', name: 'Estimated Sightseeing entry/tours', amount: b.activities, isActual: false }
      ];

      const trip = createTrip({
        userId: req.userId,
        destination,
        numDays: daysCount,
        budgetType,
        interests: interests || [],
        days: mappedDays,
        budgetBreakdown: {
          flights: b.flights,
          accommodation: b.accommodation,
          food: b.food,
          activities: b.activities,
          total: b.total
        },
        hotels: aiResponse.hotels,
        packingList: mappedPackingList,
        expenses: initialExpenses
      });

      res.status(201).json({ trip });
    } catch (err: any) {
      console.error("AI Generation error: ", err);
      res.status(500).json({ error: 'Failed to generate itinerary. Please try again in a few moments.' });
    }
  });

  // DAY REGENERATION
  app.post('/api/trips/:id/regenerate-day', authenticate, async (req: any, res) => {
    const { dayNumber, instruction } = req.body;
    if (!dayNumber || !instruction) {
      return res.status(400).json({ error: 'Day number and prompt instruction are required.' });
    }

    try {
      const trip = getTripById(req.params.id);
      if (!trip) {
        return res.status(404).json({ error: 'Trip not found.' });
      }
      if (trip.userId !== req.userId) {
        return res.status(403).json({ error: 'Unauthorized.' });
      }

      const parsedDayIndex = parseInt(dayNumber, 10);
      const dayPlanToRegen = trip.days.find(d => d.dayNumber === parsedDayIndex);
      if (!dayPlanToRegen) {
        return res.status(400).json({ error: 'Invalid day number for this itinerary.' });
      }

      // Call Gemini for targeted day replacement
      const newDayPlan = await regenerateDayPlan(
        trip.destination,
        parsedDayIndex,
        dayPlanToRegen,
        trip.budgetType,
        trip.interests,
        instruction
      );

      // Map UUIDs to new activities
      newDayPlan.activities = newDayPlan.activities.map(act => ({
        ...act,
        id: crypto.randomUUID()
      }));

      const updated = updateTrip(trip.id, req.userId, (prevTrip) => {
        const daysCopy = [...prevTrip.days];
        const dayIdx = daysCopy.findIndex(d => d.dayNumber === parsedDayIndex);
        if (dayIdx !== -1) {
          daysCopy[dayIdx] = newDayPlan;
        }
        return {
          ...prevTrip,
          days: daysCopy
        };
      });

      res.json({ trip: updated });
    } catch (err: any) {
      console.error("Regenerate day error: ", err);
      res.status(500).json({ error: 'Failed to regenerate requested day.' });
    }
  });

  // MANUALLY ADD ACTIVITY TO ITINERARY
  app.post('/api/trips/:id/activities/add', authenticate, (req: any, res) => {
    const { dayNumber, timeOfDay, name, description, category } = req.body;
    if (!dayNumber || !timeOfDay || !name || !description) {
      return res.status(400).json({ error: 'Missing activity requirements.' });
    }

    try {
      const updated = updateTrip(req.params.id, req.userId, (prevTrip) => {
        const parsedDay = parseInt(dayNumber, 10);
        const daysCopy = prevTrip.days.map((d) => {
          if (d.dayNumber === parsedDay) {
            const newActivity: Activity = {
              id: crypto.randomUUID(),
              timeOfDay,
              name,
              description,
              category: category || 'Other'
            };
            return {
              ...d,
              activities: [...d.activities, newActivity]
            };
          }
          return d;
        });
        return { ...prevTrip, days: daysCopy };
      });

      res.json({ trip: updated });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Operation failed.' });
    }
  });

  // MANUALLY REMOVE ACTIVITY FROM ITINERARY
  app.post('/api/trips/:id/activities/remove', authenticate, (req: any, res) => {
    const { dayNumber, activityId } = req.body;
    if (!dayNumber || !activityId) {
      return res.status(400).json({ error: 'Day number and activity ID are required.' });
    }

    try {
      const updated = updateTrip(req.params.id, req.userId, (prevTrip) => {
        const parsedDay = parseInt(dayNumber, 10);
        const daysCopy = prevTrip.days.map((d) => {
          if (d.dayNumber === parsedDay) {
            return {
              ...d,
              activities: d.activities.filter((act) => act.id !== activityId)
            };
          }
          return d;
        });
        return { ...prevTrip, days: daysCopy };
      });

      res.json({ trip: updated });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Operation failed.' });
    }
  });

  // PACKING LIST TOGGLE CHECKLIST
  app.post('/api/trips/:id/packing/toggle', authenticate, (req: any, res) => {
    const { itemId } = req.body;
    if (!itemId) {
      return res.status(400).json({ error: 'Item ID required' });
    }

    try {
      const updated = updateTrip(req.params.id, req.userId, (prevTrip) => {
        const packingCopy = prevTrip.packingList.map((item) => {
          if (item.id === itemId) {
            return { ...item, packed: !item.packed };
          }
          return item;
        });
        return { ...prevTrip, packingList: packingCopy };
      });
      res.json({ trip: updated });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // ACTUAL SPEND / EXPENSE LOGGER -- ET & EM
  app.post('/api/trips/:id/expenses/add', authenticate, (req: any, res) => {
    const { category, name, amount } = req.body;
    const expenseAmt = parseFloat(amount);

    if (!category || !name || isNaN(expenseAmt) || expenseAmt < 0) {
      return res.status(400).json({ error: 'Valid category, name, and positive amount are required.' });
    }

    try {
      const updated = updateTrip(req.params.id, req.userId, (prevTrip) => {
        const newExpense: ExpenseItem = {
          id: crypto.randomUUID(),
          category,
          name,
          amount: expenseAmt,
          isActual: true // Mark as logged, user-input spend
        };
        return {
          ...prevTrip,
          expenses: [...prevTrip.expenses, newExpense]
        };
      });
      res.json({ trip: updated });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.delete('/api/trips/:id/expenses/:expenseId', authenticate, (req: any, res) => {
    try {
      const updated = updateTrip(req.params.id, req.userId, (prevTrip) => {
        return {
          ...prevTrip,
          expenses: prevTrip.expenses.filter((exp) => exp.id !== req.params.expenseId)
        };
      });
      res.json({ trip: updated });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[FULLSTACK] Server running on http://127.0.0.1:${PORT}`);
  });
}

startServer().catch(console.error);
