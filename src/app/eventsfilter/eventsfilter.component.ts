import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ModuleWithComponentFactories, ViewChild } from '@angular/core';
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
  @Output() filterChanged = new EventEmitter<Map<String, any>>();

  filter: Map<String, any> = new Map();
  organizerFormControl = new FormControl();
  organizerOptions: Observable<Organizer[]>;
  eventFormControl = new FormControl();
  eventOptions: Observable<Event[]>;
  dateStart = new FormControl(this.get_begin_of_day(new Date()));
  dateEnd = new FormControl(this.get_end_of_day(new Date()));
  nextDaysFormControl = new FormControl();
  nextDays: number[] = [2,3,4,5,6,7]
  categoriesFormControl = new FormControl();
  value: string;

  private filteredEvents:Event[];
  private filteredOrganizers:Organizer[];
  private filteredCategories:Category[];
  private minDate:Date;
  private maxDate:Date;
  private filtertext:string;

  constructor() {

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

  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['organizers']) {
      this.filteredOrganizers = this.events ? this.filterOrganizersByEvents(this.organizers, this.events) : this.organizers;
      
      this.setOrganizerOptions('');
    }
    
    if (changes['events']){
      this.filteredEvents = this.events;
      this.filteredOrganizers = this.organizers ? this.filterOrganizersByEvents(this.organizers, this.events) : undefined;
      this.filteredCategories = this.categories ? this.filterCategoriesByEvents(this.categories, this.events) : undefined;
      this.setEventOptions('');
    }

    if (changes['categories']) {
      this.filteredCategories = this.events ? this.filterCategoriesByEvents(this.categories, this.events) : this.categories;
    }

    this.onFilter();
  }

  organizerChanged(value:string) {
    //Events
    this.filteredEvents = this.filterEventsByOrganizer(this.events, value);
    this.filteredEvents = this.filterEventsByCategories(this.filteredEvents, this.categoriesFormControl.value);

    //Categories
    var eventList = this.filterEventsByOrganizer(this.events, value);
    eventList = this.filterEventsByTitle(eventList, this.eventFormControl.value)
    this.filteredCategories = this.filterCategoriesByEvents(this.categories, eventList);
    //Todo filter dates according to filteredEvents
    
    //Set Dates according to filteredEvents
    this.setEventOptions(this.getEventFilterValue());
  }

  eventChanged(value:string) {
    //Organizers
    var eventList = this.filterEventsByTitle(this.events, value);
    eventList = this.filterEventsByCategories(eventList, this.categoriesFormControl.value)
    this.filteredOrganizers = this.filterOrganizersByEvents(this.organizers, eventList)

    //Categories
    eventList = this.filterEventsByTitle(this.events, value);
    eventList = this.filterEventsByOrganizer(eventList, this.organizerFormControl.value)
    this.filteredCategories = this.filterCategoriesByEvents(this.categories, eventList);


    //ToDo:Filter eventlist according to date
    

    //Set Dates according to Eventlist
    
    this.setOrganizerOptions(this.getOrganizerFilterValue());
  }

  private categoriesChanged(value: any) {
    //Organizer
    var eventList = this.filterEventsByTitle(this.events, this.eventFormControl.value);
    eventList = this.filterEventsByCategories(this.events, value);
    this.filteredOrganizers = this.filterOrganizersByEvents(this.organizers, eventList);

    //Events
    this.filteredEvents = this.filterEventsByCategories(this.events, value);
    this.filteredEvents = this.filterEventsByOrganizer(this.filteredEvents, this.organizerFormControl.value);
    //ToDo:Filter eventlist according to date

    //Set Dates according to Eventlist

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
    if (this.filteredOrganizers) {
      return this.filteredOrganizers.filter(
        organizer => value ? organizer.name.toLowerCase().includes(value.toLowerCase()): true
      );
    }
    return [];
  }

  private get_event_options(value: string): Event[] {
    if (this.filteredEvents){
      return this.filteredEvents.filter(
        event => 
          (event.title.toLowerCase().includes(value.toLowerCase()))
      );
    }
    return [];
  }

  public onFilter() {
    this.filter.set('organizerTxt', this.organizerFormControl.value);
    this.filter.set('event', this.eventFormControl.value)
    this.categoriesFormControl.value == null || this.categoriesFormControl.value.length == 0 ? 
      this.filter.set('categories', null): 
      this.filter.set('categories', this.categoriesFormControl.value);

    this.filter.set('startDate', this.dateStart.value);
    this.filter.set('endDate', this.dateEnd.value)

    this.filtertext = 'Filter: [Filtertext]'
    this.filterChanged.emit(this.filter);
  }

  onToday() {
    this.dateStart.setValue(this.get_begin_of_day(new Date()));
    this.dateEnd.setValue(this.get_end_of_day(new Date()));
  }

  onTomorrow() {
    var today = this.get_begin_of_day(new Date());
    var tomorrow = new Date(today.setDate(today.getDate() + 1))
    this.dateStart.setValue(tomorrow);
    this.dateEnd.setValue(this.get_end_of_day(tomorrow));
  }

  onNextDays(value: number) {
    if (value) {
      var today = this.get_begin_of_day(new Date());
      var nextDays = new Date(today.setDate(today.getDate() + value));
      this.dateStart.setValue(nextDays);
      this.dateEnd.setValue(this.get_end_of_day(nextDays));  
    }
  }

  private get_begin_of_day(date: Date): Date {
    return new Date(new Date().setHours(0, 0, 0, 0));
  }

  private get_end_of_day(date: Date): Date {
    return new Date(date.setHours(23, 59, 59, 999));
  }

  private clearCategories(select:MatSelect) {
    this.categoriesFormControl.setValue(undefined);
    // select.close();
  }

  private filterEvents():void {
    this.filteredEvents = this.events;

    if (this.eventFormControl.value) {
      this.filteredEvents =  this.filteredEvents.filter(
        event => event.title.includes(this.eventFormControl.value)
      )
    }

    if (this.organizerFormControl.value) {
      this.filteredEvents =  this.filteredEvents.filter(event =>
          (event.organizer && event.organizer['#text'] ? event.organizer['#text'].includes(this.organizerFormControl.value): false)
      )
    }

    if (this.categoriesFormControl.value && this.categoriesFormControl.value.length > 0) {
      this.filteredEvents =  this.filteredEvents.filter(event =>
        (event.categories ? 
          this.categoriesFormControl.value.findIndex(category => 
            Array.isArray(event.categories.category) ? 
            event.categories.category.findIndex(item => item.id == category.id) >= 0 :
            event.categories.category.id == category.id) >= 0
          : false)
      )
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
