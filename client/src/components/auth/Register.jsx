import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function Register() {
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [formError, setFormError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password || !form.confirmPassword) {
      setFormError('Please fill in all fields');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    if (form.password.length < 8) {
      setFormError('Password must be at least 8 characters');
      return;
    }
    const { confirmPassword, ...userData } = form;
    const result = await register(userData);
    if (result.success) navigate('/dashboard');
    else setFormError(result.error);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="card max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Sign Up</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {(formError || error) && <div className="bg-red-50 text-red-700 p-2 rounded">{formError || error}</div>}
          <input className="input-field" type="text" name="username" placeholder="Username" value={form.username} onChange={handleChange} />
          <input className="input-field" type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} />
          <input className="input-field" type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} />
          <input className="input-field" type="password" name="confirmPassword" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} />
          <button className="btn btn-primary w-full" type="submit" disabled={loading}>{loading ? 'Signing up...' : 'Sign Up'}</button>
        </form>
        <div className="text-center mt-5 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 font-medium">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
