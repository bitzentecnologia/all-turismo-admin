import { Pipe, PipeTransform } from '@angular/core';
import { ImageService } from '../../core/services/image.service';

@Pipe({
  name: 'imagePath',
  standalone: true
})
export class ImagePathPipe implements PipeTransform {
  
  constructor(private imageService: ImageService) {}

  transform(value: string, type: 'logo' | 'icon' | 'product' | 'banner' | 'background' = 'icon'): string {
    switch (type) {
      case 'logo':
        return this.imageService.getLogoPath(value as any);
      case 'icon':
        return this.imageService.getIconPath(value);
      case 'product':
        return this.imageService.getProductImagePath(value);
      case 'banner':
        return this.imageService.getBannerPath('default', value);
      case 'background':
        return this.imageService.getBackgroundPath(value);
      default:
        return value;
    }
  }
}
