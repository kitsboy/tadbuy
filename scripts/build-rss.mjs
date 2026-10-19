#!/usr/bin/env node
/**
 * Write public/feed.xml from a hand-listed set of pages that already exist.
 * No invented news. Run: node scripts/build-rss.mjs
 */
import { writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const SITE = 'https://tadbuy.giveabit.io'
const ITEMS = [
  ['/docs', 'Documentation', 'How a Tadbuy campaign is planned, bought, and settled in sats.', '2026-09-01'],
  ['/publisher', 'Publisher portal', 'Where an independent publisher connects a channel.', '2026-09-01'],
  ['/ppq', 'PPQ guide', 'How placement quality is scored before a buy.', '2026-09-01'],
  ['/bolt12', 'BOLT12', 'What the BOLT12 payment option is, in plain words.', '2026-09-01'],
  ['/changelog', 'Changelog', 'What changed on the Tadbuy site.', '2026-09-01'],
  ['/compare', 'Compare', 'How Tadbuy sits next to an ordinary ad buy.', '2026-09-01'],
]

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

const items = ITEMS.map(([path, title, desc, day]) => `    <item>
      <title>${esc(title)}</title>
      <link>${SITE}${path}</link>
      <guid isPermaLink="true">${SITE}${path}</guid>
      <pubDate>${new Date(day + 'T12:00:00Z').toUTCString()}</pubDate>
      <description>${esc(desc)}</description>
    </item>`).join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Tadbuy — Bitcoin-native ads</title>
    <link>${SITE}</link>
    <description>Campaigns planned in sats, delivery you can check. Own pages only. Sibling news is not mixed in.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`
writeFileSync(join(ROOT, 'public', 'feed.xml'), xml)
console.log(`feed.xml ${ITEMS.length} items`)
