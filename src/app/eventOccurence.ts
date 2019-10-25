import { formatDate } from '@angular/common';
import { UtilsService } from './utils.service';

export class EventOccurence {
    constructor(public dFrom:Date, public dTo:Date){
    }

    public getString() {
        // let dateString = '';
        // if (this.isToday(this.dFrom)) {
        //   dateString = 'Heute'
        // }
        // else if (this.isTomorrow(this.dFrom)) {
        //   dateString = 'Morgen'
        // }
        // else {
        //   dateString = formatDate(this.dFrom, 'EEE dd MMM yyyy', 'deAT');
        // }
        return UtilsService.getDateFormated(this.dFrom) + ' - '+ formatDate(this.dTo, 'HH:mm', 'deAT');
   
    }
    
    private isToday(date: Date): Boolean {
        var today = new Date();
        return (new Date(date)).setHours(0,0,0,0) == today.setHours(0, 0, 0, 0)
    }
    
    private isTomorrow(date: Date): Boolean {
        var today = new Date();
        return (new Date(date)).setHours(0,0,0,0) == new Date(today.setDate(today.getDate() + 1)).setHours(0, 0, 0, 0)
    }
}