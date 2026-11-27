import React from "react";
import { Sparkles } from "lucide-react";

const COLOR_MAP = {
  pastel_pink: { bg: "#F8D7DA", border: "#E8B4B8", accent: "#E0989E", name: "Blush Pink" },
  lavender: { bg: "#EAE6F8", border: "#D1C7EC", accent: "#B6A4DC", name: "Lavender Dream" },
  sage_green: { bg: "#E2E8DC", border: "#C2CEC0", accent: "#9EAF9B", name: "Sage Botanical" },
  ivory_gold: { bg: "#FFFEE8", border: "#E8DFAD", accent: "#D4AF37", name: "Ivory Cream & Gold" },
  terracotta: { bg: "#F3DDD0", border: "#D9B299", accent: "#A67C52", name: "Terracotta Caramel" },
  midnight_blue: { bg: "#2A394A", border: "#1C2733", accent: "#7B9EBD", name: "Midnight Navy", textLight: true },
};

const TOPPING_MAP = {
  edible_flowers: { label: "🌸 Edible Florals", icon: "🌸" },
  gold_leaf: { label: "✨ 24K Gold Flakes", icon: "✨" },
  fresh_berries: { label: "🍓 Fresh Berries", icon: "🍓" },
  macarons: { label: "🍬 Pastel Macarons", icon: "🍬" },
  meringue_pearls: { label: "⚪ Crisp Pearls", icon: "⚪" },
};

const CakeVisualPreview = ({
  flavour = "belgian_chocolate",
  weight = "1.0",
  shape = "round",
  tiers = "1",
  frosting = "whipped_cream",
  colorPalette = "pastel_pink",
  toppings = [],
  cakeMessage = "",
}) => {
  const color = COLOR_MAP[colorPalette] || COLOR_MAP.pastel_pink;
  const numTiers = parseInt(tiers, 10) || 1;
  const isHeart = shape === "heart";
  const isSquare = shape === "square";

  // Tier widths and heights
  const tierConfigs = [
    { width: "w-56", height: "h-24", z: "z-10" },
    { width: "w-44", height: "h-20", z: "z-20" },
    { width: "w-32", height: "h-16", z: "z-30" },
  ];

  return (
    <div className="relative w-full aspect-square max-w-[440px] mx-auto bg-gradient-to-b from-[#fbf9f6] via-[#f7f2eb] to-[#ece5da] rounded-3xl p-6 shadow-inner border border-[#e8dfd5] flex flex-col items-center justify-between overflow-hidden">
      {/* Studio Header Badges */}
      <div className="w-full flex items-center justify-between z-30">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/80 backdrop-blur-sm text-[#a67c52] shadow-sm border border-[#a67c52]/20">
          <Sparkles size={12} className="animate-spin text-[#a67c52]" /> Live 2D Studio Preview
        </span>
        <span className="text-xs font-medium text-gray-500 bg-white/70 px-2.5 py-1 rounded-full shadow-xs">
          {shape.toUpperCase()} • {tiers} {tiers === "1" ? "TIER" : "TIERS"} • {weight} KG
        </span>
      </div>

      {/* Visual Composition Center */}
      <div className="relative w-full flex-1 flex flex-col items-center justify-end pb-8 pt-4">
        {/* Soft Radial Backlight */}
        <div
          className="absolute w-64 h-64 rounded-full blur-2xl opacity-40 transition-all duration-700 pointer-events-none"
          style={{ backgroundColor: color.accent }}
        />

        {/* Cake Structure */}
        <div className="relative flex flex-col-reverse items-center justify-end w-full">
          {Array.from({ length: numTiers }).map((_, index) => {
            const cfg = tierConfigs[index];
            const isTopTier = index === numTiers - 1;

            return (
              <div
                key={index}
                className={`relative ${cfg.width} ${cfg.height} ${cfg.z} transition-all duration-500 ease-out flex items-center justify-center -mb-2 shadow-lg`}
                style={{
                  backgroundColor: color.bg,
                  borderColor: color.border,
                  borderWidth: frosting === "naked" ? "1px" : "3px",
                  borderStyle: frosting === "naked" ? "dashed" : "solid",
                  borderRadius: isHeart
                    ? "40% 40% 35% 35% / 50% 50% 30% 30%"
                    : isSquare
                    ? "12px"
                    : "9999px / 40px",
                  boxShadow: `0 8px 24px -4px ${color.border}66, inset 0 2px 8px rgba(255,255,255,0.7)`,
                }}
              >
                {/* Frosting Drip or Ganache Effect */}
                {frosting === "chocolate_ganache" && (
                  <div className="absolute top-0 inset-x-0 h-4 bg-[#3E2723]/70 rounded-t-full opacity-80 backdrop-blur-xs" />
                )}
                {frosting === "buttercream" && (
                  <div className="absolute inset-x-2 top-1 h-2 rounded-full bg-white/40 blur-xs" />
                )}

                {/* Cake Message on Top Tier */}
                {isTopTier && cakeMessage && (
                  <div className="absolute inset-x-2 px-3 py-1 text-center z-40">
                    <span
                      className={`text-xs md:text-sm font-serif italic tracking-wide drop-shadow-sm px-2 py-0.5 rounded-full ${
                        color.textLight ? "text-white" : "text-[#5c4033]"
                      }`}
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.4)",
                        backdropFilter: "blur(2px)",
                      }}
                    >
                      "{cakeMessage}"
                    </span>
                  </div>
                )}

                {/* Toppings Placed on Top Tier */}
                {isTopTier && toppings && toppings.length > 0 && (
                  <div className="absolute -top-4 inset-x-0 flex items-center justify-center gap-1.5 z-40 flex-wrap px-2">
                    {toppings.map((t) => {
                      const topInfo = TOPPING_MAP[t];
                      return topInfo ? (
                        <span
                          key={t}
                          className="text-lg md:text-xl drop-shadow-md animate-bounce transform hover:scale-125 transition-transform"
                          title={topInfo.label}
                        >
                          {topInfo.icon}
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* Marble/Gold Cake Stand & Plinth */}
          <div className="w-64 h-3 bg-gradient-to-r from-[#e3d7c8] via-[#ffffff] to-[#d6c7b3] rounded-full shadow-md z-0 border border-[#cbbca9]" />
          <div className="w-40 h-2 bg-[#b8a792] rounded-full opacity-60 blur-xs z-0 -mt-1" />
        </div>
      </div>

      {/* Bottom Visual Highlights */}
      <div className="w-full bg-white/80 backdrop-blur-md rounded-2xl p-3 border border-[#ede5db] flex items-center justify-between text-xs z-30 shadow-xs">
        <div>
          <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">Palette</span>
          <span className="font-semibold text-gray-800">{color.name}</span>
        </div>
        <div className="h-5 w-px bg-gray-200" />
        <div>
          <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">Frosting</span>
          <span className="font-semibold text-gray-800 capitalize">{frosting.replace("_", " ")}</span>
        </div>
        <div className="h-5 w-px bg-gray-200" />
        <div>
          <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">Flavour</span>
          <span className="font-semibold text-[#a67c52] capitalize">{flavour.replace("_", " ")}</span>
        </div>
      </div>
    </div>
  );
};

export default CakeVisualPreview;

