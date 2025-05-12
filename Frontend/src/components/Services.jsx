import React from 'react';
import FeatureCard from "./LandingPage/FeatureCard";
import { motion } from 'framer-motion';

const Services = () => {
  const featureList = [
    {
      icon: "./teacher.png",
      title: "Teacher Management",
      description:
        "Cloud-based school management solution to help institutions record, track, and monitor students’ enrolment, grade, and attendance records.",
    },
    {
      icon: "./student.png",
      title: "Student Management",
      description:
        "Cloud-based online system which enables faculty members to track class-specific attendance and grade records.",
    },
    {
      icon: "./money.png",
      title: "Fee Management",
      description:
        "Technology leverages teaching-learning solutions through smart classroom infrastructure.",
    },
    {
      icon: "./notifications.png",
      title: "Notices Management",
      description:
        "A cloud-based scalable LMS platform for educational institutions of all sizes. It allows teachers to customize courses.",
    },
    {
      icon: "./check.png",
      title: "Attendance Management",
      description:
        "Our solutions integrate with a school's existing Student Information System and other teaching platforms.",
    },
    {
      icon: "./assignment.png",
      title: "Assignment Management",
      description:
        "We develop mobile learning solutions and content for web and specialized apps.",
    },
  ];

  return (
    <div className="py-16 px-6 bg-gradient-to-br from-white to-blue-50 min-h-screen">
      {/* Heading Section with animation */}
      <motion.div
        className="mt-20 text-center mb-12"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl font-bold text-gray-900">Key Features</h2>
        <p className="w-1/2 md:w-3/5 mx-auto text-lg text-gray-700 mt-4 leading-relaxed">
          Explore our advanced educational solutions designed for better management and learning.
        </p>
      </motion.div>

      {/* Feature Cards Grid with animations */}
      <motion.div
        className="flex flex-wrap justify-center gap-10 "
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.2,
            },
          },
        }}
      >
        {featureList.map((item, idx) => (
          <motion.div
            key={idx}
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.5 }}

          >
            <FeatureCard
              icon={item.icon}
              title={item.title}
              description={item.description}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Services;
