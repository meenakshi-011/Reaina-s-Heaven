import React from "react";

const Loader = () => {
  return (
    <div className="min-h-[70vh] w-full flex flex-col items-center justify-center bg-[#f8f5f2]">
      <div className="relative w-24 h-24">
        {/* Background track */}
        <div className="absolute inset-0 border-4 border-[#e0d8ce] rounded-full"></div>
        
        {/* Spinning indicator */}
        <div className="absolute inset-0 border-4 border-[#a67c52] rounded-full border-t-transparent animate-spin"></div>
        
        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center text-3xl animate-pulse">
          🌿
        </div>
      </div>
      <p className="mt-8 text-[#8c8c73] font-serif tracking-widest uppercase text-sm animate-pulse font-semibold">
        Loading Haven...
      </p>
    </div>
  );
};

export default Loader;
