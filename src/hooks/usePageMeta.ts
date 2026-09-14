import { useEffect } from 'react';

const BASE_TITLE = 'Tadbuy';
const DEFAULT_DESCRIPTION =
  'One campaign across Nostr and independent publisher channels. Coordinate placements, verify delivery, and prepare for Bitcoin-native settlement.';

function setMetaTag(attr: 'name' | 'property', key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

export function usePageTitle(pageTitle: string) {
  useEffect(() => {
    document.title = `${pageTitle} | ${BASE_TITLE}`;
    return () => {
      document.title = `${BASE_TITLE} — Bitcoin-Native Ad Buying Platform`;
    };
  }, [pageTitle]);
}

export function usePageMeta(pageTitle: string, description?: string) {
  const desc = description ?? DEFAULT_DESCRIPTION;

  useEffect(() => {
    document.title = `${pageTitle} | ${BASE_TITLE}`;
    setMetaTag('name', 'description', desc);
    setMetaTag('property', 'og:title', `${pageTitle} | ${BASE_TITLE}`);
    setMetaTag('property', 'og:description', desc);
    setMetaTag('name', 'twitter:title', `${pageTitle} | ${BASE_TITLE}`);
    setMetaTag('name', 'twitter:description', desc);

    return () => {
      document.title = `${BASE_TITLE} — Bitcoin-Native Ad Buying Platform`;
      setMetaTag('name', 'description', DEFAULT_DESCRIPTION);
    };
  }, [pageTitle, desc]);
}