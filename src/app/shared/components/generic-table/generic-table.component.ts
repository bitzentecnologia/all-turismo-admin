import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroEye, heroPencil, heroTrash } from '@ng-icons/heroicons/outline';

export type TableColumn<T> = {
  key: keyof T;
  label: string;
  type?: 'text' | 'badge' | 'date';
  badgeClass?: (value: any) => string;
  translateValue?: (value: any) => string;
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
  viewProviders: [provideIcons({ heroEye, heroPencil, heroTrash })],
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.scss'],
})
export class GenericTableComponent<T extends Record<string, any>> {
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

  onView(item: T) {
    this.view.emit(item);
  }

  onEdit(item: T) {
    this.edit.emit(item);
  }

  onDelete(item: T) {
    this.delete.emit(item);
  }

  // Função para o *ngFor do template
  paginatedData(): T[] {
    if (!this.meta) return this.data;

    const start = (this.meta.page - 1) * this.meta.limit;
    const end = start + this.meta.limit;
    return this.data.slice(start, end);
  }

  // Navegação entre páginas
  goToPage(page: number) {
    if (!this.meta) return;
    if (page < 1 || page > this.meta.lastPage) return;

    this.pageChange.emit(page);
  }
}
