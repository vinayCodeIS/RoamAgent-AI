import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Sparkles, MapPin, Calendar, DollarSign, Heart, PlaneTakeoff } from 'lucide-react';

interface TripFormProps {
  onSubmit: (formData: {
    destination: string;
    numDays: number;
    budgetType: 'Low' | 'Medium' | 'High';
    interests: string[];
  }) => void;
  loading: boolean;
}

const POPULAR_DESTINATIONS = [
  {
    name: 'Tokyo, Japan',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=400&q=80',
    tagline: 'Neon streetscapes & ancient shrines'
  },
  {
    name: 'Paris, France',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80',
    tagline: 'Fine arts, cozy bistros & romantic walks'
  },
  {
    name: 'Rome, Italy',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=400&q=80',
    tagline: 'Ancient arenas, fountains & culinary traditions'
  },
  {
    name: 'New York, USA',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=400&q=80',
    tagline: 'iconic skylines, Broadway & sprawling parks'
  },
  {
    name: 'Reykjavik, Iceland',
    image: 'https://images.unsplash.com/photo-1504829857797-ddff28127792?auto=format&fit=crop&w=400&q=80',
    tagline: 'Vibrant northern lights & geothermal hot springs'
  },
  {
    name: 'Bali, Indonesia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&q=80',
    tagline: 'Tropical paradise, seaside temples & yoga'
  }
];

const INTERESTS_OPTIONS = [
  { id: 'Food', label: 'Food & Dining', icon: '🍣' },
  { id: 'Culture', label: 'Art & Culture', icon: '🏛️' },
  { id: 'Adventure', label: 'Outdoor Adventure', icon: '🧗' },
  { id: 'Shopping', label: 'Local Shopping', icon: '🛍️' },
  { id: 'Nature', label: 'Nature & Parks', icon: '🌲' },
  { id: 'Relaxing', label: 'Wellness & Chill', icon: '🧘' },
  { id: 'Nightlife', label: 'Bars & Nightlife', icon: '🍹' },
  { id: 'History', label: 'History & Landmarks', icon: '🏺' }
];

const LOADING_STEPS = [
  'Contacting RoamAgent backend...',
  'Mapping landmark proximity routes...',
  'Scouting verified hotel recommendations...',
  'Compiling local budget and fare estimates...',
  'Crafting customizable destination packing list...',
  'Finalizing day-by-day sightseeing layout...'
];

export default function TripForm({ onSubmit, loading }: TripFormProps) {
  const [destination, setDestination] = useState('');
  const [numDays, setNumDays] = useState(5);
  const [budgetType, setBudgetType] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [stepIndex, setStepIndex] = useState(0);

  // Rotate loading instructions to keep user engaged
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      setStepIndex(0);
      interval = setInterval(() => {
        setStepIndex((idx) => (idx + 1) % LOADING_STEPS.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) return;
    onSubmit({
      destination: destination.trim(),
      numDays,
      budgetType,
      interests: selectedInterests
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4" id="trip-planner-form-container">
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading-stage"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="bg-white border border-[#E6E2DD] rounded-2xl p-12 text-center min-h-[450px] flex flex-col items-center justify-center shadow-sm space-y-6 relative overflow-hidden"
            id="planner-loading-screen"
          >
            {/* Soft decorative light background overlay */}
            <div className="absolute inset-0 bg-[#FAF9F6]/50 pointer-events-none"></div>

            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-[#FAF9F6] border-t-[#4A6741] border-r-[#4A6741] animate-spin flex items-center justify-center">
                <PlaneTakeoff className="w-10 h-10 text-[#4A6741] rotate-45 animate-pulse" />
              </div>
              <Sparkles className="w-6 h-6 text-[#4A6741]/80 absolute -top-1 -right-1 animate-bounce" />
            </div>

            <div className="space-y-2 max-w-md relative z-10">
              <h3 className="text-2xl font-serif font-light text-[#2C2C2C] tracking-tight">Designing Your Custom Dream Vacation</h3>
              <p className="text-[#6B6B6B] text-sm font-sans">
                Our Gemini intelligence agent is synthesizing days, stays, and localized expense budgets.
              </p>
            </div>

            {/* Simulated progress indicator */}
            <div className="w-full max-w-xs bg-[#E6E2DD] h-2 rounded-full overflow-hidden relative z-10">
              <div 
                className="bg-[#4A6741] h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${((stepIndex + 1) / LOADING_STEPS.length) * 100}%` }}
              ></div>
            </div>

            <AnimatePresence mode="wait">
              <motion.p
                key={LOADING_STEPS[stepIndex]}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-[#4A6741] font-medium text-sm whitespace-nowrap relative z-10"
              >
                {LOADING_STEPS[stepIndex]}
              </motion.p>
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.form
            key="form-stage"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="bg-white border border-[#E6E2DD] rounded-2xl p-5 sm:p-8 shadow-sm relative text-[#2C2C2C]"
          >
            {/* Form Title */}
            <div className="flex items-center gap-3 mb-8 border-b border-[#E6E2DD] pb-6">
              <div className="p-3 bg-[#4A6741]/10 rounded-2xl">
                <Compass className="w-6 h-6 text-[#4A6741]" />
              </div>
              <div>
                <h2 className="text-2xl font-serif text-[#2C2C2C] tracking-tight font-medium">Create a New Travel Plan</h2>
                <p className="text-[#6B6B6B] text-xs">Specify your dream variables and let AI structure everything instantly.</p>
              </div>
            </div>

            {/* Inputs Panel Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Destination */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#4A6741]" /> Destination
                </label>
                <div className="relative">
                  <input
                    id="form-destination-input"
                    type="text"
                    required
                    placeholder="e.g. Tokyo, Paris, Reykjavik"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#E6E2DD] focus:border-[#4A6741] focus:ring-1 focus:ring-[#4A6741] outline-none rounded-xl py-2.5 pl-4 pr-12 text-[#2C2C2C] text-sm transition-all"
                  />
                  <div className="absolute right-3 top-2.5 px-2 py-0.5 bg-[#E6E2DD]/70 text-[#6B6B6B] text-[10px] font-mono rounded">
                    REALTIME
                  </div>
                </div>

                {/* Quick Helper Text */}
                <p className="text-[10.5px] text-[#8E8E8E] italic">
                  Type any global landmark, city, or country. Or tap a featured escape below.
                </p>
              </div>

              {/* Day Counts & Budgets */}
              <div className="grid grid-cols-2 gap-4">
                {/* Duration */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#4A6741]" /> Duration
                    </label>
                    <span className="text-xs font-bold text-[#4A6741] bg-[#4A6741]/10 px-2.5 py-1 rounded-full border border-[#4A6741]/20 select-none animate-shimmer">
                      {numDays} {numDays === 1 ? 'Day' : 'Days'}
                    </span>
                  </div>
                  <div className="pt-1.5">
                    <input
                      id="form-duration-slider"
                      type="range"
                      min="1"
                      max="14"
                      step="1"
                      value={numDays}
                      onChange={(e) => setNumDays(parseInt(e.target.value, 10))}
                      className="w-full accent-[#4A6741] h-1.5 bg-[#E6E2DD] rounded-xl cursor-pointer appearance-none transition-all outline-none"
                    />
                    <div className="flex justify-between text-[10px] text-[#8E8E8E] font-mono mt-1.5 px-0.5 select-none">
                      <span>1d</span>
                      <span>3d</span>
                      <span>5d</span>
                      <span>7d</span>
                      <span>10d</span>
                      <span>12d</span>
                      <span>14d</span>
                    </div>
                  </div>
                </div>

                {/* Budget selector */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-[#4A6741]" /> Budget preference
                  </label>
                  <div className="grid grid-cols-3 gap-1 bg-[#FAF9F6] p-1 rounded-xl border border-[#E6E2DD]">
                    {(['Low', 'Medium', 'High'] as const).map((tier) => (
                      <button
                        id={`form-budget-${tier.toLowerCase()}`}
                        key={tier}
                        type="button"
                        onClick={() => setBudgetType(tier)}
                        className={`text-xs font-medium py-1.5 rounded-lg cursor-pointer transition-all ${
                          budgetType === tier
                            ? 'bg-[#4A6741] text-white shadow-sm'
                            : 'text-[#6B6B6B] hover:text-[#2C2C2C]'
                        }`}
                      >
                        {tier === 'Low' ? '$' : tier === 'Medium' ? '$$' : '$$$'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Featured escapist destinations grid with real imagery */}
            <div className="space-y-3 mb-8">
              <label className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#4A6741]" /> Featured Escapes & Curated Inspirations
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {POPULAR_DESTINATIONS.map((dest) => {
                  const isSelected = destination.toLowerCase().includes(dest.name.split(',')[0].toLowerCase());
                  return (
                    <button
                      id={`form-dest-card-${dest.name.split(',')[0].toLowerCase()}`}
                      key={dest.name}
                      type="button"
                      onClick={() => setDestination(dest.name)}
                      className={`relative rounded-xl h-24 overflow-hidden text-left group transition-all duration-300 border focus:outline-none cursor-pointer ${
                        isSelected 
                          ? 'ring-2 ring-[#4A6741] border-transparent scale-[1.01] shadow-md' 
                          : 'border-[#E6E2DD] hover:border-[#4A6741] shadow-sm'
                      }`}
                    >
                      <img 
                        src={dest.image} 
                        alt={dest.name} 
                        referrerPolicy="no-referrer"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent"></div>
                      <div className="absolute bottom-2 left-3 right-3 text-white z-10">
                        <p className="font-serif text-sm font-semibold tracking-tight">{dest.name}</p>
                        <p className="text-[9px] text-white/80 font-sans truncate">{dest.tagline}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interest Tags */}
            <div className="space-y-3 mb-8">
              <label className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-[#4A6741]" /> Travel Interests & Style (Multi-select)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {INTERESTS_OPTIONS.map((opt) => {
                  const isSelected = selectedInterests.includes(opt.id);
                  return (
                    <button
                      id={`form-interest-chip-${opt.id.toLowerCase()}`}
                      key={opt.id}
                      type="button"
                      onClick={() => toggleInterest(opt.id)}
                      className={`py-3 px-4 rounded-xl border text-left text-xs transition-all flex items-center gap-2 cursor-pointer ${
                        isSelected
                          ? 'border-[#4A6741] bg-[#4A6741]/10 text-[#4A6741] font-semibold shadow-sm'
                          : 'border-[#E6E2DD] bg-[#FAF9F6] hover:bg-[#E6E2DD]/45 text-[#6B6B6B] hover:text-[#2C2C2C]'
                      }`}
                    >
                      <span className="text-base">{opt.icon}</span>
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Bar */}
            <div className="flex justify-end pt-4 border-t border-[#E6E2DD]">
              <button
                id="form-generate-btn"
                type="submit"
                className="bg-[#4A6741] hover:bg-[#3d5435] text-white font-semibold text-sm py-3 px-8 rounded-xl flex items-center gap-2 shadow hover:shadow-md cursor-pointer transition-all"
              >
                <Sparkles className="w-4 h-4 fill-white" />
                <span>Compile AI Itinerary</span>
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
