import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { DatePicker } from 'primeng/datepicker';
import { environment } from '../../../../environments/environment';
import { CouponSuccessModalComponent } from '@shared/components/coupon-success-modal/coupon-success-modal.component';

@Component({
  selector: 'app-create-coupon',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, DatePicker, CouponSuccessModalComponent],
  templateUrl: './create-coupon.component.html',
  styleUrls: ['./create-coupon.component.scss'],
})
export class CreateCouponComponent implements OnInit {
  description = '';
  dailyQuantity = '';
  rules = '';
  selectedImages: File[] = [];
  imagePreviewUrls: string[] = [];
  startDate: Date | null = null;
  endDate: Date | null = null;
  startTime: Date | null = null;
  endTime: Date | null = null;
  showSuccessModal = false;

  maxDescriptionLength = 100;
  maxRulesLength = 200;

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

  get rulesCharCount(): number {
    return this.rules.length;
  }

  showExampleRules(): void {
    alert(
      'Exemplo de regras:\n\n' +
        '- Válido apenas para consumo no local\n' +
        '- Não acumulativo com outras promoções\n' +
        '- Não válido para feriados\n' +
        '- Sujeito à disponibilidade'
    );
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

  onCancel(): void {
    this.router.navigate(['/cupons']);
  }

  onSubmit(): void {
    const _couponData = {
      description: this.description,
      dailyQuantity: parseInt(this.dailyQuantity, 10),
      rules: this.rules,
      images: this.selectedImages,
      startDate: this.startDate ? this.startDate.toISOString() : null,
      endDate: this.endDate ? this.endDate.toISOString() : null,
      startTime: this.startTime ? this.startTime.toLocaleTimeString() : null,
      endTime: this.endTime ? this.endTime.toLocaleTimeString() : null,
    };

    this.showSuccessModal = true;
  }

  onModalClosed(): void {
    this.router.navigate(['/cupons']);
  }

  onViewRequests(): void {
    this.router.navigate(['/cupons']);
  }
}
