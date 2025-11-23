import { NextRequest, NextResponse } from 'next/server';

// In-memory store (will reset on server restart)
// In production, use Redis or a database.
const sessions: Record<string, any> = {};

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { action, sessionId, payload } = body;

    if (action === 'create') {
        const newSessionId = Math.random().toString(36).substring(2, 8).toUpperCase();
        sessions[newSessionId] = {
            id: newSessionId,
            created: Date.now(),
            messages: [],
        };
        return NextResponse.json({ sessionId: newSessionId });
    }

    if (action === 'join') {
        if (!sessions[sessionId]) {
            return NextResponse.json({ error: 'Session not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true });
    }

    if (action === 'send') {
        if (!sessions[sessionId]) {
            return NextResponse.json({ error: 'Session not found' }, { status: 404 });
        }
        sessions[sessionId].messages.push(payload);
        return NextResponse.json({ success: true });
    }

    if (action === 'poll') {
        if (!sessions[sessionId]) {
            return NextResponse.json({ error: 'Session not found' }, { status: 404 });
        }
        // Return all messages for now. Client filters what it has seen.
        return NextResponse.json({ messages: sessions[sessionId].messages });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
