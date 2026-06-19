import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { BudgetBreakdown, DayPlan, RecommendedHotel, PackingItem, Activity } from "./types.js";

// Load environment variables immediately
dotenv.config();

let aiClient: GoogleGenAI | null = null;

function getAi(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not set. Please ensure it is provided in your .env file.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

interface GeneratedTripResponse {
  title: string;
  days: {
    dayNumber: number;
    title: string;
    activities: {
      timeOfDay: 'Morning' | 'Afternoon' | 'Evening';
      name: string;
      description: string;
      category: string;
    }[];
  }[];
  budgetBreakdown: BudgetBreakdown;
  hotels: RecommendedHotel[];
  suggestedPackingList: {
    name: string;
    category: 'Clothing' | 'Toiletries' | 'Electronics' | 'Documents' | 'Essentials';
  }[];
}

export async function generateTripPlan(
  destination: string,
  numDays: number,
  budgetType: 'Low' | 'Medium' | 'High',
  interests: string[]
): Promise<GeneratedTripResponse> {
  const interestsStr = interests.length > 0 ? interests.join(', ') : 'General exploration';

  const prompt = `Generate a comprehensive travel itinerary for a ${numDays}-day trip to "${destination}".
Budget Preference: "${budgetType}" (Low = strict budgeting/free activities, Medium = balanced, High = luxury/special experiences).
User Interests/Preferences: ${interestsStr}.

You must structure the response with:
1. A day-by-day plan with exactly ${numDays} days. For each day, provide exactly 3 activities: one in the Morning, one in the Afternoon, and one in the Evening.
2. An estimated budget in USD specifically optimized for ${numDays} days at ${budgetType} tier in ${destination} (estimate typical flights, accommodation, food, and activity totals).
3. Exactly 3 recommended hotels: 1 "Budget Friendly", 1 "Mid Range", and 1 "Luxury" matching traveler rating standards for ${destination}.
4. A customized travel packing checklist for this destination (around 8 essential specific items with category labels).`;

  const ai = getAi();
  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: prompt,
    config: {
      systemInstruction: `You are an expert global travel planner agent. You generate high-quality, practical travel itineraries and accurate, localized budget estimations in clean, validated JSON format. Ensure names and locations are real and interesting. Do not include extra markdown outside of the JSON block.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "A catchy trip title" },
          days: {
            type: Type.ARRAY,
            description: "List of days inside the itinerary",
            items: {
              type: Type.OBJECT,
              properties: {
                dayNumber: { type: Type.INTEGER },
                title: { type: Type.STRING, description: "Themes of this day" },
                activities: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      timeOfDay: { type: Type.STRING, enum: ["Morning", "Afternoon", "Evening"] },
                      name: { type: Type.STRING },
                      description: { type: Type.STRING, description: "Detailed 1-2 sentence description of what the user will do" },
                      category: { type: Type.STRING, description: "Category like Food, Culture, Adventure, Shopping, Nature, Transit" }
                    },
                    required: ["timeOfDay", "name", "description", "category"]
                  }
                }
              },
              required: ["dayNumber", "title", "activities"]
            }
          },
          budgetBreakdown: {
            type: Type.OBJECT,
            properties: {
              flights: { type: Type.NUMBER, description: "Estimated average international/domestic flight cost to destination in USD" },
              accommodation: { type: Type.NUMBER, description: "Estimated total hotel stay cost for the duration in USD" },
              food: { type: Type.NUMBER, description: "Estimated total food/dining expenses for the duration in USD" },
              activities: { type: Type.NUMBER, description: "Estimated total ticket/tours expenses for the duration in USD" },
              total: { type: Type.NUMBER, description: "Crucial: Sum of flights, accommodation, food, and activities in USD" }
            },
            required: ["flights", "accommodation", "food", "activities", "total"]
          },
          hotels: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                tier: { type: Type.STRING, enum: ["Budget Friendly", "Mid Range", "Luxury"] },
                priceEstimate: { type: Type.STRING, description: "e.g. '$60/night'" },
                rating: { type: Type.STRING, description: "e.g. '4.6/5'" },
                description: { type: Type.STRING, description: "Short caption explaining why this is recommended" }
              },
              required: ["name", "tier", "priceEstimate", "rating", "description"]
            }
          },
          suggestedPackingList: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, description: "Specific item, e.g., 'Rain jacket', 'Comfortable walking shoes', 'Travel adapter'" },
                category: { type: Type.STRING, enum: ["Clothing", "Toiletries", "Electronics", "Documents", "Essentials"] }
              },
              required: ["name", "category"]
            }
          }
        },
        required: ["title", "days", "budgetBreakdown", "hotels", "suggestedPackingList"]
      }
    }
  });

  const parsed = JSON.parse(response.text.trim()) as GeneratedTripResponse;
  return parsed;
}

export async function regenerateDayPlan(
  destination: string,
  dayNumber: number,
  currentDayPlan: DayPlan,
  budgetType: 'Low' | 'Medium' | 'High',
  interests: string[],
  userInstruction: string
): Promise<DayPlan> {
  const prompt = `You need to regenerate Day ${dayNumber} for an itinerary in "${destination}".
Original Day Title: "${currentDayPlan.title}".
Original Activities:
${JSON.stringify(currentDayPlan.activities, null, 2)}

User Request instruction for regeneration: "${userInstruction}".
Budget Preference: "${budgetType}".
User General Interests: ${interests.join(', ')}.

Create a modified DayPlan substituting current activities with new ones centered on the user's specific request, but matching the context, style, and flow. The regenerated day must fit perfectly as a replacements containing a Morning, Afternoon, and Evening activity.`;

  const ai = getAi();
  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: prompt,
    config: {
      systemInstruction: `You are an expert travel planner modifier. Create high quality modified schedules strictly according to user instructions. Output only the requested DayPlan in valid JSON format.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          dayNumber: { type: Type.INTEGER },
          title: { type: Type.STRING, description: "Theme of this day" },
          activities: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                timeOfDay: { type: Type.STRING, enum: ["Morning", "Afternoon", "Evening"] },
                name: { type: Type.STRING },
                description: { type: Type.STRING, description: "Detailed 1-2 sentence description" },
                category: { type: Type.STRING }
              },
              required: ["timeOfDay", "name", "description", "category"]
            }
          }
        },
        required: ["dayNumber", "title", "activities"]
      }
    }
  });

  const parsed = JSON.parse(response.text.trim()) as DayPlan;
  parsed.dayNumber = dayNumber; // Enforce correct day number
  return parsed;
}
