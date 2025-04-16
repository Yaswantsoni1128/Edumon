import React from 'react'
import HeroCard from './HeroCard'

const Hero2 = () => {
  const cards = [
    {
      icon: "./school.png",
      title: "Seamless School Management",
      content: "Effortlessly track attendance, grades, and student progress with our intuitive platform, reducing administrative workload."
    },
    {
      icon: "./family.png",
      title: "Real-Time Parent Engagement",
      content: "Keep parents informed with instant updates on assignments, fees, and school activities through a dedicated portal."
    },
    {
      icon: "./cyber-security.png",
      title: "Secure & Scalable Solution",
      content: "Built with robust security and scalability, Edumon ensures data protection while adapting to your school's evolving needs."
    }
  ]

  return (
    <div className='m-5 p-10 flex justify-around items-center gap-2'>
      <div className='bg-sky-600 w-1/3 p-5 rounded-xl flex flex-col items-center gap-2 shadow-3xl '>
        <p className='text-white text-3xl font-bold p-5'>Why Choose Edumon for your school?</p>
        <p className='text-white text-md p-5 align-baseline text-'>Edumon simplifies school operations with Teacher & Student Management, ensuring seamless attendance and performance tracking. Our Notices & Assignment Management keeps everyone updated, while Fee & Attendance Tracking automates payments and records accurately. A smart, cloud-based solution for effortless school administration and improved learning experiences.</p>
        
      </div>
      <div className='w-2/3 flex flex-wrap justify-around gap-3 items-stretch '>
        {cards.map((item, idx) => (
          <HeroCard key={idx} icon={item.icon} title={item.title} content={item.content} />
        ))}
      </div>
    </div>
  )
}

export default Hero2
