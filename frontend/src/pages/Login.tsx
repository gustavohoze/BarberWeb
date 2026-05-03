import type { FormEvent } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid email or password');
      }

      const data = await response.json();

      localStorage.setItem('authToken', data.token);
      if (rememberMe) {
        localStorage.setItem('adminEmail', email);
      } else {
        localStorage.removeItem('adminEmail');
      }

      navigate('/admin/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="relative flex min-h-screen flex-grow items-center justify-center overflow-hidden bg-background px-4 py-12 md:px-margin-desktop"
      style={{
        backgroundImage:
          "linear-gradient(rgba(18, 20, 20, 0.92), rgba(18, 20, 20, 0.96)), url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1800&q=80')",
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      <div className="relative z-10 w-full max-w-md">
        <div className="mb-stack-lg text-center">
          <h1 className="mb-stack-sm font-h1 text-h1 uppercase tracking-tight text-primary-container">
            Barber Admin
          </h1>
          <p className="font-label-caps text-label-caps uppercase text-on-surface-variant">
            Precision Master Barber
          </p>
        </div>

        <section className="border border-surface-container-highest bg-surface-container p-gutter shadow-[0_0_24px_-8px_rgba(212,175,55,0.24)]">
          <div className="mb-stack-lg text-center">
            <h2 className="mb-stack-sm font-h2 text-h2 text-on-surface">Sign In</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Access your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-stack-md">
            <div>
              <label htmlFor="email" className="mb-unit block font-label-caps text-label-caps uppercase text-on-surface">
                Email Address
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                  person
                </span>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full border border-surface-container-highest bg-background py-3 pl-11 pr-3 font-body-md text-body-md text-on-surface outline-none transition-colors placeholder:text-on-surface-variant/60 focus:border-primary"
                  placeholder="admin@masterbarber.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-unit block font-label-caps text-label-caps uppercase text-on-surface">
                Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                  lock
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full border border-surface-container-highest bg-background py-3 pl-11 pr-12 font-body-md text-body-md text-on-surface outline-none transition-colors placeholder:text-on-surface-variant/60 focus:border-primary"
                  placeholder="Enter your password"
                />
                <button
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center text-on-surface-variant transition-colors hover:text-primary"
                  onClick={() => setShowPassword((value) => !value)}
                  type="button"
                >
                  <span className="material-symbols-outlined text-xl">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 py-stack-sm">
              <label className="flex cursor-pointer items-center gap-2 font-body-md text-sm text-on-surface-variant">
                <input
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 cursor-pointer border-surface-container-highest bg-background text-primary focus:ring-primary"
                  type="checkbox"
                />
                Remember me
              </label>
              <button
                className="font-button text-button text-primary transition-colors hover:text-surface-tint"
                type="button"
              >
                Forgot Password?
              </button>
            </div>

            {error && (
              <div className="border border-error bg-error-container px-4 py-3">
                <p className="font-body-md text-on-error-container">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 bg-primary px-6 py-4 font-button text-button uppercase tracking-widest text-on-primary transition-colors duration-300 hover:bg-surface-tint disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                login
              </span>
              {loading ? 'Signing In...' : 'Login'}
            </button>
          </form>

          <div className="mt-stack-lg border-t border-surface-container-highest pt-stack-md text-center">
            <p className="font-label-caps text-label-caps uppercase text-on-surface-variant/70">
              Demo: admin@masterbarber.com / password123
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};
