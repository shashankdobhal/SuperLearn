/** Pretty-prints a plain JS value as a TS object/array literal matching this
 * repo's hand-authored lesson file style (single-quoted strings, unquoted
 * identifier keys, 2-space indent) — so a generated file reads the same as
 * one Claude or a human wrote by hand, not like machine-dumped JSON. */
function quoteString(s: string): string {
  // Prefer single quotes (repo convention); fall back to double quotes only
  // when the string contains a single quote and no double quote, matching
  // the existing hand-authored files' own escaping choice.
  if (s.includes("'") && !s.includes('"')) {
    return `"${s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
  }
  return `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

const IDENTIFIER_RE = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

function serializeValue(value: unknown, indent: number): string {
  const pad = '  '.repeat(indent);
  const childPad = '  '.repeat(indent + 1);

  if (value === null || value === undefined) return 'null';
  if (typeof value === 'string') return quoteString(value);
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);

  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    const items = value.map((v) => `${childPad}${serializeValue(v, indent + 1)}`).join(',\n');
    return `[\n${items},\n${pad}]`;
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>).filter(([, v]) => v !== undefined);
    if (entries.length === 0) return '{}';
    const body = entries
      .map(([k, v]) => {
        const key = IDENTIFIER_RE.test(k) ? k : quoteString(k);
        return `${childPad}${key}: ${serializeValue(v, indent + 1)}`;
      })
      .join(',\n');
    return `{\n${body},\n${pad}}`;
  }

  throw new Error(`Cannot serialize value of type ${typeof value}`);
}

export function serializeLessonFile(opts: {
  exportName: string;
  lesson: Record<string, unknown>;
  headerComment: string;
}): string {
  const { exportName, lesson, headerComment } = opts;
  return `import type { DayLesson } from '@/lib/curriculum/lesson-types';

${headerComment}
export const ${exportName}: DayLesson = ${serializeValue(lesson, 0)};
`;
}
