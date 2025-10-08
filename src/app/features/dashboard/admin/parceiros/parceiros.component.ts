import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  GenericTableComponent,
  TableColumn,
} from '@shared/components/generic-table/generic-table.component';
import { ParceirosService } from './parceiros.service';
import { PaginationMeta } from '@shared/models/pagination.model';
import { Router } from '@angular/router';
import { translateStatus } from '@shared/utils/status-translator';

export type Partner = {
  id: string;
  name: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  created_at: string;
  contact_phone: string;
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
    { key: 'name', label: 'Nome', type: 'text', sortable: true },
    {
      key: 'created_at',
      label: 'Data de Criação',
      type: 'date',
      sortable: true,
    },
    { key: 'contact_phone', label: 'Telefone de Contato', type: 'text' },
    {
      key: 'status',
      label: 'Status',
      type: 'badge',
      sortable: true,
      badgeClass: status => {
        if (status === 'ACTIVE') return 'badge-success';
        if (status === 'PENDING') return 'badge-warning';
        return 'badge-danger';
      },
      translateValue: translateStatus,
    },
  ];

  constructor(
    private parceirosService: ParceirosService,
    private router: Router
  ) { }

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
          created_at: p.created_at || '',
          contact_phone: p.contact_phone || '',
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
