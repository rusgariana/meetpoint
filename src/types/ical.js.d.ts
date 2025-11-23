declare module 'ical.js' {
    export function parse(input: string): any;
    export class Component {
        constructor(jcal: any);
        getAllSubcomponents(name: string): Component[];
        getFirstPropertyValue(name: string): any;
    }
    export class Event {
        constructor(component: Component | any);
        uid: string;
        summary: string;
        startDate: { toString: () => string };
        endDate: { toString: () => string };
        description: string;
        location: string;
    }
}
