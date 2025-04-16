import React from 'react'
import Contact from './LandingPage/Contact'
import Footer from './LandingPage/Footer'
import Navbar from './LandingPage/Navbar'
import ContactCard from './LandingPage/ContactCard'

const ContactUs = () => {
  const cards = [
    {
      icon: "./circle.png",
      title: "Our Address",
      description: `Edumon\nIIIT Una\nHimachal Pradesh`
    },
    {
      icon: "./mail.png",
      title: "Email Us",
      description: `23261@iiitu.ac.in\nsupport@edumon.com`
    },
    {
      icon: "./contact-us.png",
      title: "Call Us",
      description: "+91 8003999085"
    }
  ];

  return (
    <div className=''>
      
  return (
    <div className="py-16 px-6 bg-gray-50">
      {/* Heading */}
      <div className="text-center mb-10">
        <p className="text-4xl font-bold text-gray-900">Contact</p>
        <p className="w-3/5 mx-auto text-lg text-gray-700 mt-2 leading-relaxed">
          Want to know more about our solutions and how we can help you? Please provide your details, and we will get in touch with you.
        </p>
      </div>

      {/* Contact Cards */}
      <div className="flex flex-wrap justify-center gap-10">
        {cards.map((item, idx) => (
          <ContactCard key={idx} icon={item.icon} title={item.title} description={item.description} />
        ))}
      </div>
    </div>
  );
    </div>
  )
}

export default ContactUs