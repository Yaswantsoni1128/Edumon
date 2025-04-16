import React from 'react'

const HeroCard = ({icon, title, content}) => {
  return (
    <div className='bg-white p-5 w-64 min-h-[250px] shadow-xl rounded-lg flex flex-col gap-2 items-center justify-between  group'>
      <img src={icon} alt="" className='w-10 h-10 rounded-full bg-white'/>
      <p className='text-black font-medium text-lg text-center group-hover:text-sky-600'>{title}</p>
      <p className='text-gray-500 font-medium text-center'>{content}</p>
    </div>
  )
}

export default HeroCard
