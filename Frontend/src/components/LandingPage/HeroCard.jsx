import React from 'react';

const HeroCard = ({ icon: Icon, title, content }) => {
  return (
    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group flex flex-col items-center text-center h-full">
      <div className="w-14 h-14 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-600 mb-6 group-hover:scale-110 group-hover:bg-sky-600 group-hover:text-white transition-all duration-500">
        {typeof Icon === 'string' ? (
          <img src={Icon} alt={title} className="w-6 h-6 object-contain" />
        ) : (
          <Icon size={24} />
        )}
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-sky-600 transition-colors duration-300 tracking-tight">
        {title}
      </h3>
      <p className="text-gray-500 leading-relaxed text-xs font-semibold">
        {content}
      </p>
    </div>
  );
};

export default HeroCard;
