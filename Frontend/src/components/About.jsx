import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  const cards = [
    {
      icon: './school.png',
      title: 'Seamless School Management',
      content:
        'Effortlessly track attendance, grades, and student progress with our intuitive platform, reducing administrative workload.',
    },
    {
      icon: './family.png',
      title: 'Real-Time Parent Engagement',
      content:
        'Keep parents informed with instant updates on assignments, fees, and school activities through a dedicated portal.',
    },
    {
      icon: './cyber-security.png',
      title: 'Secure & Scalable Solution',
      content:
        "Built with robust security and scalability, Edumon ensures data protection while adapting to your school's evolving needs.",
    },
  ];

  return (
    <div className="py-10 px-4 sm:px-6 md:px-10 lg:px-20 xl:px-28 bg-gradient-to-br from-blue-50 to-white min-h-screen">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-sky-600 mt-10 sm:mt-16 max-w-5xl mx-auto p-6 sm:p-10 rounded-3xl shadow-xl text-white text-center"
      >
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
          Why Choose Edumon for Your School?
        </h2>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed">
          Edumon simplifies school operations with Teacher & Student Management, ensuring
          seamless attendance and performance tracking. Our Notices & Assignment
          Management keeps everyone updated, while Fee & Attendance Tracking automates
          payments and records accurately. A smart, cloud-based solution for effortless
          school administration and improved learning experiences.
        </p>
      </motion.div>

      {/* Info Boxes */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-12 max-w-7xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.3,
            },
          },
        }}
      >
        {cards.map((item, idx) => (
          <motion.div
            key={idx}
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition duration-300"
          >
            <img src={item.icon} alt={item.title} className="w-16 h-16 mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold mb-2">{item.title}</h3>
            <p className="text-sm sm:text-base text-gray-600">{item.content}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default About;
