import React from 'react';
import HeroCard from '../components/LandingPage/HeroCard';
import { motion } from 'framer-motion';

const About = () => {
  const cards = [
    {
      icon: "./school.png",
      title: "Seamless School Management",
      content:
        "Effortlessly track attendance, grades, and student progress with our intuitive platform, reducing administrative workload.",
    },
    {
      icon: "./family.png",
      title: "Real-Time Parent Engagement",
      content:
        "Keep parents informed with instant updates on assignments, fees, and school activities through a dedicated portal.",
    },
    {
      icon: "./cyber-security.png",
      title: "Secure & Scalable Solution",
      content:
        "Built with robust security and scalability, Edumon ensures data protection while adapting to your school's evolving needs.",
    },
  ];

  return (
    <div className="py-16 px-4 md:px-16 bg-gradient-to-br from-blue-50 to-white min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-sky-600 mt-20 max-w-4xl mx-auto p-8 rounded-2xl shadow-lg text-white mb-12 text-center"
      >
        <h2 className="text-4xl font-bold mb-4">
          Why Choose Edumon for Your School?
        </h2>
        <p className="text-md md:text-lg leading-relaxed">
          Edumon simplifies school operations with Teacher & Student Management,
          ensuring seamless attendance and performance tracking. Our Notices &
          Assignment Management keeps everyone updated, while Fee & Attendance
          Tracking automates payments and records accurately. A smart,
          cloud-based solution for effortless school administration and improved
          learning experiences.
        </p>
      </motion.div>

      <motion.div
        className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8 max-w-6xl mx-auto"
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
          >
            <HeroCard
              icon={item.icon}
              title={item.title}
              content={item.content}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default About;
