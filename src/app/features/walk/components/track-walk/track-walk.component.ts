import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { LocationService } from '../../../../services/location.service';
import { ReplaySubject } from 'rxjs';
import * as L from 'leaflet';
import { MatButton } from '@angular/material/button';
import { SessionService } from '../../../../services/session.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-track-walk',
  templateUrl: './track-walk.component.html',
  styleUrl: './track-walk.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton],
})
export class TrackWalkComponent implements OnInit {
  private readonly locationService = inject(LocationService);
  private readonly sessionService = inject(SessionService);
  private readonly destroyRef = inject(DestroyRef);

  private map: L.Map | undefined;
  private userPosition: { lat: number; lng: number } | null = null;
  private userMarker: L.CircleMarker | undefined;
  private pathHistory: L.LatLngExpression[] = [];
  private path: L.Polyline | undefined;

  public readonly sessionId = input.required<number, string>({
    transform: (sessionId) => Number(sessionId),
  });
  private readonly isMapInit$ = new ReplaySubject<boolean>(1);

  constructor() {
    afterNextRender({
      write: () => {
        this.initMap();
      },
    });
  }

  public ngOnInit(): void {
    this.locationService
      .getCurrentLocation$()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ latitude, longitude }) => {
          this.updatePath(latitude, longitude);
          this.userPosition = { lat: latitude, lng: longitude };
          this.centerMapOnUser();
        },
      });
  }

  private initMap(): void {
    const warsawCoordinates: L.LatLngExpression = [52.2297, 21.0122];

    const initialCenter = this.userPosition
      ? ([this.userPosition.lat, this.userPosition.lng] as L.LatLngExpression)
      : warsawCoordinates;

    this.map = L.map('map', {
      center: initialCenter,
      zoom: 13,
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
      this.userMarker.bindPopup('Jesteś tutaj').openPopup();
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

  protected finishWalk(sessionId: number): void {
    this.sessionService.stopWalk(sessionId);
  }
}
