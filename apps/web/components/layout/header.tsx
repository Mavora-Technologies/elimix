'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Lock page scrolling and support the Escape key.
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const navigationItems = [
    {
      label: 'Home',
      href: '/',
      icon: 'fa-solid fa-house',
    },
    {
      label: 'About Us',
      href: '/about',
      icon: 'fa-solid fa-users',
    },
    {
      label: 'Features',
      href: '/features',
      icon: 'fa-solid fa-layer-group',
    },
    {
      label: 'Pricing',
      href: '/pricing',
      icon: 'fa-solid fa-tags',
    },
    {
      label: 'Contact Us',
      href: '/contact',
      icon: 'fa-regular fa-envelope',
    },
  ];

  return (
    <div className="sticky top-0 z-40 flex w-full flex-col">

      {/* Top Contact Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-[#0B1320] px-4 py-2 text-xs text-slate-300 md:px-12">

        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2">
            <i className="fa-solid fa-location-dot text-teal-400" />
            Nairobi, Kenya
          </span>

          <a
            href="mailto:info@elimix.com"
            className="hidden items-center gap-2 transition-colors hover:text-white sm:flex"
          >
            <i className="fa-regular fa-envelope text-teal-400" />
            info@elimix.com
          </a>
        </div>

        <a
          href="tel:+254795707823"
          className="flex items-center gap-2 transition-colors hover:text-white"
        >
          <i className="fa-solid fa-phone text-teal-400" />
          <span>+254 (0) 795 707 823</span>
        </a>

      </div>

      {/* Main Header */}
      <header className="relative z-40 flex h-[72px] items-center justify-between border-b border-slate-100 bg-white px-5 shadow-sm md:h-20 md:px-12">

        {/* Logo */}
        <Link
          href="/"
          aria-label="Elimix Home"
          className="flex items-center"
        >
          <div className="relative h-9 w-32 sm:w-36">
            <Image
              src="/logo.png"
              alt="Elimix Logo"
              fill
              priority
              sizes="(max-width: 768px) 128px, 144px"
              className="object-contain object-left"
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-8 text-sm font-medium text-slate-600 lg:flex"
        >
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={`transition-colors hover:text-teal-600 ${
                isActive(item.href)
                  ? 'font-semibold text-[#0F2942]'
                  : ''
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/login">
            <Button
              variant="ghost"
              size="sm"
              className="font-medium text-slate-700 hover:text-[#0F2942]"
            >
              Sign In
            </Button>
          </Link>

          <Link href="/login">
            <Button
              size="sm"
              className="bg-[#0F2942] px-5 text-white shadow-sm hover:bg-[#1A3D63]"
            >
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={mobileMenuOpen}
          aria-controls="elimix-mobile-menu"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-50 lg:hidden"
        >
          <i className="fa-solid fa-bars text-lg" />
        </button>

      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[999] lg:hidden">

          {/* Dark Backdrop */}
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={closeMobileMenu}
            className="absolute inset-0 h-full w-full cursor-default bg-[#071426]/55 backdrop-blur-[2px]"
          />

          {/* Right Sidebar - Narrow 72% Width */}
          <aside
            id="elimix-mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            className="animate-in slide-in-from-right absolute right-0 top-0 flex h-[100dvh] w-[72%] max-w-[320px] flex-col overflow-hidden border-l border-slate-200 bg-white shadow-2xl duration-200"
          >

            {/* Sidebar Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-4 py-4">
              <Link
                href="/"
                onClick={closeMobileMenu}
                aria-label="Elimix Home"
                className="relative h-7 w-24"
              >
                <Image
                  src="/logo.png"
                  alt="Elimix Logo"
                  fill
                  sizes="96px"
                  className="object-contain object-left"
                />
              </Link>

              <button
                type="button"
                onClick={closeMobileMenu}
                aria-label="Close navigation menu"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                <i className="fa-solid fa-xmark text-xs" />
              </button>
            </div>

            {/* Sidebar Content */}
            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-4">

              {/* Brand Introduction */}
              <div className="mb-4 mt-1">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-widest text-slate-600">
                  <i className="fa-solid fa-wand-magic-sparkles text-teal-500" />
                  ELIMIX
                </div>

                <h2 className="mt-2.5 text-lg font-extrabold leading-tight text-[#0B1727]">
                  Tech Built for Education
                </h2>
              </div>

              {/* Navigation Links */}
              <nav
                aria-label="Mobile navigation"
                className="flex flex-col gap-2"
              >
                {navigationItems.map((item) => {
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMobileMenu}
                      aria-current={active ? 'page' : undefined}
                      className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-bold transition-all duration-200 ${
                        active
                          ? 'bg-[#0B1727] text-white shadow-md'
                          : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition-colors ${
                            active
                              ? 'bg-white/10 text-white'
                              : 'border border-slate-200 bg-slate-50 text-slate-400 group-hover:text-slate-600'
                          }`}
                        >
                          <i className={`${item.icon} text-xs`} />
                        </span>
                        <span>{item.label}</span>
                      </div>

                      {!active && (
                        <i className="fa-solid fa-chevron-down text-[10px] text-slate-300" />
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Bottom Actions */}
              <div className="mt-auto flex flex-col gap-2 pt-4 pb-2">
                <Link
                  href="/login"
                  onClick={closeMobileMenu}
                  className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-[#0B1727] px-4 py-2 text-sm font-bold text-white shadow-md transition-colors hover:bg-[#16304D]"
                >
                  Get Started
                  <i className="fa-solid fa-arrow-right text-[10px]" />
                </Link>

                <Link
                  href="/login"
                  onClick={closeMobileMenu}
                  className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50"
                >
                  <i className="fa-regular fa-user text-slate-400 text-xs" />
                  Sign In
                </Link>

                {/* Stacked Contact Information */}
                <div className="mt-1 flex flex-col items-center gap-2 border-t border-slate-100 pt-3">
                  <a
                    href="tel:+254795707823"
                    className="flex items-center justify-center gap-2 text-[11px] font-bold text-[#0B1727] transition-colors hover:text-teal-600"
                  >
                    <i className="fa-solid fa-phone text-teal-500" />
                    +254 (0) 795 707 823
                  </a>

                  <a
                    href="mailto:info@elimix.com"
                    className="flex items-center justify-center gap-2 text-[11px] font-bold text-[#0B1727] transition-colors hover:text-teal-600"
                  >
                    <i className="fa-regular fa-envelope text-teal-500" />
                    Email Us
                  </a>
                </div>
              </div>

            </div>

          </aside>

        </div>
      )}

    </div>
  );
}