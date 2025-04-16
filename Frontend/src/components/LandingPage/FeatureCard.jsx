import React from "react";

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white shadow-lg border border-gray-200 rounded-xl p-6 w-80 flex flex-col items-center text-center transition-transform duration-300 hover:scale-105 hover:shadow-xl group">
      {/* Circular Icon */}
      <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-500 transition-all duration-300 group-hover:bg-white mb-4">
        <img src={icon} alt={title} className="w-8 h-8" />
      </div>

      {/* Title */}
      <p className="text-lg font-bold text-gray-900 uppercase transition-all duration-300 group-hover:text-sky-600">
        {title}
      </p>

      {/* Description */}
      <p className="text-gray-600 text-md mt-2 leading-relaxed transition-all duration-300">
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;
