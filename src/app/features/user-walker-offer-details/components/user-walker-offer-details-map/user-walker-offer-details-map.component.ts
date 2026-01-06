import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  Injector,
  input,
  OnInit,
} from '@angular/core';
import { combineLatest, filter, ReplaySubject } from 'rxjs';
import * as L from 'leaflet';
import {
  MapControlAction,
  MapControlsComponent,
} from '../../../../components/map-controls/map-controls.component';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { AvailableSlot } from '../../../walker-offers/models/available-slot.model';
import { SlotDatePipe } from '../../../add-walker-offer/pipes/slot-date.pipe';

@Component({
  selector: 'app-user-walker-offer-details-map',
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
  providers: [SlotDatePipe],
  template: `
    <div class="map-container">
      <div class="map-frame">
        <app-map-controls (clicked)="onControlClick($event)" />
        <div id="map"></div>
      </div>
    </div>
  `,
})
export class UserWalkerOfferDetailsMapComponent implements OnInit {
  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);
  private readonly slotDatePipe = inject(SlotDatePipe);

  public readonly userPosition = input.required<{ latitude: number; longitude: number }>();
  // public readonly radiusKm = input.required<number>();
  public readonly availableSlots = input.required<AvailableSlot[]>();

  private map: L.Map | undefined;
  private userMarker: L.CircleMarker | undefined;

  private readonly isMapInit$ = new ReplaySubject<boolean>(1);

  // public readonly markerClicked = output<AvailableSlot>();

  constructor() {
    afterNextRender({
      write: () => {
        this.initMap();
        this.addUserMarker();
      },
    });
  }

  public ngOnInit(): void {
    combineLatest([
      toObservable(this.availableSlots, { injector: this.injector }),
      this.isMapInit$.pipe(filter(Boolean)),
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([availableSlots]) => {
        availableSlots.forEach((slot) => {
          const { latitude, longitude } = slot;

          const latlng: L.LatLngExpression = [latitude, longitude];

          if (!this.map) return;

          L.circleMarker(latlng)
            .addTo(this.map)
            .bindTooltip(this.slotDatePipe.transform(slot), { permanent: true })
            .openTooltip()
            .on('click', () => {
              // this.markerClicked.emit(offer);
            });
        });
      });
  }

  private initMap(): void {
    const warsawCoordinates: L.LatLngExpression = [52.2297, 21.0122];

    const initialCenter = this.userPosition
      ? ([this.userPosition().latitude, this.userPosition().longitude] as L.LatLngExpression)
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

    const latlng: L.LatLngExpression = [
      this.userPosition().latitude,
      this.userPosition().longitude,
    ];

    if (!this.userMarker) {
      this.userMarker = L.circleMarker(latlng).addTo(this.map);
      this.userMarker.bindPopup('Tutaj jesteś').openPopup();
    } else {
      this.userMarker.setLatLng(latlng);
    }
  }

  private centerMapOnUser(args?: { zoom?: number }): void {
    if (this.map && this.userPosition) {
      this.map.setView([this.userPosition().latitude, this.userPosition().longitude], args?.zoom);
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
}
