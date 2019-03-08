import { Location } from './location';
import { EventOrganizer } from './eventOrganizer';

export class Event {
    constructor(public id:number, public title: string, public description: string,
         public firstdate: Date, public lastdate: Date, public location: Location,
         public categories: any, public organizer: EventOrganizer) {
    }
}