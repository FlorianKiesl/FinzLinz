import { Component, OnInit, Output, EventEmitter, OnChanges, SimpleChanges, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Organizer } from '../organizer';
import { Event } from '../event';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-eventsfilter',
  templateUrl: './eventsfilter.component.html',
  styleUrls: ['./eventsfilter.component.scss']
})
export class EventsfilterComponent implements OnInit, OnChanges {
  @Input() organizers: Organizer[];
  @Input() events: Event[];
  @Output() filterChanged = new EventEmitter<Map<String, any>>();

  filter: Map<String, any> = new Map();
  filteredEvents: Observable<Event[]>;
  title = new FormControl();
  dateStart = new FormControl(new Date());
  dateEnd = new FormControl(new Date());
  categoriesFormControl = new FormControl();
  categories: string[] = ['Sport', 'Freizeit/Unterhaltung', 'Bühne/Musik/Literatur', 'Festivals', 'Ausstellungen'];
  organizerFormControl = new FormControl();
  filteredOrganizers: Observable<Organizer[]>;

  constructor() {

  }

  ngOnInit() {
    console.log(this.categoriesFormControl);
    if (this.categoriesFormControl) {
      this.categoriesFormControl.valueChanges.subscribe(value => {this.categories_changed(value);});
    }

    /*if (this.title){
      this.title.valueChanges.subscribe(value => {this.onTitleChange(value);});
    }*/
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    if(changes['organizers']) {
      this.filteredOrganizers = this.organizerFormControl.valueChanges.pipe(
        startWith(''),
        map(value => this._organizer_filtered(value))
      );  
    }
    
    if (changes['events']){
      this.filteredEvents = this.title.valueChanges.pipe(
        startWith(''),
        map(value => this._events_filtered(value))
      );
    }
  }

  private _organizer_filtered(value: string): Organizer[] {
    if (this.organizers) {
      return this.organizers.filter(
        organizer => organizer.name.toLowerCase().indexOf(value.toLowerCase()) === 0 
      );
    }
    return [];
  }

  private _events_filtered(value: string): Event[] {
    if (this.events){
      return this.events.filter(
        event => event.title.toLowerCase().indexOf(value.toLowerCase()) === 0
      );
    }
    return [];
  }

  categories_changed(value: SimpleChanges) {
    this.filter.set("category", value)
    this.filterChanged.emit(this.filter);
  }

  onTitleChange(value: SimpleChanges){
    this.filter.set("title", value);
    this.filterChanged.emit(this.filter);
  }
}
