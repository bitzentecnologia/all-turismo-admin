import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ParceirosService } from '../parceiros.service';
import { CommonModule } from '@angular/common';

export type Partner = {
  id: string;
  name: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
};

@Component({
  selector: 'app-partner-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './partner-details.component.html',
  styleUrls: ['./partner-details.component.scss'],
})
export class PartnerDetailComponent implements OnInit {
  partner?: Partner;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private parceirosService: ParceirosService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loading = true;
        this.parceirosService.getPartnerById(id).subscribe({
          next: (p: Partner) => {
            this.partner = p;
          },
          error: (err: any) => {
            console.error('Erro ao carregar parceiro', err);
          },
          complete: () => {
            this.loading = false;
          },
        });
      }
    });
  }
}
