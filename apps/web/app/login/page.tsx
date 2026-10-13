// apps/web/app/login/page.tsx
'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const BRAND = {
  navy: '#012E54',
  blue: '#006FBF',
  brightBlue: '#0088CE',
  cyan: '#04B1D6',
  teal: '#0199B9',
};

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  // Login States
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Register States
  const [institutionName, setInstitutionName] = useState("");
  const [adminName, setAdminName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [selectedTier, setSelectedTier] = useState("Professional (Up to 2,000 students)");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      
      if (!apiUrl) {
        throw new Error("API endpoint not configured.");
      }

      const res = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-tenant-id": "00000000-0000-0000-0000-000000000000" 
        },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`Server returned a non-JSON response (${res.status} ${res.statusText}). Is the backend running?`);
      }

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Invalid email or password.");
      }

      localStorage.setItem("elimix_token", data.data.token);
      localStorage.setItem("elimix_user", JSON.stringify(data.data.user));
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Unable to connect to the server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error("API endpoint not configured.");
      }

      const res = await fetch(`${apiUrl}/auth/register`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-tenant-id": "00000000-0000-0000-0000-000000000000"
        },
        body: JSON.stringify({
          institutionName,
          adminName,
          email: regEmail,
          password: regPassword,
          tier: selectedTier
        }),
      });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`Backend endpoint not found (${res.status} ${res.statusText}). Please implement the /auth/register route.`);
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed. Please try again.");
      }

      if (data.data?.token) {
        localStorage.setItem("elimix_token", data.data.token);
        localStorage.setItem("elimix_user", JSON.stringify(data.data.user));
        router.push("/dashboard");
      } else {
        setError("Registration successful. Please log in.");
        setMode('login');
      }
    } catch (err: any) {
      setError(err.message || "Unable to connect to the server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-slate-50 font-sans selection:bg-[#0088CE] selection:text-white">
      
      {/* ==================================================================
          LEFT BRANDING PANEL
          ================================================================== */}
      <div className="hidden lg:flex lg:col-span-5 bg-[#012E54] text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Abstract Background Glows */}
        <div className="absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-[#0088CE]/20 blur-[100px] pointer-events-none"></div>
        <div className="absolute -left-32 -bottom-32 h-[500px] w-[500px] rounded-full bg-[#04B1D6]/20 blur-[100px] pointer-events-none"></div>
        
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 pointer-events-none mix-blend-overlay"></div>

        <div className="space-y-6 relative z-10">
          <Link href="/" className="inline-block transition-transform hover:scale-105 duration-300">
            <Image 
              src="/logo.png" 
              alt="Elimix Logo" 
              width={140} 
              height={40}
              className="object-contain filter brightness-0 invert" 
              priority
            />
          </Link>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-4 py-1.5 text-xs font-semibold text-[#04B1D6] border border-white/10 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#04B1D6] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#04B1D6]"></span>
            </span>
            Comprehensive School Management System
          </div>
        </div>

        <div className="space-y-6 relative z-10 max-w-md">
          <h1 className="text-4xl font-bold tracking-tight leading-tight text-white">
            Simplify Your Institution's Operations
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed font-medium">
            Unify your admissions, academics, fee collections, and parent communication in a single, secure platform designed for modern educational excellence.
          </p>
        </div>

        <div className="text-xs text-slate-400 relative z-10 flex items-center justify-between border-t border-white/10 pt-8 mt-12">
          <span>© {new Date().getFullYear()} Mavora Technologies</span>
          <Link href="/contact" className="hover:text-white transition-colors flex items-center gap-1">
            Support Desk <i className="fa-solid fa-arrow-right-long text-[10px]"></i>
          </Link>
        </div>
      </div>

      {/* ==================================================================
          RIGHT FORM CONSOLE PANEL
          ================================================================== */}
      <div className="col-span-1 lg:col-span-7 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-20 relative">
        
        {/* Mobile Header */}
        <div className="lg:hidden w-full max-w-[420px] mb-8 flex justify-center">
          <Link href="/">
            <Image 
              src="/logo.png" 
              alt="Elimix Logo" 
              width={130} 
              height={32}
              className="object-contain" 
              priority
            />
          </Link>
        </div>

        <div className="w-full max-w-[420px]">
          
          {/* Mode Switcher Segmented Control */}
          <div className="bg-slate-200/70 p-1.5 rounded-xl flex items-center text-sm font-semibold mb-8 shadow-inner">
            <button
              onClick={() => { setMode('login'); setError(""); }}
              className={`flex-1 py-2.5 rounded-lg transition-all duration-300 ${
                mode === 'login' 
                  ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/50' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('register'); setError(""); }}
              className={`flex-1 py-2.5 rounded-lg transition-all duration-300 ${
                mode === 'register' 
                  ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/50' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Register Workspace
            </button>
          </div>

          {/* Main Form Container */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-8 sm:p-10 shadow-xl shadow-slate-200/40">
            
            <div className="space-y-2 mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                {mode === 'login' ? 'Welcome back' : 'Provision your institution'}
              </h2>
              <p className="text-sm text-slate-500">
                {mode === 'login' 
                  ? 'Enter your credentials to access your administrative console.' 
                  : 'Complete these details to set up your isolated tenant workspace.'}
              </p>
            </div>

            {error && (
              <div className={`mb-6 rounded-xl border p-4 text-sm font-medium flex items-start gap-3 ${
                error.includes("successful") 
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
                  : "bg-rose-50 border-rose-200 text-rose-800"
              }`}>
                <i className={`fa-solid mt-0.5 ${error.includes("successful") ? "fa-circle-check text-emerald-600" : "fa-triangle-exclamation text-rose-600"}`}></i>
                <span className="leading-snug">{error}</span>
              </div>
            )}

            {mode === 'login' ? (
              /* ================= LOGIN FORM ================= */
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Work Email</Label>
                  <Input 
                    type="email" 
                    placeholder="admin@elimix.com" 
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required 
                    className="h-11 rounded-xl border-slate-200 bg-slate-50/50 px-4 text-sm shadow-sm transition-all focus:bg-white focus:ring-2 focus:ring-[#006FBF]/20 focus:border-[#006FBF]"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold text-slate-700">Password</Label>
                    <Link href="/contact" className="text-xs font-semibold text-[#006FBF] hover:text-[#012E54] transition-colors">Forgot password?</Link>
                  </div>
                  <Input 
                    type="password" 
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required 
                    className="h-11 rounded-xl border-slate-200 bg-slate-50/50 px-4 text-sm shadow-sm transition-all focus:bg-white focus:ring-2 focus:ring-[#006FBF]/20 focus:border-[#006FBF]"
                  />
                </div>
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full h-11 rounded-xl text-white font-semibold text-sm shadow-sm hover:opacity-95 transition-all flex items-center justify-center gap-2"
                    style={{ background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})` }}
                  >
                    {isLoading ? (
                      <><i className="fa-solid fa-spinner animate-spin"></i> Authenticating...</>
                    ) : (
                      "Sign In to Console"
                    )}
                  </Button>
                </div>
              </form>
            ) : (
              /* ================= REGISTER FORM ================= */
              <form onSubmit={handleRegister} className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Institution Name</Label>
                  <Input 
                    type="text" 
                    placeholder="e.g., Strathmore Academy" 
                    value={institutionName}
                    onChange={(e) => setInstitutionName(e.target.value)}
                    required 
                    className="h-11 rounded-xl border-slate-200 bg-slate-50/50 px-4 text-sm shadow-sm transition-all focus:bg-white focus:ring-2 focus:ring-[#006FBF]/20 focus:border-[#006FBF]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Administrator Full Name</Label>
                  <Input 
                    type="text" 
                    placeholder="Dr. Valary Femy" 
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    required 
                    className="h-11 rounded-xl border-slate-200 bg-slate-50/50 px-4 text-sm shadow-sm transition-all focus:bg-white focus:ring-2 focus:ring-[#006FBF]/20 focus:border-[#006FBF]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Institutional Email</Label>
                  <Input 
                    type="email" 
                    placeholder="admin@school.edu" 
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required 
                    className="h-11 rounded-xl border-slate-200 bg-slate-50/50 px-4 text-sm shadow-sm transition-all focus:bg-white focus:ring-2 focus:ring-[#006FBF]/20 focus:border-[#006FBF]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Secure Password</Label>
                  <Input 
                    type="password" 
                    placeholder="Minimum 8 characters"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required 
                    className="h-11 rounded-xl border-slate-200 bg-slate-50/50 px-4 text-sm shadow-sm transition-all focus:bg-white focus:ring-2 focus:ring-[#006FBF]/20 focus:border-[#006FBF]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Student Capacity Tier</Label>
                  <div className="relative">
                    <select 
                      value={selectedTier}
                      onChange={(e) => setSelectedTier(e.target.value)}
                      className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm text-slate-700 shadow-sm appearance-none focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#006FBF]/20 focus:border-[#006FBF] transition-all"
                    >
                      <option>Starter (Up to 300 students)</option>
                      <option>Business (Up to 800 students)</option>
                      <option>Professional (Up to 2,000 students)</option>
                      <option>Enterprise (2,000+ / custom)</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                      <i className="fa-solid fa-chevron-down text-xs"></i>
                    </div>
                  </div>
                </div>
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full h-11 rounded-xl text-white font-semibold text-sm shadow-sm hover:opacity-95 transition-all flex items-center justify-center gap-2"
                    style={{ background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})` }}
                  >
                    {isLoading ? (
                      <><i className="fa-solid fa-spinner animate-spin"></i> Provisioning Tenant...</>
                    ) : (
                      "Register & Provision Workspace"
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>

          <div className="text-center mt-8">
            <Link href="/" className="text-sm text-slate-500 hover:text-slate-800 font-medium transition-colors flex items-center justify-center gap-2">
              <i className="fa-solid fa-arrow-left text-xs"></i> Back to Homepage
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}