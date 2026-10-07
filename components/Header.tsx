'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const mobileMenuRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!mobileMenuOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    mobileMenuRef.current?.querySelector<HTMLAnchorElement>('a')?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false)
        menuButtonRef.current?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [mobileMenuOpen])

  const navLinks = [
    { label: 'Features', href: '/features' },
    { label: 'Security', href: '/security' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Download', href: '/download' },
    { label: 'Docs', href: '/docs' },
    { label: 'Use Cases', href: '/use-cases' },
  ]

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 bg-white backdrop-blur-md border-b border-gray-200 transition-shadow duration-300 ${
        scrolled ? 'shadow-lg' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image 
            src="/logo.png" 
            alt="SQLPerformance AI" 
            width={42} 
            height={42}
            className="w-10 h-10"
          />
          <span className="font-extrabold text-lg leading-tight tracking-tight text-gray-900">
            SQLPerformance <span className="text-primary">AI</span>
          </span>
        </Link>

        {/* Desktop Navigation.
            Breakpoint is lg, not md. The six links plus the wordmark and the CTA
            need about 1000px; at md (768px, an iPad in portrait) they were still
            shown and "Use Cases" and "Start Trial" each wrapped onto two lines and
            ran into each other. Below lg the hamburger below carries the same links,
            so nothing is lost — keep the three lg: breakpoints in this file in step. */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.href}
              href={link.href} 
              className="text-gray-600 hover:text-primary font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA + Mobile Menu Toggle */}
        <div className="flex items-center gap-4">
          <Link 
            href="/download" 
            className="hidden sm:block px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-cta shadow-cta hover:bg-cta-hover hover:shadow-cta-hover hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-cta/35 transition-all"
          >
            Start Trial
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            ref={menuButtonRef}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-900" />
            ) : (
              <Menu className="w-6 h-6 text-gray-900" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <nav
          ref={mobileMenuRef}
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="lg:hidden max-h-[calc(100vh-76px)] overflow-y-auto bg-white border-t border-gray-200 px-6 py-4 space-y-3"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-primary font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/download"
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full px-4 py-2.5 rounded-xl text-center text-white bg-cta hover:bg-cta-hover font-semibold transition-colors"
          >
            Start Free Trial
          </Link>
        </nav>
      )}
    </header>
  )
}
