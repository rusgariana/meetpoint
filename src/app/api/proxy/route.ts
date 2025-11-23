import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get('url');

    if (!url) {
        return NextResponse.json({ error: 'Missing URL' }, { status: 400 });
    }

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
        const text = await res.text();
        return new NextResponse(text, {
            headers: { 'Content-Type': 'text/calendar' },
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch calendar' }, { status: 500 });
    }
}
