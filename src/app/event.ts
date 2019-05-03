import { Location } from './location';
import { EventOrganizer } from './eventOrganizer';
import { EventOccurence } from './eventOccurence';
import { Injectable } from '@angular/core';
import { Adapter } from './adapter';
import { strictEqual } from 'assert';

export class Event {
    constructor(public id:number, public title: string, public description: string,
         public firstdate: Date, public lastdate: Date, public date:EventOccurence[], public location: Location,
         public categories: any, public organizer: EventOrganizer, public datumstring: string) {
    }

    //ToDo: Carfule with timezones they are shown in the log with the central european timezone so one our less
    public getRepeatingOccurencesDates():EventOccurence[] {
        let occurences = [];
        for (let item of this.date){
            let nextOccurence = item;
            while (nextOccurence.dFrom.valueOf() <= this.lastdate.valueOf()) {
                occurences.push(nextOccurence);
                let dFromNext = new Date(nextOccurence.dFrom)
                let dToNext = new Date(nextOccurence.dTo)
                nextOccurence = new EventOccurence(
                    new Date (dFromNext.setDate(dFromNext.getDate() + 7)), new Date (dToNext.setDate(dToNext.getDate() + 7))
                );
            }
        }

        return occurences;
    }

    public isEventInTimeRange(startDate:Date, endDate:Date):boolean {
        let firstDateCopy = new Date (new Date(this.firstdate).setHours(0, 0, 0, 0));
        let lastDateCopy = new Date (new Date(this.lastdate).setHours(0, 0, 0, 0));
        startDate ? startDate.setHours(0, 0, 0, 0) : false;
        endDate ? endDate.setHours(0, 0, 0, 0): false;

        return (startDate ? firstDateCopy >= startDate|| lastDateCopy >= startDate : true) && 
            (endDate ? firstDateCopy <= endDate: true)
    }
}

@Injectable({
    providedIn: 'root'
})
export class EventAdapter implements Adapter<Event>{
    adapt(item: any): Event {
        var occurences = [];
        if (Array.isArray(item.date)) {
            for (let dateItem of item.date){
                occurences.push(new EventOccurence(new Date(dateItem['@dFrom'] + '+01:00'), new Date(dateItem['@dTo'] + '+01:00')));
            }
        }
        else {
            occurences.push(new EventOccurence(new Date(item.date['@dFrom'] + '+01:00'), new Date(item.date['@dTo'] + '+01:00')));
        }

        return new Event(
            item.id,
            item.title ? item.title : '',
            item.description,
            new Date(item.firstdate),
            new Date(item.lastdate),
            occurences,
            item.location,
            item.categories,
            item.organizer,
            item.datumstring
        );
    }

}