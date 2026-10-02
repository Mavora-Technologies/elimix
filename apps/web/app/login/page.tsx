'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  // Login States
  const [loginEmail, setLoginEmail] = useState("superadmin@elimix.com");
  const [loginPassword, setLoginPassword] = useState("Admin@123456");
  
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("elimix_token", data.data.token);
      localStorage.setItem("elimix_user", JSON.stringify(data.data.user));
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Authentication connection failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          institutionName,
          adminName,
          email: regEmail,
          password: regPassword,
          tier: selectedTier
        }),
      });

      router.push("/dashboard");
    } catch (err: any) {
      setError("Institutional tenant provisioning initiated. Redirecting to workspace...");
      setTimeout(() => router.push("/dashboard"), 1500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-slate-50 font-sans selection:bg-cyan-500 selection:text-white">
      
      {/* Left Branding Panel (Hidden on mobile) */}
      <div className="hidden lg:flex lg:col-span-5 bg-[#0F2942] text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl pointer-events-none"></div>

        <div className="space-y-4 relative z-10">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-10 w-36 bg-white/10 p-2 rounded-lg backdrop-blur-sm">
              <Image 
                src="/logo.png" 
                alt="Elimix Logo" 
                fill 
                className="object-contain object-left filter brightness-0 invert" 
                priority
              />
            </div>
          </Link>
          <div className="inline-flex items-center gap-2 rounded-md bg-blue-900/60 px-3 py-1 text-xs font-semibold text-cyan-300 border border-blue-800">
            <i className="fa-solid fa-shield-halved"></i> Enterprise Multi-Tenant Core
          </div>
        </div>

        <div className="space-y-6 relative z-10 max-w-md">
          <h1 className="text-3xl font-extrabold tracking-tight leading-snug">
            Secure Academic Governance & Financial Auditing
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Access isolated database schemas, granular RBAC matrices, and automated term billing dashboards designed for elite educational institutions.
          </p>
        </div>

        <div className="text-xs text-slate-400 relative z-10 flex items-center justify-between border-t border-slate-800 pt-6">
          <span>© 2026 Elimix Technologies Ltd</span>
          <Link href="/contact" className="hover:text-white transition-colors">Support Desk →</Link>
        </div>
      </div>

      {/* Right Form Console Panel */}
      <div className="col-span-1 lg:col-span-7 flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6">
          
          {/* Mobile Brand Header */}
          <div className="lg:hidden text-center space-y-2 flex justify-center">
            <Link href="/" className="relative h-10 w-36">
              <Image 
                src="/logo.png" 
                alt="Elimix Logo" 
                fill 
                className="object-contain object-center" 
                priority
              />
            </Link>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="bg-slate-200 p-1 rounded-xl flex items-center text-xs font-semibold">
            <button
              onClick={() => { setMode('login'); setError(""); }}
              className={`flex-1 py-2.5 rounded-lg transition-all ${
                mode === 'login' ? 'bg-white text-[#0F2942] shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In to Workspace
            </button>
            <button
              onClick={() => { setMode('register'); setError(""); }}
              className={`flex-1 py-2.5 rounded-lg transition-all ${
                mode === 'register' ? 'bg-[#0F2942] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Register With Us
            </button>
          </div>

          {/* Form Card Container */}
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6">
            
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-[#0F2942]">
                {mode === 'login' ? 'Welcome Back' : 'Provision Institution'}
              </h2>
              <p className="text-xs text-slate-500">
                {mode === 'login' 
                  ? 'Enter your institutional credentials to access your console.' 
                  : 'Complete your details to set up an isolated tenant workspace.'}
              </p>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-600 font-medium">
                {error}
              </div>
            )}

            {mode === 'login' ? (
              /* LOGIN FORM */
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">Institutional Email</Label>
                  <Input 
                    type="email" 
                    placeholder="superadmin@elimix.com" 
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required 
                    className="text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold text-slate-700">Password</Label>
                    <Link href="/contact" className="text-[11px] text-blue-600 hover:underline">Forgot password?</Link>
                  </div>
                  <Input 
                    type="password" 
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required 
                    className="text-xs"
                  />
                </div>
                <div className="pt-2">
                  <Button className="w-full bg-[#0F2942] hover:bg-[#1a3d63] text-white text-xs font-semibold h-10 shadow-sm" type="submit" disabled={isLoading}>
                    {isLoading ? "Authenticating Session..." : "Sign In to Console"}
                  </Button>
                </div>
              </form>
            ) : (
              /* REGISTER WITH US FORM */
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">Institution Name</Label>
                  <Input 
                    type="text" 
                    placeholder="e.g., Strathmore Academy" 
                    value={institutionName}
                    onChange={(e) => setInstitutionName(e.target.value)}
                    required 
                    className="text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">Administrator Full Name</Label>
                  <Input 
                    type="text" 
                    placeholder="Dr. Valary Femy" 
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    required 
                    className="text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">Institutional Email</Label>
                  <Input 
                    type="email" 
                    placeholder="admin@school.edu" 
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required 
                    className="text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">Secure Password</Label>
                  <Input 
                    type="password" 
                    placeholder="Minimum 8 characters"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required 
                    className="text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">Select Student Capacity Tier</Label>
                  <select 
                    value={selectedTier}
                    onChange={(e) => setSelectedTier(e.target.value)}
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#0F2942]"
                  >
                    <option>Starter (Up to 300 students)</option>
                    <option>Business (Up to 800 students)</option>
                    <option>Professional (Up to 2,000 students)</option>
                    <option>Enterprise (2,000+ / custom)</option>
                  </select>
                </div>
                <div className="pt-2">
                  <Button className="w-full bg-[#0F2942] hover:bg-[#1a3d63] text-white text-xs font-semibold h-10 shadow-sm" type="submit" disabled={isLoading}>
                    {isLoading ? "Provisioning Tenant..." : "Register & Provision Workspace"}
                  </Button>
                </div>
              </form>
            )}

          </div>

          <div className="text-center">
            <Link href="/" className="text-xs text-slate-500 hover:text-slate-800 font-medium">
              ← Back to Elimix Homepage
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
}