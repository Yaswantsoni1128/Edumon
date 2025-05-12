import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="px-4 md:px-20 py-10 min-h-[600px] flex items-center bg-white">
      <div className="flex flex-col-reverse lg:flex-row items-center justify-between w-full gap-10">
        
        {/* Text Content */}
        <div className="w-full lg:w-1/2 flex flex-col gap-5 text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
            Welcome to Edumon
          </h1>
          <p className="text-gray-600 text-base md:text-lg max-w-md mx-auto lg:mx-0">
            EduMon is a smart school tracking platform that helps parents monitor attendance,
            assignments, fees, academic progress, and communication seamlessly.
          </p>
          <div className="flex justify-center lg:justify-start">
            <Link to="/login">
              <button className="mt-3 px-6 py-3 bg-sky-700 text-white text-base font-medium rounded-xl flex items-center gap-2 hover:bg-gray-200 hover:text-sky-700 transition">
                <img src="./right.png" alt="arrow" className="h-6 w-6 rounded-full bg-white" />
                Get Started
              </button>
            </Link>
          </div>
        </div>

        {/* Image */}
        <div className="mt-20 w-full lg:w-1/2 flex justify-center">
          <img
            src="./school_bg.jpg"
            alt="school"
            className="rounded-full w-64 h-64 md:w-96 md:h-96 object-cover shadow-xl transition-transform duration-500 hover:scale-105"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
