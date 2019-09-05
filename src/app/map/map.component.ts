import { Component, Input, OnChanges, OnInit, SimpleChanges, ChangeDetectorRef, NgZone, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { icon, latLng, Layer, Map as LeafletMap, marker, Marker, tileLayer, LatLngExpression, MarkerOptions, Icon } from 'leaflet';
import { Event } from '../event';
import { EventdetailsComponent } from '../eventdetails/eventdetails.component';
import { Location } from '../location';
import { LocationService } from '../location.service';
import { HostListener } from "@angular/core";
import { EventsfilterService } from '../eventsfilter.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnChanges, OnDestroy {
  @Input() filter: Map<String, any>
  
  events: Event[] = [];
  selectedEvents: Event[] = [];
  detailsHeight: number = 0;
  map: LeafletMap;
  locations: Location[];
  mapMarkers: Marker<any>[] = [];
  selectedMarker: Marker;
  subscription: Subscription;

  layer: Layer = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  });


  defaultIcon: Icon = icon({
    iconSize: [ 25, 41 ],
    iconAnchor: [ 13, 41 ],
    iconUrl: 'leaflet/marker-icon.png',
    shadowUrl: 'leaflet/marker-shadow.png'
  });

  markedIcon: Icon = icon({
    iconSize: [ 25, 41 ],
    iconAnchor: [ 13, 41 ],
    iconUrl: 'https://gkv.com/wp-content/uploads/leaflet-maps-marker-icons/map_marker-red.png',
    shadowUrl: 'leaflet/marker-shadow.png'
  });

  layers: any[] = [
    this.layer
  ]


  options = {
    layers: this.layer,
    zoom: 14,
    center: latLng([ 48.30639, 14.28611 ])
  };

  constructor(
    private locationService: LocationService, 
    private eventsfilterService: EventsfilterService,
    public eventDetailsDialog:MatDialog, private zone: NgZone) { }

  ngOnInit() {
    console.log('hallo');
    //console.log(L.map('map'));
    if (this.map) {
      for(var i = 0; i < this.mapMarkers.length; i++){
        this.map.removeLayer(this.mapMarkers[i]);
      }
      this.redraw(this.map)
    }

    this.filter = this.eventsfilterService.getFilterMap();
    if (this.filter) {
      this.events = this.filter.get('filteredEvents');
      if (this.map) {
        for(var i = 0; i < this.mapMarkers.length; i++){
          this.map.removeLayer(this.mapMarkers[i]);
        }
        this.redraw(this.map)
      }
    }

    this.subscription = this.eventsfilterService.eventsfilter.subscribe( filterMap => {
      this.filter = filterMap;
      this.events = this.filter.get('filteredEvents');
      if (this.map) {
        for(var i = 0; i < this.mapMarkers.length; i++){
          this.map.removeLayer(this.mapMarkers[i]);
        }
        this.redraw(this.map)
      }
    });

  }

  ngOnChanges(changes: SimpleChanges) {
  //   if (changes['filter']){
  //     this.events = this.filter.get('filteredEvents');
  //   }
  //   if (this.map) {
  //     for(var i = 0; i < this.mapMarkers.length; i++){
  //       this.map.removeLayer(this.mapMarkers[i]);
  //     }
  //     this.redraw(this.map)
  //   }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  async getLocations(): Promise<Location[]> {
    return this.locationService.getLocations().toPromise();
  }

  getEventsToLocation(location_id:number): Array<Event> {
    return this.events.filter(item => item.location ? item.location.id == location_id : undefined)
  }

  async onMapReady(map: LeafletMap) {
    this.redraw(map);
  }

  async redraw(map: LeafletMap) {
    this.map = map;
    this.map.on("click", function(e) {
      this.changeIcons();
      this.detailsHeight = 0;
      this.zone.run(() => {
        this.selectedEvents = [];
      })
      
    }.bind(this));

    this.locations = await this.getLocations();
    this.addMarkers();

    //ToDo: Here the Markers needs to be deleted and added again, otherwise when setIcon is called when clicking on the marker the Previous icon still stays, but i do not know why the hell this happens.
    //Only when page has loaded and no filter action was triggered this happens.
    for(var i = 0; i < this.mapMarkers.length; i++){
      this.map.removeLayer(this.mapMarkers[i]);
    }
    this.addMarkers();
  }

  private addMarkers() {
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
        let htmlToolTip = html;
        let counter = 0;
        for (let event of eventsToLocation) {
          let html_event = "<div height=\"200px\"><p>" +
          "<a href=&quot;#&quot;>" + event.title + "</a>" + 
          "<br>Nächste Veranstaltung: " + event.getNextEventDateBetweenString(this.filter.get('dateStart'), this.filter.get('dateEnd')) + "</p></div>";

          html = html + html_event;
          counter++;
          if (counter <= 3) {
            htmlToolTip = html;
          }
          
        }
        if (counter > 3) {
          htmlToolTip = htmlToolTip + "<div height=\"200px\"><p></p></div>"
          htmlToolTip = htmlToolTip + (eventsToLocation.length - 3) + " weitere Veranstaltungen"
        }
        else {
          htmlToolTip = html
        }

        let m = new EventMarker([ location.latitude, location.longitude ], {},
          location.id
        );
        
        m.setIcon(this.defaultIcon);

        m.on('click', this.onMarkerClick.bind(this))
        this.mapMarkers.push(m);

        m.bindTooltip(htmlToolTip).addTo(this.map);

      }
    }
  }

  changeIcons(){
    this.mapMarkers.forEach(element => {
      element.setIcon(this.defaultIcon)
    });
  }


  refresh() {
    this.detailsHeight = 1;
    this.map.invalidateSize();
    this.detailsHeight = 0;
    console.log(this.map.getSize()) 
    console.log(window.innerHeight)

  }

  onMarkerClick(e) {
    console.log(this.events)
    if (this.selectedMarker) {
      this.selectedMarker.setIcon(this.defaultIcon); // Maybe use here a marker which shows that this has been already viewed...
    }

    this.selectedMarker = e.target;
    this.detailsHeight = 20;
		this.zone.run(() => {
      this.map.setView(this.selectedMarker.getLatLng(), this.map.getZoom());
      var myIcon = this.markedIcon;
      e.target.setIcon(myIcon);

      this.selectedEvents = this.getEventsToLocation(e.target.locationID);
    });
  }
  
  openEventDetails(event:Event){
    const eventDetailDialogRef = this.eventDetailsDialog.open(
      EventdetailsComponent, {data: event}
    );
    eventDetailDialogRef.afterClosed().subscribe(result => {
      console.log("Dialog closed: ${result}");
    })
    console.log(event);
  }
}

export class EventMarker extends Marker{
  locationID: number;
  constructor(latlng: LatLngExpression, options?: MarkerOptions, locationID?: number){
    super(latlng, options);
    this.locationID = locationID;
  }
}


/*
Source:
https://github.com/Asymmetrik/ngx-leaflet
https://asymmetrik.com/ngx-leaflet-tutorial-angular-cli/
https://github.com/Asymmetrik/ngx-leaflet/issues/178
https://github.com/Asymmetrik/ngx-leaflet/issues/60

Check this for custom sidebar
https://leafletjs.com/examples/extending/extending-3-controls.html
*/