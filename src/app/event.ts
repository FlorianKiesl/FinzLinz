import { Location } from './location';

export class Event {
    id: number;
    title: string;
    description: string;
    "firstdate": Date;
    "lastdate": Date;
    location: Location;
    categories: any;
    organizer: any;
}