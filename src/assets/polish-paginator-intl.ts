import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Injectable()
export class PolishPaginatorIntl extends MatPaginatorIntl {
  public override itemsPerPageLabel = 'Ilość elementów na stronę:';
  public override nextPageLabel = 'Następna strona';
  public override previousPageLabel = 'Poprzednia strona';
  public override firstPageLabel = 'Pierwsza strona';
  public override lastPageLabel = 'Ostatnia strona';

  public override getRangeLabel = (page: number, pageSize: number, length: number): string => {
    if (length === 0 || pageSize === 0) {
      return `0 z ${length}`;
    }

    length = Math.max(length, 0);
    const startIndex = page * pageSize;

    const endIndex =
      startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;

    return `${startIndex + 1} – ${endIndex} z ${length}`;
  };
}
