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
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full -z-10">
          <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-sky-50 rounded-full blur-[120px] opacity-60"></div>
          <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-indigo-50 rounded-full blur-[120px] opacity-60"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6 mb-16 md:mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-50 text-sky-700 text-[10px] font-black border border-sky-100 uppercase tracking-[0.2em]"
            >
              <Award size={14} />
              <span>Verified Excellence</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-7xl font-black text-gray-900 leading-[1.1] tracking-tighter uppercase"
            >
              WE ARE REVOLUTIONIZING <span className="text-sky-600">SCHOOLING</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-500 text-sm md:text-base font-bold uppercase tracking-widest leading-relaxed"
            >
              Edumon is not just a tool; it's a digital ecosystem designed to bring clarity, efficiency, and safety to educational institutions worldwide.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tight">Our Mission</h2>
                <p className="text-gray-600 leading-relaxed text-sm md:text-base font-medium">
                  To empower educators with intelligent automation so they can focus on what truly matters: mentoring the leaders of tomorrow. We bridge the communication gap between schools and parents through real-time data flow.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { title: "Transparency", desc: "Open data flow between all stakeholders." },
                  { title: "Security", desc: "Military-grade encryption for student data." },
                  { title: "Innovation", desc: "Always evolving with the latest AI trends." },
                  { title: "User First", desc: "Intuitive design for non-technical users." }
                ].map((item, i) => (
                  <div key={i} className="space-y-2 p-6 bg-gray-50 rounded-[2rem] border border-gray-100 hover:border-sky-200 transition-colors">
                    <div className="flex items-center gap-2 text-sky-600 font-black uppercase tracking-widest text-[10px]">
                      <CheckCircle2 size={16} />
                      {item.title}
                    </div>
                    <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wide leading-snug">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl relative group">
                <img 
                  src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1200"
                  alt="About Edumon"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1523050335392-93851179ae2c?auto=format&fit=crop&q=80&w=1200";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-sky-950/60 to-transparent"></div>
                <div className="absolute bottom-8 left-8 right-8 text-white p-8 bg-white/10 backdrop-blur-xl rounded-[2rem] border border-white/20">
                  <p className="text-sm md:text-base font-black italic uppercase tracking-tighter leading-tight">
                    "Technology is just a tool. In terms of getting the kids working together and motivating them, the teacher is the most important."
                  </p>
                  <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-sky-300">— Bill Gates</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Cards */}
      <section className="py-24 lg:py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cards.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group p-10 bg-gray-50 rounded-[3rem] border border-gray-100 hover:bg-white hover:shadow-3xl hover:-translate-y-2 transition-all duration-500"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110 duration-500 ${item.color} shadow-xl shadow-current opacity-80`}>
                  <item.icon size={28} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight uppercase">{item.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed font-bold uppercase tracking-widest opacity-80">{item.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
