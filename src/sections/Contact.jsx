import { useState, useCallback } from 'react'
import emailjs from '@emailjs/browser'
import { SectionWrapper } from '../components/SectionWrapper'
import { Button } from '../components/Button'
import { personal } from '../data/personal'

// Replace these with your EmailJS credentials from https://www.emailjs.com/
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID'
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY'

const INITIAL_FORM = { name: '', email: '', subject: '', message: '' }

function validate(form) {
  const errors = {}
  if (!form.name.trim()) errors.name = 'Name is required'
  if (!form.email.trim()) errors.email = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email'
  if (!form.subject.trim()) errors.subject = 'Subject is required'
  if (!form.message.trim()) errors.message = 'Message is required'
  return errors
}

function Field({ label, name, type = 'text', value, onChange, error, placeholder, textarea = false }) {
  const base = `w-full bg-slate-100 dark:bg-zinc-800 border rounded-xl px-4 py-3 text-sm
    text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500
    focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors duration-200
    ${error
      ? 'border-red-400 dark:border-red-500'
      : 'border-slate-200 dark:border-zinc-700 hover:border-violet-300 dark:hover:border-zinc-600'
    }`

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5">
        {label}
      </label>
      {textarea ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={5}
          className={base}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={base}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
        />
      )}
      {error && (
        <p id={`${name}-error`} role="alert" className="mt-1 text-xs text-red-500 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}

const SOCIALS = [
  {
    key: 'github',
    label: 'GitHub',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    key: 'twitter',
    label: 'Twitter / X',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    key: 'email',
    label: 'Email',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7" />
      </svg>
    ),
  },
]

export function Contact() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }, [])

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    setStatus('loading')
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          from_email: form.email,
          subject: form.subject,
          message: form.message,
          to_email: personal.email,
        },
        EMAILJS_PUBLIC_KEY
      )
      setStatus('success')
      setForm(INITIAL_FORM)
    } catch {
      setStatus('error')
    }
  }, [form])

  return (
    <SectionWrapper id="contact">
      <div className="section-container">
        <span className="section-label">Get in touch</span>
        <h2 className="section-heading">Contact</h2>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
          {/* Info */}
          <div>
            <p className="text-slate-600 dark:text-zinc-400 text-lg leading-relaxed mb-8">
              Have a project in mind or want to talk? I'm always open to new opportunities and interesting conversations. Drop me a message — I usually reply within 24 hours.
            </p>

            <ul className="space-y-4">
              {SOCIALS.map(({ key, label, icon }) => (
                <li key={key}>
                  <a
                    href={personal.social[key]}
                    target={key !== 'email' ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 group text-slate-600 dark:text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 rounded-lg p-1"
                  >
                    <span className="w-10 h-10 flex-shrink-0 rounded-xl card flex items-center justify-center group-hover:border-violet-400/50 dark:group-hover:border-violet-500/50 transition-all duration-200">
                      {icon}
                    </span>
                    <span className="font-medium text-sm">{label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate aria-label="Contact form">
            <div className="space-y-4">
              <Field label="Name" name="name" value={form.name} onChange={handleChange} error={errors.name} placeholder="Your Name" />
              <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} placeholder="you@example.com" />
              <Field label="Subject" name="subject" value={form.subject} onChange={handleChange} error={errors.subject} placeholder="What's on your mind?" />
              <Field label="Message" name="message" value={form.message} onChange={handleChange} error={errors.message} placeholder="Tell me more…" textarea />
            </div>

            {status === 'success' && (
              <p role="alert" className="mt-4 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                ✓ Message sent! I'll get back to you soon.
              </p>
            )}
            {status === 'error' && (
              <p role="alert" className="mt-4 text-sm text-red-500 dark:text-red-400 font-medium">
                Something went wrong. Please try again or email me directly.
              </p>
            )}

            <Button type="submit" className="mt-6 w-full" disabled={status === 'loading'}>
              {status === 'loading' ? 'Sending…' : 'Send Message →'}
            </Button>
          </form>
        </div>
      </div>
    </SectionWrapper>
  )
}
