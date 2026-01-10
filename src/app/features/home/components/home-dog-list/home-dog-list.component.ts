import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddDogFormDialogComponent } from '../add-dog-form-dialog/add-dog-form-dialog.component';
import { filter } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';
import { DogApiService } from '../../../../services/dog-api.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { SectionWrapperComponent } from '../../../../components/section-wrapper/section-wrapper.component';
import { DogsGridComponent } from '../../../../components/dog-grid/dogs-grid.component';

@Component({
  selector: 'app-home-dog-list',
  templateUrl: './home-dog-list.component.html',
  styleUrl: './home-dog-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatProgressSpinner,
    MatIcon,
    MatButton,
    MatCardModule,
    SectionWrapperComponent,
    DogsGridComponent,
  ],
})
export class HomeDogListComponent {
  private readonly matDialog = inject(MatDialog);
  private readonly dogApi = inject(DogApiService);

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
