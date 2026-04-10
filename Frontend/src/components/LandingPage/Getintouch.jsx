import React from 'react'
import { motion } from 'framer-motion'
import { Send, User, Mail, MessageSquare } from 'lucide-react'

const Getintouch = () => {
  return (
    <div className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto bg-gray-50 rounded-[3rem] p-8 md:p-16 border border-gray-100 shadow-2xl shadow-gray-200/50"
      >
        <div className="text-center mb-12 space-y-4">
          <h3 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Send us a message</h3>
          <p className="text-gray-500 font-medium">Have specific questions? Our team typically responds within 2 hours.</p>
        </div>

        <form method="POST" action="https://formspree.io/f/xrbewbpg" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1 flex items-center gap-2">
                <User size={14} className="text-sky-600" />
                Full Name
              </label>
              <input 
                type="text" 
                name="Name" 
                placeholder="John Doe" 
                className="w-full bg-white border border-gray-200 rounded-2xl py-4 px-6 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all font-medium" 
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1 flex items-center gap-2">
                <Mail size={14} className="text-sky-600" />
                Email Address
              </label>
              <input 
                type="email" 
                name="Email" 
                placeholder="john@example.com" 
                className="w-full bg-white border border-gray-200 rounded-2xl py-4 px-6 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all font-medium" 
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1 flex items-center gap-2">
              <MessageSquare size={14} className="text-sky-600" />
              Your Message
            </label>
            <textarea 
              placeholder="How can we help your school?" 
              name="message" 
              className="w-full bg-white border border-gray-200 rounded-2xl p-6 h-40 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all font-medium resize-none" 
              required
            ></textarea>
          </div>

          <button className="w-full md:w-auto bg-sky-600 text-white font-black px-12 py-5 rounded-2xl shadow-xl shadow-sky-200 hover:bg-sky-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 ml-auto">
            Submit Message
            <Send size={20} />
          </button>
        </form>
      </motion.div>
    </div>
  )
}

export default Getintouch