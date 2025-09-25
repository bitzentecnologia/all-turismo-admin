import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  GenericTableComponent,
  TableColumn,
} from '@shared/components/generic-table/generic-table.component';
import { ParceirosService } from './parceiros.service';
import { PaginationMeta } from '@shared/models/pagination.model';
import { Router } from '@angular/router';

export type Partner = {
  id: string;
  name: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
};

@Component({
  selector: 'app-parceiros',
  standalone: true,
  imports: [CommonModule, GenericTableComponent],
  templateUrl: './parceiros.component.html',
  styleUrls: ['./parceiros.component.scss'],
})
export class ParceirosComponent implements OnInit {
  partners: Partner[] = [];
  loading = false;

  meta = {
    total: 0,
    page: 1,
    lastPage: 1,
    limit: 10,
  };

  columns: TableColumn<Partner>[] = [
    { key: 'name', label: 'Nome da Empresa', type: 'text' },
    {
      key: 'status',
      label: 'Status',
      type: 'badge',
      badgeClass: status => {
        if (status === 'ACTIVE') return 'badge-success';
        if (status === 'PENDING') return 'badge-warning';
        return 'badge-danger';
      },
    },
  ];

  constructor(
    private parceirosService: ParceirosService,
    private router: Router
  ) {}

  ngOnInit() {
    this.fetchPartners();
  }

  fetchPartners(page: number = 1, limit: number = 10) {
    this.loading = true;
    this.parceirosService.getParceiros(page, limit).subscribe({
      next: res => {
        this.partners = res.data.map(p => ({
          id: p.id,
          name: p.name,
          status:
            p.status === 'ACTIVE' ? 'ACTIVE' : p.status === 'PENDING' ? 'PENDING' : 'INACTIVE',
        }));

        this.meta = {
          total: res.meta.totalItems,
          page: res.meta.currentPage,
          lastPage: res.meta.totalPages,
          limit: res.meta.itemsPerPage,
        };
      },
      error: err => {
        console.error('Erro ao carregar parceiros', err);
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  onPageChange(page: number) {
    this.fetchPartners(page, this.meta.limit);
  }

  onView(partner: Partner) {
    this.router.navigate(['/parceiros', partner.id]);
  }

  onEdit(partner: Partner) {
    console.log('Editar:', partner);
  }

  onDelete(partner: Partner) {
    console.log('Excluir:', partner);
  }
}
