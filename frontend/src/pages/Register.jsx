import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/auth';

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
    mobile: '',
    address: '',
    pinCode: '',
    companyName: '',
    companyGst: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await register(form);
      alert('Registration successful!');
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);
      alert(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Create Your Account
        </h2>
        <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="username"
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
            className="input"
          />
          <input
            name="fullName"
            type="text"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            required
            className="input"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="input"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="input"
          />
          <input
            name="mobile"
            type="text"
            placeholder="Mobile"
            value={form.mobile}
            onChange={handleChange}
            className="input"
          />
          <input
            name="address"
            type="text"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            className="input"
          />
          <input
            name="pinCode"
            type="text"
            placeholder="Pin Code"
            value={form.pinCode}
            onChange={handleChange}
            className="input"
          />
          <input
            name="companyName"
            type="text"
            placeholder="Company Name"
            value={form.companyName}
            onChange={handleChange}
            className="input"
          />
          <input
            name="companyGst"
            type="text"
            placeholder="Company GST"
            value={form.companyGst}
            onChange={handleChange}
            className="input"
          />

          <button
            type="submit"
            className="col-span-1 md:col-span-2 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Register
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;
