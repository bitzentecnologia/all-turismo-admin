import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private apiUrl = environment.apiUrl;

  // Base path para imagens
  private readonly basePath = 'assets/images';

  // Logos
  getLogoPath(type: 'primary' | 'white' | 'dark' | 'logo2' | 'logo5' = 'primary'): string {
    if (type === 'logo2') {
      return `${this.basePath}/logo/logo2.png`;
    }
    if (type === 'logo5') {
      return `${this.basePath}/logo/logo5.png`;
    }
    return `${this.basePath}/logo/logo-${type}.svg`;
  }

  // Ícones
  getIconPath(name: string, size?: string): string {
    const sizeSuffix = size ? `-${size}` : '';
    return `${this.basePath}/icons/icon-${name}${sizeSuffix}.svg`;
  }

  // Produtos
  getProductImagePath(productId: string): string {
    return `${this.basePath}/products/product-${productId}.jpg`;
  }

  // Estabelecimentos
  getEstablishmentImagePath(establishmentId: string): string {
    return `${this.basePath}/products/establishment-${establishmentId}.jpg`;
  }

  // Banners
  getBannerPath(type: string, id: string): string {
    return `${this.basePath}/banners/banner-${type}-${id}.jpg`;
  }

  // Backgrounds
  getBackgroundPath(name: string): string {
    return `${this.basePath}/backgrounds/${name}.jpg`;
  }

  // Verificar se imagem existe
  async imageExists(path: string): Promise<boolean> {
    try {
      const response = await fetch(path);
      return response.ok;
    } catch {
      return false;
    }
  }

  // Obter imagem com fallback
  async getImageWithFallback(primaryPath: string, fallbackPath: string): Promise<string> {
    const exists = await this.imageExists(primaryPath);
    return exists ? primaryPath : fallbackPath;
  }

  getImageById(id: string): string {

    return `${this.apiUrl}${id}`;
  }
}
