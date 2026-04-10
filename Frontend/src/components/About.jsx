import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Users, Zap, CheckCircle2, Award } from 'lucide-react';

const About = () => {
  const cards = [
    {
      icon: Users,
      title: 'Seamless Management',
      content:
        'Effortlessly track attendance, grades, and student progress with our intuitive platform, reducing administrative workload.',
      color: 'bg-sky-100 text-sky-600'
    },
    {
      icon: Zap,
      title: 'Real-Time Engagement',
      content:
        'Keep parents informed with instant updates on assignments, fees, and school activities through a dedicated portal.',
      color: 'bg-indigo-100 text-indigo-600'
    },
    {
      icon: ShieldCheck,
      title: 'Secure & Scalable',
      content:
        "Built with robust security and scalability, Edumon ensures data protection while adapting to your school's evolving needs.",
      color: 'bg-emerald-100 text-emerald-600'
    },
  ];

  return (
    <div className="pb-20 px-4 sm:px-6 lg:px-8 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto space-y-20 lg:space-y-32">
        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-50 text-sky-700 text-[10px] font-black border border-sky-100 uppercase tracking-widest">
              <Award size={14} />
              <span>Verified Excellence</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 leading-tight uppercase">
              Why Choose Edumon for Your <span className="text-sky-600">Institution?</span>
            </h2>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed font-medium">
              Edumon simplifies school operations with Teacher & Student Management, ensuring
              seamless attendance and performance tracking.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Automated Attendance",
                "Instant Notices",
                "Secure Fees",
                "Academic Reports"
              ].map((text, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-700 text-[10px] font-black uppercase tracking-wider">
                  <CheckCircle2 className="text-sky-500" size={18} />
                  {text}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[4/3] bg-gradient-to-br from-sky-600 to-indigo-700 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
              <img 
                src="https://images.unsplash.com/photo-1577891720d93-388d22797e8c?auto=format&fit=crop&q=80&w=1200"
                alt="About Edumon"
                className="w-full h-full object-cover mix-blend-overlay opacity-60 hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 flex items-center justify-center p-8 md:p-12 text-center text-white bg-black/10 text-xl font-medium italic uppercase tracking-tighter">
                "Empowering educators to focus on what matters most."
              </div>
            </div>
          </motion.div>
        </div>

        {/* Info Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10">
          {cards.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 hover:bg-white hover:shadow-2xl hover:border-transparent transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-300 ${item.color}`}>
                <item.icon size={24} />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-4 tracking-tight uppercase">{item.title}</h3>
              <p className="text-[10px] text-gray-500 leading-relaxed font-black uppercase tracking-widest">{item.content}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
