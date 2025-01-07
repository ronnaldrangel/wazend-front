// 'use client';

import { useState } from 'react';


export default function User() {
  const [activeTab, setActiveTab] = useState('account');

  const user = {
    name: 'Ronald Rangel',
    username: 'gamersx8',
    email: 'ronald@rangel.pro',
    initials: 'RR',
    // imageUrl: 'https://via.placeholder.com/150', // Agrega la URL de la foto del usuario aquí
  };

  return (
    <div className='w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-lg'>

      <div className='border-b pt-8 px-6'>
        {/* Tabs */}
        <div className='flex gap-8 justify-center'>
          <button
            onClick={() => setActiveTab('account')}
            className={`pb-4 px-1 ${activeTab === 'account'
              ? 'border-b-2 border-emerald-600 text-emerald-600 font-bold'
              : 'text-gray-500'
              }`}
          >
            Cuenta
          </button>
          {/* <button
            onClick={() => setActiveTab('notifications')}
            className={`pb-4 px-1 ${activeTab === 'notifications'
              ? 'border-b-2 border-emerald-600 text-emerald-600 font-bold'
              : 'text-gray-500'
              }`}
          >
            Notificaciones
          </button> */}
        </div>
      </div>

      {/* Profile Content */}
      <div className='flex flex-col items-center p-8'>
        {/* Avatar */}
        <div className='w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mb-4'>
          {user.imageUrl ? (
            <img
              src={user.imageUrl}
              alt={user.name}
              className='w-full h-full rounded-full object-cover'
            />
          ) : (
            <span className='text-white text-4xl font-medium'>
              {user.initials}
            </span>
          )}
        </div>

        {/* Name */}
        <h1 className='text-3xl font-bold text-slate-700 mb-2'>
          {user.name}
        </h1>

        {/* No websites message */}
        <p className='text-gray-400 text-sm mb-8'>Te uniste el 12/09/2024</p>

        {/* User Details */}
        <div className='w-full space-y-6 bg-gray-100 p-6 rounded-lg'>

          {/* Username Field */}
          <div className='flex flex-col md:flex-row items-center'>
            <div className='w-full md:w-1/4 mb-2 md:mb-0'>
              <label className='text-base font-semibold text-black'>
                Username
              </label>
            </div>
            <div className='w-full md:w-3/4'>
              <p className='text-gray-700'>{user.username}</p>
            </div>
          </div>



          {/* Email Field */}
          <div className='flex flex-col md:flex-row items-center'>
            <div className='w-full md:w-1/4 mb-2 md:mb-0'>
              <label className='text-base font-semibold text-black'>
                Email
              </label>
            </div>
            <div className='w-full md:w-3/4'>
              <p className='text-gray-700'>{user.email}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
