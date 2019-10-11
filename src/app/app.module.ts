import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { 
  MatButtonModule, MatCardModule, MatTabsModule, MatMenuModule, MatToolbarModule, 
  MatIconModule, MatSidenavModule, MatListModule, MatExpansionModule, MatFormFieldModule, 
  MatDatepickerModule, MatNativeDateModule, MatInputModule, MatSelectModule, MatAutocompleteModule, 
  MatOptionModule, MatDividerModule, MatGridListModule, MatDialogModule, MatRippleModule, MatDialog 
} from '@angular/material';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EventsComponent } from './events/events.component';
import { MapComponent } from './map/map.component';
import { EventsfilterComponent } from './eventsfilter/eventsfilter.component';
import { registerLocaleData } from '@angular/common';
import localeDEAT from '@angular/common/locales/de-AT';
import localeDEATExtra from '@angular/common/locales/extra/de-AT';
import { EventdetailsComponent } from './eventdetails/eventdetails.component';
import { RouterModule, Routes } from '@angular/router';
import { map } from 'leaflet';
import { Event } from './event';
import { EventcommentsComponent } from './eventcomments/eventcomments.component';
import { EventpersonalcommentComponent } from './eventpersonalcomment/eventpersonalcomment.component';
import { StarratingComponent } from './starrating/starrating.component';
import { EventdescriptionComponent } from './eventdescription/eventdescription.component';

registerLocaleData(localeDEAT, 'deAT', localeDEATExtra);

@NgModule({
  declarations: [
    AppComponent,
    EventsComponent,
    MapComponent,
    EventsfilterComponent,
    EventdetailsComponent,
    EventcommentsComponent,
    EventpersonalcommentComponent,
    StarratingComponent,
    EventdescriptionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(
      [
        { path: '', component:EventsComponent },
        { path: 'map', component: MapComponent },
        { path: 'list', component: EventsComponent } 
      ],
      { enableTracing: true }
    ),
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatMenuModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatTabsModule,
    MatGridListModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatInputModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatDividerModule,
    MatRippleModule,
    LeafletModule.forRoot()
  ],
  //providers: [{provide: LOCALE_ID, useValue: 'deAT'}], ToDo: causes invalid language tag: deAT error => investigate why
  bootstrap: [AppComponent],
  entryComponents: [
    EventdetailsComponent
  ]
})
export class AppModule { 

}
