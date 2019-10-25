import { Location } from './location';
import { EventOrganizer } from './eventOrganizer';
import { EventOccurence } from './eventOccurence';
import { Injectable } from '@angular/core';
import { Adapter } from './adapter';
import { Link } from './link';

export class Event {

    constructor(public id:number, public title: string, public description: string,
         public firstdate: Date, public lastdate: Date, public date:EventOccurence[], public location: Location,
         public categories: any, public organizer: EventOrganizer, public datumstring: string, public rating:number, 
         public ratingCount:number, public links:Link[]) {
            this.date = this.getRepeatingOccurencesDates();
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
        let eventOccurenceItem = this.getNextEventDateBetween(startDate, endDate);
        return eventOccurenceItem ? true: false;
    }

    public getNextEventDate():EventOccurence{
        console.log(this)
        //return this.date.find((eventOccurence) => eventOccurence.dTo.valueOf() >= Date.now())
        return this.getNextEventDateBetween(new Date(Date.now()), undefined)
    }

    public getNextEventDateBetween(dateFrom: Date, dateTo: Date):EventOccurence {
        let eDate;
        let sDate;
        
        if (!dateFrom && !dateTo) {
            return this.date[0];
        }

        else if (dateFrom && !dateTo) {
            sDate = new Date (new Date(dateFrom).setHours(0, 0, 0, 0));
            eDate = new Date (new Date(dateFrom).setHours(24, 0, 0, 0));
        }
        else if (!dateFrom && dateTo) {
            sDate = new Date (new Date(dateTo).setHours(0, 0, 0, 0));
            eDate = new Date (new Date(dateTo).setHours(24, 0, 0, 0));
        }
        else {
            sDate = new Date (new Date(dateFrom).setHours(0, 0, 0, 0));
            eDate = new Date (new Date(dateTo).setHours(24, 0, 0, 0));
        }
        
        return this.date.find(
            (eventOccurrence) => 
            (eventOccurrence.dTo.valueOf() >= sDate.valueOf()) && (eventOccurrence.dTo.valueOf() <= eDate.valueOf()));
    }

    public getNextEventDateBetweenString(dateFrom: Date, dateTo: Date){
        let eventOccurence = this.getNextEventDateBetween(dateFrom, dateTo);
        if (!eventOccurence) {
          return 'keine Veranstaltung in ausgewählten Zeitraum gefunden';
        }

        return eventOccurence.getString();
    }
}

@Injectable({
    providedIn: 'root'
})
export class EventAdapter implements Adapter<Event>{
    adapt(item: any): Event {
        var occurences = [];
        var links = []
        if (Array.isArray(item.date)) {
            for (let dateItem of item.date){
                occurences.push(new EventOccurence(new Date(dateItem['@dFrom']), new Date(dateItem['@dTo'])));
            }
        }
        else {
            occurences.push(new EventOccurence(new Date(item.date['@dFrom']), new Date(item.date['@dTo'])));
        }

        if (!Array.isArray(item.links.link)){
            links.push(new Link(item.links.link.url, item.links.link.info))
        }
        else {
            links = item.links.link
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
            item.datumstring,
            item.rating ? item.rating : 0,
            item.ratingCount ? item.ratingCount : 0,
            links
        );
    }

}