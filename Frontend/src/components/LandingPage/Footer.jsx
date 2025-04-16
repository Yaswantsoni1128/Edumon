import React from 'react'

const Footer = () => {
  return (
    <div className='text-gray-800 text-md font-medium flex justify-between items-center px-20 py-6 bg-gray-100 shadow-lg'>
      <p>All copyright reserved to ©Edumon, Made with ❤️Yaswant</p>
      <div className='flex justify-around items-center gap-1'>
        <img src="./linkedin.png" alt="" className='h-6 w-6 rounded-full cursor-pointer'/>
        <img src="./instagram.png" alt="" className='h-6 w-6 rounded-full cursor-pointer'/>
        <img src="./github.png" alt="" className='h-6 w-6 rounded-full cursor-pointer'/>
        <img src="./facebook.png" alt="" className='h-6 w-6 rounded-full cursor-pointer'/>
      </div>
    </div>
  )
}

export default Footer