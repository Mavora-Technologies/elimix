import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-[#0F2942] text-white px-6 py-16 md:px-12">
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        <div className="space-y-4 md:col-span-1">
          <div className="relative h-10 w-36 bg-white/10 p-2 rounded-md">
            <Image 
              src="/logo.png" 
              alt="Elimix Logo" 
              fill 
              className="object-contain object-left filter brightness-0 invert" 
            />
          </div>
          <p className="text-sm text-gray-300 italic font-medium">
            Simplify • Automate • Grow
          </p>
          <p className="text-xs text-gray-400">
            Next-generation multi-tenant institutional SaaS built for scale, security, and performance.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold tracking-wider uppercase text-cyan-400 mb-4">Platform</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><Link href="#features" className="hover:text-white transition-colors">Tenant Isolation</Link></li>
            <li><Link href="#features" className="hover:text-white transition-colors">Advanced RBAC</Link></li>
            <li><Link href="#features" className="hover:text-white transition-colors">Academic Analytics</Link></li>
            <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing Tiers</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold tracking-wider uppercase text-cyan-400 mb-4">Resources</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><Link href="/login" className="hover:text-white transition-colors">Documentation</Link></li>
            <li><Link href="/login" className="hover:text-white transition-colors">API Reference</Link></li>
            <li><Link href="/login" className="hover:text-white transition-colors">System Status</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold tracking-wider uppercase text-cyan-400 mb-4">Legal & Compliance</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><Link href="#home" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link href="#home" className="hover:text-white transition-colors">Terms of Service</Link></li>
            <li><Link href="#contact" className="hover:text-white transition-colors">Security & Trust</Link></li>
          </ul>
        </div>
      </div>

      <div className="mx-auto max-w-7xl border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400">
        <div>© 2026 Elimix Platform. All rights reserved.</div>
        <div className="flex gap-6 mt-4 sm:mt-0">
          <span>Enterprise Grade Security</span>
          <span>ISO 27001 Ready</span>
        </div>
      </div>
    </footer>
  );
}