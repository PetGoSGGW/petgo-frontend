import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  Injector,
  input,
  OnInit,
  output,
} from '@angular/core';
import { combineLatest, filter, map, ReplaySubject } from 'rxjs';
import * as L from 'leaflet';
import {
  MapControlAction,
  MapControlsComponent,
} from '../../../../components/map-controls/map-controls.component';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { WalkerOffer } from '../../models/walker-offer.model';

@Component({
  selector: 'app-walker-offer-map',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MapControlsComponent],
  styles: [
    `
      .map-container {
        height: calc((100svh - var(--header-height) - 2rem) / 2);
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

      .no-background-tooltip {
        background: transparent;
        border: none;
        box-shadow: none;
      }

      .no-background-tooltip::before {
        display: none;
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
export class WalkerOfferMapComponent implements OnInit {
  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);

  public readonly userPosition = input.required<{ lat: number; lng: number }>();
  public readonly radiusKm = input.required<number>();
  public readonly offers = input.required<WalkerOffer[]>();

  private map: L.Map | undefined;
  private userMarker: L.CircleMarker | undefined;

  private readonly isMapInit$ = new ReplaySubject<boolean>(1);

  public readonly markerClicked = output<WalkerOffer>();

  constructor() {
    afterNextRender({
      write: () => {
        this.initMap();
        this.addUserMarker();
        this.addCircle();
      },
    });
  }

  public ngOnInit(): void {
    combineLatest([
      toObservable(this.offers, { injector: this.injector }).pipe(
        map((offers) => offers.filter((offer) => offer.slots.length > 0)),
      ),
      this.isMapInit$.pipe(filter(Boolean)),
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([offers]) => {
        offers.forEach((offer) => {
          const [{ latitude, longitude }] = offer.slots;

          const latlng: L.LatLngExpression = [latitude, longitude];

          if (!this.map) return;

          L.circleMarker(latlng)
            .addTo(this.map)
            .bindTooltip(offer.walkerName, { permanent: true })
            .openTooltip()
            .on('click', () => {
              this.markerClicked.emit(offer);
            });
        });
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
