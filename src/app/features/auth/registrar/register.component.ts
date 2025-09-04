import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { formatCnpj, formatCep, formatPhone, validateNumbersOnly as validateNumbers } from '../../../shared/utils/masks';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  currentStep: number = 1;
  isLoading: boolean = false;

  // Dados da etapa 1 - Responsável
  name: string = '';
  email: string = '';
  phone: string = '';

  // Dados da etapa 2 - Endereço
  cep: string = '';
  state: string = '';
  city: string = '';
  neighborhood: string = '';
  street: string = '';
  number: string = '';
  complement: string = '';

  // Dados da etapa 3 - Estabelecimento
  establishmentName: string = '';
  cnpj: string = '';
  categoryId: string = '';
  subcategoryId: string = '';
  establishmentPhone: string = '';
  instagram: string = '';
  description: string = '';
  logoFile: File | null = null;
  logoPreview: string = '';

  // Categorias (futuramente carregadas de API)
  categories: any[] = [
    { id: '1', name: 'Gastronomia' },
    { id: '2', name: 'Lazer' },
    { id: '3', name: 'Serviços' },
    { id: '4', name: 'Hotelaria' },
    { id: '5', name: 'Shows' }
  ];

  subcategories: any[] = [
    { id: '1', categoryId: '1', name: 'Restaurante' },
    { id: '2', categoryId: '1', name: 'Bar' },
    { id: '3', categoryId: '1', name: 'Café' },
    { id: '4', categoryId: '2', name: 'Parque' },
    { id: '5', categoryId: '2', name: 'Cinema' },
    { id: '6', categoryId: '3', name: 'Consultório' },
    { id: '7', categoryId: '4', name: 'Hotel' },
    { id: '8', categoryId: '4', name: 'Pousada' },
    { id: '9', categoryId: '5', name: 'Casa de Show' }
  ];

  constructor(private router: Router) {}

  // Navegação entre etapas
  nextStep(): void {
    if (this.validateCurrentStep()) {
      this.isLoading = true;
      
      setTimeout(() => {
        this.isLoading = false;
        if (this.currentStep < 3) {
          this.currentStep++;
        } else {
          // Finalizar processo
          this.finishRegistration();
        }
      }, 1000);
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    } else {
      this.router.navigate(['/login']);
    }
  }

  // Validação por etapa
  validateCurrentStep(): boolean {
    switch (this.currentStep) {
      case 1:
        if (!this.name || !this.email || !this.phone) {
          alert('Por favor, preencha todos os campos da etapa 1');
          return false;
        }
        break;
      case 2:
        if (!this.cep || !this.state || !this.city || !this.neighborhood || !this.street || !this.number) {
          alert('Por favor, preencha todos os campos obrigatórios da etapa 2');
          return false;
        }
        break;
      case 3:
        if (!this.establishmentName || !this.cnpj || !this.categoryId || !this.establishmentPhone) {
          alert('Por favor, preencha todos os campos obrigatórios da etapa 3');
          return false;
        }
        break;
    }
    return true;
  }

  // Finalizar registro
  finishRegistration(): void {
    console.log('Registro finalizado:', {
      responsavel: { name: this.name, email: this.email, phone: this.phone },
      endereco: { 
        cep: this.cep, 
        state: this.state, 
        city: this.city, 
        neighborhood: this.neighborhood,
        street: this.street,
        number: this.number,
        complement: this.complement
      },
      estabelecimento: { 
        name: this.establishmentName, 
        cnpj: this.cnpj,
        categoryId: this.categoryId,
        subcategoryId: this.subcategoryId,
        phone: this.establishmentPhone,
        instagram: this.instagram,
        description: this.description,
        logo: this.logoFile ? this.logoFile.name : null
      }
    });
    
    this.router.navigate(['/']);
  }

  // Máscara para telefone brasileiro
  formatPhone(event: any): void {
    this.phone = formatPhone(event.target.value);
  }

  // Máscara para CEP brasileiro
  formatCep(event: any): void {
    this.cep = formatCep(event.target.value);
  }

  // Máscara para CNPJ brasileiro
  formatCnpj(event: any): void {
    this.cnpj = formatCnpj(event.target.value);
  }

  // Máscara para telefone fixo ou celular
  formatEstablishmentPhone(event: any): void {
    this.establishmentPhone = formatPhone(event.target.value);
  }

  // Validar apenas números no input
  validateNumbersOnly(event: any): boolean {
    return validateNumbers(event);
  }

  // Upload de logo
  onLogoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.logoFile = file;
      
      // Criar preview da imagem
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.logoPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Remover logo
  removeLogo(): void {
    this.logoFile = null;
    this.logoPreview = '';
  }

  // Obter subcategorias filtradas por categoria
  getFilteredSubcategories(): any[] {
    if (!this.categoryId) return [];
    return this.subcategories.filter(sub => sub.categoryId === this.categoryId);
  }

  // Getters para controlar visibilidade
  get isStep1(): boolean {
    return this.currentStep === 1;
  }

  get isStep2(): boolean {
    return this.currentStep === 2;
  }

  get isStep3(): boolean {
    return this.currentStep === 3;
  }

  get isLastStep(): boolean {
    return this.currentStep === 3;
  }

  get stepTitle(): string {
    switch (this.currentStep) {
      case 1: return 'Dados do responsável';
      case 2: return 'Endereço';
      case 3: return 'Estabelecimento';
      default: return '';
    }
  }

  get buttonText(): string {
    return this.isLastStep ? 'Criar conta' : 'Continuar';
  }
}
