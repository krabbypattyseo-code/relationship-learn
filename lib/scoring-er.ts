import Anthropic from '@anthropic-ai/sdk';
import { computeERComposite } from '@/lib/scoring';
import type { ChatEntry, ERScore, ERScoreRaw, UserId } from '@/types';

export async function generateERScore(
  userId: UserId,
  entries: ChatEntry[]
): Promise<ERScore> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('Anthropic API key not configured');
  }

  const entrySummary = entries.map((e) => ({
    mode: e.mode,
    date: e.created_at,
    preview:
      e.messages.filter((m) => m.role === 'user').slice(-1)[0]?.content?.slice(0, 300) ??
      '',
  }));

  const prompt = `Kamu adalah sistem scoring psikologi untuk ${userId}.
Berdasarkan entri journaling berikut dari 7 hari terakhir:

${JSON.stringify(entrySummary, null, 2)}

Berikan score 0-100 untuk 4 dimensi Emotion Regulation (Goleman):

1. SELF_AWARENESS — seberapa sadar user tentang kondisi emosionalnya sendiri.
   Sinyal positif: /reflect entries yang introspektif, menyebut perasaan spesifik.
   Sinyal negatif: tidak ada refleksi, atau hanya deskriptif tanpa insight.

2. SELF_REGULATION — seberapa baik user mengelola respons emosionalnya.
   Sinyal positif: setelah /analisis ada /plan atau /reflect yang konstruktif.
   Sinyal negatif: /analisis berulang tentang hal yang sama tanpa resolusi.

3. EMPATHY — seberapa banyak user mempertimbangkan perspektif pasangan.
   Sinyal positif: entri yang menyebut pasangan atau love language lens.
   Sinyal negatif: entri yang sangat self-focused tanpa considering pasangan.

4. SOCIAL_SKILL — kualitas planning komunikasi dan hubungan.
   Sinyal positif: /conversation dan /plan yang thoughtful.
   Sinyal negatif: tidak ada intentional communication planning.

Respond ONLY dengan JSON berikut, tanpa preamble atau penjelasan:
{
  "self_awareness": <0-100>,
  "self_regulation": <0-100>,
  "empathy": <0-100>,
  "social_skill": <0-100>,
  "rationale": "<1-2 kalimat summary kenapa score ini>"
}`;

  const anthropic = new Anthropic({ apiKey });
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 300,
    messages: [{ role: 'user', content: prompt }],
  });

  const block = response.content[0];
  if (block.type !== 'text') {
    throw new Error('Unexpected response from Claude');
  }

  const clean = block.text.replace(/```json|```/g, '').trim();
  const data = JSON.parse(clean) as ERScoreRaw;
  return { ...data, composite: computeERComposite(data) };
}
