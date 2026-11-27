import React from "react";
import { Sparkles, Flower2 } from "lucide-react";

const WRAP_STYLES = {
  kraft_paper: { bg: "#D2B48C", border: "#B59369", label: "Textured Kraft Paper", shadow: "#8B6943" },
  korean_matte: { bg: "#FADADD", border: "#E8B4B8", label: "Korean Waterproof Matte", shadow: "#C48B90" },
  black_gold: { bg: "#1F2421", border: "#D4AF37", label: "Black & Gold Foil", shadow: "#000000" },
  rustic_burlap: { bg: "#C4A47C", border: "#8B5A2B", label: "Rustic Burlap & Lace", shadow: "#5C3818" },
};

const RIBBON_COLORS = {
  terracotta: "#C98A60",
  rose_pink: "#E0BFB8",
  forest_green: "#2D5A27",
  ivory_satin: "#FFFFF0",
};

const FLOWER_EMOJIS = {
  dutch_roses: { icon: "🌹", label: "Dutch Red Roses" },
  peach_roses: { icon: "🌷", label: "Peach Avalanches" },
  white_lilies: { icon: "🌸", label: "White Lilies" },
  purple_orchids: { icon: "🌺", label: "Purple Orchids" },
  babys_breath: { icon: "💮", label: "Baby's Breath" },
  carnations: { icon: "💐", label: "Carnations" },
};

const BouquetVisualPreview = ({
  flowerTypes = ["dutch_roses"],
  bouquetSize = "classic",
  wrappingStyle = "kraft_paper",
  ribbonColor = "terracotta",
  cardMessage = "",
}) => {
  const wrap = WRAP_STYLES[wrappingStyle] || WRAP_STYLES.kraft_paper;
  const ribbonHex = RIBBON_COLORS[ribbonColor] || RIBBON_COLORS.terracotta;

  // Flower counts based on bouquet size
  const sizeCountMap = {
    petite: 6,
    classic: 10,
    deluxe: 16,
    grandeur: 24,
  };
  const count = sizeCountMap[bouquetSize] || 10;

  return (
    <div className="relative w-full aspect-square max-w-[440px] mx-auto bg-gradient-to-b from-[#fbf9f6] via-[#f7f2eb] to-[#ece5da] rounded-3xl p-6 shadow-inner border border-[#e8dfd5] flex flex-col items-center justify-between overflow-hidden">
      {/* Studio Header Badges */}
      <div className="w-full flex items-center justify-between z-30">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/80 backdrop-blur-sm text-[#a67c52] shadow-sm border border-[#a67c52]/20">
          <Sparkles size={12} className="text-[#a67c52]" /> Live Bouquet Arrangement
        </span>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#a67c52] text-white shadow-xs capitalize">
          {bouquetSize} Size
        </span>
      </div>

      {/* Visual Bouquet Center */}
      <div className="relative w-full flex-1 flex flex-col items-center justify-end pb-4 pt-2">
        {/* Soft Radial Backlight */}
        <div className="absolute w-60 h-60 rounded-full bg-[#e8cbb0]/30 blur-2xl pointer-events-none" />

        {/* Florist Bouquet Structure */}
        <div className="relative flex flex-col items-center justify-end w-full">
          {/* Blooms Spray Canopy */}
          <div className="relative w-64 h-36 flex flex-wrap items-center justify-center gap-2 z-20 px-2 -mb-6">
            {Array.from({ length: Math.min(count, 14) }).map((_, i) => {
              const flowerKey = flowerTypes[i % flowerTypes.length] || "dutch_roses";
              const fInfo = FLOWER_EMOJIS[flowerKey] || FLOWER_EMOJIS.dutch_roses;
              return (
                <span
                  key={i}
                  className="text-2xl md:text-3xl drop-shadow-md transform transition-all duration-300 hover:scale-125 cursor-pointer"
                  style={{
                    transform: `rotate(${(i % 5 - 2) * 8}deg) translateY(${Math.sin(i) * 6}px)`,
                  }}
                  title={fInfo.label}
                >
                  {fInfo.icon}
                </span>
              );
            })}
          </div>

          {/* Cone Wrap Paper */}
          <div
            className="relative w-48 h-40 shadow-xl transition-all duration-500 ease-out z-10 flex flex-col items-center justify-between p-3"
            style={{
              backgroundColor: wrap.bg,
              borderColor: wrap.border,
              borderWidth: "2px",
              clipPath: "polygon(0% 0%, 100% 0%, 75% 100%, 25% 100%)",
              boxShadow: `0 12px 28px -6px ${wrap.shadow}55`,
            }}
          >
            <div className="w-full text-center pt-2">
              <span className="text-[10px] font-serif uppercase tracking-widest text-black/50">
                Reaina's Heaven
              </span>
            </div>
          </div>

          {/* Ribbon Bow Knot */}
          <div
            className="absolute bottom-6 w-14 h-4 rounded-full z-20 shadow-md border border-black/10 flex items-center justify-center"
            style={{ backgroundColor: ribbonHex }}
          >
            <div className="w-3 h-3 rounded-full bg-white/40" />
          </div>
          {/* Ribbon Tails */}
          <div
            className="absolute bottom-1 -left-2 w-3 h-8 rotate-12 rounded-b-md z-15 opacity-90 shadow-sm"
            style={{ backgroundColor: ribbonHex }}
          />
          <div
            className="absolute bottom-1 left-2 w-3 h-10 -rotate-12 rounded-b-md z-15 opacity-90 shadow-sm"
            style={{ backgroundColor: ribbonHex }}
          />

          {/* Card Message Preview on Bouquet */}
          {cardMessage && (
            <div className="absolute top-1 right-2 z-30 max-w-[150px] p-2 bg-[#FFFDF9] border border-[#a67c52]/30 rounded-lg shadow-md text-left rotate-3">
              <p className="text-[9px] font-serif text-gray-700 italic line-clamp-3">"{cardMessage}"</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Info Bar */}
      <div className="w-full bg-white/80 backdrop-blur-md rounded-2xl p-3 border border-[#ede5db] flex items-center justify-between text-xs z-30 shadow-xs">
        <div>
          <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">Paper Wrap</span>
          <span className="font-semibold text-gray-800">{wrap.label}</span>
        </div>
        <div className="h-5 w-px bg-gray-200" />
        <div>
          <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">Ribbon</span>
          <span className="font-semibold text-gray-800 capitalize">{ribbonColor.replace("_", " ")}</span>
        </div>
        <div className="h-5 w-px bg-gray-200" />
        <div>
          <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">Blooms</span>
          <span className="font-semibold text-[#a67c52]">{flowerTypes.length} Types</span>
        </div>
      </div>
    </div>
  );
};

export default BouquetVisualPreview;

