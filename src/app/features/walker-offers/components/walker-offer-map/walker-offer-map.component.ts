import { afterNextRender, ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import * as L from 'leaflet';
import {
  MapControlAction,
  MapControlsComponent,
} from '../../../../components/map-controls/map-controls.component';

@Component({
  selector: 'app-walker-offer-map',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MapControlsComponent],
  styles: [
    `
      .map-container {
        height: calc(50svh);
        border-radius: 1rem;
        position: relative;
      }

      .map-frame {
        border: 2px solid black;
        height: 100%;
      }

      #map {
        height: 100%;
      }
    `,
  ],
  template: `
    <div class="map-container">
      <div class="map-frame">
        <app-map-controls (clicked)="onControlClick($event)" />
        <div id="map"></div>
      </div>
    </div>
  `,
})
export class WalkerOfferMapComponent {
  public readonly userPosition = input.required<{ lat: number; lng: number }>();
  public readonly radiusKm = input.required<number>();

  private map: L.Map | undefined;
  private userMarker: L.CircleMarker | undefined;
  private pathHistory: L.LatLngExpression[] = [];
  private path: L.Polyline | undefined;

  private readonly isMapInit$ = new ReplaySubject<boolean>(1);

  constructor() {
    afterNextRender({
      write: () => {
        this.initMap();
        this.addCircle();
      },
    });
  }

  private initMap(): void {
    const warsawCoordinates: L.LatLngExpression = [52.2297, 21.0122];

    const initialCenter = this.userPosition
      ? ([this.userPosition().lat, this.userPosition().lng] as L.LatLngExpression)
      : warsawCoordinates;

    this.map = L.map('map', {
      center: initialCenter,
      zoom: 13,
      zoomControl: false,
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    });

    tiles.addTo(this.map);

    this.isMapInit$.next(true);

    if (this.userPosition()) {
      this.addUserMarker();
    }
  }

  private addUserMarker(): void {
    if (!this.map || !this.userPosition()) return;

    const latlng: L.LatLngExpression = [this.userPosition().lat, this.userPosition().lng];

    if (!this.userMarker) {
      this.userMarker = L.circleMarker(latlng).addTo(this.map);
      this.userMarker.bindPopup('Tutaj jesteś').openPopup();
    } else {
      this.userMarker.setLatLng(latlng);
    }
  }

  private centerMapOnUser(args?: { zoom?: number }): void {
    if (this.map && this.userPosition) {
      this.map.setView([this.userPosition().lat, this.userPosition().lng], args?.zoom);
      this.addUserMarker();
    }
  }

  protected onControlClick(action: MapControlAction): void {
    switch (action) {
      case 'center':
        this.centerMapOnUser();
        break;
      case 'zoom-in':
        this.map?.zoomIn();
        break;
      case 'zoom-out':
        this.map?.zoomOut();
        break;
    }
  }

  private addCircle(): void {
    const radiusMeters = this.radiusKm() * 1000;

    const circle = L.circle([this.userPosition().lat, this.userPosition().lng], {
      color: '#000',
      fillColor: 'none',
      fillOpacity: 0.5,
      radius: radiusMeters,
    });

    if (this.map) {
      circle.addTo(this.map);
    }
  }
}
