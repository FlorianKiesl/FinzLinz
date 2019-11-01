import { Component, OnInit, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-datefilter',
  templateUrl: './datefilter.component.html',
  styleUrls: ['./datefilter.component.scss']
})
export class DatefilterComponent implements OnInit {
  @Input() minDate:Date;
  @Input() maxDate:Date;

  // @Output() dateStartFormControl:FormControl;
  // @Output() dateEndFormControl:FormControl;

  dateStart = new FormControl(new Date());
  dateEnd = new FormControl(new Date());

  constructor() { }

  ngOnInit() {
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
  
}
