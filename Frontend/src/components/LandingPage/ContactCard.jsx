import React from "react";

const ContactCard = ({ icon: Icon, title, description }) => {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col items-center text-center group w-full max-w-sm">
      <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 mb-6 group-hover:scale-110 group-hover:bg-orange-600 group-hover:text-white transition-all duration-500 shadow-sm">
        {typeof Icon === 'string' ? (
          <img src={Icon} alt={title} className="w-8 h-8 object-contain" />
        ) : (
          <Icon size={28} />
        )}
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors duration-300">
        {title}
      </h3>

      <p className="text-gray-500 leading-relaxed text-sm font-medium whitespace-pre-wrap">
        {description}
      </p>
    </div>
  );
};

export default ContactCard;
