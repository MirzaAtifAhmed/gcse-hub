import { type FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    const form = new FormData(event.currentTarget);

    try {
      const user = await login(String(form.get('email')), String(form.get('password')));
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch {
      setError('Invalid email or password');
    }
  }

  return (
    <main className="form-page">
      <form className="card form" onSubmit={onSubmit}>
        <h1>Welcome back</h1>
        <p>Login to continue your GCSE journey.</p>
        {error && <div className="error">{error}</div>}
        <div className="field"><label>Email</label><input name="email" type="email" required /></div>
        <div className="field"><label>Password</label><input name="password" type="password" required /></div>
        <button className="btn btn-primary" type="submit">Login</button>
        <p>New to GCSE Hub? <Link to="/register">Create an account</Link></p>
      </form>
    </main>
  );
}
