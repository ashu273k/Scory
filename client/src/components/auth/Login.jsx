import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function Login() {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [formError, setFormError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setFormError('Please fill in all fields');
      return;
    }
    const result = await login(form);
    if (result.success) navigate('/dashboard');
    else setFormError(result.error);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="card max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Sign In</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {(formError || error) && <div className="bg-red-50 text-red-700 p-2 rounded">{formError || error}</div>}
          <input className="input-field" type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} autoFocus />
          <input className="input-field" type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} />
          <button className="btn btn-primary w-full" type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
        </form>
        <div className="text-center mt-5 text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-600 font-medium">Register</Link>
        </div>
      </div>
    </div>
  );
}
