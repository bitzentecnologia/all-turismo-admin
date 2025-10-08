import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  heroArrowsUpDown,
  heroChevronDown,
  heroChevronUp,
  heroEye,
  heroPencil,
  heroTrash,
} from '@ng-icons/heroicons/outline';

export type TableColumn<T> = {
  key: keyof T;
  label: string;
  type?: 'text' | 'badge' | 'date';
  badgeClass?: (value: any) => string;
  translateValue?: (value: any) => string;
  sortable?: boolean;
  sortFn?: (a: T, b: T) => number;
  sortAccessor?: (item: T) => unknown;
};

export interface PaginationMeta {
  total: number;
  page: number;
  lastPage: number;
  limit: number;
}

@Component({
  selector: 'app-generic-table',
  standalone: true,
  imports: [CommonModule, NgIcon, DatePipe],
  viewProviders: [
    provideIcons({
      heroEye,
      heroPencil,
      heroTrash,
      heroArrowsUpDown,
      heroChevronUp,
      heroChevronDown,
    }),
  ],
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.scss'],
})
export class GenericTableComponent<T extends Record<string, any>> implements OnChanges {
  @Input() data: T[] = [];
  @Input() columns: TableColumn<T>[] = [];
  @Input() showEditAction = false;
  @Input() showVisualizeAction = false;
  @Input() showDeleteAction = false;

  // Paginação
  @Input() meta?: PaginationMeta;
  @Output() pageChange = new EventEmitter<number>();

  @Output() view = new EventEmitter<T>();
  @Output() edit = new EventEmitter<T>();
  @Output() delete = new EventEmitter<T>();

  sortState: { key: keyof T; direction: 'asc' | 'desc' } | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['columns'] && this.sortState) {
      const activeColumn = this.columns.find(
        column => column.key === this.sortState?.key && column.sortable
      );

      if (!activeColumn) {
        this.sortState = null;
      }
    }
  }

  get displayedData(): T[] {
    const dataCopy = [...this.data];

    if (!this.sortState) {
      return this.applyClientPagination(dataCopy);
    }

    const activeColumn = this.columns.find(column => column.key === this.sortState?.key);
    if (!activeColumn) {
      return this.applyClientPagination(dataCopy);
    }

    const directionFactor = this.sortState.direction === 'asc' ? 1 : -1;

    const sortedData = dataCopy.sort((a, b) => {
      if (activeColumn.sortFn) {
        return activeColumn.sortFn(a, b) * directionFactor;
      }

      const aValue = this.extractSortableValue(a, activeColumn);
      const bValue = this.extractSortableValue(b, activeColumn);

      return this.compareValues(aValue, bValue) * directionFactor;
    });

    return this.applyClientPagination(sortedData);
  }

  onView(item: T) {
    this.view.emit(item);
  }

  onEdit(item: T) {
    this.edit.emit(item);
  }

  onDelete(item: T) {
    this.delete.emit(item);
  }

  // Navegação entre páginas
  goToPage(page: number) {
    if (!this.meta) return;
    if (page < 1 || page > this.meta.lastPage) return;

    this.pageChange.emit(page);
  }

  toggleSort(column: TableColumn<T>) {
    if (!column.sortable) {
      return;
    }

    if (!this.sortState || this.sortState.key !== column.key) {
      this.sortState = { key: column.key, direction: 'asc' };
      return;
    }

    if (this.sortState.direction === 'asc') {
      this.sortState = { key: column.key, direction: 'desc' };
      return;
    }

    this.sortState = null;
  }

  private extractSortableValue(item: T, column: TableColumn<T>): unknown {
    if (column.sortAccessor) {
      return column.sortAccessor(item);
    }

    const value = item[column.key];

    if (column.type === 'date') {
      const valueAsString =
        typeof value === 'string' ? value : value !== undefined && value !== null ? String(value) : '';
      const timestamp = Date.parse(valueAsString);
      return Number.isNaN(timestamp) ? null : timestamp;
    }

    return value;
  }

  private compareValues(a: unknown, b: unknown): number {
    if (a === null || a === undefined) {
      return b === null || b === undefined ? 0 : -1;
    }

    if (b === null || b === undefined) {
      return 1;
    }

    if (typeof a === 'number' && typeof b === 'number') {
      return a - b;
    }

    if (typeof a === 'boolean' && typeof b === 'boolean') {
      return Number(a) - Number(b);
    }

    if (typeof a === 'bigint' && typeof b === 'bigint') {
      return a < b ? -1 : a > b ? 1 : 0;
    }

    if (typeof a === 'string' && typeof b === 'string') {
      return a.localeCompare(b, undefined, { sensitivity: 'base' });
    }

    const aNumber = Number(a);
    const bNumber = Number(b);

    const canCompareAsNumber = !Number.isNaN(aNumber) && !Number.isNaN(bNumber);
    if (canCompareAsNumber) {
      return aNumber - bNumber;
    }

    const aString = String(a);
    const bString = String(b);

    return aString.localeCompare(bString, undefined, { sensitivity: 'base' });
  }

  private applyClientPagination(data: T[]): T[] {
    if (!this.meta) {
      return data;
    }

    const requiresClientSlice = data.length > this.meta.limit;
    if (!requiresClientSlice) {
      return data;
    }

    const start = (this.meta.page - 1) * this.meta.limit;
    const end = start + this.meta.limit;

    return data.slice(start, end);
  }
}
