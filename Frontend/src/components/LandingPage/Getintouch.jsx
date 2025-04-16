import React from 'react'

const Getintouch = () => {
  return (
    <form method="POST" action={"https://formspree.io/f/xrbewbpg"} className="bg-gray-50 shadow-xl rounded-xl w-full md:w-3/4 lg:w-1/2 md:mx-auto p-6">
    <h3 className="text-2xl font-semibold text-center">Get in touch</h3>
    <input type="text" name="Name" placeholder="Enter your name" className="px-5 py-2 mt-5 w-full border text-lg rounded-md" required/>
    <input type="email" name="Email" placeholder="Enter your email" className="px-5 py-2 mt-5 w-full border text-lg rounded-md" required/>
    <textarea placeholder="Your message" name="message" className="px-5 h-24 py-2 mt-5 w-full border text-lg rounded-md resize-none" required></textarea>
    <button className="mt-5 rounded-lg bg-sky-600 font-semibold text-lg px-8 py-3 text-white shadow-lg cursor-pointer h hover:scale-105 transition-all">
      Submit
    </button>
  </form>
  )
}

export default Getintouch