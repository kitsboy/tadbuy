import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ScrollText, Loader2 } from 'lucide-react';
import { Card, CardTitle } from '@/components/ui';
import { Badge } from '@/components/ui/Badge';
import { usePageMeta } from '@/hooks/usePageMeta';
import { PROJECT_STATE } from '@/data/projectState';

function parseChangelogSections(markdown: string): { version: string; body: string }[] {
  const sections: { version: string; body: string }[] = [];
  const parts = markdown.split(/^## /m).filter(Boolean);
  for (const part of parts) {
    const [header, ...rest] = part.split('\n');
    sections.push({ version: header.trim(), body: rest.join('\n').trim() });
  }
  return sections;
}

export default function Changelog() {
  usePageMeta('Changelog', 'Release history and enhancement batches for Tadbuy.');

  const [content, setContent] = useState<string | null>(null);
  const [source, setSource] = useState<string>('loading');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/seo/changelog');
        if (res.ok) {
          const data = await res.json();
          setContent(data.content);
          setSource(data.source ?? 'api');
          return;
        }
      } catch { /* fallback */ }

      try {
        const res = await fetch('/CHANGELOG.md');
        if (res.ok) {
          setContent(await res.text());
          setSource('CHANGELOG.md');
          return;
        }
      } catch { /* fallback */ }

      const batches = Object.values(PROJECT_STATE.featureBatches)
        .map(b => `- **${b.label}:** ${b.completed}/${b.total} enhancements`)
        .join('\n');
      setContent(`## [${PROJECT_STATE.version}] — ${PROJECT_STATE.lastSynced}\n\n### Feature Batches\n${batches}`);
      setSource('projectState');
      setLoading(false);
    }

    load().finally(() => setLoading(false));
  }, []);

  const sections = content ? parseChangelogSections(content) : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto space-y-6 pb-16 p-4 md:p-8"
    >
      <div>
        <Badge variant="accent" className="mb-3">
          <ScrollText className="w-3.5 h-3.5" />
          Release Notes
        </Badge>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Changelog</h1>
        <p className="text-sm text-muted mt-2">
          All notable changes to Tadbuy · Source: <code className="text-accent">{source}</code>
        </p>
      </div>

      {loading ? (
        <Card>
          <div className="flex items-center gap-2 text-muted text-sm">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading changelog…
          </div>
        </Card>
      ) : sections.length > 0 ? (
        sections.map((section, i) => (
          <Card key={i}>
            <CardTitle>{section.version}</CardTitle>
            <pre className="text-xs text-muted whitespace-pre-wrap font-sans leading-relaxed">
              {section.body}
            </pre>
          </Card>
        ))
      ) : (
        <Card>
          <pre className="text-xs text-muted whitespace-pre-wrap font-sans leading-relaxed">
            {content}
          </pre>
        </Card>
      )}
    </motion.div>
  );
}