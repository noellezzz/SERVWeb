import React from 'react';
import oscaContact from '../../assets/osca-contact.gif'; // Import the GIF directly

function Contact() {
  return (
    <div>
      <section className='hero-section w-full h-[calc(70vh+50px)] bg-white flex flex-col lg:flex-row items-center justify-between px-4 py-10 overflow-clip'>
        <div className='flex-1 flex justify-center items-center'>
          <div className='w-full max-w-[600px]'>
            <img
              src={oscaContact}  // Use the imported GIF here
              alt='OSCA Contact GIF'
              width='560'
              height='415'
              className='object-contain'
            />
          </div>
        </div>

        <div className='flex-1 flex flex-col justify-center pl-8 text-center lg:text-left'>
          <h1 className='text-5xl font-bold text-red-600 mb-6'>Contact Us</h1>

          <form className='space-y-6'>
            <div>
              <label htmlFor='name' className='block text-lg font-medium text-gray-700'>Your Name</label>
              <input
                type='text'
                id='name'
                name='name'
                placeholder='Enter your name'
                className='w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600'
              />
            </div>

            <div>
              <label htmlFor='email' className='block text-lg font-medium text-gray-700'>Your Email</label>
              <input
                type='email'
                id='email'
                name='email'
                placeholder='Enter your email'
                className='w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600'
              />
            </div>

            <div>
              <label htmlFor='message' className='block text-lg font-medium text-gray-700'>Message</label>
              <textarea
                id='message'
                name='message'
                placeholder='Enter your message'
                rows='4'
                className='w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600'
              ></textarea>
            </div>

            <div className='flex justify-center'>
              <button
                type='submit'
                className='px-6 py-3 bg-red-600 text-white text-lg rounded-md hover:bg-red-700 focus:outline-none'
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </section>

    </div>
  );
}

export default Contact;
