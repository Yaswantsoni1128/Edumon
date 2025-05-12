import React from 'react';

const HeroCard = ({ icon, title, content }) => {
  return (
    <div className="bg-white p-6 w-full sm:w-[45%] lg:w-[30%] min-h-[250px] shadow-xl rounded-xl flex flex-col gap-4 items-center justify-start text-center transition-transform duration-300 hover:scale-105 group">
      <img src={icon} alt={title} className="w-14 h-14 rounded-full bg-white" />
      <h3 className="text-lg md:text-xl font-semibold text-black group-hover:text-sky-600">
        {title}
      </h3>
      <p className="text-sm md:text-base text-gray-600 font-medium">
        {content}
      </p>
    </div>
  );
};

export default HeroCard;
