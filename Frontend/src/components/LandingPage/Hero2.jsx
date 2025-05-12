import React from 'react';
import HeroCard from './HeroCard';

const Hero2 = () => {
  const cards = [
    {
      icon: "./school.png",
      title: "Seamless School Management",
      content: "Effortlessly track attendance, grades, and student progress with our intuitive platform, reducing administrative workload."
    },
    {
      icon: "./family.png",
      title: "Real-Time Parent Engagement",
      content: "Keep parents informed with instant updates on assignments, fees, and school activities through a dedicated portal."
    },
    {
      icon: "./cyber-security.png",
      title: "Secure & Scalable Solution",
      content: "Built with robust security and scalability, Edumon ensures data protection while adapting to your school's evolving needs."
    }
  ];

  return (
    <div className="m-5 p-6 md:p-10 flex flex-col lg:flex-row gap-6 items-center justify-between">
      
      {/* Left Section */}
      <div className="bg-sky-600 w-full lg:w-1/3 p-6 rounded-xl flex flex-col gap-4 shadow-xl text-center lg:text-left">
        <h2 className="text-white text-2xl md:text-3xl font-bold">Why Choose Edumon for your school?</h2>
        <p className="text-white text-sm md:text-base">
          Edumon simplifies school operations with Teacher & Student Management, ensuring seamless attendance and performance tracking.
          Our Notices & Assignment Management keeps everyone updated, while Fee & Attendance Tracking automates payments and records accurately.
          A smart, cloud-based solution for effortless school administration and improved learning experiences.
        </p>
      </div>

      {/* Right Section (Cards) */}
      <div className="w-full lg:w-2/3 flex flex-wrap gap-4 justify-center">
        {cards.map((item, idx) => (
          <HeroCard
            key={idx}
            icon={item.icon}
            title={item.title}
            content={item.content}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero2;
