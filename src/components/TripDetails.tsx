import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, Bed, Utensils, Compass, Tag, Trash, Plus, Sparkles, 
  CheckSquare, Square, DollarSign, Wallet, RefreshCw, AlertCircle, ShoppingBag, Landmark, Map, Check
} from 'lucide-react';
import { Trip, Activity, PackingItem, ExpenseItem } from '../types.js';
import { TripMap } from './TripMap.js';

export function getDestinationHeroImage(destination: string): string {
  const dest = destination.toLowerCase();
  if (dest.includes('tokyo') || dest.includes('japan') || dest.includes('kyoto') || dest.includes('osaka')) {
    return 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80';
  }
  if (dest.includes('paris') || dest.includes('france') || dest.includes('nice') || dest.includes('lyon')) {
    return 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80';
  }
  if (dest.includes('rome') || dest.includes('italy') || dest.includes('venice') || dest.includes('florence') || dest.includes('amalfi')) {
    return 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80';
  }
  if (dest.includes('new york') || dest.includes('nyc') || dest.includes('manhattan') || dest.includes('usa') || dest.includes('america') || dest.includes('san francisco') || dest.includes('los angeles')) {
    return 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80';
  }
  if (dest.includes('reykjavik') || dest.includes('iceland')) {
    return 'https://images.unsplash.com/photo-1504829857797-ddff28127792?auto=format&fit=crop&w=1200&q=80';
  }
  if (dest.includes('bali') || dest.includes('indonesia') || dest.includes('ubud')) {
    return 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80';
  }
  if (dest.includes('london') || dest.includes('united kingdom') || dest.includes('uk') || dest.includes('scotland') || dest.includes('edinburgh')) {
    return 'https://images.unsplash.com/photo-1513635269975-59663e0ca1ad?auto=format&fit=crop&w=1200&q=80';
  }
  if (dest.includes('sydney') || dest.includes('melbourne') || dest.includes('australia')) {
    return 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=80';
  }
  if (dest.includes('barcelona') || dest.includes('madrid') || dest.includes('spain') || dest.includes('mallorca') || dest.includes('ibiza')) {
    return 'https://images.unsplash.com/photo-1583779457094-0cfcf3600897?auto=format&fit=crop&w=1200&q=80';
  }
  if (dest.includes('swiss') || dest.includes('switzerland') || dest.includes('alps') || dest.includes('zurich') || dest.includes('geneva')) {
    return 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80';
  }
  if (dest.includes('hawaii') || dest.includes('maui') || dest.includes('honolulu')) {
    return 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=1200&q=80';
  }
  if (dest.includes('greece') || dest.includes('santorini') || dest.includes('athens') || dest.includes('mykonos')) {
    return 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80';
  }
  if (dest.includes('egypt') || dest.includes('cairo') || dest.includes('pyramids')) {
    return 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=1200&q=80';
  }
  if (dest.includes('dubai') || dest.includes('uae') || dest.includes('abu dhabi')) {
    return 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80';
  }
  if (dest.includes('singapore')) {
    return 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80';
  }
  if (dest.includes('beach') || dest.includes('beach') || dest.includes('maldives') || dest.includes('caribbean') || dest.includes('bahamas')) {
    return 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=1200&q=80';
  }
  if (dest.includes('mountain') || dest.includes('mountains') || dest.includes('hike') || dest.includes('trekking')) {
    return 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1200&q=80';
  }
  if (dest.includes('amsterdam') || dest.includes('netherlands')) {
    return 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80';
  }
  if (dest.includes('berlin') || dest.includes('germany') || dest.includes('munich')) {
    return 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1200&q=80';
  }
  if (dest.includes('copenhagen') || dest.includes('denmark')) {
    return 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?auto=format&fit=crop&w=1200&q=80';
  }
  if (dest.includes('seoul') || dest.includes('korea')) {
    return 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80';
  }
  if (dest.includes('bangkok') || dest.includes('thailand') || dest.includes('phuket')) {
    return 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80';
  }
  if (dest.includes('canada') || dest.includes('toronto') || dest.includes('vancouver')) {
    return 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=1200&q=80';
  }
  if (dest.includes('mexico') || dest.includes('cancun')) {
    return 'https://images.unsplash.com/photo-1512813583145-baaa340ef29f?auto=format&fit=crop&w=1200&q=80';
  }
  if (dest.includes('rio') || dest.includes('brazil')) {
    return 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1200&q=80';
  }
  if (dest.includes('cape town') || dest.includes('south africa')) {
    return 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=1200&q=80';
  }
  if (dest.includes('india') || dest.includes('delhi') || dest.includes('mumbai') || dest.includes('taj mahal')) {
    return 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80';
  }
  return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80';
}

export function getHotelImage(tier: string): string {
  const t = tier.toLowerCase();
  if (t.includes('luxury')) {
    return 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80';
  }
  if (t.includes('mid') || t.includes('medium')) {
    return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80';
  }
  return 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80';
}

interface TripDetailsProps {
  trip: Trip;
  onTripUpdate: (updatedTrip: Trip) => void;
  token: string;
}

export default function TripDetails({ trip, onTripUpdate, token }: TripDetailsProps) {
  const [activeTab, setActiveTab] = useState<'itinerary' | 'budget' | 'hotels' | 'packing'>('itinerary');
  const [selectedDay, setSelectedDay] = useState(1);
  
  // Custom activity form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newActTime, setNewActTime] = useState<'Morning' | 'Afternoon' | 'Evening'>('Morning');
  const [newActName, setNewActName] = useState('');
  const [newActDesc, setNewActDesc] = useState('');
  const [newActCategory, setNewActCategory] = useState('Culture');

  // Regenerate Day form state
  const [showRegenInput, setShowRegenInput] = useState<number | null>(null);
  const [regenInstruction, setRegenInstruction] = useState('');
  const [dayLoading, setDayLoading] = useState<number | null>(null);

  // Expense form state
  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState<'Flights' | 'Accommodation' | 'Food' | 'Activities' | 'Other'>('Food');

  const [apiError, setApiError] = useState<string | null>(null);
  const [addingActivity, setAddingActivity] = useState(false);
  const [loggingExpense, setLoggingExpense] = useState(false);

  // Utility to map category to color (Natural Tones matching theme palette)
  const getCategoryTheme = (cat: string) => {
    const c = cat.toLowerCase();
    if (c.includes('food') || c.includes('dine') || c.includes('dining')) {
      return { bg: 'bg-[#FAF9F6] text-amber-800 border-amber-200', icon: '🍣' };
    }
    if (c.includes('shop') || c.includes('store')) {
      return { bg: 'bg-[#FAF9F6] text-[#6B6B6B] border-[#E6E2DD]', icon: '🛍️' };
    }
    if (c.includes('adventure') || c.includes('hiking') || c.includes('sport')) {
      return { bg: 'bg-emerald-50 text-emerald-800 border-emerald-200', icon: '🧗' };
    }
    if (c.includes('culture') || c.includes('art') || c.includes('museum') || c.includes('landmark')) {
      return { bg: 'bg-[#4A6741]/10 text-[#4A6741] border-[#4A6741]/20', icon: '🏛️' };
    }
    if (c.includes('transit') || c.includes('flight') || c.includes('travel')) {
      return { bg: 'bg-sky-50 text-sky-800 border-sky-100', icon: '✈️' };
    }
    return { bg: 'bg-[#F2EDE7] text-[#2C2C2C] border-[#E6E2DD]', icon: '📍' };
  };

  // API Call handlers
  const handleTogglePacking = async (itemId: string) => {
    try {
      const response = await fetch(`/api/trips/${trip.id}/packing/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ itemId })
      });
      if (!response.ok) throw new Error('Failed to toggle packing checklist item');
      const data = await response.json();
      onTripUpdate(data.trip);
    } catch (err: any) {
      setApiError(err.message);
    }
  };

  const handleRemoveActivity = async (dayNumber: number, activityId: string) => {
    try {
      const response = await fetch(`/api/trips/${trip.id}/activities/remove`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ dayNumber, activityId })
      });
      if (!response.ok) throw new Error('Failed to remove activity from schedule');
      const data = await response.json();
      onTripUpdate(data.trip);
    } catch (err: any) {
      setApiError(err.message);
    }
  };

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActName.trim() || !newActDesc.trim() || addingActivity) return;
    setAddingActivity(true);
    setApiError(null);

    try {
      const response = await fetch(`/api/trips/${trip.id}/activities/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          dayNumber: selectedDay,
          timeOfDay: newActTime,
          name: newActName,
          description: newActDesc,
          category: newActCategory
        })
      });
      if (!response.ok) throw new Error('Could not append activity to schedule');
      const data = await response.json();
      onTripUpdate(data.trip);
      
      // Reset form variables
      setNewActName('');
      setNewActDesc('');
      setShowAddModal(false);
    } catch (err: any) {
      setApiError(err.message);
    } finally {
      setAddingActivity(false);
    }
  };

  const handleRegenerateDay = async (dayNum: number) => {
    if (!regenInstruction.trim() || dayLoading !== null) return;
    setDayLoading(dayNum);
    setApiError(null);
    setShowRegenInput(null);

    try {
      const response = await fetch(`/api/trips/${trip.id}/regenerate-day`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          dayNumber: dayNum,
          instruction: regenInstruction
        })
      });
      if (!response.ok) throw new Error('AI failed to customize this day schedule');
      const data = await response.json();
      onTripUpdate(data.trip);
      setRegenInstruction('');
    } catch (err: any) {
      setApiError(err.message);
    } finally {
      setDayLoading(null);
    }
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(expenseAmount);
    if (!expenseName.trim() || isNaN(amt) || amt < 0 || loggingExpense) return;
    setLoggingExpense(true);
    setApiError(null);

    try {
      const response = await fetch(`/api/trips/${trip.id}/expenses/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          category: expenseCategory,
          name: expenseName,
          amount: amt
        })
      });
      if (!response.ok) throw new Error('Could not save expense transaction');
      const data = await response.json();
      onTripUpdate(data.trip);
      setExpenseName('');
      setExpenseAmount('');
    } catch (err: any) {
      setApiError(err.message);
    } finally {
      setLoggingExpense(false);
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    try {
      const response = await fetch(`/api/trips/${trip.id}/expenses/${expenseId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to delete expense transaction log');
      const data = await response.json();
      onTripUpdate(data.trip);
    } catch (err: any) {
      setApiError(err.message);
    }
  };

  // EXPENSE COMPUTATIONS
  const estBudget = trip.budgetBreakdown;
  const flightsEst = estBudget.flights;
  const lodgingEst = estBudget.accommodation;
  const foodEst = estBudget.food;
  const activitiesEst = estBudget.activities;
  const totalOriginalEstimate = estBudget.total;

  const actualExpenses = trip.expenses.filter(e => e.isActual);
  const actualFlights = actualExpenses.filter(e => e.category === 'Flights').reduce((sum, e) => sum + e.amount, 0);
  const actualLodging = actualExpenses.filter(e => e.category === 'Accommodation').reduce((sum, e) => sum + e.amount, 0);
  const actualFood = actualExpenses.filter(e => e.category === 'Food').reduce((sum, e) => sum + e.amount, 0);
  const actualActivities = actualExpenses.filter(e => e.category === 'Activities').reduce((sum, e) => sum + e.amount, 0);
  const actualOthers = actualExpenses.filter(e => e.category === 'Other').reduce((sum, e) => sum + e.amount, 0);
  
  const totalActualSpent = actualFlights + actualLodging + actualFood + actualActivities + actualOthers;
  const totalBudgetProgressPercent = Math.min(Math.round((totalActualSpent / totalOriginalEstimate) * 100), 150);

  // Packing ratio
  const packedCount = trip.packingList.filter((item) => item.packed).length;
  const totalPackItems = trip.packingList.length;
  const packingProgressPercent = totalPackItems > 0 ? Math.round((packedCount / totalPackItems) * 100) : 0;

  return (
    <div className="space-y-6 text-[#2C2C2C]" id="active-trip-workspace">
      
      {/* IMMERSIVE SCENIC HERO COVER */}
      <div className="relative rounded-2xl h-56 md:h-72 overflow-hidden flex flex-col justify-end p-5 md:p-8 text-white shadow-sm border border-[#E6E2DD]">
        <img 
          src={getDestinationHeroImage(trip.destination)} 
          alt={trip.destination}
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] scale-100 hover:scale-[1.03] select-none pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/5 pointer-events-none"></div>
        
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#4A6741] text-[10px] font-bold uppercase tracking-widest rounded-lg">
            <span>READY TO EXPLORE</span>
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-semibold tracking-tight leading-none text-white drop-shadow-sm">
            {trip.destination}
          </h1>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/90 font-medium">
            <span className="flex items-center gap-1.5 px-2 py-0.5 bg-black/20 backdrop-blur-md rounded-lg border border-white/10">
              <Calendar className="w-3.5 h-3.5 text-emerald-300" /> {trip.numDays} Days
            </span>
            <span className="flex items-center gap-1.5 px-2 py-0.5 bg-black/20 backdrop-blur-md rounded-lg border border-white/10">
              <DollarSign className="w-3.5 h-3.5 text-emerald-300" /> {trip.budgetType} Budget
            </span>
            <span className="hidden sm:inline opacity-40">|</span>
            <div className="flex gap-1.5 flex-wrap">
              {trip.interests.map((int) => (
                <span key={int} className="px-2.5 py-0.5 bg-[#4A6741]/40 hover:bg-[#4A6741]/60 backdrop-blur-sm rounded-full text-[10px] text-emerald-200 font-bold border border-[#4A6741]/35 transition-colors">
                  {int}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RESPONSIVE TRACKER BENTO PANEL */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="global-progress-indicators-bar">
        {/* Total Spend progress card */}
        <div className="bg-white border border-[#E6E2DD] rounded-2xl p-5 flex items-center justify-between gap-4 shadow-sm hover:border-[#4A6741]/50 transition-all">
          <div className="flex-1 space-y-1">
            <p className="text-[10px] font-bold text-[#8E8E8E] uppercase tracking-wider font-sans">TOTAL SPEND TRACKER</p>
            <p className="text-xl font-serif text-[#2C2C2C] font-semibold flex items-baseline gap-1.5">
              ${totalActualSpent.toLocaleString()} 
              <span className="text-xs text-[#8E8E8E] font-sans font-normal">/ ${totalOriginalEstimate.toLocaleString()} estimated</span>
            </p>
            <div className="w-full bg-[#FAF9F6] h-1.5 rounded-full overflow-hidden border border-[#E6E2DD]/40 relative mt-2">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${totalActualSpent > totalOriginalEstimate ? 'bg-amber-600' : 'bg-[#4A6741]'}`}
                style={{ width: `${Math.min(totalBudgetProgressPercent, 100)}%` }}
              ></div>
            </div>
          </div>
          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-center shrink-0">
            <Wallet className="w-6 h-6 text-[#4A6741]" />
          </div>
        </div>

        {/* Luggage Packed progress card */}
        <div className="bg-white border border-[#E6E2DD] rounded-2xl p-5 flex items-center justify-between gap-4 shadow-sm hover:border-[#4A6741]/50 transition-all">
          <div className="flex-1 space-y-1">
            <p className="text-[10px] font-bold text-[#8E8E8E] uppercase tracking-wider font-sans">LUGGAGE PACKED</p>
            <p className="text-xl font-serif text-[#2C2C2C] font-semibold flex items-baseline gap-1.5">
              {packedCount} 
              <span className="text-xs text-[#8E8E8E] font-sans font-normal">/ {totalPackItems} items ready</span>
            </p>
            <div className="w-full bg-[#FAF9F6] h-1.5 rounded-full overflow-hidden border border-[#E6E2DD]/40 relative mt-2">
              <div 
                className="bg-[#4A6741] h-full rounded-full transition-all duration-500"
                style={{ width: `${packingProgressPercent}%` }}
              ></div>
            </div>
          </div>
          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-6 h-6 text-[#4A6741]" />
          </div>
        </div>
      </div>

      {apiError && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-700 text-xs rounded-xl flex items-center justify-between gap-3">
          <span className="flex items-center gap-2 font-medium"><AlertCircle className="w-4 h-4 shrink-0 text-red-500" /> {apiError}</span>
          <button onClick={() => setApiError(null)} className="font-bold hover:text-red-950 cursor-pointer px-2">X</button>
        </div>
      )}

      {/* TABS SELECTOR */}
      <div className="flex border-b border-[#E6E2DD] gap-1 overflow-x-auto flex-nowrap pb-px scrollbar-none">
        {[
          { id: 'itinerary', label: 'Day-by-Day Schedule', icon: Compass },
          { id: 'budget', label: 'Expenses & Budget Tracker', icon: Wallet },
          { id: 'hotels', label: 'Stays & Hotels Suggestions', icon: Bed },
          { id: 'packing', label: 'Destination Packing Checklist', icon: CheckSquare }
        ].map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              id={`tab-btn-${tab.id}`}
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3.5 px-5 text-xs font-semibold flex items-center gap-2 border-b-2 whitespace-nowrap cursor-pointer transition-all ${
                isActive 
                  ? 'border-[#4A6741] text-[#4A6741] font-bold bg-white' 
                  : 'border-transparent text-[#6B6B6B] hover:text-[#2C2C2C] hover:bg-[#FAF9F6]'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* CORE WORKSPACE CONTENT */}
      <div className="min-h-[400px]" id="workspace-tab-contents">
        <AnimatePresence mode="wait">
          
          {/* 1. ITINERARY TAB */}
          {activeTab === 'itinerary' && (
            <motion.div
              key="itinerary-tab"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="grid grid-cols-1 lg:grid-cols-4 gap-6"
            >
              {/* Day Quick Navigation Column */}
              <div className="lg:col-span-1 space-y-3">
                <p className="text-[11px] font-bold text-[#8E8E8E] uppercase tracking-wider pl-1 font-sans">Days List</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-1 gap-2.5 w-full">
                  {trip.days.map((pDay) => (
                    <button
                      id={`day-nav-btn-${pDay.dayNumber}`}
                      key={pDay.dayNumber}
                      onClick={() => setSelectedDay(pDay.dayNumber)}
                      className={`text-left p-3 rounded-xl flex lg:items-center justify-between transition-all border cursor-pointer min-w-0 w-full overflow-hidden ${
                        selectedDay === pDay.dayNumber
                          ? 'bg-[#4A6741]/5 border-[#4A6741] text-[#4A6741] font-semibold shadow-sm'
                          : 'bg-[#FAF9F6] border-[#E6E2DD] text-[#6B6B6B] hover:text-[#2C2C2C] hover:bg-[#E6E2DD]/30'
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center gap-x-2 gap-y-0.5 text-xs min-w-0 w-full">
                        <span className="font-mono text-[#8E8E8E] text-[9px] uppercase tracking-wider shrink-0">Day {pDay.dayNumber}</span>
                        <span className="truncate text-[#2C2C2C] font-semibold block w-full">{pDay.title}</span>
                      </div>
                      <span className="hidden lg:inline-block text-[9px] bg-[#E6E2DD]/60 text-[#2C2C2C] px-1.5 py-0.5 rounded font-mono font-bold shrink-0 ml-1.5 font-sans">
                        {pDay.activities.length}
                      </span>
                    </button>
                  ))}
                </div>

                <button
                  id="add-custom-open"
                  onClick={() => setShowAddModal(true)}
                  className="w-full mt-4 bg-white hover:bg-[#FAF9F6] border border-[#E6E2DD] text-[#4A6741] font-semibold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Custom Activity
                </button>
              </div>

              {/* Day focus layout details */}
              <div className="lg:col-span-3 space-y-4">
                {trip.days.map((pDay) => {
                  if (pDay.dayNumber !== selectedDay) return null;
                  const isCurrentDayLoading = dayLoading === pDay.dayNumber;

                  return (
                    <div key={pDay.dayNumber} className="space-y-4" id={`selected-day-stage-${pDay.dayNumber}`}>
                      {/* Day Title focus banner */}
                      <div className="bg-[#FAF9F6] border border-[#E6E2DD] rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <p className="text-[10px] text-[#4A6741] font-bold font-mono tracking-wider">ACTIVE SCHEDULE FOCUS</p>
                          <h2 className="text-xl font-serif text-[#2C2C2C] font-semibold flex items-center gap-2 mt-0.5">
                             Day {pDay.dayNumber}: {pDay.title}
                          </h2>
                        </div>

                        {/* Regenerate prompt toggler */}
                        <div>
                          {showRegenInput === pDay.dayNumber ? (
                            <div className="flex gap-2 w-full max-w-md">
                              <input
                                id="regen-instruction-input"
                                type="text"
                                placeholder="e.g. Add more outdoor nature activities"
                                value={regenInstruction}
                                onChange={(e) => setRegenInstruction(e.target.value)}
                                className="bg-white border border-[#E6E2DD] text-xs px-3 py-2 rounded-lg text-[#2C2C2C] font-sans outline-none focus:border-[#4A6741] focus:ring-1 focus:ring-[#4A6741] w-full"
                              />
                              <button
                                id="submit-regen-day-btn"
                                onClick={() => handleRegenerateDay(pDay.dayNumber)}
                                className="bg-[#4A6741] hover:bg-[#3d5435] text-white font-bold text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer shrink-0"
                              >
                                {isCurrentDayLoading ? (
                                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                ) : (
                                  <>
                                    <Sparkles className="w-3 h-3 fill-white" />
                                    <span>AI Edit</span>
                                  </>
                                )}
                              </button>
                              <button 
                                onClick={() => setShowRegenInput(null)} 
                                className="text-[#8E8E8E] text-xs px-2 hover:text-[#2C2C2C]"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              id="open-regen-input-btn"
                              onClick={() => {
                                setShowRegenInput(pDay.dayNumber);
                                setRegenInstruction('');
                              }}
                              className="text-[#4A6741] hover:text-[#3d5435] font-bold text-xs bg-white hover:bg-[#FAF9F6] border border-[#E6E2DD] py-2 px-4 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-[#4A6741]" />
                              <span>Customize with AI</span>
                            </button>
                          )}
                        </div>
                      </div>
                      
                      {/* MAP & SCHEDULE LAYOUT GRID */}
                      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 items-start">
                        {/* 1. Dynamic Map Column */}
                        <div className="xl:col-span-2 w-full">
                          <TripMap trip={trip} selectedDay={selectedDay} />
                        </div>

                        {/* 2. Schedule List Column */}
                        <div className="xl:col-span-3 space-y-4">
                          {/* Activities Display Loop */}
                          {isCurrentDayLoading ? (
                            <div className="bg-white border border-[#E6E2DD] rounded-xl p-12 text-center text-[#6B6B6B] flex flex-col items-center justify-center space-y-3">
                              <div className="w-10 h-10 border-4 border-[#FAF9F6] border-t-[#4A6741] rounded-full animate-spin"></div>
                              <p className="text-sm font-serif text-[#2C2C2C]">Gemini is rewriting Day {pDay.dayNumber} plan...</p>
                              <p className="text-xs text-[#8E8E8E]">Tailoring based on your parameters.</p>
                            </div>
                          ) : pDay.activities.length === 0 ? (
                            <div className="bg-white border border-[#E6E2DD] rounded-xl p-10 text-center text-[#6B6B6B] italic">
                              No plans scheduled on this day. Use "Add Custom Activity" to insert card items.
                            </div>
                          ) : (
                            <div className="space-y-3 relative pl-4 border-l-2 border-[#E6E2DD]">
                              {pDay.activities.map((act) => {
                                const theme = getCategoryTheme(act.category);
                                return (
                                  <motion.div
                                    layoutId={act.id}
                                    key={act.id}
                                    className="bg-white border border-[#E6E2DD] hover:border-[#4A6741] rounded-xl p-4 flex gap-4 transition-all shadow-sm group"
                                  >
                                    <div className="text-center shrink-0 flex flex-col items-center justify-center bg-[#FAF9F6] p-2.5 rounded-xl border border-[#E6E2DD] w-20">
                                      <span className="text-xl">{theme.icon}</span>
                                      <span className="text-[9px] font-bold text-[#6B6B6B] uppercase tracking-wider mt-1.5 block">
                                        {act.timeOfDay}
                                      </span>
                                    </div>

                                    <div className="space-y-1 flex-1 min-w-0">
                                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                                        <h3 className="font-serif font-medium text-[#2C2C2C] text-sm md:text-base leading-tight">{act.name}</h3>
                                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${theme.bg}`}>
                                          {act.category}
                                        </span>
                                      </div>
                                      <p className="text-[#6B6B6B] text-xs leading-relaxed">{act.description}</p>
                                    </div>

                                    <div className="shrink-0 self-center md:opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button
                                        id={`remove-activity-btn-${act.id}`}
                                        onClick={() => handleRemoveActivity(pDay.dayNumber, act.id)}
                                        className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition-all cursor-pointer"
                                        title="Delete Activity"
                                      >
                                        <Trash className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </motion.div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* 2. BUDGET & EXPENSES TAB */}
          {activeTab === 'budget' && (
            <motion.div
              key="budget-tab"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {/* Left Column: Log Actual Expenses Form */}
              <div className="md:col-span-1 space-y-4">
                <div className="bg-white border border-[#E6E2DD] rounded-xl p-5 shadow-sm">
                  <h3 className="text-sm font-bold text-[#2C2C2C] tracking-wide flex items-center gap-1.5 mb-4">
                    <Wallet className="w-4 h-4 text-[#4A6741]" /> Log Real Expense Spends
                  </h3>

                  <form onSubmit={handleAddExpense} className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-bold text-[#6B6B6B] uppercase tracking-wider mb-1">
                        Expense Description / Vendor
                      </label>
                      <input
                        id="expense-name-input"
                        type="text"
                        required
                        placeholder="e.g. Nishiki Market lunch"
                        value={expenseName}
                        onChange={(e) => setExpenseName(e.target.value)}
                        className="bg-[#FAF9F6] border border-[#E6E2DD] focus:border-[#4A6741] focus:ring-1 focus:ring-[#4A6741] rounded-lg p-2.5 text-xs text-[#2C2C2C] outline-none w-full"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#6B6B6B] uppercase tracking-wider mb-1">
                          Amount (USD)
                        </label>
                        <div className="relative">
                          <input
                            id="expense-amount-input"
                            type="number"
                            required
                            min="0.01"
                            step="0.01"
                            placeholder="32.50"
                            value={expenseAmount}
                            onChange={(e) => setExpenseAmount(e.target.value)}
                            className="bg-[#FAF9F6] border border-[#E6E2DD] focus:border-[#4A6741] focus:ring-1 focus:ring-[#4A6741] rounded-lg p-2.5 pl-7 text-xs text-[#2C2C2C] outline-none w-full"
                          />
                          <span className="absolute left-3 top-2.5 text-[#8E8E8E] text-xs font-bold">$</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#6B6B6B] uppercase tracking-wider mb-1">
                          Category
                        </label>
                        <select
                          id="expense-category-input"
                          value={expenseCategory}
                          onChange={(e) => setExpenseCategory(e.target.value as any)}
                          className="bg-[#FAF9F6] border border-[#E6E2DD] focus:border-[#4A6741] rounded-lg p-2.5 text-xs text-[#2C2C2C] outline-none w-full cursor-pointer"
                        >
                          <option value="Flights">Flights</option>
                          <option value="Accommodation">Stays</option>
                          <option value="Food">Meals / Food</option>
                          <option value="Activities">Activities</option>
                          <option value="Other">Other Spend</option>
                        </select>
                      </div>
                    </div>

                    <button
                      id="log-expense-btn"
                      type="submit"
                      disabled={loggingExpense}
                      className="w-full bg-[#4A6741] hover:bg-[#3d5435] text-white font-semibold text-xs py-2.5 px-3 rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-sm"
                    >
                      {loggingExpense ? (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      ) : (
                        'Log Expenditure Transaction'
                      )}
                    </button>
                  </form>
                </div>

                {/* advice block design matching Aether theme */}
                <div className="bg-[#F2EDE7] border border-[#E6E2DD] rounded-xl p-4 text-[#6B6B6B] text-xs flex items-center gap-3">
                  <div className="p-2.5 bg-white rounded-lg border border-[#E6E2DD]">
                    <Compass className="text-[#4A6741] w-5 h-5 shadow-sm" />
                  </div>
                  <div>
                    <span className="font-bold text-[#2C2C2C] block text-xs">RoamAgent Optimizer Hint</span>
                    <span>Keep track of physical dining & sightseeing spends to verify accuracy against initial estimates.</span>
                  </div>
                </div>
              </div>

              {/* Middle/Right Columns: Interactive tracker ledger list */}
              <div className="md:col-span-2 space-y-4">
                {/* visual budget comparison gauge board page */}
                <div className="bg-white border border-[#E6E2DD] rounded-xl p-5 shadow-sm" id="budget-progress-board">
                  <h3 className="text-sm font-bold text-[#2C2C2C] tracking-wide flex items-center gap-1.5 mb-5 border-b border-[#E6E2DD] pb-3">
                    <Wallet className="w-4.5 h-4.5 text-[#4A6741]" /> Comparison Analysis: Estimated vs Actual Spends
                  </h3>

                  {/* progress chart rows matching nature green & soft warm tones */}
                  <div className="space-y-4">
                    {[
                      { label: 'Flights / Commutes', current: actualFlights, est: flightsEst, color: 'bg-[#4A6741]', themeColor: '#4A6741' },
                      { label: 'Accommodation / Lodging', current: actualLodging, est: lodgingEst, color: 'bg-emerald-600', themeColor: '#059669' },
                      { label: 'Meals & Dining Food', current: actualFood, est: foodEst, color: 'bg-amber-600', themeColor: '#d97706' },
                      { label: 'Tours & Activities', current: actualActivities, est: activitiesEst, color: 'bg-violet-700', themeColor: '#6d28d9' },
                      { label: 'Other Spends', current: actualOthers, est: 0, color: 'bg-[#6B6B6B]', themeColor: '#6b6b6b' }
                    ].map((row) => {
                      const totalAlloc = row.est;
                      const hasEstimate = totalAlloc > 0;
                      const pct = hasEstimate ? Math.round((row.current / totalAlloc) * 100) : 0;
                      return (
                        <div key={row.label} className="space-y-1 bg-[#FAF9F6] p-3 rounded-lg border border-[#E6E2DD]">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-semibold text-[#2C2C2C]">{row.label}</span>
                            <span className="text-[#6B6B6B]">
                              <span className="text-[#2C2C2C] font-semibold">${row.current.toLocaleString()}</span>
                              {hasEstimate && (
                                <> <span className="text-[10px] text-[#8E8E8E]">logged</span> <span className="text-[#8E8E8E]">/ ${totalAlloc.toLocaleString()} est</span></>
                              )}
                            </span>
                          </div>

                          {hasEstimate ? (
                            <div className="w-full bg-[#E6E2DD] h-2 rounded-full overflow-hidden relative">
                              <div 
                                className={`h-full rounded-full transition-all duration-700 ${row.current > totalAlloc ? 'bg-amber-700' : row.color}`}
                                style={{ width: `${Math.min(pct, 100)}%` }}
                              ></div>
                            </div>
                          ) : (
                            <div className="text-[10px] text-[#8E8E8E] italic">No initial estimate limit declared</div>
                          )}

                          {hasEstimate && pct > 100 && (
                            <span className="text-[10px] text-amber-700 font-semibold block">⚠️ Exceeded estimated category budget limit by ${(row.current - totalAlloc).toLocaleString()}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Real spend transaction ledger */}
                <div className="bg-white border border-[#E6E2DD] rounded-xl p-5 shadow-sm">
                  <h3 className="text-sm font-bold text-[#2C2C2C] tracking-wide mb-3">Logged Expenditures History</h3>

                  {actualExpenses.length === 0 ? (
                    <p className="text-[#8E8E8E] text-xs italic p-4 text-center">No expenditure transactions logged yet. Use the log form to record itemization lists.</p>
                  ) : (
                    <div className="divide-y divide-[#E6E2DD] overflow-hidden rounded-lg border border-[#E6E2DD] bg-[#FAF9F6]">
                      {actualExpenses.map((exp) => (
                        <div key={exp.id} className="flex justify-between items-center py-3 px-4 hover:bg-white transition-colors">
                          <div className="min-w-0">
                            <p className="font-semibold text-[#2C2C2C] text-xs truncate">{exp.name}</p>
                            <span className="text-[9px] bg-[#E6E2DD] text-[#2C2C2C] font-bold px-1.5 py-0.5 rounded uppercase mt-1 inline-block">
                              {exp.category}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 ml-2">
                            <span className="text-[#2C2C2C] text-xs font-semibold font-mono">${exp.amount.toFixed(2)}</span>
                            <button
                              id={`delete-expense-btn-${exp.id}`}
                              onClick={() => handleDeleteExpense(exp.id)}
                              className="text-[#8E8E8E] hover:text-red-500 p-1 rounded-full hover:bg-red-50"
                              title="Delete log"
                            >
                              <Trash className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* 3. HOTELS TAB */}
          {activeTab === 'hotels' && (
            <motion.div
              key="hotels-tab"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {trip.hotels.map((hotel) => {
                const isLuxury = hotel.tier === 'Luxury';
                const isMid = hotel.tier === 'Mid Range';
                return (
                  <div
                    id={`hotel-card-${hotel.tier.toLowerCase().replace(' ', '-')}`}
                    key={hotel.tier}
                    className={`bg-white border rounded-2xl overflow-hidden hover:border-[#4A6741] hover:shadow-md transition-all shadow-sm flex flex-col ${
                      isLuxury ? 'border-amber-500/40 shadow-amber-500/[0.02]' : isMid ? 'border-[#4A6741]' : 'border-[#E6E2DD]'
                    }`}
                  >
                    <div className="relative h-44 overflow-hidden shrink-0">
                      <img 
                        src={getHotelImage(hotel.tier)} 
                        alt={hotel.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105 select-none"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
                      <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-10">
                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider shadow-sm ${
                          isLuxury 
                            ? 'bg-amber-600 text-white border border-amber-500' 
                            : isMid 
                              ? 'bg-[#4A6741] text-white border border-[#3d5435]' 
                              : 'bg-white text-[#6B6B6B] border border-[#E6E2DD]'
                        }`}>
                          {hotel.tier}
                        </span>
                        <span className="text-amber-800 font-bold text-xs font-mono bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded-lg shadow-sm border border-amber-200">
                          ★ {hotel.rating}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 flex flex-col justify-between flex-1 space-y-4">
                      <div>
                        <h3 className="text-base font-serif text-[#2C2C2C] font-semibold tracking-tight">{hotel.name}</h3>
                        <p className="text-[#6B6B6B] text-xs mt-1.5 leading-relaxed line-clamp-4">{hotel.description}</p>
                      </div>

                      <div className="pt-3 border-t border-[#E6E2DD] flex items-center justify-between text-xs">
                        <span className="text-[#8E8E8E]">Estimated Rate</span>
                        <span className="text-[#4A6741] text-sm font-bold font-mono">{hotel.priceEstimate}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}

          {/* 4. PACKING CHECKLIST TAB */}
          {activeTab === 'packing' && (
            <motion.div
              key="packing-tab"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="max-w-xl mx-auto bg-white border border-[#E6E2DD] rounded-2xl p-6 shadow-sm text-[#2C2C2C]"
            >
              <div className="text-center mb-6">
                <p className="text-[10px] font-bold text-[#4A6741] uppercase tracking-wider">CHECKLIST TRACKER</p>
                <h3 className="text-xl font-serif text-[#2C2C2C] font-semibold mt-0.5">Suggested Packing List</h3>
                <p className="text-[#6B6B6B] text-xs mt-1">Checkoff physical item luggage packing as you prepare for departure.</p>

                {/* packing progress bar */}
                <div className="flex items-center justify-between text-xs text-[#6B6B6B] mt-4 max-w-xs mx-auto">
                  <span>Progress Ratio:</span>
                  <span className="font-bold text-[#4A6741]">{packingProgressPercent}% ({packedCount}/{totalPackItems})</span>
                </div>
                <div className="w-full max-w-xs bg-[#FAF9F6] h-2 rounded-full overflow-hidden mt-1.5 mx-auto border border-[#E6E2DD]/50">
                  <div className="bg-[#4A6741] h-full rounded-full transition-all duration-500" style={{ width: `${packingProgressPercent}%` }}></div>
                </div>
              </div>

              {trip.packingList.length === 0 ? (
                <p className="text-[#8E8E8E] italic text-center text-xs p-6">No packing lists generated for your trip.</p>
              ) : (
                <div className="space-y-2">
                  {trip.packingList.map((item) => (
                    <button
                      id={`pack-item-toggle-${item.id}`}
                      key={item.id}
                      onClick={() => handleTogglePacking(item.id)}
                      className={`w-full p-3 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                        item.packed
                          ? 'border-[#E6E2DD] bg-[#FAF9F6]/60 text-[#8E8E8E] line-through decoration-[#8E8E8E]'
                          : 'border-[#E6E2DD] bg-white hover:border-[#4A6741] text-[#2C2C2C]'
                      }`}
                    >
                      <span>
                        {item.packed ? (
                          <CheckSquare className="w-5 h-5 text-[#4A6741]" />
                        ) : (
                          <Square className="w-5 h-5 text-[#8E8E8E] hover:text-[#4A6741]" />
                        )}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold leading-none">{item.name}</p>
                        <span className="text-[9px] text-[#8E8E8E] uppercase tracking-wider mt-1 block">{item.category}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* CREATE CUSTOM PLAN MODAL */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-white border border-[#E6E2DD] rounded-2xl p-6 w-full max-w-md max-h-[85vh] overflow-y-auto shadow-xl relative text-[#2C2C2C]"
            >
              <h3 className="text-base font-serif font-semibold text-[#2C2C2C] tracking-wide mb-4 flex items-center gap-1.5">
                <Plus className="w-5 h-5 text-[#4A6741]" /> Add Custom Activity Plan to Day {selectedDay}
              </h3>

              <form onSubmit={handleAddActivity} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#6B6B6B] uppercase tracking-wider mb-1">
                    Activity Name
                  </label>
                  <input
                    id="new-activity-name-input"
                    type="text"
                    required
                    placeholder="e.g. Traditional tea house tea ceremony"
                    value={newActName}
                    onChange={(e) => setNewActName(e.target.value)}
                    className="bg-[#FAF9F6] border border-[#E6E2DD] focus:border-[#4A6741] focus:ring-1 focus:ring-[#4A6741] rounded-lg p-2.5 text-xs text-[#2C2C2C] outline-none w-full"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#6B6B6B] uppercase tracking-wider mb-1">
                    Detailed Description
                  </label>
                  <textarea
                    id="new-activity-desc-input"
                    required
                    rows={3}
                    placeholder="Describe what you will do, or ticket/reservation requirements."
                    value={newActDesc}
                    onChange={(e) => setNewActDesc(e.target.value)}
                    className="bg-[#FAF9F6] border border-[#E6E2DD] focus:border-[#4A6741] focus:ring-1 focus:ring-[#4A6741] rounded-lg p-2.5 text-xs text-[#2C2C2C] outline-none w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#6B6B6B] uppercase tracking-wider mb-1">
                      Time of Day
                    </label>
                    <select
                      id="new-activity-time-select"
                      value={newActTime}
                      onChange={(e) => setNewActTime(e.target.value as any)}
                      className="bg-[#FAF9F6] border border-[#E6E2DD] rounded-lg p-2.5 text-xs text-[#2C2C2C] outline-none w-full cursor-pointer"
                    >
                      <option value="Morning">Morning</option>
                      <option value="Afternoon">Afternoon</option>
                      <option value="Evening">Evening</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#6B6B6B] uppercase tracking-wider mb-1">
                      Category
                    </label>
                    <select
                      id="new-activity-category-select"
                      value={newActCategory}
                      onChange={(e) => setNewActCategory(e.target.value)}
                      className="bg-[#FAF9F6] border border-[#E6E2DD] rounded-lg p-2.5 text-xs text-[#2C2C2C] outline-none w-full cursor-pointer"
                    >
                      <option value="Culture">Culture / Sightseeing</option>
                      <option value="Food">Meals / Dining</option>
                      <option value="Adventure">Nature & Outdoors</option>
                      <option value="Shopping">Shopping</option>
                      <option value="Transit">Transit / Travel</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-[#E6E2DD]">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="text-[#6B6B6B] hover:text-[#2C2C2C] px-4 py-2 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    id="new-activity-submit-btn"
                    type="submit"
                    disabled={addingActivity}
                    className="bg-[#4A6741] hover:bg-[#3d5435] text-white font-bold text-xs py-2 px-4 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
                  >
                    {addingActivity ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                      'Save Activity Plan'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
