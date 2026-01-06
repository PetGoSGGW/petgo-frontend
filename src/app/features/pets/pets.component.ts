import { Component, computed, inject } from '@angular/core';
import { DogApiService } from '../../services/dog-api.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/auth/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { AddDogFormDialogComponent } from '../home/components/add-dog-form-dialog/add-dog-form-dialog.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-pets-component',
  imports: [RouterModule],
  templateUrl: './pets.component.html',
  styleUrl: './pets.component.css',
})
export class PetsComponent {
  private authService = inject(AuthService);
  private readonly dogApi = inject(DogApiService);
  private readonly matDialog = inject(MatDialog);
  protected readonly userId = computed(() => this.authService.session()?.userId);

  protected dogs = rxResource({
    stream: () => this.dogApi.getDogs$(),
  });

  protected openAddDogDialog(): void {
    this.matDialog
      .open(AddDogFormDialogComponent, { width: '800px' })
      .afterClosed()
      .pipe(filter((result) => !!result))
      .subscribe(() => {
        this.dogs.reload();
      });
  }
}
