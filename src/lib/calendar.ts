import ICAL from 'ical.js';

export interface CalendarEvent {
    uid: string;
    title: string;
    start: string; // ISO string
    end: string; // ISO string
    description?: string;
    location?: string;
    url?: string;
}

export function parseICS(icsContent: string): CalendarEvent[] {
    try {
        const jcalData = ICAL.parse(icsContent);
        const comp = new ICAL.Component(jcalData);
        const vevents = comp.getAllSubcomponents('vevent');

        return vevents.map((vevent) => {
            const event = new ICAL.Event(vevent);
            return {
                uid: event.uid,
                title: event.summary,
                start: event.startDate.toString(),
                end: event.endDate.toString(),
                description: event.description,
                location: event.location,
                // @ts-ignore - ical.js types might be incomplete
                url: vevent.getFirstPropertyValue('url'),
            };
        });
    } catch (e) {
        console.error("Failed to parse ICS", e);
        return [];
    }
}

export async function fetchCalendar(url: string): Promise<string> {
    // Use our own proxy to avoid CORS
    const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`;
    const res = await fetch(proxyUrl);
    if (!res.ok) throw new Error("Failed to fetch calendar");
    return res.text();
}
