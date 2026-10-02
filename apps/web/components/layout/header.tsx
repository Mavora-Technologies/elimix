'use client';

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function Header() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 flex h-20 items-center justify-between border-b border-gray-100 bg-white/90 px-6 backdrop-blur-md md:px-12 shadow-sm">
      <Link href="/" className="flex items-center gap-3 group">
        <div className="relative h-10 w-36">
          <Image 
            src="/logo.png" 
            alt="Elimix Logo" 
            fill 
            className="object-contain object-left" 
            priority
            sizes="(max-width: 768px) 140px, 150px"
          />
        </div>
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
        <Link href="/" className={`transition-colors hover:text-blue-600 ${isActive('/') ? 'text-[#0F2942] font-semibold' : ''}`}>Home</Link>
        <Link href="/features" className={`transition-colors hover:text-blue-600 ${isActive('/features') ? 'text-[#0F2942] font-semibold' : ''}`}>Features</Link>
        <Link href="/pricing" className={`transition-colors hover:text-blue-600 ${isActive('/pricing') ? 'text-[#0F2942] font-semibold' : ''}`}>Pricing</Link>
        <Link href="/contact" className={`transition-colors hover:text-blue-600 ${isActive('/contact') ? 'text-[#0F2942] font-semibold' : ''}`}>Contact Us</Link>
      </nav>

      <div className="hidden md:flex items-center gap-4">
        <Link href="/login">
          <Button variant="ghost" size="sm" className="text-gray-700 hover:text-[#0F2942] font-medium">Sign In</Button>
        </Link>
        <Link href="/login">
          <Button size="sm" className="bg-[#0F2942] hover:bg-[#1a3d63] text-white shadow-md px-5">Get Started</Button>
        </Link>
      </div>

      {/* Mobile Hamburger Toggle Button */}
      <button 
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden p-2 text-slate-700 focus:outline-none"
        aria-label="Toggle navigation menu"
      >
        <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-xl`}></i>
      </button>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="absolute top-20 left-0 w-full bg-white border-b border-slate-200 shadow-xl py-6 px-6 flex flex-col gap-4 md:hidden">
          <Link 
            href="/" 
            onClick={() => setMobileMenuOpen(false)}
            className={`text-base font-medium py-2 border-b border-slate-100 ${isActive('/') ? 'text-[#0F2942] font-semibold' : 'text-slate-600'}`}
          >
            Home
          </Link>
          <Link 
            href="/features" 
            onClick={() => setMobileMenuOpen(false)}
            className={`text-base font-medium py-2 border-b border-slate-100 ${isActive('/features') ? 'text-[#0F2942] font-semibold' : 'text-slate-600'}`}
          >
            Features
          </Link>
          <Link 
            href="/pricing" 
            onClick={() => setMobileMenuOpen(false)}
            className={`text-base font-medium py-2 border-b border-slate-100 ${isActive('/pricing') ? 'text-[#0F2942] font-semibold' : 'text-slate-600'}`}
          >
            Pricing
          </Link>
          <Link 
            href="/contact" 
            onClick={() => setMobileMenuOpen(false)}
            className={`text-base font-medium py-2 border-b border-slate-100 ${isActive('/contact') ? 'text-[#0F2942] font-semibold' : 'text-slate-600'}`}
          >
            Contact Us
          </Link>
          <div className="flex flex-col gap-3 pt-4">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full justify-center text-slate-700">Sign In</Button>
            </Link>
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full justify-center bg-[#0F2942] text-white">Get Started</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}