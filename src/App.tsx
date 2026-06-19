import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Sparkles, LogOut, Plus, Map, User, ChevronRight, Menu, X, Trash } from 'lucide-react';
import { User as UserType, Trip } from './types.js';
import Auth from './components/Auth.tsx';
import TripForm from './components/TripForm.tsx';
import TripDetails from './components/TripDetails.tsx';

export default function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('roam_token'));
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  // Dashboard layout states
  const [trips, setTrips] = useState<Trip[]>([]);
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null);
  const [generating, setGenerating] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [errorAlert, setErrorAlert] = useState<string | null>(null);

  // Try to restore user session on startup
  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = localStorage.getItem('roam_token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${storedToken}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setToken(storedToken);
          getSavedTrips(storedToken);
        } else {
          // Token expired
          localStorage.removeItem('roam_token');
          setToken(null);
        }
      } catch {
        // Network offline
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, []);

  // Fetch trips lists
  const getSavedTrips = async (sessionToken: string) => {
    try {
      const response = await fetch('/api/trips', {
        headers: { 'Authorization': `Bearer ${sessionToken}` }
      });
      if (response.ok) {
        const data = await response.json();
        setTrips(data.trips);
        // Default to active first trip if available
        if (data.trips.length > 0 && !activeTrip) {
          setActiveTrip(data.trips[0]);
        }
      }
    } catch {
      // offline
    }
  };

  const handleAuthSuccess = (newToken: string, authenticatedUser: UserType) => {
    localStorage.setItem('roam_token', newToken);
    setToken(newToken);
    setUser(authenticatedUser);
    getSavedTrips(newToken);
  };

  const handleLogOut = () => {
    localStorage.removeItem('roam_token');
    setToken(null);
    setUser(null);
    setTrips([]);
    setActiveTrip(null);
    setShowMobileSidebar(false);
  };

  const handleGenerateTrip = async (formData: {
    destination: string;
    numDays: number;
    budgetType: 'Low' | 'Medium' | 'High';
    interests: string[];
  }) => {
    if (!token) return;
    setGenerating(true);
    setErrorAlert(null);

    try {
      const response = await fetch('/api/trips/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'AI generation failed');
      }

      // Add to trips state list and focus on it
      setTrips((prev) => [data.trip, ...prev]);
      setActiveTrip(data.trip);
    } catch (err: any) {
      setErrorAlert(err.message || 'We could not generate your trip. Please try another destination.');
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteTrip = async (e: React.MouseEvent, tripId: string) => {
    e.stopPropagation();
    if (!token || !window.confirm('Are you sure you want to delete this itinerary?')) return;

    try {
      const response = await fetch(`/api/trips/${tripId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setTrips((prev) => prev.filter((t) => t.id !== tripId));
        if (activeTrip?.id === tripId) {
          setActiveTrip(null);
        }
      }
    } catch {
      setErrorAlert('Failed to delete itinerary');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex flex-col items-center justify-center space-y-4" id="app-loading-gate">
        <div className="w-12 h-12 border-4 border-[#E6E2DD] border-t-[#4A6741] rounded-full animate-spin"></div>
        <p className="text-[#6B6B6B] text-xs font-mono tracking-widest uppercase">Initializing RoamAgent engine...</p>
      </div>
    );
  }

  // Not authenticated? Show Auth gate
  if (!token || !user) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#2C2C2C] flex flex-col font-sans" id="app-root-workspace">
      
      {/* GLOBAL NAVBAR HEADER */}
      <header className="bg-white border-b border-[#E6E2DD] sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-2.5">
            <button
              id="mobile-sidebar-toggle-btn"
              onClick={() => setShowMobileSidebar(!showMobileSidebar)}
              className="lg:hidden p-2 hover:bg-[#FAF9F6] rounded-lg text-[#6B6B6B] hover:text-[#2C2C2C] border border-transparent hover:border-[#E6E2DD]"
            >
              {showMobileSidebar ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setActiveTrip(null); setShowMobileSidebar(false); }}>
              <div className="w-8 h-8 bg-[#4A6741] rounded-lg flex items-center justify-center shadow-sm">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-[#4A6741] font-sans flex items-center gap-1.5">
                RoamAgent <Sparkles className="w-4 h-4 text-[#4A6741] fill-[#4A6741]/20 animate-pulse" />
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* User profile identifier */}
            <div className="hidden sm:flex items-center gap-2 py-1.5 px-3 bg-[#FAF9F6] border border-[#E6E2DD] rounded-xl text-xs text-[#2C2C2C] font-semibold shadow-sm">
              <User className="w-3.5 h-3.5 text-[#4A6741]" />
              <span className="truncate max-w-[150px]">{user.email}</span>
            </div>

            <button
              id="global-logout-btn"
              onClick={handleLogOut}
              className="px-3.5 py-2 hover:bg-[#FAF9F6] rounded-xl text-xs font-bold text-[#6B6B6B] hover:text-[#2C2C2C] flex items-center gap-1.5 border border-transparent hover:border-[#E6E2DD] cursor-pointer transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-sans">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* CORE FRAME LAYOUT */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto relative">
        
        {/* MOBILE SIDEBAR BACKSTAGE BLANKET COVER */}
        <AnimatePresence>
          {showMobileSidebar && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileSidebar(false)}
              className="fixed inset-0 bg-black z-20 lg:hidden cursor-pointer"
            />
          )}
        </AnimatePresence>
        
        {/* SIDEBAR: SAVED ITINERARIES PANEL */}
        <aside className={`
          fixed inset-y-16 left-0 z-30 w-72 bg-[#FAF9F6] border-r border-[#E6E2DD] p-5 shrink-0 overflow-y-auto transform transition-transform duration-300 lg:translate-x-0 lg:static
          ${showMobileSidebar ? 'translate-x-0 bg-white' : '-translate-x-full'}
        `} id="trips-sidebar-panel">
          <div className="space-y-4">
            
            <button
              id="sidebar-new-search-btn"
              onClick={() => {
                setActiveTrip(null);
                setShowMobileSidebar(false);
              }}
              className="w-full bg-[#4A6741] hover:bg-[#3d5435] text-white font-bold text-xs py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm hover:shadow transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Create New Travel Plan
            </button>

            <div className="border-t border-[#E6E2DD] pt-4">
              <h3 className="text-[10px] font-bold text-[#8E8E8E] uppercase tracking-wider mb-3 pl-1">
                Your Saved Itineraries ({trips.length})
              </h3>

              {trips.length === 0 ? (
                <div className="text-[#8E8E8E] text-xs text-center p-6 border-2 border-dashed border-[#E6E2DD] rounded-xl bg-white/50">
                  <Map className="w-8 h-8 text-[#8E8E8E]/60 mx-auto mb-2 animate-bounce" />
                  <p>No trip plans stored yet.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {trips.map((savedTrip) => {
                    const isSelected = activeTrip?.id === savedTrip.id;
                    return (
                      <div
                        id={`sidebar-trip-pill-${savedTrip.id}`}
                        key={savedTrip.id}
                        onClick={() => {
                          setActiveTrip(savedTrip);
                          setShowMobileSidebar(false);
                        }}
                        className={`w-full text-left p-3.5 rounded-xl flex items-center justify-between text-xs transition-all border cursor-pointer ${
                          isSelected
                            ? 'bg-white border-[#4A6741] text-[#4A6741] font-bold shadow-sm'
                            : 'bg-white/40 hover:bg-white border-[#E6E2DD] text-[#6B6B6B] hover:text-[#2C2C2C]'
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <p className={`font-serif text-sm font-medium leading-tight truncate ${isSelected ? 'text-[#4A6741]' : 'text-[#2C2C2C]'}`}>{savedTrip.destination}</p>
                          <p className="text-[10px] text-[#8E8E8E] font-sans font-normal mt-0.5">{savedTrip.numDays} Days &bull; {savedTrip.budgetType}</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <ChevronRight className="w-3.5 h-3.5 text-[#8E8E8E]" />
                          <button
                            id={`sidebar-trip-delete-${savedTrip.id}`}
                            onClick={(e) => handleDeleteTrip(e, savedTrip.id)}
                            className="p-1 hover:bg-red-50 rounded text-[#8E8E8E] hover:text-red-500 transition-colors cursor-pointer"
                            title="Delete Trip"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* MAIN WORKSPACE VIEW CANVASES */}
        <main className="flex-1 p-3.5 sm:p-6 overflow-y-auto min-w-0 bg-[#FDFCFB]">
          {errorAlert && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl mb-5 flex items-center justify-between text-xs text-red-800">
              <span>{errorAlert}</span>
              <button onClick={() => setErrorAlert(null)} className="font-bold hover:text-red-950 pl-2">X</button>
            </div>
          )}

          <AnimatePresence mode="wait">
            {activeTrip ? (
              <motion.div
                key={`details-${activeTrip.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <TripDetails
                  trip={activeTrip}
                  onTripUpdate={(updated) => {
                    setActiveTrip(updated);
                    // update inside lists as well
                    setTrips((prev) => prev.map((t) => t.id === updated.id ? updated : t));
                  }}
                  token={token}
                />
              </motion.div>
            ) : (
              <motion.div
                key="planner-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <TripForm onSubmit={handleGenerateTrip} loading={generating} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

      </div>
    </div>
  );
}
