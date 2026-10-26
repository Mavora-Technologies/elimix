import React from "react";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://elimix.mavoratechnologies.com"
).replace(/\/$/, "");
const ORG_URL = "https://mavoratechnologies.com";

function safeJsonLdReplacer(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function OrganizationAndWebsiteJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${ORG_URL}/#organization`,
        name: "Mavora Technologies",
        url: ORG_URL,
        description:
          "Software engineering and digital transformation company developing enterprise platforms including the Elimix School Management System.",
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "Elimix School Management System",
        publisher: {
          "@id": `${ORG_URL}/#organization`,
        },
        inLanguage: "en-KE",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLdReplacer(schema) }}
    />
  );
}

export function SoftwareAppJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${SITE_URL}/#software`,
    name: "Elimix School Management System",
    alternateName: "Mavora SRMS",
    operatingSystem: "Web, Cloud-Based",
    applicationCategory: "EducationalApplication",
    url: SITE_URL,
    creator: {
      "@type": "Organization",
      name: "Mavora Technologies",
      url: ORG_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Mavora Technologies",
      url: ORG_URL,
    },
    featureList: [
      "Multi-tenant PostgreSQL database schema isolation",
      "Granular Role-Based Access Control (RBAC) and immutable audit logs",
      "Student admissions, class management, attendance, and medical records",
      "Academic curriculum, lesson plans, subject allocations, and timetables",
      "CBC, IGCSE, and tertiary examination management and branded report cards",
      "School fee structures, invoicing, payment recording, reconciliation, and statements",
      "Cloud-native LMS courses, quizzes, progress tracking, and digital resources",
      "Parent portals, library, hostel, transport fleet, HR payroll, and procurement",
    ],
    description:
      "Manage school administration with Elimix. Connect student records, fees, attendance and academic operations in one school management platform.",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLdReplacer(schema) }}
    />
  );
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export function WebPageJsonLd({
  title,
  description,
  path,
  breadcrumbs = [],
  faqs = [],
}: {
  title: string;
  description: string;
  path: string;
  breadcrumbs?: BreadcrumbItem[];
  faqs?: FaqItem[];
}) {
  const pageUrl = `${SITE_URL}${path}`;

  const graph: Record<string, unknown>[] = [
    {
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: title,
      description,
      isPartOf: {
        "@id": `${SITE_URL}/#website`,
      },
      about: {
        "@id": `${SITE_URL}/#software`,
      },
      inLanguage: "en-KE",
    },
  ];

  if (breadcrumbs.length > 0) {
    graph.push({
      "@type": "BreadcrumbList",
      "@id": `${pageUrl}#breadcrumb`,
      itemListElement: breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: `${SITE_URL}${item.path}`,
      })),
    });
  }

  if (faqs.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${pageUrl}#faq`,
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    });
  }

  const schema = {
    "@context": "https://schema.org",
    "@graph": graph,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLdReplacer(schema) }}
    />
  );
}