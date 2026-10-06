import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="w-full bg-[#F0F4F8] text-slate-800 font-sans border-t border-slate-200/80 relative overflow-hidden" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>

      {/* Green accent blur positioned at the bottom left corner matching the site theme */}
      <div className="absolute bottom-0 left-0 w-[20rem] sm:w-[30rem] lg:w-[40rem] h-[20rem] sm:h-[30rem] lg:h-[40rem] bg-emerald-500/10 rounded-tr-full blur-[80px] sm:blur-[100px] pointer-events-none"></div>

      {/* 1. Compact CTA Section */}
      <div className="w-full border-b border-slate-200/80 px-4 sm:px-6 md:px-10 lg:px-16 2xl:px-32 py-10 md:py-12 relative z-10">
        <div className="max-w-[2000px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
          <div className="text-center md:text-left space-y-2 flex-1">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0F2942] tracking-tight">
              Ready to simplify your school?
            </h3>
            <p className="text-slate-600 text-sm sm:text-base max-w-2xl leading-relaxed">
              Bring students, teachers, parents, and administrators together in one connected platform.
            </p>
          </div>
          <div className="shrink-0 w-full md:w-auto">
            <Link href="/contact" className="w-full md:w-auto">
              <Button className="w-full md:w-auto bg-[#0F2942] hover:bg-slate-800 text-white font-bold px-8 py-6 h-12 shadow-md transition-all text-sm sm:text-base rounded-xl">
                Get Started <i className="fa-solid fa-arrow-right ml-2 text-sm"></i>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Grid */}
      <div className="w-full px-4 sm:px-6 md:px-10 lg:px-16 2xl:px-32 py-16 md:py-20 max-w-[2000px] mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="inline-block focus:outline-none focus:ring-2 focus:ring-[#0070F3] rounded-md">
              <div className="flex items-center">
                <Image 
                  src="/logo.png" 
                  alt="Elimix Logo" 
                  width={160} 
                  height={40} 
                  className="object-contain h-10 w-auto"
                />
              </div>
            </Link>
            <div className="space-y-3">
              <p className="text-[#0070F3] font-semibold text-sm uppercase tracking-wider">
                School management, simplified.
              </p>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-sm">
                Everything your school needs to manage operations, connect your community, and make better decisions from one platform.
              </p>
            </div>
            {/* Social Media Circular Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <a href="https://www.linkedin.com/in/mavora-technologies-a4938a437/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="h-10 w-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-700 hover:text-[#0070F3] hover:border-blue-200 transition-all">
                <i className="fa-brands fa-linkedin text-sm"></i>
              </a>
              <a href="https://www.facebook.com/profile.php?fb_profile_edit_entry_point=%7B%22click_point%22%3A%22edit_profile_button%22%2C%22feature%22%3A%22profile_header%22%7D&id=61594211408886&sk=about" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="h-10 w-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-700 hover:text-[#0070F3] hover:border-blue-200 transition-all">
                <i className="fa-brands fa-facebook text-sm"></i>
              </a>
              <a href="https://www.instagram.com/mav0ratechnologiesltd/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="h-10 w-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-700 hover:text-[#0070F3] hover:border-blue-200 transition-all">
                <i className="fa-brands fa-instagram text-sm"></i>
              </a>
              <a href="https://www.tiktok.com/@mavoratechnologies" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="h-10 w-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-700 hover:text-[#0070F3] hover:border-blue-200 transition-all">
                <i className="fa-brands fa-tiktok text-sm"></i>
              </a>
            </div>
          </div>

          {/* Platform Links (Wired to respective pages) */}
          <div className="space-y-5">
            <h4 className="text-[#0F2942] font-bold text-sm tracking-widest uppercase flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0070F3]"></span> Platform
            </h4>
            <ul className="space-y-3.5 text-sm sm:text-base text-slate-600 font-medium">
              <li><Link href="/students" className="hover:text-[#0070F3] transition-colors flex items-center gap-2"><i className="fa-solid fa-angle-right text-xs text-[#0070F3]"></i> Student Management</Link></li>
              <li><Link href="/academics" className="hover:text-[#0070F3] transition-colors flex items-center gap-2"><i className="fa-solid fa-angle-right text-xs text-[#0070F3]"></i> Academic Management</Link></li>
              <li><Link href="/finance" className="hover:text-[#0070F3] transition-colors flex items-center gap-2"><i className="fa-solid fa-angle-right text-xs text-[#0070F3]"></i> Finance & Fees</Link></li>
              <li><Link href="/attendance" className="hover:text-[#0070F3] transition-colors flex items-center gap-2"><i className="fa-solid fa-angle-right text-xs text-[#0070F3]"></i> Attendance</Link></li>
              <li><Link href="/communication" className="hover:text-[#0070F3] transition-colors flex items-center gap-2"><i className="fa-solid fa-angle-right text-xs text-[#0070F3]"></i> Communication</Link></li>
              <li><Link href="/exams" className="hover:text-[#0070F3] transition-colors flex items-center gap-2"><i className="fa-solid fa-angle-right text-xs text-[#0070F3]"></i> Examination Management</Link></li>
            </ul>
          </div>

          {/* Social Media Links Column */}
          <div className="space-y-5">
            <h4 className="text-[#0F2942] font-bold text-sm tracking-widest uppercase flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0070F3]"></span> Social Media
            </h4>
            <ul className="space-y-3.5 text-sm sm:text-base text-slate-600 font-medium">
              <li>
                <a href="https://www.linkedin.com/in/mavora-technologies-a4938a437/" target="_blank" rel="noopener noreferrer" className="hover:text-[#0070F3] transition-colors flex items-center gap-2">
                  <i className="fa-brands fa-linkedin text-sm text-[#0070F3]"></i> LinkedIn
                </a>
              </li>
              <li>
                <a href="https://www.facebook.com/profile.php?fb_profile_edit_entry_point=%7B%22click_point%22%3A%22edit_profile_button%22%2C%22feature%22%3A%22profile_header%22%7D&id=61594211408886&sk=about" target="_blank" rel="noopener noreferrer" className="hover:text-[#0070F3] transition-colors flex items-center gap-2">
                  <i className="fa-brands fa-facebook text-sm text-[#0070F3]"></i> Facebook
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/mav0ratechnologiesltd/" target="_blank" rel="noopener noreferrer" className="hover:text-[#0070F3] transition-colors flex items-center gap-2">
                  <i className="fa-brands fa-instagram text-sm text-[#0070F3]"></i> Instagram
                </a>
              </li>
              <li>
                <a href="https://www.tiktok.com/@mavoratechnologies" target="_blank" rel="noopener noreferrer" className="hover:text-[#0070F3] transition-colors flex items-center gap-2">
                  <i className="fa-brands fa-tiktok text-sm text-[#0070F3]"></i> TikTok
                </a>
              </li>
            </ul>
          </div>

          {/* Company Links (Wired to respective pages) */}
          <div className="space-y-5">
            <h4 className="text-[#0F2942] font-bold text-sm tracking-widest uppercase flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0070F3]"></span> Company
            </h4>
            <ul className="space-y-3.5 text-sm sm:text-base text-slate-600 font-medium">
              <li><Link href="/about" className="hover:text-[#0070F3] transition-colors flex items-center gap-2"><i className="fa-solid fa-angle-right text-xs text-[#0070F3]"></i> About Elimix</Link></li>
              <li><Link href="/contact" className="hover:text-[#0070F3] transition-colors flex items-center gap-2"><i className="fa-solid fa-angle-right text-xs text-[#0070F3]"></i> Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-[#0070F3] transition-colors flex items-center gap-2"><i className="fa-solid fa-angle-right text-xs text-[#0070F3]"></i> Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-[#0070F3] transition-colors flex items-center gap-2"><i className="fa-solid fa-angle-right text-xs text-[#0070F3]"></i> Terms of Service</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* 3. Trust Strip */}
      <div className="w-full border-t border-slate-200/80 px-4 sm:px-6 md:px-10 lg:px-16 2xl:px-32 relative z-10">
        <div className="max-w-[2000px] mx-auto py-6 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-semibold text-slate-500 tracking-wider uppercase text-center">
          <span className="flex items-center gap-2"><i className="fa-solid fa-lock text-slate-400"></i> Secure</span>
          <span className="hidden sm:inline text-slate-300">•</span>
          <span className="flex items-center gap-2"><i className="fa-solid fa-cloud text-slate-400"></i> Cloud-Based</span>
          <span className="hidden sm:inline text-slate-300">•</span>
          <span className="flex items-center gap-2"><i className="fa-solid fa-shield-halved text-slate-400"></i> Role-Based Access</span>
          <span className="hidden sm:inline text-slate-300">•</span>
          <span className="flex items-center gap-2"><i className="fa-solid fa-mobile-screen-button text-slate-400"></i> Mobile Ready</span>
        </div>
      </div>

      {/* 4. Bottom Bar */}
      <div className="w-full bg-[#E5ECF4] px-4 sm:px-6 md:px-10 lg:px-16 2xl:px-32 border-t border-slate-200/80 relative z-10">
        <div className="max-w-[2000px] mx-auto py-6 flex flex-col-reverse sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-600 font-medium">
          <p>© 2026 Elimix. All rights reserved.</p>
          
          <div className="flex items-center gap-6 text-lg">
            <a href="https://www.linkedin.com/in/mavora-technologies-a4938a437/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-slate-600 hover:text-[#0070F3] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0070F3] rounded p-1">
              <i className="fa-brands fa-linkedin"></i>
            </a>
            <a href="https://www.facebook.com/profile.php?fb_profile_edit_entry_point=%7B%22click_point%22%3A%22edit_profile_button%22%2C%22feature%22%3A%22profile_header%22%7D&id=61594211408886&sk=about" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-slate-600 hover:text-[#0070F3] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0070F3] rounded p-1">
              <i className="fa-brands fa-facebook"></i>
            </a>
            <a href="https://www.instagram.com/mav0ratechnologiesltd/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-slate-600 hover:text-[#0070F3] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0070F3] rounded p-1">
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a href="https://www.tiktok.com/@mavoratechnologies" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="text-slate-600 hover:text-[#0070F3] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0070F3] rounded p-1">
              <i className="fa-brands fa-tiktok"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}