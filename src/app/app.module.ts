import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCardModule, MatTabsModule, MatMenuModule, MatToolbarModule, MatIconModule, MatSidenavModule, MatListModule, MatExpansionModule, MatFormFieldModule, MatDatepickerModule, MatNativeDateModule, MatInputModule, MatSelectModule, MatAutocomplete, MatOption, MatAutocompleteModule, MatOptionModule, DateAdapter } from '@angular/material';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EventsComponent } from './events/events.component';
import { MapComponent } from './map/map.component';
import { EventsfilterComponent } from './eventsfilter/eventsfilter.component';
import { registerLocaleData } from '@angular/common';
import localeDEAT from '@angular/common/locales/de-AT';
import localeDEATExtra from '@angular/common/locales/extra/de-AT';

registerLocaleData(localeDEAT, 'deAT', localeDEATExtra);

@NgModule({
  declarations: [
    AppComponent,
    EventsComponent,
    MapComponent,
    EventsfilterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
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
    MatExpansionModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    LeafletModule.forRoot()
  ],
  providers: [{provide: LOCALE_ID, useValue: 'deAT'}],
  bootstrap: [AppComponent]
})
export class AppModule { 
}
