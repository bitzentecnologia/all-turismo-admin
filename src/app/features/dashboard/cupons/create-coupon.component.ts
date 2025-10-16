import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';
import { StatusAlertComponent } from '@shared/components/status-alert/status-alert.component';

interface CouponRule {
  id: string;
  text: string;
  checked: boolean;
}

interface CustomRule {
  id: string;
  text: string;
}

@Component({
  selector: 'app-create-coupon',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, StatusAlertComponent],
  templateUrl: './create-coupon.component.html',
  styleUrls: ['./create-coupon.component.scss'],
})
export class CreateCouponComponent implements OnInit {
  discountPercentage = '';
  description = '';
  selectedImages: File[] = [];
  imagePreviewUrls: string[] = [];

  rules: CouponRule[] = [
    {
      id: '1',
      text: 'Não é válido para feriados, vésperas de feriados e datas comemorativas.',
      checked: false,
    },
    {
      id: '2',
      text: 'Não é acumulativo com outras promoções vigentes no estabelecimento.',
      checked: false,
    },
    { id: '3', text: 'O consumo deve ser realizado no restaurante.', checked: false },
    {
      id: '4',
      text: 'Não é válido para delivery, embalagem para viagem e festivais com cardápios pré-definidos.',
      checked: false,
    },
    {
      id: '5',
      text: 'Outras bebidas, taxa de serviço, gorjeta e couvert artístico não estão inclusos no benefício.',
      checked: false,
    },
    {
      id: '6',
      text: 'Bebidas, entradas, sobremesas e taxa de entrega não estão incluídas no benefício.',
      checked: false,
    },
  ];

  customRules: CustomRule[] = [];
  maxDescriptionLength = 100;

  constructor(
    private router: Router,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle(`Criar novo cupom | ${environment.appName}`);
  }

  get descriptionCharCount(): number {
    return this.description.length;
  }

  get couponPreview(): string {
    if (!this.discountPercentage || !this.description) {
      return 'Ex: 20% de desconto no rodízio de pizza';
    }
    return `${this.discountPercentage}% ${this.description}`;
  }

  get minimumDiscountText(): string {
    if (this.discountPercentage) {
      return `Desconto mínimo de ${this.discountPercentage}%`;
    }
    return 'Desconto mínimo de 20%';
  }

  onImageSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const filesArray = Array.from(input.files);

      filesArray.forEach(file => {
        if (this.selectedImages.length < 3) {
          this.selectedImages.push(file);

          const reader = new FileReader();
          reader.onload = (e: ProgressEvent<FileReader>) => {
            if (e.target?.result) {
              this.imagePreviewUrls.push(e.target.result as string);
            }
          };
          reader.readAsDataURL(file);
        }
      });
    }
  }

  removeImage(index: number): void {
    this.selectedImages.splice(index, 1);
    this.imagePreviewUrls.splice(index, 1);
  }

  addCustomRule(): void {
    this.customRules.push({
      id: Date.now().toString(),
      text: '',
    });
  }

  removeCustomRule(index: number): void {
    this.customRules.splice(index, 1);
  }

  onCancel(): void {
    this.router.navigate(['/cupons']);
  }

  onSubmit(): void {
    const selectedRules = this.rules.filter(rule => rule.checked).map(rule => rule.text);

    const allRules = [...selectedRules, ...this.customRules.map(r => r.text).filter(t => t.trim())];

    const _couponData = {
      discountPercentage: parseInt(this.discountPercentage, 10),
      description: this.description,
      rules: allRules,
      images: this.selectedImages,
    };

    this.router.navigate(['/cupons']);
  }
}
