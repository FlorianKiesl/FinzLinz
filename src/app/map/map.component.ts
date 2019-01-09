import { Component, OnInit } from '@angular/core';
import { latLng, tileLayer, Map, marker, icon, Marker, TileLayer, Layer, Handler } from 'leaflet';
import { Event } from '../event'
import { EventService } from '../event.service'
import { LocationService } from '../location.service';
import { Location } from '../location';
import { identifierModuleUrl } from '@angular/compiler';
import { __await } from 'tslib';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  map: Map;
  events: Event[];
  locations: Location[];
  
  layer: Layer = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  });

  layers: any[] = [
    this.layer
  ]


  options = {
    layers: this.layer,
    zoom: 14,
    center: latLng([ 48.30639, 14.28611 ])
  };

  constructor(private eventService: EventService, private locationService: LocationService) { }

  ngOnInit() {
    console.log('hi');
  }

  async getEvents(): Promise<Event[]> {
    return this.eventService.getEvents().toPromise();
  }

  async getLocations(): Promise<Location[]> {
    return this.locationService.getLocations().toPromise();
  }

  getEventsToLocation(location_id:number): Array<Event> {
    var events = Array<Event>();
    //console.log(location_id);
    for (let event of this.events) {
      //console.log(event.location["-id"]);
      if (event.location["-id"] == location_id) {
        events.push(event);
      }
    }

    return events;
  }

  async onMapReady(map: Map) {
    this.map = map;
    this.events = await this.getEvents();
    this.locations= await this.getLocations();
    
    for (let location of this.locations) {
      var events = this.getEventsToLocation(location["-id"]);
      if (events.length > 0){
        if (location.latitude == undefined && location.longitude == undefined) {
          //ToDo: If 2 marker will have the same longitude latitude, the first marker will be overwritten => make dictionary for places with latlng as key. BUt do this in the REST API
          location.latitude = 48.30639;
          location.longitude = 14.28611;
        }
        let html = "<p><b>" + location.name + "</b></p>";
        let htmlStar = "<i class=\"material-icons\" style=\"font-size:12px;\">star</i>";
        for (let event of events) {
          html = html + "<div height=\"200px\"><p>" + event.title ;
          
          html = html + "<br>" + htmlStar + htmlStar + htmlStar + htmlStar + "</p></div>"
        }
        let m = marker([ location.latitude, location.longitude ], 
          {icon: icon({
            iconSize: [ 25, 41 ],
            iconAnchor: [ 13, 41 ],
            iconUrl: 'leaflet/marker-icon.png',
            shadowUrl: 'leaflet/marker-shadow.png'
          })
        })
        m.bindPopup(html).openPopup().addTo(this.map);
      }
    }
  }

  refresh() {
    this.map.invalidateSize(); 
  }

  doDetails() {
      console.log("Hallo");
  }

}
