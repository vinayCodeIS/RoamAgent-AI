export interface Activity {
  id: string;
  timeOfDay: 'Morning' | 'Afternoon' | 'Evening';
  name: string;
  description: string;
  category: string; // e.g. Food, Culture, Adventure, Shopping, Entertainment
}

export interface DayPlan {
  dayNumber: number;
  title: string;
  activities: Activity[];
}

export interface BudgetBreakdown {
  flights: number;
  accommodation: number;
  food: number;
  activities: number;
  total: number;
}

export interface RecommendedHotel {
  name: string;
  tier: 'Budget Friendly' | 'Mid Range' | 'Luxury';
  priceEstimate: string;
  rating: string;
  description: string;
}

export interface PackingItem {
  id: string;
  name: string;
  category: string; // Clothing, Toiletries, Electronics, Documents, Essentials
  packed: boolean;
}

export interface ExpenseItem {
  id: string;
  category: 'Flights' | 'Accommodation' | 'Food' | 'Activities' | 'Other';
  name: string;
  amount: number;
  isActual: boolean; // false = estimated, true = logged/actual expense by user
}

export interface Trip {
  id: string;
  userId: string;
  destination: string;
  numDays: number;
  budgetType: 'Low' | 'Medium' | 'High';
  interests: string[];
  days: DayPlan[];
  budgetBreakdown: BudgetBreakdown;
  hotels: RecommendedHotel[];
  packingList: PackingItem[];
  expenses: ExpenseItem[];
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}
