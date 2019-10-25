import { Injectable } from '@angular/core';
import { EventdetailsComponent } from './eventdetails/eventdetails.component';
import { MatDialog } from '@angular/material';
import { Event } from './event';
import { saveAs } from 'file-saver';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(private eventDetailsDialog:MatDialog){

  }

  openEventDetails(event:Event){
  const eventDetailDialogRef = this.eventDetailsDialog.open(
      EventdetailsComponent, {
      data: event,
      panelClass: "myapp-no-padding-dialog",
      width: "100%",
      height: "100%",
      maxWidth: "100%",
      maxHeight: "100%",
      }
  );
  eventDetailDialogRef.afterClosed().subscribe(result => {
      console.log("Dialog closed: ${result}");
  })
  console.log(event);
  }

  // ToDo: try to pass only needed data...like title, date, location,...
  createEventICSFile(event:Event, event_date){
    var content = 
      'BEGIN:VCALENDAR'+ '\r\n' +
      'PRODID:Calendar'+ '\n' +
      'VERSION:2.0'+ '\n' +
      'BEGIN:VEVENT'+ '\n' +
      'UID:0@default'+ '\n' +
      'CLASS:PUBLIC'+ '\n' +
      'DESCRIPTION:' + event.title + '\n' +
      'DTSTAMP;VALUE=DATE-TIME:' + formatDate(new Date(Date.now()),  'yyyyMMddTHHmmss', 'deAT') + '\n' +
      'DTSTART;VALUE=DATE-TIME:'+ formatDate(event_date.dFrom, 'yyyyMMddTHHmmss', 'deAT') + '\n' +
      'DTEND;VALUE=DATE-TIME:'+ formatDate(event_date.dTo, 'yyyyMMddTHHmmss', 'deAT') + '\n' +
      //how to get organizername? 
      'LOCATION:' + event.organizer +  '\n' +
      'TRANSP:TRANSPARENT' + '\n' +
      'END:VEVENT' + '\n' +
      'END:VCALENDAR'
    var filename = 'export.ics'

    var blob = new Blob([content], {
     type: "text/plain;charset=utf-8"
    });
    
    saveAs(blob, filename);
  }

  public static getDateFormated(date:Date): string{
    if (this.isToday(date)) {
      return 'Heute ' + formatDate(date, 'HH:mm', 'deAT')
    }
    else if (this.isTomorrow(date)) {
      return 'Morgen '  + formatDate(date, 'HH:mm', 'deAT')
    }
    else {
      //return formatDate(date, 'dd MMM yyyy', 'deAT');
      return formatDate(date, 'EEE dd MMM yyyy HH:mm', 'deAT');
    }
  }
  
  private static isToday(date: Date): Boolean {
    var today = new Date();
    return (new Date(date)).setHours(0,0,0,0) == today.setHours(0, 0, 0, 0)
  }

  private static isTomorrow(date: Date): Boolean {
      var today = new Date();
      return (new Date(date)).setHours(0,0,0,0) == new Date(today.setDate(today.getDate() + 1)).setHours(0, 0, 0, 0)
  }

}
