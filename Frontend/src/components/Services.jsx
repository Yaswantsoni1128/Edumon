import React from 'react';
import FeatureCard from "./LandingPage/FeatureCard";
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

const Services = () => {
  const featureList = [
    {
      icon: Users,
      title: "Teacher Portal",
      description: "Faculty management and performance analytics.",
    },
    {
      icon: GraduationCap,
      title: "Student Hub",
      description: "Academic history and attendance trends.",
    },
    {
      icon: CreditCard,
      title: "Fee Automation",
      description: "Digital payment processing and invoicing.",
    },
    {
      icon: BellRing,
      title: "Notice Express",
      description: "Instant school Announcements and alerts.",
    },
    {
      icon: CalendarCheck,
      title: "Smart Attendance",
      description: "Daily logging with pattern analysis.",
    },
    {
      icon: FileText,
      title: "Assignments",
      description: "Distribution and tracking for students.",
    },
  ];

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50/50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-widest border border-indigo-100">
            <BadgeCheck size={14} />
            <span>Powering Excellence</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight uppercase">
            Comprehensive <span className="text-sky-600">Solutions</span>
          </h2>
          <p className="max-w-2xl mx-auto text-[10px] md:text-xs text-gray-500 font-black uppercase tracking-[0.15em] leading-relaxed">
            Every tool you need to manage a modern educational institution efficiently.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            visible: { transition: { staggerChildren: 0.1 } }
          }}
        >
          {featureList.map((item, idx) => (
            <motion.div key={idx} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="h-full">
              <FeatureCard icon={item.icon} title={item.title} description={item.description} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Services;
