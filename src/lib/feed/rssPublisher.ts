/**
 * RSS/Atom Ad Feed Publisher — Publish campaign updates as XML feeds
 * 
 * Provides RSS 2.0 and Atom feed endpoints for campaign updates,
 * ad placements, and publisher analytics. Used by feed aggregators,
 * SEO crawlers, and Nostr feed processors (NIP-96).
 */

import { createElement } from 'react';

export interface FeedItem {
  id: string;
  title: string;
  description: string;
  url: string;
  publishedAt: number;
  updatedAt: number;
  author?: string;
  categories: string[];
  content?: string;
  link: string;
  image?: string;
  pubDate: string; // RFC 822 format
}

export interface AdFeed {
  title: string;
  description: string;
  link: string;
  language: string;
  copyright: string;
  items: FeedItem[];
  ttl: number; // Time-to-live in minutes
}

/** Generate RSS 2.0 XML feed */
export function generateRssFeed(feed: AdFeed): string {
  const itemsXml = feed.items
    .map((item) => `
    <item>
      <title>${escapeXml(item.title)}</title>
      <description>${escapeXml(item.description)}</description>
      <link>${item.url}</link>
      <guid isPermaLink="false">${item.id}</guid>
      <pubDate>${item.pubDate}</pubDate>
      ${item.author ? `<author>${escapeXml(item.author)}</author>` : ''}
      ${item.content ? `<content>${escapeXml(item.content)}</content>` : ''}
      ${item.image ? `<enclosure url="${item.image}" type="image/jpeg" />` : ''}
      ${item.categories.map((c) => `<category>${escapeXml(c)}</category>`).join('')}
    </item>
  `).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(feed.title)}</title>
    <description>${escapeXml(feed.description)}</description>
    <link>${feed.link}</link>
    <language>${feed.language}</language>
    <copyright>${escapeXml(feed.copyright)}</copyright>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <ttl>${feed.ttl}</ttl>
    <atom:link href="${feed.link}/feed.xml" rel="self" type="application/rss+xml" />
${itemsXml}
  </channel>
</rss>`;
}

/** Generate Atom XML feed */
export function generateAtomFeed(feed: AdFeed): string {
  const updated = new Date().toISOString();
  const itemsEntries = feed.items.map((item) => `
    <entry>
      <title>${escapeXml(item.title)}</title>
      <summary>${escapeXml(item.description)}</summary>
      <content type="html"><![CDATA[
        ${item.content || `<p>Campaign: ${escapeXml(item.title)}</p><p>Updates, metrics, and performance reports.</p>`}
      ]]></content>
      <link href="${item.url}" />
      <id>${item.id}</id>
      <updated>${updated}</updated>
      <published>${item.pubDate.replace(' GMT', 'Z')}</published>
      ${item.author ? `      <author><name>${escapeXml(item.author)}</name></author>\n` : ''}
      ${item.categories.map((c) => `      <category term="${escapeXml(c)}"/>`).join('\n')}
    </entry>
  `).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(feed.title)}</title>
  <subtitle>${escapeXml(feed.description)}</subtitle>
  <link href="${feed.link}" rel="self" />
  <link href="${feed.link}/atom.xml" rel="self" type="application/atom+xml" />
  <updated>${updated}</updated>
  <id>${feed.link}/atom.xml</id>
  <copyright>${escapeXml(feed.copyright)}</copyright>
${itemsEntries}
</feed>`;
}

/** Convert campaign to feed item */
export function campaignToFeedItem(campaign: { id: string; name: string; status: string; spendSats: number; createdAt: number }): FeedItem {
  return {
    id: `tadbuy:campaign:${campaign.id}`,
    title: `Campaign Updated: ${campaign.name}`,
    description: `Campaign ${campaign.name} (ID: ${campaign.id}) is now ${campaign.status}. Total spend: ${campaign.spendSats.toLocaleString()} sats.`,
    url: `https://tadbuy.giveabit.io/campaigns/${campaign.id}`,
    publishedAt: campaign.createdAt,
    updatedAt: Date.now(),
    categories: ['campaign', campaign.status.toLowerCase(), 'bitcoin', 'lightning'],
    pubDate: new Date(campaign.createdAt).toUTCString(),
    link: `https://tadbuy.giveabit.io/campaigns/${campaign.id}`,
  };
}

/** Escape XML special characters */
export function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** Generate publisher feed items */
export function generatePublisherFeedItems(publisherId: string): FeedItem[] {
  // In production, this would query the campaign database
  return [
    campaignToFeedItem({
      id: 'cmp_001',
      name: 'Bitcoin Winter Sale',
      status: 'active',
      spendSats: 125000,
      createdAt: Date.now() - 86400000,
    }),
    campaignToFeedItem({
      id: 'cmp_002',
      name: 'Lightning Boost Promotion',
      status: 'paused',
      spendSats: 45000,
      createdAt: Date.now() - 172800000,
    }),
  ];
}

/** Default feed configuration */
export const DEFAULT_AD_FEED: AdFeed = {
  title: 'Tadbuy Campaign Updates',
  description: 'Latest campaign updates and performance reports from the Bitcoin-native ad platform.',
  link: 'https://tadbuy.giveabit.io',
  language: 'en',
  copyright: '© 2026 Give A Bit Inc.',
  items: [],
  ttl: 60,
};

/** Get or create feed for publishers */
export function getPublisherFeed(publisherId: string): AdFeed {
  return {
    ...DEFAULT_AD_FEED,
    title: `Tadbuy — ${publisherId} Campaign Feed`,
    items: generatePublisherFeedItems(publisherId),
  };
}