import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ParceirosService, PartnerDetailsResponse } from '../parceiros.service';
import { CommonModule } from '@angular/common';
import { ImageService } from '@core/services/image.service';
import { FormsModule, NgForm } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { DropDownItem } from '@shared/models/dropdown.model';

export type Partner = PartnerDetailsResponse & {
  subcategory: { name: string };
  categoryRules: any[];
  categoryInformationals: any[];
};

@Component({
  selector: 'app-partner-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './partner-details.component.html',
  styleUrls: ['./partner-details.component.scss'],
})
export class PartnerDetailComponent implements OnInit {
  partner?: Partner;
  loading = true;
  approving = false;
  openSection: string | null = 'info';

  categories: DropDownItem[] = [];
  subcategories: DropDownItem[] = [];

  constructor(
    private route: ActivatedRoute,
    private parceirosService: ParceirosService,
    private router: Router,
    private imageService: ImageService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loading = true;
        this.parceirosService.getPartnerById(id).subscribe({
          next: (p: PartnerDetailsResponse) => {
            this.partner = {
              ...p,
              categoryRules: (p as any).categoryRules || [],
              categoryInformationals: (p as any).categoryInformationals || [],
              subcategory: (p as any).subcategory || { name: '' },
            };
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

    this.parceirosService.getCategories().subscribe({
      next: res => (this.categories = res),
      error: err => console.error('Erro ao carregar categorias:', err),
    });
  }

  getCompanyLogoUri(id: string | undefined): string {
    if (!id) {
      return 'assets/default-logo.png';
    }
    return this.imageService.getLogoUriImageById(id);
  }

  toggleSection(section: string) {
    this.openSection = this.openSection === section ? null : section;
  }

  get partnerRules(): any[] {
    return this.partner?.categoryRules?.filter(rule => !rule.is_delivery) || [];
  }

  get partnerDeliveryRules(): any[] {
    return this.partner?.categoryRules?.filter(rule => rule.is_delivery) || [];
  }

  savePartner() {
    if (!this.partner) return;

    this.loading = true;
    this.parceirosService.updatePartner(this.partner.id, this.partner).subscribe({
      next: updated => {
        this.partner = {
          ...updated,
          categoryRules: (updated as any).categoryRules || [],
          categoryInformationals: (updated as any).categoryInformationals || [],
          subcategory: (updated as any).subcategory || { name: '' },
        };
      },
      error: err => console.error('Erro ao salvar parceiro', err),
      complete: () => (this.loading = false),
    });
  }

  approvePartner() {
    if (!this.partner) return;

    this.approving = true;
    this.parceirosService.approvePartner(this.partner.id).subscribe({
      next: p => {
        this.partner = {
          ...p,
          categoryRules: (p as any).categoryRules || [],
          categoryInformationals: (p as any).categoryInformationals || [],
          subcategory: (p as any).subcategory || { name: '' },
        };
        console.log('Parceiro aprovado!', this.partner);
        this.approving = false;
      },
      error: err => {
        console.error('Erro ao aprovar parceiro', err);
        this.approving = false;
      },
    });
  }

  goBack() {
    this.router.navigate(['/parceiros']);
  }
}
