import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { DatePicker } from 'primeng/datepicker';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-create-coupon',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, DatePicker],
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
  startTime = '';
  endTime = '';

  maxDescriptionLength = 100;
  maxRulesLength = 200;

  timeOptions: string[] = [
    '00:00',
    '01:00',
    '02:00',
    '03:00',
    '04:00',
    '05:00',
    '06:00',
    '07:00',
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
    '21:00',
    '22:00',
    '23:00',
  ];

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
      startTime: this.startTime,
      endTime: this.endTime,
    };

    this.router.navigate(['/cupons']);
  }
}
