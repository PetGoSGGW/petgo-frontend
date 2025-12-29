import { afterNextRender, ChangeDetectionStrategy, Component } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-walk',
  templateUrl: './walk.component.html',
  styleUrl: './walk.component.css',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class WalkComponent {
  private map: L.Map | undefined;

  constructor() {
    afterNextRender({
      write: () => {
        this.initMap();
      },
    });
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [51.505, -0.09],
      zoom: 13,
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    });

    tiles.addTo(this.map);
  }

  private fixMarkerIcons(): void {
    const iconRetinaUrl = 'assets/marker-icon-2x.png';
    const iconUrl = 'assets/marker-icon.png';
    const shadowUrl = 'assets/marker-shadow.png';
    const iconDefault = L.icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41],
    });
    L.Marker.prototype.options.icon = iconDefault;
  }
}
