#!/usr/bin/env node
// Stop hook: verifies the generated ruleset is internally consistent.
//
// Checks invariants that are true at EVERY point of a run, so it never fights
// a half-finished elicitation. It does not check completeness — only that what
// exists does not contradict itself.
//
// exit 0 -> clean (or nothing to check)
// exit 2 -> blocking; stderr is fed back to the agent to fix

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const CLAUDE_MD = 'CLAUDE.md';
const AGENTS_MD = 'AGENTS.md';
const RULES_DIR = 'rules';
const MAX_LINES = 200;

const fail = [];

if (!existsSync(CLAUDE_MD)) process.exit(0); // no ruleset yet

// The router is AGENTS.md once one exists — portable to any AGENTS.md-aware
// tool, not just Claude Code. Fall back to CLAUDE.md itself for a ruleset
// written before this split existed, or for this kit's own meta CLAUDE.md,
// which has no rules/ directory and trips none of the checks below anyway.
const hasAgentsMd = existsSync(AGENTS_MD);
const ROUTER = hasAgentsMd ? AGENTS_MD : CLAUDE_MD;

const md = readFileSync(ROUTER, 'utf8');
const lines = md.split(/\r?\n/);

// 1. Router stays a router.
if (lines.length > MAX_LINES) {
  fail.push(
    `${ROUTER} is ${lines.length} lines (cap ${MAX_LINES}). ` +
      `Move domain content into rules/<domain>.md and cite it instead.`
  );
}

// 2. No eager imports of domain rules — they defeat the on-demand split.
for (const [i, line] of lines.entries()) {
  const m = line.match(/@\.?\/?rules\/[\w.-]+\.md/);
  if (m) {
    fail.push(
      `${ROUTER}:${i + 1} imports \`${m[0]}\` eagerly. ` +
        `Reference the path in prose so it loads when its trigger fires.`
    );
  }
}

// 3. Every rules/ path cited in the router exists.
const cited = [...md.matchAll(/(?<!@)\b(rules\/[\w.-]+\.md)\b/g)].map((m) => m[1]);
for (const path of [...new Set(cited)]) {
  if (!existsSync(path)) {
    fail.push(`${ROUTER} points at \`${path}\`, which does not exist.`);
  }
}

// 3b. Claude Code reads CLAUDE.md, not AGENTS.md — if AGENTS.md exists, CLAUDE.md
// must import it, or the router never actually loads in a Claude Code session.
if (hasAgentsMd) {
  const claudeMd = readFileSync(CLAUDE_MD, 'utf8');
  if (!/@\.?\/?AGENTS\.md\b/.test(claudeMd)) {
    fail.push(
      `${AGENTS_MD} exists but ${CLAUDE_MD} does not import it (\`@AGENTS.md\`). ` +
        `Claude Code reads CLAUDE.md, not AGENTS.md, so without the import the router never loads.`
    );
  }
}

// 4. Every rule id in the Always block resolves to a heading in a rule file.
const ruleFiles = existsSync(RULES_DIR)
  ? readdirSync(RULES_DIR).filter((f) => f.endsWith('.md') && !f.startsWith('_'))
  : [];
const corpus = ruleFiles.map((f) => readFileSync(join(RULES_DIR, f), 'utf8')).join('\n');
const definedIds = new Set(
  [...corpus.matchAll(/^##\s+([A-Z][A-Z0-9]*\d)\s+—/gm)].map((m) => m[1])
);

const alwaysBlock = md.split(/^##\s+/m).find((s) => /^Always\b/i.test(s));
if (alwaysBlock) {
  const referenced = [...alwaysBlock.matchAll(/\*\*([A-Z][A-Z0-9]*\d)\*\*/g)].map((m) => m[1]);
  for (const id of [...new Set(referenced)]) {
    if (!definedIds.has(id)) {
      fail.push(
        `${CLAUDE_MD} cites rule \`${id}\` in its Always block, ` +
          `but no rules/*.md defines a \`## ${id} — …\` heading.`
      );
    }
  }
  if (referenced.length > 10) {
    fail.push(
      `The Always block cites ${referenced.length} rules (soft cap 10). ` +
        `Reclassify the ones that can load when their area is touched.`
    );
  }
}

// 5. A ruleset with domain files carries its logs.
if (ruleFiles.length > 0) {
  for (const log of ['_progress.md', '_decisions.md']) {
    if (!existsSync(join(RULES_DIR, log))) {
      fail.push(
        `${RULES_DIR}/ has ${ruleFiles.length} domain file(s) but no \`${log}\`. ` +
          `A run that cannot be resumed or re-litigated is not finished.`
      );
    }
  }
}

if (fail.length) {
  console.error('Ruleset check failed:\n\n' + fail.map((f) => `  - ${f}`).join('\n'));
  process.exit(2);
}
process.exit(0);
