import React from 'react'
import { BiSend } from "react-icons/bi";
const SendInput = () => {
  return (
    <div>
       <form className='px-4 my-3 '>
         <div className='w-full relative'>
            <input
            type='text'
            placeholder='Send message...'
            className='border text-sm rounded-lg block w-full border-zinc-500 bg-black-100 txt-white'
            />
            <button className='absolute inset-y-0 end-0 flex items-center pr-1'>
            <BiSend />
            </button>
         </div>
       </form>
    </div>
  )
}

export default SendInput
