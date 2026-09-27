import { apiPost } from './client';

export interface NovaTurn {
  role: 'nova' | 'user';
  text: string;
}

export interface NovaReplyResult {
  reply: string;
}

export interface NovaReportResult {
  overallFeedback: string;
  grammarIssues: string[];
  vocabularyNotes: string[];
}

/** Nova's next conversational line, given the full turn history so far —
 * see server/nova.ts. Full history goes in every call so Nova can respond
 * to whatever the learner actually said, including a question asked back. */
export async function fetchNovaReply(history: NovaTurn[]): Promise<NovaReplyResult> {
  return apiPost<NovaReplyResult>('/api/nova/reply', { history });
}

/** Grades a finished conversation session as a whole (grammar/vocabulary,
 * text-only — see server/nova.ts for why pronunciation isn't in v1). */
export async function fetchNovaReport(history: NovaTurn[]): Promise<NovaReportResult> {
  return apiPost<NovaReportResult>('/api/nova/report', { history });
}
