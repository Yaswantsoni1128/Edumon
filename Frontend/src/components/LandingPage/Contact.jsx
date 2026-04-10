import React from 'react';
import ContactCard from './ContactCard';
import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, MessageSquare } from 'lucide-react';

const Contact = () => {
  const cards = [
    {
      icon: MapPin,
      title: "Our Address",
      description: `Edumon HQ\nIIIT Una, Himachal Pradesh\nIndia - 177209`
    },
    {
      icon: Mail,
      title: "Email Us",
      description: `connect@edumon.com\nsupport@edumon.com`
    },
    {
      icon: Phone,
      title: "Call Us",
      description: "+91 8003999085\nMon-Fri, 9am - 6pm"
    }
  ];

  return (
    <div className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
      <div className="max-w-7xl mx-auto">
        {/* Heading Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-20 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 text-orange-700 text-xs font-bold uppercase tracking-widest border border-orange-100">
            <MessageSquare size={14} />
            <span>Connect with Us</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            We're here to <span className="text-orange-600">Help You</span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 font-medium leading-relaxed">
            Reach out to our experts for a personalized walkthrough of the Edumon ecosystem.
          </p>
        </motion.div>

        {/* Contact Cards Grid */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            visible: { transition: { staggerChildren: 0.15 } }
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center"
        >
          {cards.map((item, idx) => (
            <motion.div
              key={idx}
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: { opacity: 1, scale: 1 }
              }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <ContactCard 
                icon={item.icon} 
                title={item.title} 
                description={item.description} 
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
