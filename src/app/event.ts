import { Location } from './location';

export class Event {
    id: number;
    title: string;
    description: string;
    "-firstdate": string;
    "-lastdate": string;
    location: Location;
}