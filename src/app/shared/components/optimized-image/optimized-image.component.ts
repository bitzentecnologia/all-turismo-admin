import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageService } from '../../../core/services/image.service';

@Component({
  selector: 'app-optimized-image',
  standalone: true,
  imports: [CommonModule],
  template: `
    <img 
      [src]="imageSrc" 
      [alt]="alt"
      [class]="cssClass"
      [style]="customStyle"
      (load)="onImageLoad()"
      (error)="onImageError()"
      [class.loading]="isLoading"
      [class.error]="hasError"
    />
  `,
  styles: [`
    img {
      transition: opacity 0.3s ease;
    }
    
    img.loading {
      opacity: 0.6;
    }
    
    img.error {
      opacity: 0.3;
    }
  `]
})
export class OptimizedImageComponent implements OnInit {
  @Input() src!: string;
  @Input() alt: string = '';
  @Input() type: 'logo' | 'icon' | 'product' | 'banner' | 'background' = 'icon';
  @Input() fallback?: string;
  @Input() cssClass?: string;
  @Input() customStyle?: string;

  imageSrc: string = '';
  isLoading: boolean = true;
  hasError: boolean = false;

  constructor(private imageService: ImageService) {}

  ngOnInit() {
    this.loadImage();
  }

  private async loadImage() {
    this.isLoading = true;
    this.hasError = false;

    try {
      // Obter caminho da imagem baseado no tipo
      let imagePath = '';
      switch (this.type) {
        case 'logo':
          imagePath = this.imageService.getLogoPath(this.src as any);
          break;
        case 'icon':
          imagePath = this.imageService.getIconPath(this.src);
          break;
        case 'product':
          imagePath = this.imageService.getProductImagePath(this.src);
          break;
        case 'banner':
          imagePath = this.imageService.getBannerPath('default', this.src);
          break;
        case 'background':
          imagePath = this.imageService.getBackgroundPath(this.src);
          break;
        default:
          imagePath = this.src;
      }

      // Verificar se a imagem existe
      const exists = await this.imageService.imageExists(imagePath);
      if (exists) {
        this.imageSrc = imagePath;
      } else if (this.fallback) {
        this.imageSrc = this.fallback;
      } else {
        this.imageSrc = imagePath; // Tentar mesmo assim
      }
    } catch (error) {
      console.error('Erro ao carregar imagem:', error);
      this.hasError = true;
      if (this.fallback) {
        this.imageSrc = this.fallback;
      }
    }
  }

  onImageLoad() {
    this.isLoading = false;
    this.hasError = false;
  }

  onImageError() {
    this.isLoading = false;
    this.hasError = true;
    if (this.fallback && this.imageSrc !== this.fallback) {
      this.imageSrc = this.fallback;
    }
  }
}
