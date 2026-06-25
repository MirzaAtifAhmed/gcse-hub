import { type FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<'student' | 'parent'>('parent');
  const [error, setError] = useState('');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    const form = new FormData(event.currentTarget);

    try {
      await register({
        name: String(form.get('name')),
        email: String(form.get('email')),
        password: String(form.get('password')),
        role,
        currentYear: role === 'student' ? Number(form.get('currentYear')) : undefined,
      });
      navigate('/dashboard');
    } catch {
      setError('Could not create account. The email may already be registered.');
    }
  }

  return (
    <main className="form-page">
      <form className="card form" onSubmit={onSubmit}>
        <h1>Create account</h1>
        <p>Start building GCSE confidence today.</p>
        {error && <div className="error">{error}</div>}

        <div className="field"><label>Name</label><input name="name" required /></div>
        <div className="field"><label>Email</label><input name="email" type="email" required /></div>
        <div className="field"><label>Password</label><input name="password" type="password" minLength={8} required /></div>

        <div className="field">
          <label>Account type</label>
          <select value={role} onChange={(event) => setRole(event.target.value as 'student' | 'parent')}>
            <option value="parent">Parent</option>
            <option value="student">Student</option>
          </select>
        </div>

        {role === 'student' && (
          <div className="field">
            <label>Current year group</label>
            <select name="currentYear" defaultValue="8">
              <option value="7">Year 7</option>
              <option value="8">Year 8</option>
              <option value="9">Year 9</option>
              <option value="10">Year 10</option>
              <option value="11">Year 11</option>
            </select>
          </div>
        )}

        <button className="btn btn-primary" type="submit">Create account</button>
        <p>Already registered? <Link to="/login">Login</Link></p>
      </form>
    </main>
  );
}
