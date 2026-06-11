import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { getSystemPrompt } from '@/lib/prompts';
import { isValidUserId } from '@/lib/auth';
import type { Mode, Message } from '@/types';

const VALID_MODES: Mode[] = [
  'reflect',
  'analisis',
  'plan',
  'conversation',
  'growth',
];

const MODE_MAX_TOKENS: Record<Mode, number> = {
  reflect: 4096,
  analisis: 3072,
  plan: 3072,
  conversation: 3072,
  growth: 3072,
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, mode, messages } = body as {
      userId: unknown;
      mode: unknown;
      messages: Message[];
    };

    if (!isValidUserId(userId)) {
      return NextResponse.json({ error: 'Invalid userId' }, { status: 400 });
    }

    if (!VALID_MODES.includes(mode as Mode)) {
      return NextResponse.json({ error: 'Invalid mode' }, { status: 400 });
    }

    if (!Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages' }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Anthropic API key not configured' },
        { status: 500 }
      );
    }

    const anthropic = new Anthropic({ apiKey });
    const system = getSystemPrompt(userId, mode as Mode);

    const stream = anthropic.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: MODE_MAX_TOKENS[mode as Mode],
      system,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (
              chunk.type === 'content_block_delta' &&
              chunk.delta.type === 'text_delta'
            ) {
              controller.enqueue(encoder.encode(chunk.delta.text));
            }
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Anthropic API error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
