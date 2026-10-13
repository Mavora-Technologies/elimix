// apps/web/app/dashboard/support/article/[articleId]/page.tsx
'use client';

export const runtime = 'edge';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const BRAND = {
  navy: '#012E54',
  blue: '#006FBF',
  brightBlue: '#0088CE',
  cyan: '#04B1D6',
  teal: '#0199B9',
};

// Mock data to simulate fetching an article from your CMS/Database
const articleData = {
  id: 'art-101',
  title: 'Getting Started with Your Institutional Workspace',
  categoryId: 'cat-1',
  categoryName: 'Platform Onboarding',
  author: 'Mavora Customer Success',
  lastUpdated: 'October 12, 2026',
  readTime: '5 min read',
  views: '1.2k',
  relatedArticles: [
    { id: 'art-103', title: 'Configuring Academic Years and Terms' },
    { id: 'art-104', title: 'Setting up Role-Based Access Control (RBAC)' },
    { id: 'art-106', title: 'Importing Student Data via CSV' },
  ]
};

export default function SupportArticlePage() {
  const params = useParams();
  const articleId = typeof params?.articleId === 'string' ? params.articleId : 'art-101';
  
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean | null>(null);

  const handleFeedback = (isHelpful: boolean) => {
    // Simulate API call to register feedback metrics
    setFeedbackSubmitted(isHelpful);
    setTimeout(() => {
      // Could reset or leave as is
    }, 3000);
  };

  return (
    <div className="space-y-6 pb-12 w-full max-w-full overflow-hidden">
      
      {/* HEADER & BREADCRUMBS */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500 mb-2">
            <Link href="/dashboard" className="hover:text-[#006FBF] transition-colors">Dashboard</Link>
            <i className="fa-solid fa-chevron-right text-[9px] opacity-50" />
            <Link href="/dashboard/support" className="hover:text-[#006FBF] transition-colors">Support Center</Link>
            <i className="fa-solid fa-chevron-right text-[9px] opacity-50" />
            <Link href={`/dashboard/support/category/${articleData.categoryId}`} className="hover:text-[#006FBF] transition-colors truncate max-w-[120px] sm:max-w-[200px]">
              {articleData.categoryName}
            </Link>
            <i className="fa-solid fa-chevron-right text-[9px] opacity-50" />
            <span className="text-slate-900 truncate max-w-[150px] sm:max-w-[250px]">{articleData.title}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto flex-shrink-0">
          <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-[#006FBF] transition-colors" title="Print Article">
            <i className="fa-solid fa-print text-xs"></i>
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-[#006FBF] transition-colors" title="Copy Link">
            <i className="fa-solid fa-link text-xs"></i>
          </button>
        </div>
      </div>

      {/* ARTICLE LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* MAIN ARTICLE CONTENT (LEFT COLUMN) */}
        <div className="lg:col-span-8 space-y-6">
          <article className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-10 shadow-sm">
            
            {/* Article Meta Header */}
            <div className="border-b border-slate-100 pb-6 mb-8">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mb-4 leading-snug">
                {articleData.title}
              </h1>
              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs font-medium text-slate-500">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                    <i className="fa-solid fa-building text-[10px] text-slate-400"></i>
                  </div>
                  <span className="text-slate-700 font-semibold">{articleData.author}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <i className="fa-regular fa-calendar text-[11px]"></i> Updated {articleData.lastUpdated}
                </div>
                <div className="flex items-center gap-1.5">
                  <i className="fa-regular fa-clock text-[11px]"></i> {articleData.readTime}
                </div>
              </div>
            </div>

            {/* Article Body */}
            <div className="text-slate-700 text-sm sm:text-[15px] leading-relaxed space-y-6">
              <p>
                Welcome to your new institutional workspace! Setting up your school environment correctly from day one ensures a seamless experience for your administrators, teachers, students, and parents. This guide walks you through the essential first steps to provision your multi-tenant environment.
              </p>

              <h2 id="step-1" className="text-xl font-bold text-slate-900 pt-4 pb-1 border-b border-slate-100">
                Step 1: Configure Institutional Details
              </h2>
              <p>
                Before importing users, ensure your school's branding and core details are set up. This information appears on parent portals, fee invoices, and academic report cards.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-600 marker:text-[#006FBF]">
                <li>Navigate to <strong>Settings &gt; Institution Profile</strong>.</li>
                <li>Upload your high-resolution school logo.</li>
                <li>Verify your official contact details, physical address, and school motto.</li>
                <li>Configure your primary billing currency and default timezone.</li>
              </ul>

              <div className="rounded-xl border border-[#006FBF]/20 bg-[#006FBF]/5 p-4 my-6 flex gap-4 items-start">
                <div className="flex items-center justify-center flex-shrink-0 h-8 w-8 rounded-full bg-white shadow-sm border border-[#006FBF]/10 text-[#006FBF]">
                  <i className="fa-solid fa-lightbulb text-sm"></i>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Pro Tip: Academic Years</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Always set up your <strong>Academic Year and Terms</strong> <em>before</em> generating fee structures or importing students, as enrollment mapping depends on an active academic period.
                  </p>
                </div>
              </div>

              <h2 id="step-2" className="text-xl font-bold text-slate-900 pt-4 pb-1 border-b border-slate-100">
                Step 2: Set Up Academic Structures
              </h2>
              <p>
                The academic engine forms the backbone of the platform. You need to define how your institution categorizes students and subjects.
              </p>
              <ol className="list-decimal pl-6 space-y-2 text-slate-600 marker:text-[#006FBF] marker:font-bold">
                <li>Go to <strong>Academics &gt; Departments</strong> and create your faculty groups (e.g., Sciences, Humanities).</li>
                <li>Navigate to <strong>Academics &gt; Subjects</strong> to build your curriculum catalog.</li>
                <li>Define your <strong>Classes and Streams</strong> (e.g., Grade 9, Form 1 North) via the Student Management module.</li>
              </ol>

              <h2 id="step-3" className="text-xl font-bold text-slate-900 pt-4 pb-1 border-b border-slate-100">
                Step 3: Define Roles and Permissions (RBAC)
              </h2>
              <p>
                Security is paramount. The Role-Based Access Control (RBAC) system ensures staff only see what they are authorized to manage.
              </p>
              <p>
                Under <strong>Security &amp; Access &gt; Roles &amp; Permissions</strong>, review the default roles (Principal, Teacher, Accountant). You can edit these or create custom roles tailored to your operational needs. Ensure you restrict financial modules exclusively to authorized accounting personnel.
              </p>

              <h2 id="next-steps" className="text-xl font-bold text-slate-900 pt-4 pb-1 border-b border-slate-100">
                Next Steps
              </h2>
              <p>
                Once your foundation is set, you are ready to begin importing your student and staff directories. Check out our detailed guide on <Link href="/dashboard/support/article/art-106" className="text-[#006FBF] font-semibold hover:underline">Importing Student Data via CSV</Link> for the quickest way to populate your workspace.
              </p>
            </div>
            
          </article>

          {/* Feedback Section */}
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50 p-6 sm:p-8 flex flex-col items-center text-center">
            {feedbackSubmitted === null ? (
              <>
                <h3 className="text-sm font-bold text-slate-900 mb-4">Was this article helpful?</h3>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleFeedback(true)}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-2 text-xs font-semibold text-slate-600 transition-all hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 shadow-sm"
                  >
                    <i className="fa-regular fa-thumbs-up"></i> Yes
                  </button>
                  <button 
                    onClick={() => handleFeedback(false)}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-2 text-xs font-semibold text-slate-600 transition-all hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 shadow-sm"
                  >
                    <i className="fa-regular fa-thumbs-down"></i> No
                  </button>
                </div>
              </>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-3">
                  <i className="fa-solid fa-check"></i>
                </div>
                <h3 className="text-sm font-bold text-slate-900">Thank you for your feedback!</h3>
                <p className="text-xs text-slate-500 mt-1">We use this data to constantly improve our documentation.</p>
              </div>
            )}
          </div>

        </div>

        {/* SIDEBAR (RIGHT COLUMN) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* TABLE OF CONTENTS */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sticky top-[100px]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 px-1">On this page</h3>
            <ul className="space-y-3 text-[13px] font-medium text-slate-600">
              <li>
                <a href="#step-1" className="block px-2 py-1 rounded hover:bg-slate-50 hover:text-[#006FBF] transition-colors">
                  Step 1: Institutional Details
                </a>
              </li>
              <li>
                <a href="#step-2" className="block px-2 py-1 rounded hover:bg-slate-50 hover:text-[#006FBF] transition-colors">
                  Step 2: Academic Structures
                </a>
              </li>
              <li>
                <a href="#step-3" className="block px-2 py-1 rounded hover:bg-slate-50 hover:text-[#006FBF] transition-colors">
                  Step 3: Define Roles (RBAC)
                </a>
              </li>
              <li>
                <a href="#next-steps" className="block px-2 py-1 rounded hover:bg-slate-50 hover:text-[#006FBF] transition-colors">
                  Next Steps
                </a>
              </li>
            </ul>
          </div>

          {/* RELATED ARTICLES */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 px-1">Related Articles</h3>
            <ul className="space-y-3">
              {articleData.relatedArticles.map(article => (
                <li key={article.id}>
                  <Link 
                    href={`/dashboard/support/article/${article.id}`}
                    className="group flex items-start gap-2.5 rounded-lg px-1.5 py-1 transition-colors"
                  >
                    <i className="fa-regular fa-file-lines text-slate-300 mt-0.5 group-hover:text-[#006FBF]"></i>
                    <span className="text-[13px] font-medium text-slate-600 leading-snug group-hover:text-[#006FBF] group-hover:underline">
                      {article.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT SUPPORT CARD */}
          <div className="rounded-2xl border border-[#006FBF]/20 bg-gradient-to-b from-[#006FBF]/5 to-transparent p-6 shadow-sm text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm border border-[#006FBF]/10 text-[#006FBF] mb-3">
              <i className="fa-solid fa-headset"></i>
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1.5">Need more help?</h3>
            <p className="text-xs text-slate-500 mb-4">
              Our support team is available 24/7.
            </p>
            <Link 
              href="/dashboard/support"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
            >
              Contact Support
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
}