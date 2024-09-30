import Layout from '../../layout/dashboard';
import React, { useState } from 'react';
import { toast } from 'sonner';

export default function Index() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '', // Agrega el campo del teléfono al estado
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para enviar datos del formulario
    console.log(formData);
    toast.success('Solicitud enviada.');
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '', // Asegúrate de limpiar también el campo del teléfono al enviar el formulario
      message: ''
    });
  };

  return (
    <Layout title="Soporte">
      <div className="bg-white shadow-lg rounded-lg">
        <div className='px-6 py-4'>
          <h2 className="text-gray-900 text-lg font-semibold">Solicitud de soporte</h2>
        </div>
        <hr className="border-gray-100 mb-6"/>
        <form onSubmit={handleSubmit} className='px-6 pb-8'>
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-gray-900 text-sm font-medium mb-2" htmlFor="firstName">
                Nombre
              </label>
              <input
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 text-medium leading-8"
                id="firstName"
                type="text"
                placeholder="Nombre"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-900 text-sm font-medium mb-2" htmlFor="lastName">
                Apellido
              </label>
              <input
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 text-medium leading-8"
                id="lastName"
                type="text"
                placeholder="Apellido"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-900 text-sm font-medium mb-2" htmlFor="email">
                Correo
              </label>
              <input
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 text-medium leading-8"
                id="email"
                type="email"
                placeholder="Correo"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-900 text-sm font-medium mb-2" htmlFor="phone">
                Teléfono
              </label>
              <input
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 text-medium leading-8"
                id="phone"
                type="number"
                placeholder="Teléfono"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-gray-900 text-sm font-medium mb-2 mt-4" htmlFor="message">
              Mensaje
            </label>
            <textarea
              className="block w-full h-40 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 text-medium leading-8"
              id="message"
              placeholder="Mensaje"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="text-white flex w-full justify-center rounded-md px-3 py-3 text-base font-semibold leading-6 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-600"
              type="submit"
            >
              Enviar
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};
