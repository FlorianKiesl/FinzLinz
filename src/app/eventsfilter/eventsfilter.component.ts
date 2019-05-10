import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Event } from '../event';
import { Organizer } from '../organizer';
import { Category } from '../category';
import { MatSelect } from '@angular/material';

@Component({
  selector: 'app-eventsfilter',
  templateUrl: './eventsfilter.component.html',
  styleUrls: ['./eventsfilter.component.scss']
})
export class EventsfilterComponent implements OnInit, OnChanges {
  @Input() organizers: Organizer[];
  @Input() events: Event[];
  @Input() categories: Category[];
  @Output() filterChanged = new EventEmitter<Event[]>();

  organizerFormControl = new FormControl();
  organizerOptions: Observable<Organizer[]>;
  eventFormControl = new FormControl();
  eventOptions: Observable<Event[]>;
  dateStart = new FormControl(new Date());
  dateEnd = new FormControl(new Date());
  nextDaysFormControl = new FormControl();
  nextDays: number[] = [2,3,4,5,6,7]
  categoriesFormControl = new FormControl();
  value: string;

  private filteredEventOptions:Event[];
  private filteredOrganizerOptions:Organizer[];
  public filteredCategories:Category[];
  public minDate:Date;
  public maxDate:Date;
  public filtertext:string;

  constructor() {

  }

  private onFilter() {
    let filteredEvents = this.filterEventsByTitle(this.filteredEventOptions.copyWithin(-1, -1), this.eventFormControl.value)
    this.filterChanged.emit(filteredEvents);
  }

  private onReset() {
    this.eventFormControl.setValue('');
    this.organizerFormControl.setValue('');
    this.clearCategories(undefined);
    this.dateStart.setValue(undefined);
    this.dateEnd.setValue(undefined);
  }

  private clearCategories(select:MatSelect) {
    this.categoriesFormControl.setValue(undefined);
    //select ? select.close() : "";
  }

  //ToDo: Make filterfunctions more abstract so they can be used similar as in app.component. and use lowercase everywhere
  ngOnInit() {
    if (this.categoriesFormControl) {
      this.categoriesFormControl.valueChanges.subscribe(value => {this.categoriesChanged(value);});
    }

    if (this.nextDaysFormControl) {
      this.nextDaysFormControl.valueChanges.subscribe(value => {this.onNextDays(value)});
    }

    if (this.organizerFormControl) {
      this.organizerFormControl.valueChanges.subscribe(value => this.organizerChanged(value))
    }

    if (this.eventFormControl) {
      this.eventFormControl.valueChanges.subscribe(value => this.eventChanged(value));
    }

    if (this.dateStart) {
      this.dateStart.valueChanges.subscribe(value => this.startDateChanged(value));
    }

    if (this.dateEnd) {
      this.dateEnd.valueChanges.subscribe(value => this.endDateChanged(value));
    }

  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['organizers']) {
      this.filteredOrganizerOptions = this.events ? this.filterOrganizersByEvents(this.organizers, this.events) : this.organizers;
      this.setOrganizerOptions('');
    }
    
    if (changes['events']){
      this.filteredEventOptions = this.events;
      this.filteredOrganizerOptions = this.organizers ? this.filterOrganizersByEvents(this.organizers, this.events) : undefined;
      this.filteredCategories = this.categories ? this.filterCategoriesByEvents(this.categories, this.events) : undefined;
      this.setEventOptions('');
    }

    if (changes['categories']) {
      this.filteredCategories = this.events ? this.filterCategoriesByEvents(this.categories, this.events) : this.categories;
    }
  }

  
  private organizerChanged(value:string) {
    //Events
    this.filteredEventOptions = this.filterEventsByOrganizer(this.events, value);
    this.filteredEventOptions = this.filterEventsByCategories(this.filteredEventOptions, this.categoriesFormControl.value);
    this.filteredEventOptions = this.filterEventsByDates(this.filteredEventOptions, this.dateStart.value, this.dateEnd.value);

    //Categories
    var eventList = this.filterEventsByOrganizer(this.events, value);
    eventList = this.filterEventsByTitle(eventList, this.eventFormControl.value);
    eventList = this.filterEventsByDates(eventList, this.dateStart.value, this.dateEnd.value);
    this.filteredCategories = this.filterCategoriesByEvents(this.categories, eventList);

    //Dates
    eventList = this.filterEventsByOrganizer(this.events, value);
    eventList = this.filterEventsByTitle(eventList, this.eventFormControl.value);
    eventList = this.filterEventsByCategories(eventList, this.categoriesFormControl.value);
    this.maxDate = new Date(Math.max.apply(null, eventList.map(event => event.lastdate)));
    this.minDate = new Date(Math.min.apply(null, eventList.map(event => event.firstdate)));
    
    this.setEventOptions(this.getEventFilterValue());
  }

  eventChanged(value:string) {
    //Organizers
    var eventList = this.filterEventsByTitle(this.events, value);
    eventList = this.filterEventsByCategories(eventList, this.categoriesFormControl.value);
    eventList = this.filterEventsByDates(eventList, this.dateStart.value, this.dateEnd.value);
    this.filteredOrganizerOptions = this.filterOrganizersByEvents(this.organizers, eventList)

    //Categories
    eventList = this.filterEventsByTitle(this.events, value);
    eventList = this.filterEventsByOrganizer(eventList, this.organizerFormControl.value);
    eventList = this.filterEventsByDates(eventList, this.dateStart.value, this.dateEnd.value);
    this.filteredCategories = this.filterCategoriesByEvents(this.categories, eventList);

    //Dates
    eventList = this.filterEventsByTitle(this.events, value);
    eventList = this.filterEventsByCategories(eventList, this.categoriesFormControl.value);
    eventList = this.filterEventsByOrganizer(eventList, this.organizerFormControl.value);
    this.maxDate = new Date(Math.max.apply(null, eventList.map(event => event.lastdate)));
    this.minDate = new Date(Math.min.apply(null, eventList.map(event => event.firstdate)));

    this.setOrganizerOptions(this.getOrganizerFilterValue());
  }

  private categoriesChanged(value: any) {
    //Organizer
    var eventList = this.filterEventsByTitle(this.events, this.eventFormControl.value);
    eventList = this.filterEventsByCategories(eventList, value);
    eventList = this.filterEventsByDates(eventList, this.dateStart.value, this.dateEnd.value);
    this.filteredOrganizerOptions = this.filterOrganizersByEvents(this.organizers, eventList);

    //Events
    this.filteredEventOptions = this.filterEventsByCategories(this.events, value);
    this.filteredEventOptions = this.filterEventsByOrganizer(this.filteredEventOptions, this.organizerFormControl.value);
    this.filteredEventOptions = this.filterEventsByDates(this.filteredEventOptions, this.dateStart.value, this.dateEnd.value);

    //Dates
    eventList = this.filterEventsByCategories(this.events, value);
    eventList = this.filterEventsByTitle(eventList, this.eventFormControl.value);
    eventList = this.filterEventsByOrganizer(eventList, this.organizerFormControl.value);
    this.maxDate = new Date(Math.max.apply(null, eventList.map(event => event.lastdate)));
    this.minDate = new Date(Math.min.apply(null, eventList.map(event => event.firstdate)));

    this.setEventOptions(this.getEventFilterValue());
    this.setOrganizerOptions(this.getOrganizerFilterValue());
  }

  private startDateChanged(value:any) {
    this.dateChanged(value, this.filterEventsByDates(this.events, value, this.dateEnd.value));
  }

  private endDateChanged(value:any) {
    this.dateChanged(value, this.filterEventsByDates(this.events, this.dateStart.value, value));
  }

  private dateChanged(value: any, baseEventList:Event[]) {
    
    var eventList = this.filterEventsByCategories(baseEventList, this.categoriesFormControl.value);
    eventList = this.filterEventsByTitle(eventList, this.eventFormControl.value);
    this.filteredOrganizerOptions = this.filterOrganizersByEvents(this.organizers, eventList);

    eventList = this.filterEventsByTitle(baseEventList, this.eventFormControl.value);
    eventList = this.filterEventsByOrganizer(eventList, this.organizerFormControl.value);
    this.filteredCategories = this.filterCategoriesByEvents(this.categories, eventList);

    this.filteredEventOptions = this.filterEventsByCategories(baseEventList, this.categoriesFormControl.value);
    this.filteredEventOptions = this.filterEventsByOrganizer(this.filteredEventOptions, this.organizerFormControl.value);
    
    this.setEventOptions(this.getEventFilterValue());
    this.setOrganizerOptions(this.getOrganizerFilterValue());
  }

  private setEventOptions(start:string) {
    this.eventOptions = this.eventFormControl.valueChanges.pipe(
      startWith(start),
      map(value => this.get_event_options(value))
    );
  }

  private setOrganizerOptions(start:string) {
    this.organizerOptions = this.organizerFormControl.valueChanges.pipe(
      startWith(start),
      map(value => this.get_organizer_options(value))
    );
  }

  private get_organizer_options(value: string): Organizer[] {
    if (this.filteredOrganizerOptions) {
      return this.filteredOrganizerOptions.filter(
        organizer => value ? organizer.name.toLowerCase().includes(value.toLowerCase()): true
      );
    }
    return [];
  }

  private get_event_options(value: string): Event[] {
    if (this.filteredEventOptions){
      return this.filteredEventOptions.filter(
        event => 
          (event.title.toLowerCase().includes(value.toLowerCase()))
      );
    }
    return [];
  }

  onToday() {
    this.dateStart.setValue(new Date());
    this.dateEnd.setValue(new Date());
  }

  onTomorrow() {
    var today = new Date();
    var tomorrow = new Date(today.setDate(today.getDate() + 1))
    this.dateStart.setValue(tomorrow);
    this.dateEnd.setValue(tomorrow);
  }

  onNextDays(value: number) {
    if (value) {
      var today = new Date();
      var nextDays = new Date(today.setDate(today.getDate() + value));
      this.dateStart.setValue(nextDays);
      this.dateEnd.setValue(nextDays);  
    }
  }

  private filterEventsByTitle(events:Event[], titleStr:string):Event[]{
    return titleStr ? events.filter(event => event.title.toLowerCase().includes(titleStr.toLowerCase())) : events
  }

  private filterEventsByCategories(events:Event[], categories:Category[]):Event[]{
    return categories && categories.length > 0 ? events.filter(event =>
      (event.categories ? 
        categories.findIndex(category => 
          Array.isArray(event.categories.category) ? 
          event.categories.category.findIndex(item => item.id == category.id) >= 0 :
          event.categories.category.id == category.id) >= 0
        : false)
    ) : events;
  }

  private filterEventsByOrganizer(events:Event[], organizerName:string):Event[] {
    return organizerName ? events.filter(event =>
      (event.organizer && event.organizer['#text'] ? event.organizer['#text'].toLowerCase().includes(organizerName.toLowerCase()): false)
      ) : events
  }

  private filterEventsByDates(events:Event[], startDate:Date, endDate:Date):Event[] {
    return startDate ? events.filter(
      event => event.isEventInTimeRange(startDate, endDate)
    ) : events
  }

  private filterOrganizersByEvents(organizers:Organizer[], events:Event[]):Organizer[] {
    return organizers.filter(
      organizer => events.findIndex(event => event.organizer ? event.organizer.id == organizer.id : false) >= 0
    );
  }

  private filterCategoriesByEvents(categories:Category[], events:Event[]):Category[] {
    return categories.filter(category =>
      events.findIndex(event => 
        event.categories ? 
        (Array.isArray(event.categories.category) ? 
          event.categories.category.findIndex(item => item.id == category.id) >= 0 : event.categories.category.id == category.id
        ) : false
      ) >= 0
    )
  }

  private getOrganizerFilterValue():string {
    return this.organizerFormControl.value ? this.organizerFormControl.value : '';
  }

  private getEventFilterValue():string {
    return this.eventFormControl.value ? this.eventFormControl.value : '';
  }
}
