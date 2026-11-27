import React, { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  MapPin,
  Navigation,
  Search,
  ExternalLink,
  CheckCircle2,
  Maximize2,
  Minimize2,
  X,
  Compass,
  AlertCircle,
  Loader2,
} from "lucide-react";

// Helper to cleanly parse address components from OpenStreetMap Nominatim
export const parseNominatimAddress = (data) => {
  if (!data) return null;
  const addr = data.address || {};

  // Extract Road / Street
  const street =
    addr.road ||
    addr.pedestrian ||
    addr.footway ||
    addr.street ||
    addr.path ||
    addr.highway ||
    "";

  // Extract Area / Locality / Sector / Colony
  // Note: if subdistrict contains "Tahsil", prefer city_district, suburb or neighbourhood
  let area =
    addr.suburb ||
    addr.neighbourhood ||
    addr.city_district ||
    addr.quarter ||
    addr.residential ||
    addr.colony ||
    "";

  if (!area && addr.subdistrict) {
    area = addr.subdistrict.replace(/\s+Tahsil$/i, "").trim();
  }

  // Extract City
  let city =
    addr.city ||
    addr.town ||
    addr.village ||
    addr.municipality ||
    addr.state_district ||
    "";

  if (!city && addr.county) {
    city = addr.county.replace(/\s+Tahsil$/i, "").trim();
  }

  // Fallback: if area equals city, avoid duplication
  if (area && city && area.toLowerCase() === city.toLowerCase()) {
    if (addr.neighbourhood) area = addr.neighbourhood;
    else if (addr.city_district) area = addr.city_district;
  }

  // Extract State
  const state = addr.state || "";

  // Extract Pincode (6 digits)
  const pincode = addr.postcode ? addr.postcode.replace(/\D/g, "").slice(0, 6) : "";

  // Extract Landmark
  const landmark = addr.amenity || addr.building || addr.house_name || "";

  // Full detailed address string (like Google Maps)
  let fullAddress = data.display_name || "";
  fullAddress = fullAddress.replace(/, India$/, "").trim();

  // Prominent title for header (like Swiggy / Zomato: "Ranjhi, Jabalpur")
  const titleParts = [street, area].filter(Boolean);
  const title =
    titleParts.length > 0
      ? titleParts.join(", ")
      : area
      ? `${area}, ${city}`
      : city || "Detected Location";

  return {
    title,
    fullAddress: fullAddress || [area, city, state, pincode].filter(Boolean).join(", "),
    street,
    area,
    city,
    state,
    pincode,
    landmark,
  };
};

export default function DeliveryLocationMap({
  coords,
  exactLocationName,
  onLocationSelect,
  deliveryAddress,
  onAddressChange,
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  const [isLocating, setIsLocating] = useState(false);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [mapNotice, setMapNotice] = useState("");

  // Default coordinates (Jabalpur, MP, India) if user hasn't selected yet
  const defaultLat = coords?.latitude || 23.1815;
  const defaultLng = coords?.longitude || 79.9864;

  // Custom Swiggy / Zomato style pulsing marker icon
  const createDeliveryPinIcon = () => {
    return L.divIcon({
      className: "custom-delivery-pin",
      html: `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%);">
          <!-- Floating Pill Label -->
          <div style="background: #1f2937; color: white; padding: 3px 8px; border-radius: 9999px; font-size: 10px; font-weight: 700; letter-spacing: 0.025em; white-space: nowrap; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.2); margin-bottom: 2px; display: flex; items-center; gap: 4px;">
            <span style="color: #4ade80;">●</span> Delivering Here
          </div>
          <!-- Teardrop Pin Marker -->
          <div style="position: relative; width: 34px; height: 34px; background: linear-gradient(135deg, #e11d48 0%, #b91c1c 100%); border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(185,28,28,0.4); border: 2.5px solid white;">
            <div style="width: 10px; height: 10px; background: white; border-radius: 50%; transform: rotate(45deg);"></div>
          </div>
          <!-- Ground Shadow / Pulse ring -->
          <div style="width: 14px; height: 6px; background: rgba(0,0,0,0.25); border-radius: 50%; margin-top: -3px; filter: blur(1px);"></div>
        </div>
      `,
      iconSize: [0, 0],
      iconAnchor: [0, 0],
    });
  };

  // Reverse geocode latitude & longitude via OpenStreetMap Nominatim
  const reverseGeocode = useCallback(
    async (lat, lng) => {
      setIsReverseGeocoding(true);
      setMapNotice("Fetching exact street address...");
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
          { headers: { "Accept-Language": "en" } }
        );

        if (response.ok) {
          const data = await response.json();
          const parsed = parseNominatimAddress(data);

          if (parsed) {
            onLocationSelect({
              coords: { latitude: lat, longitude: lng },
              exactLocation: parsed.fullAddress,
              title: parsed.title,
              address: {
                street: parsed.street,
                area: parsed.area,
                city: parsed.city,
                state: parsed.state,
                pincode: parsed.pincode,
                landmark: parsed.landmark,
              },
            });
            setMapNotice("");
          }
        }
      } catch (err) {
        console.warn("Reverse geocode failed:", err);
        setMapNotice("Unable to fetch street name, but exact pin was recorded.");
      } finally {
        setIsReverseGeocoding(false);
      }
    },
    [onLocationSelect]
  );

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // already initialized

    // Create Leaflet map instance
    const map = L.map(mapContainerRef.current, {
      center: [defaultLat, defaultLng],
      zoom: 16,
      zoomControl: false,
    });

    // Standard OpenStreetMap tiles (free, detailed, no API key required)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Add zoom controls to bottom-right
    L.control.zoom({ position: "bottomright" }).addTo(map);

    // Create Draggable Pin Marker
    const marker = L.marker([defaultLat, defaultLng], {
      icon: createDeliveryPinIcon(),
      draggable: true,
      autoPan: true,
    }).addTo(map);

    // Event: user drags marker
    marker.on("dragend", () => {
      const pos = marker.getLatLng();
      reverseGeocode(pos.lat, pos.lng);
    });

    // Event: user clicks anywhere on map
    map.on("click", (e) => {
      marker.setLatLng(e.latlng);
      reverseGeocode(e.latlng.lat, e.latlng.lng);
    });

    mapInstanceRef.current = map;
    markerRef.current = marker;

    // Invalidate size after layout completes
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update map position when external coords change
  useEffect(() => {
    if (coords?.latitude && coords?.longitude && mapInstanceRef.current && markerRef.current) {
      const currentPos = markerRef.current.getLatLng();
      const diffLat = Math.abs(currentPos.lat - coords.latitude);
      const diffLng = Math.abs(currentPos.lng - coords.longitude);

      if (diffLat > 0.0001 || diffLng > 0.0001) {
        markerRef.current.setLatLng([coords.latitude, coords.longitude]);
        mapInstanceRef.current.setView([coords.latitude, coords.longitude], 17, {
          animate: true,
          duration: 0.8,
        });
      }
    }
  }, [coords?.latitude, coords?.longitude]);

  // Invalidate map size when expanded / collapsed
  useEffect(() => {
    if (mapInstanceRef.current) {
      setTimeout(() => {
        mapInstanceRef.current.invalidateSize();
      }, 300);
    }
  }, [isExpanded]);

  // "Use My Current Location" (GPS) handler
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    setMapNotice("Pinpointing your exact GPS coordinates...");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setIsLocating(false);

        if (mapInstanceRef.current && markerRef.current) {
          markerRef.current.setLatLng([latitude, longitude]);
          mapInstanceRef.current.flyTo([latitude, longitude], 17, {
            duration: 1.2,
          });
        }
        reverseGeocode(latitude, longitude);
      },
      (err) => {
        setIsLocating(false);
        setMapNotice("Location access denied or unavailable. You can click on the map or search above.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Search places / colonies via Nominatim
  const handleSearchSubmit = async (e) => {
    e?.preventDefault();
    if (!searchQuery.trim() || searchQuery.length < 2) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&addressdetails=1&limit=5&countrycodes=in`,
        { headers: { "Accept-Language": "en" } }
      );
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
        setShowSearchResults(true);
      }
    } catch (err) {
      console.warn("Place search failed:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSearchResult = (result) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    setShowSearchResults(false);
    setSearchQuery("");

    if (mapInstanceRef.current && markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
      mapInstanceRef.current.flyTo([lat, lng], 17, { duration: 1.2 });
    }

    const parsed = parseNominatimAddress(result);
    if (parsed) {
      onLocationSelect({
        coords: { latitude: lat, longitude: lng },
        exactLocation: parsed.fullAddress,
        title: parsed.title,
        address: {
          street: parsed.street,
          area: parsed.area,
          city: parsed.city,
          state: parsed.state,
          pincode: parsed.pincode,
          landmark: parsed.landmark,
        },
      });
    } else {
      reverseGeocode(lat, lng);
    }
  };

  // Google Maps URL for easy external verification
  const googleMapsUrl = coords?.latitude
    ? `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`
    : `https://www.google.com/maps?q=23.1815,79.9864`;

  return (
    <div className="space-y-4">
      {/* ── TOP HEADER / SWIGGY-STYLE ADDRESS BANNER ── */}
      <div className="bg-[#fcfbf9] border border-[#e0d8ce]/80 rounded-2xl p-5 shadow-sm transition-all">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#a67c52] to-[#8c653e] flex items-center justify-center text-white shrink-0 shadow-md">
              <MapPin size={20} className="drop-shadow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#a67c52]">
                  Delivery Destination (Google Maps Verified)
                </span>
                {coords && (
                  <span className="inline-flex items-center gap-1 text-[10px] bg-green-100 text-green-800 font-semibold px-2 py-0.5 rounded-full">
                    <CheckCircle2 size={11} className="text-green-600" />
                    Exact Pin Set
                  </span>
                )}
                {isReverseGeocoding && (
                  <span className="inline-flex items-center gap-1 text-[10px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full animate-pulse">
                    <Loader2 size={11} className="animate-spin" />
                    Updating address...
                  </span>
                )}
              </div>

              {/* Exact Location Display */}
              <div className="text-base font-bold text-[#2d2d2d] mt-1 leading-snug">
                {exactLocationName ||
                  [deliveryAddress?.area, deliveryAddress?.city].filter(Boolean).join(", ") ||
                  "Pin your exact delivery location on the map below"}
              </div>

              <p className="text-xs text-gray-500 mt-1 max-w-xl">
                {coords
                  ? "Move or drag the pin on the map to pinpoint your exact gate, house entrance, or landmark."
                  : "Click 'Use Current Location' or search your area to place the delivery pin."}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2 shrink-0 sm:self-start">
            <button
              type="button"
              onClick={handleLocateMe}
              disabled={isLocating}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#a67c52] hover:bg-[#8c653e] text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 disabled:opacity-50"
            >
              <Navigation size={13} className={isLocating ? "animate-spin" : ""} />
              {isLocating ? "Detecting GPS..." : "Locate Me"}
            </button>

            {coords && (
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-[#3e3e3e] rounded-xl text-xs font-semibold transition-all shadow-sm"
                title="View coordinates on Google Maps"
              >
                <span>Google Maps</span>
                <ExternalLink size={12} className="text-gray-400" />
              </a>
            )}
          </div>
        </div>

        {mapNotice && (
          <div className="mt-3 text-xs bg-amber-50 text-amber-800 px-3 py-1.5 rounded-lg border border-amber-200 flex items-center gap-2">
            <AlertCircle size={14} className="shrink-0 text-amber-600" />
            <span>{mapNotice}</span>
          </div>
        )}
      </div>

      {/* ── MAP CONTAINER WITH SEARCH & CONTROLS ── */}
      <div
        className={`relative rounded-2xl overflow-hidden border border-[#e0d8ce] shadow-md transition-all duration-300 ${
          isExpanded ? "h-[500px]" : "h-[320px]"
        }`}
      >
        {/* Floating Search Bar (Like Google Maps / Swiggy) */}
        <div className="absolute top-3 left-3 right-3 sm:right-auto sm:w-80 z-[1000]">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search area, landmark or street..."
              className="w-full bg-white/95 backdrop-blur-md text-[#2d2d2d] text-xs pl-9 pr-9 py-2.5 rounded-xl border border-gray-200 shadow-md outline-none focus:border-[#a67c52] focus:ring-2 focus:ring-[#a67c52]/20 font-medium placeholder-gray-400"
            />
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setShowSearchResults(false);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </form>

          {/* Search Results Dropdown */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="mt-1.5 bg-white rounded-xl border border-gray-200 shadow-xl max-h-56 overflow-y-auto divide-y divide-gray-100">
              {searchResults.map((res, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSearchResult(res)}
                  className="w-full text-left p-2.5 hover:bg-gray-50 flex items-start gap-2 text-xs transition-colors"
                >
                  <MapPin size={14} className="text-[#a67c52] shrink-0 mt-0.5" />
                  <span className="text-gray-700 line-clamp-2 leading-snug">
                    {res.display_name}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Floating Control: Expand / Minimize */}
        <div className="absolute top-3 right-3 z-[1000] flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 bg-white/95 backdrop-blur-md hover:bg-white text-gray-700 rounded-xl border border-gray-200 shadow-md transition-all active:scale-95"
            title={isExpanded ? "Collapse map" : "Expand map for precise pinpoint"}
          >
            {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>

        {/* Interactive Leaflet Map Div */}
        <div ref={mapContainerRef} className="w-full h-full z-0 cursor-crosshair" />

        {/* Bottom Map Instruction Overlay (Swiggy / Zomato style) */}
        <div className="absolute bottom-3 left-3 z-[1000] pointer-events-none">
          <div className="bg-white/90 backdrop-blur-md text-[11px] font-semibold text-gray-700 px-3 py-1.5 rounded-full border border-gray-200/80 shadow-md flex items-center gap-1.5">
            <Compass size={13} className="text-[#a67c52]" />
            <span>Click or drag pin to your exact building / gate</span>
          </div>
        </div>
      </div>
    </div>
  );
}
