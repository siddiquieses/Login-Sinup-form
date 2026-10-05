import { useState } from 'react'
import './App.css'

const API_URL = 'http://localhost:5000/api/users'

function App() {
  const [mode, setMode] = useState('signup')
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const isSignup = mode === 'signup'

  function switchMode(nextMode) {
    setMode(nextMode)
    setError('')
    setSuccess('')
    setShowPassword(false)
  }

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
    setError('')
    setSuccess('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (isSignup && form.password !== form.confirmPassword) {
      setError('Your passwords do not match. Please try again.')
      return
    }

    setLoading(true)
    const endpoint = isSignup ? `${API_URL}/register` : `${API_URL}/login`
    const payload = isSignup
      ? { name: form.name.trim(), email: form.email.trim(), password: form.password }
      : { email: form.email.trim(), password: form.password }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const responseText = await response.text()
      let data = {}

      if (responseText) {
        try {
          data = JSON.parse(responseText)
        } catch {
          data = { message: responseText }
        }
      }

      const result = data && typeof data === 'object' ? data : {}

      if (!response.ok) {
        const message = result.message || result.error || 'Please check your details and try again.'
        setError(typeof message === 'string' ? message : 'Please check your details and try again.')
        return
      }

      setSuccess(
        (typeof result.message === 'string' && result.message) ||
          (isSignup
            ? 'Your account is ready. You can now sign in.'
            : 'You are signed in successfully.'),
      )
      if (isSignup) {
        setForm((current) => ({ ...current, password: '', confirmPassword: '' }))
        setMode('login')
      }
    } catch {
      setError('Could not reach the server. Check that the API is running and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card" aria-label={isSignup ? 'Create an account' : 'Sign in'}>
        <aside className="welcome-panel">
          <a className="brand" href="/" aria-label="Nook home">
            <span className="brand-mark" aria-hidden="true">
              <svg viewBox="0 0 32 32" fill="none">
                <path d="M5 15.2 16 6l11 9.2v11.3H5V15.2Z" />
                <path d="M12 26.5v-8h8v8" />
              </svg>
            </span>
            <span>nook</span>
          </a>

          <div className="welcome-copy">
            <span className="eyebrow">A little space, just for you</span>
            <h1>Make yourself at home.</h1>
            <p>Good things start with a place to belong. Pick up right where you left off.</p>
          </div>

          <div className="welcome-art" aria-hidden="true">
            <div className="art-orbit art-orbit-one" />
            <div className="art-orbit art-orbit-two" />
            <div className="art-sun" />
            <div className="art-window">
              <div className="art-window-pane" />
              <div className="art-window-pane" />
              <div className="art-window-pane" />
              <div className="art-window-pane" />
            </div>
            <div className="art-plant">
              <span />
              <span />
              <span />
              <i />
            </div>
            <div className="art-ground" />
          </div>

          <p className="panel-footer">A calmer corner of the internet.</p>
        </aside>

        <div className="form-panel">
          <div className="mobile-brand" aria-hidden="true">
            <span className="brand-mark">
              <svg viewBox="0 0 32 32" fill="none">
                <path d="M5 15.2 16 6l11 9.2v11.3H5V15.2Z" />
                <path d="M12 26.5v-8h8v8" />
              </svg>
            </span>
            <span>nook</span>
          </div>

          <div className="form-heading">
            <span className="form-kicker">{isSignup ? 'GET STARTED' : 'WELCOME BACK'}</span>
            <h2>{isSignup ? 'Create your account' : 'Sign in to your account'}</h2>
            <p>
              {isSignup
                ? 'A few details and you’ll be all set.'
                : 'We’re glad you’re here. Let’s pick up where you left off.'}
            </p>
          </div>

          <div className="auth-tabs" role="tablist" aria-label="Choose an account action">
            <button
              className={isSignup ? 'auth-tab active' : 'auth-tab'}
              id="signup-tab"
              type="button"
              role="tab"
              aria-selected={isSignup}
              aria-controls="auth-form"
              onClick={() => switchMode('signup')}
            >
              Create account
            </button>
            <button
              className={!isSignup ? 'auth-tab active' : 'auth-tab'}
              id="login-tab"
              type="button"
              role="tab"
              aria-selected={!isSignup}
              aria-controls="auth-form"
              onClick={() => switchMode('login')}
            >
              Sign in
            </button>
          </div>

          <form id="auth-form" className="auth-form" onSubmit={handleSubmit}>
            {isSignup && (
              <label className="field">
                <span>Your name</span>
                <input
                  autoComplete="name"
                  name="name"
                  placeholder="e.g. Jordan Lee"
                  value={form.name}
                  onChange={updateField}
                  required
                />
              </label>
            )}

            <label className="field">
              <span>Email address</span>
              <input
                autoComplete="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={updateField}
                required
              />
            </label>

            <label className="field">
              <span>Password</span>
              <span className="password-wrap">
                <input
                  autoComplete={isSignup ? 'new-password' : 'current-password'}
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={isSignup ? 'At least 8 characters' : 'Your password'}
                  value={form.password}
                  onChange={updateField}
                  minLength={isSignup ? 8 : undefined}
                  required
                />
                <button
                  className="password-toggle"
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </span>
            </label>

            {isSignup && (
              <label className="field">
                <span>Confirm password</span>
                <input
                  autoComplete="new-password"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password again"
                  value={form.confirmPassword}
                  onChange={updateField}
                  minLength={8}
                  required
                />
              </label>
            )}

            {error && (
              <p className="form-message error-message" role="alert">
                <span aria-hidden="true">!</span>
                {error}
              </p>
            )}
            {success && (
              <p className="form-message success-message" role="status">
                <span aria-hidden="true">✓</span>
                {success}
              </p>
            )}

            <button className="submit-button" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner" aria-hidden="true" />
                  {isSignup ? 'Creating account…' : 'Signing in…'}
                </>
              ) : (
                <>
                  {isSignup ? 'Create account' : 'Sign in'}
                  <span aria-hidden="true">→</span>
                </>
              )}
            </button>
          </form>

          <p className="form-legal">
            By continuing, you agree to our <a href="#terms">Terms</a> and{' '}
            <a href="#privacy">Privacy Policy</a>.
          </p>
          <p className="secure-note">
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <rect x="3" y="7" width="10" height="7" rx="1.5" />
              <path d="M5.5 7V4.75a2.5 2.5 0 0 1 5 0V7" />
            </svg>
            Your details are always kept private
          </p>
        </div>
      </section>
      <p className="page-note">Made for the moments that matter.</p>
    </main>
  )
}

export default App
