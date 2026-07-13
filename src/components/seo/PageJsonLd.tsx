import { useEffect } from 'react';

type JsonLdType = 'FAQPage' | 'BreadcrumbList' | 'WebPage';

type PageJsonLdProps = {
  type: JsonLdType;
  data: Record<string, unknown>;
};

export function PageJsonLd({ type, data }: PageJsonLdProps) {
  useEffect(() => {
    const id = `jsonld-${type}`;
    let el = document.getElementById(id) as HTMLScriptElement | null;
    const payload = { '@context': 'https://schema.org', '@type': type, ...data };
    if (!el) {
      el = document.createElement('script');
      el.id = id;
      el.type = 'application/ld+json';
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(payload);
    return () => { el?.remove(); };
  }, [type, data]);

  return null;
}