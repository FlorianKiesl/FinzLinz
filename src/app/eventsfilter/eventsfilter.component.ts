import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-eventsfilter',
  templateUrl: './eventsfilter.component.html',
  styleUrls: ['./eventsfilter.component.scss']
})
export class EventsfilterComponent implements OnInit {
  date = new FormControl(new Date());
  categoriesFormControl = new FormControl();
  categories: string[] = ['Sport', 'Freizeit/Unterhaltung', 'Bühne/Musik/Literatur', 'Festivals', 'Ausstellungen'];

  constructor() { }

  ngOnInit() {
  }

}
