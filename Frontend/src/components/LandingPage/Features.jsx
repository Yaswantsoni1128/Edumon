import React from "react";
import FeatureCard from "./FeatureCard";
import { motion } from 'framer-motion';
import { 
  Users, 
  GraduationCap, 
  CreditCard, 
  BellRing, 
  CalendarCheck, 
  FileText,
  BadgeCheck
} from 'lucide-react';

const Features = () => {
  const featureList = [
    {
      icon: Users,
      title: "Teacher Portal",
      description:
        "Comprehensive management for faculty records, schedules, and performance analytics.",
      link: "/login"
    },
    {
      icon: GraduationCap,
      title: "Student Hub",
      description:
        "Centralized profiles for academic history, attendance trends, and behavioral reports.",
      link: "/login"
    },
    {
      icon: CreditCard,
      title: "Fee Automation",
      description:
        "Digital payment processing, automated invoicing, and clear financial statements.",
      link: "/login"
    },
    {
      icon: BellRing,
      title: "Notice Express",
      description:
        "Instant delivery of school announcements, event updates, and emergency alerts.",
      link: "/login"
    },
    {
      icon: CalendarCheck,
      title: "Smart Attendance",
      description:
        "Effortless daily logging with trend analysis to identify patterns and ensure safety.",
      link: "/login"
    },
    {
      icon: FileText,
      title: "Assignments",
      description:
        "Interactive portal for distributing tasks and submission tracking for students.",
      link: "/login"
    },
  ];

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
      <div className="max-w-7xl mx-auto">
        {/* Heading Section */}
        <motion.div
          className="text-center mb-12 md:mb-16 lg:mb-20 space-y-4"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-[9px] md:text-xs font-black uppercase tracking-widest border border-indigo-100">
            <BadgeCheck size={14} />
            <span>Powering Excellence</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight uppercase">
            Key <span className="text-sky-600">Features</span>
          </h2>
          <p className="max-w-2xl mx-auto text-xs sm:text-sm md:text-base text-gray-500 font-bold leading-relaxed uppercase tracking-wide opacity-80">
            Every tool you need to manage a modern educational institution efficiently.
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {featureList.map((item, idx) => (
            <motion.div
              key={idx}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="h-full"
            >
              <FeatureCard
                icon={item.icon}
                title={item.title}
                description={item.description}
                link={item.link}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Features;
