import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { latLng, tileLayer, Map, marker, icon, Marker, TileLayer, Layer, Handler } from 'leaflet';
import { Event } from '../event'
import { LocationService } from '../location.service';
import { Location } from '../location';
import { __await } from 'tslib';
import { async } from '@angular/core/testing';
import { LeafletDirective } from '@asymmetrik/ngx-leaflet';
import { Organizer } from '../organizer';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnChanges {
  @Input() events: Event[];
  @Input() organizer: Organizer[];
  
  map: Map;
  locations: Location[];
  mapMarkers: Marker<any>[] = [];
  
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

  constructor(private locationService: LocationService) { }

  ngOnInit() {
    //console.log(L.map('map'));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.map) {
      for(var i = 0; i < this.mapMarkers.length; i++){
        this.map.removeLayer(this.mapMarkers[i]);
      }
      this.redraw(this.map)
    }
  }

  async getLocations(): Promise<Location[]> {
    return this.locationService.getLocations().toPromise();
  }

  getEventsToLocation(location_id:number): Array<Event> {
    return this.events.filter(item => item.location ? item.location.id == location_id : undefined)
  }

  async onMapReady(map: Map) {
    this.redraw(map);
  }

  async redraw(map: Map) {
    this.map = map;
    this.locations= await this.getLocations();
    for (let location of this.locations) {
      var eventsToLocation = this.getEventsToLocation(location["id"]);
      if (eventsToLocation.length > 0){
        //console.log(location);
        if (location.latitude == undefined && location.longitude == undefined) {
          //ToDo: If 2 marker will have the same longitude latitude, the first marker will be overwritten => make dictionary for places with latlng as key. BUt do this in the REST API
          location.latitude = 48.30639;
          location.longitude = 14.28611;
        }
        let html = "<p><b>" + location.name + "</b></p>";
        let htmlStar = "<i class=\"material-icons\" style=\"font-size:12px;\">star</i>";
        for (let event of eventsToLocation) {
          html = html + "<div height=\"200px\"><p>" +
          "<a href=&quot;#&quot;>" + event.title + "</a>";
          
          //Added 03.05
          html = html + "<br>" + event.datumstring;
          //html = html + "<br>" + htmlStar + htmlStar + htmlStar + htmlStar + "</p></div>"
        }
        let m = marker([ location.latitude, location.longitude ], 
          {icon: icon({
            iconSize: [ 25, 41 ],
            iconAnchor: [ 13, 41 ],
            iconUrl: 'leaflet/marker-icon.png',
            shadowUrl: 'leaflet/marker-shadow.png'
          })
        })
        this.mapMarkers.push(m);
        //Added Lukas 03.05. Set MaxHeight and scrollbar
        let popupoptions = {maxWidth: 300, minWidth: 250, maxHeight: 220, autoPan: true};
        m.bindPopup(html,popupoptions).openPopup().addTo(this.map);
      }
    }
    this.map.invalidateSize(); 
    
  }

  refresh() {
    this.map.invalidateSize(); 
  }

  doDetails() {
      console.log("Hallo");
  }

}
