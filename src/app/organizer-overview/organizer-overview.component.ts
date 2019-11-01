import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Organizer } from '../organizer';
import { OrganizerService } from '../organizer.service';
import { Layer, tileLayer, latLng, LeafletEventHandlerFnMap, Map as LeafletMap, Marker } from 'leaflet';

@Component({
  selector: 'app-organizer-overview',
  templateUrl: './organizer-overview.component.html',
  styleUrls: ['./organizer-overview.component.scss']
})
export class OrganizerOverviewComponent implements OnInit, OnChanges {

  @Input() organizerID:number;

  organizer:Organizer;
  map: LeafletMap;
  layer: Layer = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  });

  options = {
    layers: this.layer,
    zoom: 14,
    center: latLng([ 48.30639, 14.28611 ])
  };

  mapMarkers: Marker<any>[] = [];

  constructor(private organizerService:OrganizerService) { }

  ngOnInit() {
    this.setOrganizers();
    if (this.map) {
      for(var i = 0; i < this.mapMarkers.length; i++){
        this.map.removeLayer(this.mapMarkers[i]);
      }
      this.redraw(this.map);
    }
  }

  ngOnChanges() {
    //this.refresh()
  }

  setOrganizers(): void {
    this.organizerService.getOrganizers().subscribe(organizors => {
      this.organizer = organizors.find( item =>  item.id == this.organizerID);
    });
  }

  async onMapReady(map: LeafletMap) {
    this.redraw(map);
  }

  public redraw(map: LeafletMap) {
    this.map = map;
  //   this.map.on("click", function(e) {
  //     this.refresh();
  //   }.bind(this));
  //   this.refresh();
  }

  refresh() {
    if (this.map){
      this.map.invalidateSize();
    }
  }

}
