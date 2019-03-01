import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ModuleWithComponentFactories } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Event } from '../event';
import { Organizer } from '../organizer';
import { Category } from '../category';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

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
  nextDays: number[] = [3,4,5,6,7]
  categoriesFormControl = new FormControl();
  value: string;

  private filterEvents:Event[];

  private filtertext:string;

  constructor() {

  }

  ngOnInit() {
    if (this.categoriesFormControl) {
      this.categoriesFormControl.valueChanges.subscribe(value => {this.categories_changed(value);});
    }

    if (this.nextDaysFormControl) {
      this.nextDaysFormControl.valueChanges.subscribe(value => {this.onNextDays(value)});
    }

    if (this.organizerFormControl) {
      this.organizerFormControl.valueChanges.subscribe(value => this.organizerChanged(value))
    }
  }

  clearOrganizer(){
    this.organizerFormControl.setValue('');
  }

  organizerChanged(value:string) {
    this.filterEvents = this.events.filter(
        event => event.organizer['#text'].search(value) >= 0
      );
    this.setEventOptions();
  }

  private setEventOptions() {
    this.eventOptions = this.eventFormControl.valueChanges.pipe(
      startWith(''),
      map(value => this.get_event_options(value))
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['organizers']) {
      this.organizerOptions = this.organizerFormControl.valueChanges.pipe(
        startWith(''),
        map(value => this.get_organizer_options(value))
      );
    }
    
    if (changes['events']){
      this.filterEvents = this.events;
      this.setEventOptions();
    }

    this.onFilter();
  }

  private get_organizer_options(value: string): Organizer[] {
    if (this.organizers) {
      return this.organizers.filter(
        organizer => value ? organizer.name.toLowerCase().indexOf(value.toLowerCase()) === 0 : true
      );
    }
    return [];
  }

  private get_event_options(value: string): Event[] {
    if (this.filterEvents){
      return this.filterEvents.filter(
        event => 
          (event.title.toLowerCase().indexOf(value.toLowerCase()) === 0)
      );
    }
    return [];
  }

  private categories_changed(value: SimpleChanges) {
    //this.filterChanged.emit(this.filter);
  }

  onFilter() {
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
}
