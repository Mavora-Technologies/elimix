export function SoftwareAppJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Elimix School Management System",
    "operatingSystem": "Cloud-Based, Web, iOS, Android",
    "applicationCategory": "EducationalApplication",
    "curator": {
      "@type": "Organization",
      "name": "Mavora Technologies",
      "url": "https://mavoratechnologies.com"
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "KES",
      "lowPrice": "15000",
      "highPrice": "120000",
      "offerCount": "3"
    },
    "description": "Secure, multi-tenant administrative architecture for primary schools, secondary academies, and multi-campus universities in Kenya."
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}