import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { rxResource, takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { WalkApiService } from '../../services/walk-api.service';
import { combineLatest, filter, ReplaySubject } from 'rxjs';
import * as L from 'leaflet';
import {
  MapControlAction,
  MapControlsComponent,
} from '../../../../components/map-controls/map-controls.component';

@Component({
  selector: 'app-view-walk',
  templateUrl: './view-walk.component.html',
  styleUrl: './view-walk.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MapControlsComponent],
})
export class ViewWalkComponent implements OnInit, AfterViewInit {
  private readonly walkApi = inject(WalkApiService);
  private readonly destroyRef = inject(DestroyRef);

  @ViewChild('mapContainer') private mapContainer?: ElementRef<HTMLDivElement>;

  public readonly reservationId = input.required<number, number | string>({
    transform: (sessionId) => Number(sessionId),
  });
  protected routeCoordinates = rxResource({
    params: () => ({ reservationId: this.reservationId() }),
    stream: ({ params: { reservationId } }) => this.walkApi.getWalkRoute$(reservationId),
  });

  private map: L.Map | undefined;
  private userPosition: { lat: number; lng: number } | null = null;
  private userMarker: L.CircleMarker | undefined;
  private pathHistory: L.LatLngExpression[] = [];
  private path: L.Polyline | undefined;

  private readonly isMapInit$ = new ReplaySubject<boolean>(1);

  private readonly coordinates$ = combineLatest([
    toObservable(this.routeCoordinates.value).pipe(filter(Boolean)),
    this.isMapInit$.pipe(filter(Boolean)),
  ]);

  public ngAfterViewInit(): void {
    this.initMap();
  }

  public ngOnInit(): void {
    this.coordinates$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(([coordinates]) => {
      this.pathHistory = [];

      coordinates.forEach(({ latitude, longitude }) => {
        this.updatePath(latitude, longitude);
        this.addUserMarker();
      });

      const currentPosition = coordinates.at(-1);

      if (currentPosition) {
        this.userPosition = { lat: currentPosition.latitude, lng: currentPosition.longitude };
        this.centerMapOnUser({ zoom: 30 });
      }
    });
  }

  private initMap(): void {
    const container = this.mapContainer?.nativeElement;
    if (!container) return;

    const warsawCoordinates: L.LatLngExpression = [52.2297, 21.0122];

    const initialCenter = this.userPosition
      ? ([this.userPosition.lat, this.userPosition.lng] as L.LatLngExpression)
      : warsawCoordinates;

    this.map = L.map(container, {
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

    if (this.userPosition) {
      this.addUserMarker();
    }
  }

  private centerMapOnUser(args?: { zoom?: number }): void {
    if (this.map && this.userPosition) {
      this.map.setView([this.userPosition.lat, this.userPosition.lng], args?.zoom);
      this.addUserMarker();
    }
  }

  private addUserMarker(): void {
    if (!this.map || !this.userPosition) return;

    const latlng: L.LatLngExpression = [this.userPosition.lat, this.userPosition.lng];

    if (!this.userMarker) {
      this.userMarker = L.circleMarker(latlng).addTo(this.map);
      this.userMarker.bindPopup('Twój pupil').openPopup();
    } else {
      this.userMarker.setLatLng(latlng);
    }
  }

  private updatePath(lat: number, lng: number): void {
    if (!this.map) return;

    this.pathHistory.push([lat, lng]);

    if (!this.path) {
      this.path = L.polyline(this.pathHistory, {
        color: 'blue',
        weight: 4,
        opacity: 0.7,
        smoothFactor: 1,
      }).addTo(this.map);
    } else {
      this.path.setLatLngs(this.pathHistory);
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
