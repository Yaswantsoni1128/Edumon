import React from 'react';
import HeroCard from './HeroCard';
import { motion } from 'framer-motion';
import { ShieldCheck, Users, Zap, CheckCircle2 } from 'lucide-react';

const Hero2 = () => {
  const cards = [
    {
      icon: Users,
      title: "Seamless Management",
      content: "Effortlessly track attendance, grades, and student progress with our intuitive platform, reducing administrative workload."
    },
    {
      icon: Zap,
      title: "Real-Time Engagement",
      content: "Keep parents informed with instant updates on assignments, fees, and school activities through a dedicated portal."
    },
    {
      icon: ShieldCheck,
      title: "Secure Solution",
      content: "Built with robust security and scalability, Edumon ensures data protection while adapting to your school's needs."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12 items-stretch">
        {/* Left Section (Trust Box) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="lg:col-span-5 bg-sky-600 p-8 md:p-14 rounded-[2.5rem] md:rounded-[3rem] flex flex-col justify-center gap-6 md:gap-8 shadow-2xl shadow-sky-100 text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-[5rem]"></div>
          
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-black leading-tight tracking-tight uppercase">
              Why Choose <br/> <span className="text-sky-300">Edumon?</span>
            </h2>
            <div className="w-16 h-1.5 bg-sky-300 rounded-full"></div>
          </div>

          <p className="text-sky-50 text-base leading-relaxed font-medium">
            We provide a comprehensive digital ecosystem that simplifies institution management and enhances the educational journey for everyone involved.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            {['Cloud-based', 'Real-time', 'Secure', 'Intuitive'].map((item) => (
              <div key={item} className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-sky-100">
                <CheckCircle2 size={18} className="text-sky-300" />
                {item}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Section (Cards Grid) */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: { transition: { staggerChildren: 0.1 } }
            }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {cards.map((item, idx) => (
              <motion.div
                key={idx}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                className={idx === 2 ? "sm:col-span-2" : ""}
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
      </div>
    </div>
  );
};

export default Hero2;
