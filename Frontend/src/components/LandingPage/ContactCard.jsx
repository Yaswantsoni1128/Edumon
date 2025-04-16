import React from "react";

const ContactCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white shadow-lg border border-gray-200 rounded-xl p-6 w-80 text-center transition-transform duration-300 hover:scale-105 hover:shadow-xl flex flex-col justify-start items-center">
      {/* Icon with Circular Background */}
      <span className="w-14 h-14 flex items-center justify-center rounded-full bg-orange-100 border border-orange-300">
        <img src={icon} alt={title} className="w-6 h-6" />
      </span>

      <span>
        {/* Title */}
        <p className="text-xl font-semibold text-gray-900 mt-4">{title}</p>

        {/* Description (Supports Multi-line) */}
        <p className="text-gray-600 text-md mt-2 whitespace-pre-wrap leading-relaxed">
          {description}
        </p>
      </span>
    </div>
  );
};

export default ContactCard;
