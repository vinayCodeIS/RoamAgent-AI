import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Trip, Activity } from '../types.js';
import { MapPin, Navigation, Compass, Layers } from 'lucide-react';

const geocodeCache: Record<string, [number, number]> = {
  'tokyo': [35.6762, 139.6503],
  'tokyo, japan': [35.6762, 139.6503],
  'paris': [48.8566, 2.3522],
  'paris, france': [48.8566, 2.3522],
  'rome': [41.9028, 12.4964],
  'rome, italy': [41.9028, 12.4964],
  'new york': [40.7128, -74.0060],
  'new york, usa': [40.7128, -74.0060],
  'reykjavik': [64.1466, -21.9426],
  'reykjavik, iceland': [64.1466, -21.9426],
  'bali': [-8.4095, 115.1889],
  'bali, indonesia': [-8.4095, 115.1889],
  'london': [51.5074, -0.1278],
  'london, uk': [51.5074, -0.1278],
  'sydney': [-33.8688, 151.2093],
  'sydney, australia': [-33.8688, 151.2093],
  'barcelona': [41.3851, 2.1734],
  'barcelona, spain': [41.3851, 2.1734],
  'reykjavik, iceland - northern lights tour': [64.1466, -21.9426]
};

async function geocodeAddress(query: string, cityFallback: string): Promise<[number, number]> {
  const normQuery = query.toLowerCase().trim();
  if (geocodeCache[normQuery]) {
    return geocodeCache[normQuery];
  }
  
  // Try querying openstreetmap Nominatim search
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
      {
        headers: {
          'Accept-Language': 'en'
        }
      }
    );
    if (response.ok) {
      const data = await response.json();
      if (data && data.length > 0) {
        const coords: [number, number] = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        geocodeCache[normQuery] = coords;
        return coords;
      }
    }
  } catch (err) {
    console.warn("Geocoding fetch skipped or offline. Resorting to local offset.", err);
  }
  
  // Fallback offset algorithm centered on a known city or Default Paris
  const cityNorm = cityFallback.toLowerCase();
  let baseCoords: [number, number] = [48.8566, 2.3522]; // Fallback center
  
  for (const [key, val] of Object.entries(geocodeCache)) {
    if (cityNorm.includes(key)) {
      baseCoords = val;
      break;
    }
  }
  
  // Stable pseudo-random scattering based on query text
  let hash = 0;
  for (let i = 0; i < query.length; i++) {
    hash = query.charCodeAt(i) + ((hash << 5) - hash);
  }
  const offsetLat = ((Math.abs(hash) % 100) / 1100) - 0.045;
  const offsetLng = (((Math.abs(hash) >> 8) % 100) / 1100) - 0.045;
  return [baseCoords[0] + offsetLat, baseCoords[1] + offsetLng];
}

interface TripMapProps {
  trip: Trip;
  selectedDay: number;
}

interface ActivityMarker {
  activity: Activity;
  coords: [number, number];
  index: number;
}

export function TripMap({ trip, selectedDay }: TripMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);
  
  const [markersData, setMarkersData] = useState<ActivityMarker[]>([]);
  const [mapCenterCoords, setMapCenterCoords] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(false);

  // 1. Resolve coordinates for current Day's activities
  useEffect(() => {
    let active = true;
    const currentDayPlan = trip.days.find(d => d.dayNumber === selectedDay);
    if (!currentDayPlan || currentDayPlan.activities.length === 0) {
      setMarkersData([]);
      return;
    }

    async function loadCoordinates() {
      setLoading(true);
      const items: ActivityMarker[] = [];
      
      // Determine center coords first
      const centerCoords = await geocodeAddress(trip.destination, trip.destination);
      if (!active) return;
      setMapCenterCoords(centerCoords);

      // Now map each activity to its coordinates
      let index = 1;
      for (const act of currentDayPlan.activities) {
        // Construct clear search query (e.g. Louvre Museum, Paris France)
        const searchQuery = `${act.name}, ${trip.destination}`;
        const coords = await geocodeAddress(searchQuery, trip.destination);
        if (!active) return;
        items.push({
          activity: act,
          coords,
          index: index++
        });
      }

      setMarkersData(items);
      setLoading(false);
    }

    loadCoordinates();
    return () => {
      active = false;
    };
  }, [trip.days, selectedDay, trip.destination]);

  // 2. Initialize and Tear down Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Create unique map container
    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false
    }).setView(mapCenterCoords || [48.8566, 2.3522], 13);

    // Save map instance
    mapInstanceRef.current = map;

    // Add clean minimal Mapbox/CartoDB tiles (Natural tone matching look)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 20
    }).addTo(map);

    // Dynamic zoom controller placed on the right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Layers for clean render management
    markersLayerGroupRef.current = L.layerGroup().addTo(map);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 3. Update markers and route polylines when coordinates change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerGroupRef.current;
    if (!map || !markersGroup) return;

    // Clear existing overlay states
    markersGroup.clearLayers();
    if (routePolylineRef.current) {
      routePolylineRef.current.remove();
      routePolylineRef.current = null;
    }

    if (markersData.length === 0) {
      if (mapCenterCoords) {
        map.setView(mapCenterCoords, 12);
      }
      return;
    }

    const points: L.LatLngExpression[] = [];

    markersData.forEach((marker) => {
      points.push(marker.coords);
      
      // Beautiful modern HTML marker pin with natural emerald accents
      const customIcon = L.divIcon({
        html: `
          <div class="relative group flex flex-col items-center select-none cursor-pointer">
            <div class="bg-[#4A6741] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-md border-2 border-white transform transition-transform duration-300 scale-100 hover:scale-110 active:scale-95">
              ${marker.index}
            </div>
            <div class="absolute -top-1 px-1.5 py-0.5 bg-black/80 rounded text-[9px] text-white border border-white/10 font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity translate-y-[-100%] pointer-events-none">
              ${marker.activity.name}
            </div>
          </div>
        `,
        className: 'custom-leaflet-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const lfMarker = L.marker(marker.coords, { icon: customIcon }).addTo(markersGroup);

      // Create beautiful mini popups styled with CSS
      const popupContent = `
        <div class="font-sans p-2 text-xs max-w-xs space-y-1">
          <div class="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-[#4A6741] mb-1">
            <span>ACTIVITY ${marker.index}</span>
            <span>•</span>
            <span>${marker.activity.timeOfDay}</span>
          </div>
          <h4 class="font-bold text-sm text-[#2C2C2C] leading-snug">${marker.activity.name}</h4>
          <p class="text-[#6B6B6B] text-[11px] leading-relaxed">${marker.activity.description}</p>
          <span class="inline-block mt-1 text-[9px] px-2 py-0.5 bg-[#FAF9F6] border border-[#E6E2DD] text-[#6B6B6B] uppercase font-bold rounded">
            ${marker.activity.category}
          </span>
        </div>
      `;

      lfMarker.bindPopup(popupContent, {
        closeButton: false,
        className: 'custom-leaflet-popup'
      });
    });

    // Draw routing lines connecting markers sequentially with standard natural tones color
    if (points.length > 1) {
      const line = L.polyline(points, {
        color: '#4A6741',
        weight: 3,
        dashArray: '5, 8',
        opacity: 0.8,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);
      routePolylineRef.current = line;
    }

    // Adapt bounds dynamically to center the day's route beautifully
    if (points.length > 0) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, {
        padding: [45, 45],
        maxZoom: 16,
        animate: true,
        duration: 0.8
      });
    }
  }, [markersData, mapCenterCoords]);

  return (
    <div className="bg-white border border-[#E6E2DD] rounded-2xl overflow-hidden shadow-sm flex flex-col h-full min-h-[350px] md:min-h-[400px]">
      {/* Map Control Bar Panel */}
      <div className="px-5 py-3.5 bg-[#FAF9F6] border-b border-[#E6E2DD] flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-[#4A6741] animate-spin-slow" />
          <div>
            <h3 className="text-xs font-bold text-[#2C2C2C] uppercase tracking-wider font-sans">Dynamic Day Visualizer</h3>
            <p className="text-[10px] text-[#8E8E8E] leading-none">Day {selectedDay} route map & local checkpoints</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#4A6741] bg-white border border-[#E6E2DD] px-2.5 py-1 rounded-xl shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#4A6741] animate-pulse"></span>
          <span>{markersData.length} checkpoints mapped</span>
        </div>
      </div>

      {/* Map Stage Outer shell */}
      <div className="flex-1 relative w-full h-full min-h-[280px]">
        {/* Leaflet instance container */}
        <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-10" />

        {/* Loading overaly backdrop */}
        {loading && (
          <div className="absolute inset-0 bg-white/75 backdrop-blur-xs z-20 flex flex-col items-center justify-center gap-2.5">
            <span className="w-7 h-7 border-3 border-[#FAF9F6] border-t-[#4A6741] rounded-full animate-spin"></span>
            <span className="text-[10.5px] font-bold text-[#4A6741] uppercase tracking-wider font-sans">Geocoding spots...</span>
          </div>
        )}

        {/* Floating guide legend overlay inside the map corner */}
        <div className="absolute bottom-4 left-4 z-10 p-3 bg-white/95 backdrop-blur-md rounded-xl border border-[#E6E2DD] shadow-md max-w-xs space-y-2 pointer-events-none text-[10px]">
          <p className="font-bold text-[#2C2C2C] uppercase tracking-wider text-[9px] flex items-center gap-1">
            <Layers className="w-3 h-3 text-[#4A6741]" /> ROUTE LEGEND
          </p>
          <div className="space-y-1.5 text-[#6B6B6B]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4A6741]" />
              <span>Checkpoint sequence pins (1, 2, 3...)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-0 border-t-2 border-[#4A6741] border-dashed" />
              <span>Dotted transit sequence line</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
