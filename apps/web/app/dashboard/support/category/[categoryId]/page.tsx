// apps/web/app/dashboard/support/category/[categoryId]/page.tsx
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

// Mock data for categories to simulate a database fetch
const categoriesData: Record<string, any> = {
  'cat-1': {
    title: 'Platform Onboarding',
    description: 'Initial setup, tenant configuration, and basic navigation.',
    icon: 'fa-solid fa-rocket',
    articles: [
      {
        id: 'art-101',
        title: 'Getting Started with Your Institutional Workspace',
        excerpt: 'A comprehensive guide to your new Elimix dashboard, navigating modules, and understanding the layout.',
        readTime: '5 min read',
        views: '1.2k',
        isPopular: true,
      },
      {
        id: 'art-102',
        title: 'How to Invite Administrators and Staff',
        excerpt: 'Learn how to add new administrative users, assign them to departments, and send onboarding invitations.',
        readTime: '3 min read',
        views: '850',
        isPopular: true,
      },
      {
        id: 'art-103',
        title: 'Configuring Academic Years and Terms',
        excerpt: 'Step-by-step instructions on setting up your institutional calendar, including terms, semesters, and holidays.',
        readTime: '4 min read',
        views: '640',
        isPopular: false,
      },
      {
        id: 'art-104',
        title: 'Setting up Role-Based Access Control (RBAC)',
        excerpt: 'Secure your workspace by configuring custom roles and granular permissions for different staff members.',
        readTime: '6 min read',
        views: '1.1k',
        isPopular: true,
      },
      {
        id: 'art-105',
        title: 'Customizing Institutional Branding and Logos',
        excerpt: 'Personalize your tenant workspace, report cards, and parent portals with your school colors and logo.',
        readTime: '2 min read',
        views: '430',
        isPopular: false,
      },
      {
        id: 'art-106',
        title: 'Importing Student Data via CSV',
        excerpt: 'Quickly migrate your existing student and parent records into Elimix using our standardized bulk import templates.',
        readTime: '7 min read',
        views: '920',
        isPopular: false,
      },
    ],
  },
  'cat-2': {
    title: 'Student & Parent Portals',
    description: 'Managing admissions, directories, and parent access logs.',
    icon: 'fa-solid fa-users',
    articles: [],
  },
  // Other categories would follow...
};

export default function SupportCategoryPage() {
  const params = useParams();
  const categoryId = typeof params?.categoryId === 'string' ? params.categoryId : 'cat-1';
  
  const category = categoriesData[categoryId] || categoriesData['cat-1'];
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArticles = category.articles.filter((article: any) =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12 w-full max-w-full overflow-hidden">
      
      {/* HEADER & BREADCRUMBS */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1 truncate">
            <Link href="/dashboard" className="hover:text-[#006FBF] transition-colors">Dashboard</Link>
            <i className="fa-solid fa-chevron-right text-[10px]" />
            <Link href="/dashboard/support" className="hover:text-[#006FBF] transition-colors">Support Center</Link>
            <i className="fa-solid fa-chevron-right text-[10px]" />
            <span className="text-slate-900 truncate">{category.title}</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 truncate">{category.title}</h1>
          <p className="text-xs text-slate-500 mt-0.5 truncate">{category.description}</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link href="/dashboard/support" className="flex w-full sm:w-auto h-9 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-600 hover:bg-slate-50 shadow-sm transition-colors">
            <i className="fa-solid fa-arrow-left text-[#006FBF]"></i><span>Back to Categories</span>
          </Link>
        </div>
      </div>

      {/* CATEGORY HERO & SEARCH */}
      <div className="relative rounded-2xl overflow-hidden shadow-sm border border-[#006FBF]/10 bg-white">
        <div className="absolute inset-0 z-0 opacity-5 pointer-events-none" style={{ background: `linear-gradient(135deg, ${BRAND.navy}, ${BRAND.blue})` }}>
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] mix-blend-overlay"></div>
        </div>
        
        <div className="relative z-10 p-6 sm:p-10 flex flex-col md:flex-row gap-8 items-center md:items-start justify-between">
          <div className="flex items-start gap-5 max-w-2xl">
            <div 
              className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl text-white shadow-md"
              style={{ background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})` }}
            >
              <i className={`${category.icon} text-2xl`}></i>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">{category.title}</h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">{category.description}</p>
              <div className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                <i className="fa-solid fa-book-open text-[#006FBF]"></i> {category.articles.length} Articles available
              </div>
            </div>
          </div>

          <div className="w-full md:w-80 flex-shrink-0">
            <div className="relative">
              <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input 
                type="text" 
                placeholder="Search this category..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 shadow-sm outline-none focus:border-[#006FBF] focus:ring-2 focus:ring-[#006FBF]/20 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ARTICLES LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ARTICLE LIST (LEFT COLUMN) */}
        <div className="lg:col-span-8 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 mb-2 px-1">Articles</h3>
          
          {filteredArticles.length > 0 ? (
            <div className="flex flex-col gap-3">
              {filteredArticles.map((article: any) => (
                <Link 
                  href={`/dashboard/support/article/${article.id}`} 
                  key={article.id}
                  className="group block rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:border-[#006FBF]/40 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-slate-900 text-sm group-hover:text-[#006FBF] transition-colors truncate">
                          {article.title}
                        </h4>
                        {article.isPopular && (
                          <span className="inline-flex items-center rounded-md bg-amber-50 px-1.5 py-0.5 text-[9px] font-bold text-amber-700 ring-1 ring-inset ring-amber-600/20 flex-shrink-0">
                            POPULAR
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mt-1.5">
                        {article.excerpt}
                      </p>
                      <div className="mt-3 flex items-center gap-4 text-[11px] font-medium text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <i className="fa-regular fa-clock"></i> {article.readTime}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <i className="fa-regular fa-eye"></i> {article.views} views
                        </span>
                      </div>
                    </div>
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-colors group-hover:bg-[#006FBF]/10 group-hover:text-[#006FBF]">
                      <i className="fa-solid fa-arrow-right text-xs"></i>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-300 mb-3">
                <i className="fa-solid fa-magnifying-glass text-lg"></i>
              </div>
              <h3 className="text-sm font-semibold text-slate-700">No articles found</h3>
              <p className="mt-1 text-xs text-slate-500">We couldn't find any articles matching your search term in this category.</p>
              <button 
                onClick={() => setSearchQuery('')}
                className="mt-4 text-xs font-semibold text-[#006FBF] hover:underline"
              >
                Clear search filter
              </button>
            </div>
          )}
        </div>

        {/* SIDEBAR (RIGHT COLUMN) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* QUICK HELP CARD */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <i className="fa-regular fa-lightbulb text-lg"></i>
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Need help quickly?</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-5">
              If you're setting up your institution for the first time, we recommend starting with the <strong className="text-slate-800">"Getting Started"</strong> guide to ensure all core modules are configured correctly.
            </p>
            <Link 
              href="/dashboard/support/article/art-101"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 border border-slate-200"
            >
              <i className="fa-solid fa-play text-[#006FBF]"></i> Read Getting Started Guide
            </Link>
          </div>

          {/* CONTACT SUPPORT CARD */}
          <div className="rounded-2xl border border-[#006FBF]/20 bg-gradient-to-b from-[#006FBF]/5 to-transparent p-6 shadow-sm text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm border border-[#006FBF]/10 text-[#006FBF] mb-3">
              <i className="fa-solid fa-headset text-lg"></i>
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-2">Still can't find the answer?</h3>
            <p className="text-xs text-slate-500 mb-5">
              Our enterprise support team is available to assist you with complex configurations or technical issues.
            </p>
            <Link 
              href="/dashboard/support"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:opacity-95"
              style={{ background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})` }}
            >
              <i className="fa-solid fa-ticket text-[10px]"></i> Open Support Ticket
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
}