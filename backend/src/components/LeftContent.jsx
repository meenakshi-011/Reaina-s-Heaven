import React from 'react'

const LeftContent = () => {
  return (

      <div className="w-full md:w-[65%] pr-10">"
        <h1 className="text-5xl font-serif text-[#3e3e3e] leading-tight ">
          Create Moments <br />
          of Joy & Comfort 🌿
        </h1>
         <p className="mt-6 text-lg text-gray-600">
          Discover Books, Flowers & Cozy Cafés for Every Occasion
        </p>

        {/* BUTTONS */}
        <div className="mt-8 flex gap-4">
          <button className="bg-green-700 text-white px-6 py-3 rounded-full shadow-md hover:bg-green-800 transition">
            Explore Now
          </button>

          <button className="bg-white text-gray-700 px-6 py-3 rounded-full shadow-md hover:bg-gray-100 transition">
            Browse Hampers
          </button>
        </div>
      </div>
  )
}

export default LeftContent
