import { Component, computed, inject } from '@angular/core';
import { DogApiService } from '../../services/dog-api.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthService } from '../../core/auth/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { AddDogFormDialogComponent } from '../home/components/add-dog-form-dialog/add-dog-form-dialog.component';
import { filter } from 'rxjs';
import { DogsGridComponent } from '../../components/dogs-grid/dogs-grid.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatError, MatHint } from '@angular/material/form-field';
import { SectionWrapperComponent } from '../../components/section-wrapper/section-wrapper.component';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-pets-component',
  imports: [
    DogsGridComponent,
    MatProgressSpinner,
    MatError,
    MatHint,
    SectionWrapperComponent,
    MatButton,
  ],
  templateUrl: './pets.component.html',
  styleUrl: './pets.component.css',
})
export default class PetsComponent {
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
