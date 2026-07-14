#!/usr/bin/env python3
"""Apply privacy patches to tadbuy server files on M3."""
from pathlib import Path
import re
import sys

ROOT = Path.home() / "projects" / "tadbuy"


def patch_batch1() -> None:
    p = ROOT / "server" / "routes" / "batch1.ts"
    text = p.read_text()
    if "anonymizeIp" in text and "extractClientIp" in text and "req.ip" not in text.split("function getSessionId")[1].split("export function")[0]:
        print("batch1: already patched")
        return

    if "from '../../src/lib/privacy/ipAnonymize.ts'" not in text and 'from "../../src/lib/privacy/ipAnonymize.ts"' not in text:
        text = text.replace(
            "import type { Express, Request, Response } from 'express';",
            "import type { Express, Request, Response } from 'express';\n"
            "import { anonymizeIp, extractClientIp } from '../../src/lib/privacy/ipAnonymize.ts';",
        )
        text = text.replace(
            'import type { Express, Request, Response } from "express";',
            'import type { Express, Request, Response } from "express";\n'
            'import { anonymizeIp, extractClientIp } from "../../src/lib/privacy/ipAnonymize.ts";',
        )

    pattern = re.compile(
        r"function getSessionId\(req: Request\): string \{\n"
        r"  const cookie = req\.headers\.cookie \?\? '';\n"
        r"  const match = cookie\.match\(/connect\\.sid=\(\[\^;\]\+\)/\);\n"
        r"  return match\?\.\[1\] \?\? req\.ip \?\? 'anonymous';\n"
        r"\}",
        re.M,
    )
    pattern_dq = re.compile(
        r'function getSessionId\(req: Request\): string \{\n'
        r'  const cookie = req\.headers\.cookie \?\? "";\n'
        r'  const match = cookie\.match\(/connect\\.sid=\(\[\^;\]\+\)/\);\n'
        r'  return match\?\.\[1\] \?\? req\.ip \?\? "anonymous";\n'
        r'\}',
        re.M,
    )
    replacement = (
        "function getSessionId(req: Request): string {\n"
        "  const cookie = req.headers.cookie ?? '';\n"
        "  const match = cookie.match(/connect\\.sid=([^;]+)/);\n"
        "  if (match?.[1]) return match[1];\n"
        "  // Never key sessions on raw IP — coarse anonymized prefix only\n"
        "  return anonymizeIp(extractClientIp(req)) ?? 'anonymous';\n"
        "}"
    )
    replacement_dq = (
        'function getSessionId(req: Request): string {\n'
        '  const cookie = req.headers.cookie ?? "";\n'
        '  const match = cookie.match(/connect\\.sid=([^;]+)/);\n'
        '  if (match?.[1]) return match[1];\n'
        '  // Never key sessions on raw IP — coarse anonymized prefix only\n'
        '  return anonymizeIp(extractClientIp(req)) ?? "anonymous";\n'
        '}'
    )

    new_text, n = pattern.subn(replacement, text, count=1)
    if n == 0:
        new_text, n = pattern_dq.subn(replacement_dq, text, count=1)
    if n == 0:
        # try flexible whitespace
        if "return match?.[1] ?? req.ip ??" in text:
            new_text = text.replace(
                "return match?.[1] ?? req.ip ?? 'anonymous';",
                "if (match?.[1]) return match[1];\n"
                "  return anonymizeIp(extractClientIp(req)) ?? 'anonymous';",
            ).replace(
                'return match?.[1] ?? req.ip ?? "anonymous";',
                "if (match?.[1]) return match[1];\n"
                '  return anonymizeIp(extractClientIp(req)) ?? "anonymous";',
            )
            if "anonymizeIp" not in new_text.split("function getSessionId")[0]:
                raise SystemExit("batch1: import missing after body patch")
        else:
            raise SystemExit("batch1: getSessionId pattern not found")
    p.write_text(new_text)
    assert "anonymizeIp" in p.read_text()
    assert "req.ip ??" not in p.read_text().split("function getSessionId")[1].split("export function")[0]
    print("batch1: patched OK")


def patch_server() -> None:
    p = ROOT / "server.ts"
    text = p.read_text()

    if "insertImpressionLog" not in text:
        # add import near other db imports
        needle = "from \"./src/lib/db/supabaseAdmin.ts\";"
        if needle not in text:
            needle = "from './src/lib/db/supabaseAdmin.ts';"
            add = (
                "from './src/lib/db/supabaseAdmin.ts';\n"
                "import {\n"
                "  insertImpressionLog,\n"
                "  purgeImpressionLogsOlderThan,\n"
                "} from './src/lib/db/impressionLogs.ts';"
            )
            if needle not in text:
                raise SystemExit("server: supabaseAdmin import not found")
            text = text.replace(needle, add, 1)
        else:
            add = (
                "from \"./src/lib/db/supabaseAdmin.ts\";\n"
                "import {\n"
                "  insertImpressionLog,\n"
                "  purgeImpressionLogsOlderThan,\n"
                "} from \"./src/lib/db/impressionLogs.ts\";"
            )
            text = text.replace(needle, add, 1)

    # Replace demo tracking stubs
    old_block = '''  // Phase 1 & 2: Tracking, Retargeting, View-Through, and S2S Conversions
  const demoStub = <T extends Record<string, unknown>>(payload: T) => ({ demo: true as const, ...payload });

  app.post("/api/v1/retargeting/track", (req, res) => {
    res.status(200).json(demoStub({ status: "tracked", type: "retargeting" }));
  });

  app.post("/api/v1/conversions", (req, res) => {
    res.status(200).json(demoStub({ status: "postback_received", attribution: "view-through" }));
  });

  app.post("/api/v1/ads/view", (req, res) => {
    res.status(200).json(demoStub({ status: "view_logged" }));
  });

  app.post("/api/v1/analytics/heatmap", (req, res) => {
    res.status(200).json(demoStub({ status: "scroll_depth_logged" }));
  });'''

    new_block = '''  // Phase 1 & 2: Tracking — IP stripped, fp hashed, 30-day retention (see impressionLogs.ts)
  const demoStub = <T extends Record<string, unknown>>(payload: T) => ({ demo: true as const, ...payload });

  app.post("/api/v1/retargeting/track", async (req, res) => {
    const body = req.body ?? {};
    const result = await insertImpressionLog({
      type: "retargeting",
      advertiserId: typeof body.advertiserId === "string" ? body.advertiserId : null,
      url: typeof body.url === "string" ? body.url : null,
      fp: typeof body.fp === "string" ? body.fp : null,
      req,
    });
    res.status(200).json({
      status: "tracked",
      type: "retargeting",
      privacy: { ip: "anonymized", fp: "hashed", retentionDays: 30 },
      ...(result.demo ? { demo: true as const } : {}),
      ...(result.id ? { id: result.id } : {}),
    });
  });

  app.post("/api/v1/conversions", async (req, res) => {
    const body = req.body ?? {};
    const result = await insertImpressionLog({
      type: "conversion",
      advertiserId: typeof body.advertiserId === "string" ? body.advertiserId : null,
      value: typeof body.value === "number" ? body.value : Number(body.value) || null,
      fp: typeof body.fp === "string" ? body.fp : null,
      req,
    });
    res.status(200).json({
      status: "postback_received",
      attribution: "view-through",
      privacy: { ip: "anonymized", fp: "hashed", retentionDays: 30 },
      ...(result.demo ? { demo: true as const } : {}),
      ...(result.id ? { id: result.id } : {}),
    });
  });

  app.post("/api/v1/ads/view", async (req, res) => {
    const body = req.body ?? {};
    const result = await insertImpressionLog({
      type: "view",
      adId: typeof body.adId === "string" ? body.adId : null,
      campaignId: typeof body.campaignId === "string" ? body.campaignId : null,
      fp: typeof body.fp === "string" ? body.fp : null,
      req,
    });
    res.status(200).json({
      status: "view_logged",
      privacy: { ip: "anonymized", fp: "hashed", retentionDays: 30 },
      ...(result.demo ? { demo: true as const } : {}),
      ...(result.id ? { id: result.id } : {}),
    });
  });

  app.post("/api/v1/analytics/heatmap", async (req, res) => {
    const body = req.body ?? {};
    const result = await insertImpressionLog({
      type: "heatmap",
      publisherId: typeof body.pubId === "string" ? body.pubId : null,
      scrollDepth: typeof body.scroll === "number" ? body.scroll : Number(body.scroll) || null,
      req,
    });
    res.status(200).json({
      status: "scroll_depth_logged",
      privacy: { ip: "anonymized", fp: "hashed", retentionDays: 30 },
      ...(result.demo ? { demo: true as const } : {}),
      ...(result.id ? { id: result.id } : {}),
    });
  });'''

    if 'status: "view_logged"' in text and "insertImpressionLog" in text and "privacy:" in text:
        print("server: tracking already privacy-wired")
    elif old_block in text:
        text = text.replace(old_block, new_block)
        print("server: tracking routes replaced")
    else:
        # try single-quote variant loosely via markers
        if 'app.post("/api/v1/ads/view"' in text and "insertImpressionLog" not in text.split('app.post("/api/v1/ads/view"')[1][:400]:
            raise SystemExit("server: tracking block mismatch — manual inspect needed")
        print("server: tracking block not exact match; checking...")
        if "privacy: { ip: \"anonymized\"" in text or "privacy: { ip: 'anonymized'" in text:
            print("server: privacy markers present")
        else:
            raise SystemExit("server: could not locate tracking stubs to replace")

    # fraud audit also logs
    if 'app.post("/api/v1/fraud/audit"' in text and "fraud_audit" not in text:
        text = text.replace(
            '''  app.post("/api/v1/fraud/audit", (req, res) => {
    res.status(200).json(demoStub({ status: "clean_traffic" }));
  });''',
            '''  app.post("/api/v1/fraud/audit", async (req, res) => {
    const body = req.body ?? {};
    await insertImpressionLog({
      type: "fraud_audit",
      campaignId: typeof body.campaignId === "string" ? body.campaignId : null,
      fp: typeof body.fp === "string" ? body.fp : null,
      meta: { result: "clean_traffic" },
      req,
    });
    res.status(200).json(demoStub({ status: "clean_traffic", privacy: { ip: "anonymized", fp: "hashed" } }));
  });''',
        )

    # Admin purge route after backup route
    if "purge-impression-logs" not in text:
        backup_marker = 'app.post("/api/admin/backup", agentAuthMiddleware(\'admin\'), async (req, res) => {'
        backup_marker2 = 'app.post("/api/admin/backup", agentAuthMiddleware("admin"), async (req, res) => {'
        purge_route = '''
  // 30-day impression log purge (also runs on startup)
  app.post("/api/admin/purge-impression-logs", agentAuthMiddleware("admin"), async (req, res) => {
    try {
      const days = Number(req.body?.days) > 0 ? Number(req.body.days) : 30;
      const result = await purgeImpressionLogsOlderThan(days);
      res.json({ status: "success", ...result, retentionDays: days });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "purge failed" });
    }
  });
'''
        # insert before backup route declaration for visibility
        if backup_marker2 in text:
            text = text.replace(backup_marker2, purge_route + "\n  " + backup_marker2, 1)
        elif backup_marker in text:
            text = text.replace(backup_marker, purge_route + "\n  " + backup_marker, 1)
        else:
            print("WARN: admin backup route not found; appending purge before hubhash")
            text = text.replace(
                "  // ─── Hubhash crowdfunding (demo escrow) ────────────────────────────────────",
                purge_route + "\n  // ─── Hubhash crowdfunding (demo escrow) ────────────────────────────────────",
            )

    # Startup purge once server listens — find app.listen or end of startServer
    if "purgeImpressionLogsOlderThan(30)" not in text:
        # After env warnings block is a good place: fire-and-forget
        marker = "requiredEnvVars.forEach(v => {"
        if marker in text:
            insert = (
                "  // Privacy: purge raw impression logs older than 30 days (no-op if table missing)\n"
                "  void purgeImpressionLogsOlderThan(30).then((r) => {\n"
                "    if (r.deleted > 0) console.log(`[privacy] purged ${r.deleted} impression logs older than 30d`);\n"
                "    if (r.error) console.warn('[privacy] purge skipped:', r.error);\n"
                "  }).catch(() => {});\n\n  "
            )
            text = text.replace(marker, insert + marker, 1)
        else:
            print("WARN: could not insert startup purge")

    p.write_text(text)
    final = p.read_text()
    assert "insertImpressionLog" in final
    assert "purgeImpressionLogsOlderThan" in final
    assert "purge-impression-logs" in final
    print("server: patched OK")


def append_schema_note() -> None:
    p = ROOT / "supabase-schema.sql"
    text = p.read_text()
    note = (
        "\n-- ─── Impression logs (privacy) ───────────────────────────────────────────────\n"
        "-- See supabase-impression-logs.sql for impression_logs table +\n"
        "-- purge_impression_logs(30) RPC. Run that file in the Supabase SQL editor.\n"
        "-- Raw IP is never stored; 30-day retention on raw events.\n"
    )
    if "supabase-impression-logs.sql" not in text:
        p.write_text(text.rstrip() + "\n" + note)
        print("schema note appended")
    else:
        print("schema note already present")


def main() -> int:
    if not ROOT.exists():
        print("ROOT missing", ROOT, file=sys.stderr)
        return 1
    patch_batch1()
    patch_server()
    append_schema_note()
    print("ALL PATCHES DONE")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
