import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ParceirosService, PartnerDetailsResponse, InformationalData } from '../parceiros.service';
import { CommonModule } from '@angular/common';
import { ImageService } from '@core/services/image.service';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { DropDownItem } from '@shared/models/dropdown.model';
import { formatPhone, formatCnpj, formatCep } from '@shared/utils/masks';

export type Partner = PartnerDetailsResponse & {
  subcategory: { name: string };
  category_rules: any[];
  category_informationals: any[];
  photos: string[];
  logo_url: string;
  promotion: string;
  has_delivery: boolean;
  operating_hours: any;
  users: any[];
};

export interface SelectedInformational {
  id: string;
  checked: boolean;
}

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
  informationals: InformationalData[] = [];
  selectedInformationals: SelectedInformational[] = [];

  constructor(
    private route: ActivatedRoute,
    private parceirosService: ParceirosService,
    private router: Router,
    public imageService: ImageService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loading = true;
        this.parceirosService.getPartnerById(id).subscribe({
          next: (p: PartnerDetailsResponse) => {
            this.partner = {
              ...p,
              category_rules: ((p as any).category_rules || []).map((rule: any) => ({
                ...rule,
                isActive: rule.isActive !== undefined ? rule.isActive : true
              })),
              category_informationals: (p as any).category_informationals || [],
              subcategory: (p as any).subcategory || { name: '' },
              photos: (p as any).photos || [],
              logo_url: (p as any).logo_url || '',
              promotion: (p as any).promotion || '',
              has_delivery: (p as any).has_delivery || false,
              operating_hours: (p as any).operating_hours || {},
              users: (p as any).users || [],
            };

            // Se as informações já foram carregadas, inicializar agora
            if (this.informationals.length > 0) {
              this.initializeSelectedInformationals();
            }
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

    this.parceirosService.getInformationals().subscribe({
      next: res => {
        this.informationals = res;

        // Se o parceiro já foi carregado, inicializar agora
        if (this.partner) {
          this.initializeSelectedInformationals();
        }
      },
      error: err => console.error('Erro ao carregar dados informacionais:', err),
    });
  }

  toggleSection(section: string) {
    this.openSection = this.openSection === section ? null : section;
  }

  get partnerRules(): any[] {
    return this.partner?.category_rules?.filter(rule => !rule.is_delivery) || [];
  }

  get partnerDeliveryRules(): any[] {
    return this.partner?.category_rules?.filter(rule => rule.is_delivery) || [];
  }

  get partnerCategoryInformationals(): any[] {
    return this.partner?.category_informationals || [];
  }

  get filteredInformationals(): InformationalData[] {
    if (!this.partner?.category?.id || !this.informationals?.length) {
      return [];
    }
    return this.informationals.filter(info => info.category_id === this.partner!.category!.id);
  }

  savePartner() {
    if (!this.partner) return;

    // Salvar informações selecionadas
    this.saveInformationals();

    // Preservar os valores de horário mesmo quando fechado
    const partnerToSave = { ...this.partner };
    if (partnerToSave.operating_hours) {
      const preservedHours = { ...partnerToSave.operating_hours };
      Object.keys(preservedHours).forEach(day => {
        if (preservedHours[day]) {
          // Manter os valores de startTime e endTime mesmo se isClosed for true
          preservedHours[day] = {
            ...preservedHours[day],
            startTime: preservedHours[day].startTime || '09:00',
            endTime: preservedHours[day].endTime || '18:00'
          };
        }
      });
      partnerToSave.operating_hours = preservedHours;
    }

    this.loading = true;
    this.parceirosService.updatePartner(this.partner.id, partnerToSave).subscribe({
      next: updated => {
        this.partner = {
          ...updated,
          category_rules: ((updated as any).category_rules || []).map((rule: any) => ({
            ...rule,
            isActive: rule.isActive !== undefined ? rule.isActive : true
          })),
          category_informationals: (updated as any).category_informationals || [],
          subcategory: (updated as any).subcategory || { name: '' },
          photos: (updated as any).photos || [],
          logo_url: (updated as any).logo_url || '',
          promotion: (updated as any).promotion || '',
          has_delivery: (updated as any).has_delivery || false,
          operating_hours: (updated as any).operating_hours || {},
          users: (updated as any).users || [],
        };
        this.initializeSelectedInformationals();
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
          category_rules: (p as any).category_rules || [],
          category_informationals: (p as any).category_informationals || [],
          subcategory: (p as any).subcategory || { name: '' },
          photos: (p as any).photos || [],
          logo_url: (p as any).logo_url || '',
          promotion: (p as any).promotion || '',
          has_delivery: (p as any).has_delivery || false,
          operating_hours: (p as any).operating_hours || {},
          users: (p as any).users || [],
        };
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

  getDaysOfWeek(): string[] {
    return ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  }

  getDayName(day: string): string {
    const days: { [key: string]: string } = {
      monday: 'Segunda-feira',
      tuesday: 'Terça-feira',
      wednesday: 'Quarta-feira',
      thursday: 'Quinta-feira',
      friday: 'Sexta-feira',
      saturday: 'Sábado',
      sunday: 'Domingo'
    };
    return days[day] || day;
  }

  // Métodos para aplicar máscaras
  onPhoneInput(event: any) {
    const value = event.target.value;
    event.target.value = formatPhone(value);
  }

  onCnpjInput(event: any) {
    const value = event.target.value;
    event.target.value = formatCnpj(value);
  }

  onCepInput(event: any) {
    const value = event.target.value;
    event.target.value = formatCep(value);
  }

  // Métodos para gerenciar regras
  addRule() {
    if (!this.partner) return;

    const newRule = {
      id: Date.now().toString(),
      text: '',
      is_delivery: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      category_id: this.partner.category?.id || ''
    };

    this.partner.category_rules = [...this.partner.category_rules, newRule];
  }

  removeRule(index: number) {
    if (!this.partner) return;
    this.partner.category_rules.splice(index, 1);
  }

  addDeliveryRule() {
    if (!this.partner) return;

    const newRule = {
      id: Date.now().toString(),
      text: '',
      is_delivery: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      category_id: this.partner.category?.id || ''
    };

    this.partner.category_rules = [...this.partner.category_rules, newRule];
  }

  removeDeliveryRule(index: number) {
    if (!this.partner) return;
    this.partnerDeliveryRules.splice(index, 1);
  }

  cleanPhoneNumber(phone: string): string {
    return phone.replace(/\D/g, '');
  }

  // Métodos para gerenciar informações selecionadas (seguindo padrão do registro)
  initializeSelectedInformationals() {
    if (!this.partner || !this.informationals.length) return;

    const availableInformationals = this.filteredInformationals;
    const existingInformationals = this.partner.category_informationals || [];

    this.selectedInformationals = availableInformationals.map(info => {
      const existingInfo = existingInformationals.find((ei: any) => ei.id === info.id);
      const checked = !!existingInfo;

      return {
        id: info.id,
        checked: checked
      };
    });
  }

  toggleInformationalSelection(selectedInfo: SelectedInformational) {
    const index = this.selectedInformationals.findIndex(si => si.id === selectedInfo.id);
    if (index >= 0) {
      this.selectedInformationals[index].checked = !this.selectedInformationals[index].checked;
    }
  }

  saveInformationals() {
    if (!this.partner) return;

    const selectedInfos = this.selectedInformationals.filter(si => si.checked);
    this.partner.category_informationals = selectedInfos.map(si => {
      const existingInfo = this.partner?.category_informationals?.find((ci: any) => ci.informational_id === si.id);
      return {
        id: existingInfo?.id || Date.now().toString(),
        informational_id: si.id,
        text: this.getInformationalTitle(si.id) // Usar o texto padrão da API
      };
    });
  }

  getInformationalIcon(id: string): string {
    const info = this.filteredInformationals.find(i => i.id === id);
    return info?.icon || 'info';
  }

  getInformationalTitle(id: string): string {
    const info = this.filteredInformationals.find(i => i.id === id);
    return info?.text || 'Informação';
  }
}
