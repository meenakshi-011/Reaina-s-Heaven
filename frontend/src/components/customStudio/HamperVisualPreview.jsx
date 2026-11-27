import React from "react";
import { Sparkles, Package, Gift, Trash2 } from "lucide-react";

const PACKAGING_VISUALS = {
  luxury_wooden_trunk: {
    name: "Luxury Wooden Keepsake Trunk",
    border: "#8B5A2B",
    bg: "from-[#5C3818] via-[#754820] to-[#4A2C12]",
    liner: "#F4EBE1",
    label: "Handcrafted Dark Walnut Grain",
  },
  wicker_basket: {
    name: "Woven Willow Wicker Basket",
    border: "#B38B59",
    bg: "from-[#C4A47C] via-[#D8BA93] to-[#B38B59]",
    liner: "#FFFDF9",
    label: "Rustic French Woven Willow",
  },
  velvet_box: {
    name: "Pastel Hexagon Velvet Box",
    border: "#C8A2C8",
    bg: "from-[#D8B4D8] via-[#E6CCE6] to-[#C8A2C8]",
    liner: "#FFFFFF",
    label: "Plush Velvet Hexagon Box",
  },
  kraft_tote: {
    name: "Minimalist Kraft Window Gift Tote",
    border: "#A67C52",
    bg: "from-[#D2B48C] via-[#DEB887] to-[#C19A6B]",
    liner: "#FAF0E6",
    label: "Clean Botanical Kraft Carrier",
  },
};

const HamperVisualPreview = ({
  packagingType = "luxury_wooden_trunk",
  theme = "botanical_bliss",
  colorCombination = "rose_gold",
  selectedProducts = [],
  recipientName = "",
  onRemoveProduct,
}) => {
  const packaging = PACKAGING_VISUALS[packagingType] || PACKAGING_VISUALS.luxury_wooden_trunk;

  return (
    <div className="relative w-full aspect-square max-w-[440px] mx-auto bg-gradient-to-b from-[#fbf9f6] via-[#f7f2eb] to-[#ece5da] rounded-3xl p-6 shadow-inner border border-[#e8dfd5] flex flex-col items-center justify-between overflow-hidden">
      {/* Studio Header Badges */}
      <div className="w-full flex items-center justify-between z-30">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/80 backdrop-blur-sm text-[#a67c52] shadow-sm border border-[#a67c52]/20">
          <Sparkles size={12} className="text-[#a67c52]" /> Live Hamper Composition
        </span>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#a67c52] text-white shadow-xs">
          {selectedProducts.length} Items Selected
        </span>
      </div>

      {/* Visual Composition Container */}
      <div className="relative w-full flex-1 flex flex-col items-center justify-center py-4">
        {/* Soft Aura */}
        <div className="absolute w-56 h-56 rounded-full bg-[#a67c52]/15 blur-2xl pointer-events-none" />

        {/* Outer Hamper Vessel */}
        <div
          className={`relative w-72 md:w-80 h-52 rounded-2xl p-3 shadow-xl border-4 flex flex-col justify-between overflow-hidden bg-gradient-to-br ${packaging.bg}`}
          style={{ borderColor: packaging.border }}
        >
          {/* Internal Silk/Paper Cushion Liner */}
          <div
            className="w-full flex-1 rounded-xl p-2.5 shadow-inner overflow-hidden flex flex-col justify-between relative"
            style={{ backgroundColor: packaging.liner }}
          >
            {/* Top Satin Ribbon & Bow */}
            <div className="absolute top-0 inset-x-0 h-2 bg-[#a67c52] opacity-80 z-20" />

            {/* Recipient Gold Foil Tag */}
            {recipientName && (
              <div className="absolute top-2 right-2 bg-gradient-to-r from-[#FFF8E7] to-[#F5E6C8] border border-[#D4AF37] px-2 py-0.5 rounded-md shadow-xs z-30 text-[10px] font-serif font-bold text-[#8C6D23]">
                For: {recipientName}
              </div>
            )}

            {/* Contents View */}
            {selectedProducts.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                <Gift size={28} className="text-gray-300 mb-1.5 animate-pulse" />
                <p className="text-xs font-medium text-gray-500">Hamper is currently empty</p>
                <p className="text-[10px] text-gray-400">Select goodies below to fill your trunk</p>
              </div>
            ) : (
              <div className="flex-1 grid grid-cols-2 gap-2 overflow-y-auto max-h-36 pr-1 custom-scrollbar">
                {selectedProducts.map((p, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-1.5 bg-white/90 rounded-lg border border-gray-100 shadow-xs relative group"
                  >
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="w-8 h-8 rounded-md object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-md bg-[#f8f5f2] flex items-center justify-center text-[#a67c52]">
                        <Package size={14} />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-semibold text-gray-800 truncate">{p.name}</p>
                      <p className="text-[10px] text-[#a67c52] font-bold">₹{p.price}</p>
                    </div>
                    {onRemoveProduct && (
                      <button
                        onClick={() => onRemoveProduct(p._id || p.product || p.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors p-1"
                        title="Remove item"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Bottom Wood/Vessel Slat Accent */}
            <div className="w-full text-center py-0.5 border-t border-gray-200/60 mt-1">
              <span className="text-[9px] text-gray-400 font-serif italic">Reaina Signature Packaging</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Info Bar */}
      <div className="w-full bg-white/80 backdrop-blur-md rounded-2xl p-3 border border-[#ede5db] flex items-center justify-between text-xs z-30 shadow-xs">
        <div>
          <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">Vessel</span>
          <span className="font-semibold text-gray-800 truncate block max-w-[140px]">{packaging.name}</span>
        </div>
        <div className="h-5 w-px bg-gray-200" />
        <div>
          <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">Theme</span>
          <span className="font-semibold text-[#a67c52] capitalize">{theme.replace("_", " ")}</span>
        </div>
        <div className="h-5 w-px bg-gray-200" />
        <div>
          <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">Ribbon</span>
          <span className="font-semibold text-gray-800 capitalize">{colorCombination.replace("_", " ")}</span>
        </div>
      </div>
    </div>
  );
};

export default HamperVisualPreview;

