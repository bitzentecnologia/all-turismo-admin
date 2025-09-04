import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { formatCnpj, formatCep, formatPhone, validateNumbersOnly as validateNumbers } from '../../../shared/utils/masks';
import { DropDownItem } from '../../../shared/models/dropdown.model';
import { RegisterFormData } from './register.model';
import { CepService } from '../../../shared/services/cep.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  currentStep: number = 1;
  isLoading: boolean = false;
  isConsultingCep: boolean = false;
  registerForm!: FormGroup;

  // Categorias (futuramente carregadas de API)
  categories: DropDownItem[] = [
    { id: '1', name: 'Gastronomia' },
    { id: '2', name: 'Lazer' },
    { id: '3', name: 'Serviços' },
    { id: '4', name: 'Hotelaria' },
    { id: '5', name: 'Shows' }
  ];

  subcategories: DropDownItem[] = [
    { id: '1', parentId: '1', name: 'Restaurante' },
    { id: '2', parentId: '1', name: 'Bar' },
    { id: '3', parentId: '1', name: 'Café' },
    { id: '4', parentId: '2', name: 'Parque' },
    { id: '5', parentId: '2', name: 'Cinema' },
    { id: '6', parentId: '3', name: 'Consultório' },
    { id: '7', parentId: '4', name: 'Hotel' },
    { id: '8', parentId: '4', name: 'Pousada' },
    { id: '9', parentId: '5', name: 'Casa de Show' }
  ];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private cepService: CepService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.registerForm = this.fb.group({
      responsible: this.fb.group({
        name: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.minLength(14)]]
      }),
      address: this.fb.group({
        cep: ['', [Validators.required, Validators.minLength(8)]],
        state: ['', Validators.required],
        city: ['', Validators.required],
        neighborhood: ['', Validators.required],
        street: ['', Validators.required],
        number: ['', Validators.required],
        complement: ['']
      }),
      establishment: this.fb.group({
        name: ['', [Validators.required, Validators.minLength(2)]],
        cnpj: ['', [Validators.required, Validators.minLength(18)]],
        categoryId: ['', Validators.required],
        subcategoryId: [''],
        phone: ['', [Validators.required, Validators.minLength(14)]],
        instagram: [''],
        description: ['', Validators.maxLength(100)]
      })
    });
  }

  // Navegação entre etapas
  nextStep(): void {
    if (this.validateCurrentStep()) {
      this.isLoading = true;
      
      setTimeout(() => {
        this.isLoading = false;
        if (this.currentStep < 3) {
          this.currentStep++;
        } else {
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
    const formGroup = this.getCurrentStepFormGroup();
    if (formGroup && formGroup.invalid) {
      this.markFormGroupTouched(formGroup);
      return false;
    }
    return true;
  }

  private getCurrentStepFormGroup(): FormGroup | null {
    switch (this.currentStep) {
      case 1: return this.registerForm.get('responsible') as FormGroup;
      case 2: return this.registerForm.get('address') as FormGroup;
      case 3: return this.registerForm.get('establishment') as FormGroup;
      default: return null;
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  // Finalizar registro
  finishRegistration(): void {
    if (this.registerForm.valid) {
      const formData: RegisterFormData = this.registerForm.value;
      console.log('Registro finalizado:', formData);
      this.router.navigate(['/']);
    }
  }

  // Máscaras
  formatPhone(event: any): void {
    const value = formatPhone(event.target.value);
    this.registerForm.get('responsible.phone')?.setValue(value);
  }

  formatCep(event: any): void {
    const value = formatCep(event.target.value);
    this.registerForm.get('address.cep')?.setValue(value);
    
    // Consulta CEP automaticamente quando tiver 8 dígitos
    const cepLimpo = value.replace(/\D/g, '');
    if (cepLimpo.length === 8) {
      this.consultCep(cepLimpo);
    }
  }

  // Consultar CEP automaticamente
  private consultCep(cep: string): void {
    this.isConsultingCep = true;
    
    this.cepService.consultarCep(cep).subscribe({
      next: (response) => {
        // Preenche automaticamente os campos de endereço
        this.registerForm.patchValue({
          address: {
            cep: this.cepService.formatarCep(response.cep),
            state: response.uf,
            city: response.localidade,
            neighborhood: response.bairro,
            street: response.logradouro
          }
        });
        this.isConsultingCep = false;
      },
      error: (error) => {
        console.log('CEP não encontrado ou erro na consulta:', error.message);
        // Limpa os campos de endereço em caso de erro
        this.registerForm.patchValue({
          address: {
            state: '',
            city: '',
            neighborhood: '',
            street: ''
          }
        });
        this.isConsultingCep = false;
      }
    });
  }

  formatCnpj(event: any): void {
    const value = formatCnpj(event.target.value);
    this.registerForm.get('establishment.cnpj')?.setValue(value);
  }

  formatEstablishmentPhone(event: any): void {
    const value = formatPhone(event.target.value);
    this.registerForm.get('establishment.phone')?.setValue(value);
  }

  // Validar apenas números no input
  validateNumbersOnly(event: any): boolean {
    return validateNumbers(event);
  }

  // Upload de logo
  onLogoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.registerForm.get('establishment.logoPreview')?.setValue(e.target.result);
        this.registerForm.get('establishment.logoFile')?.setValue(file);
      };
      reader.readAsDataURL(file);
    }
  }

  // Remover logo
  removeLogo(): void {
    this.registerForm.get('establishment.logoPreview')?.setValue('');
    this.registerForm.get('establishment.logoFile')?.setValue(null);
  }

  // Obter subcategorias filtradas por categoria
  getFilteredSubcategories(): DropDownItem[] {
    const categoryId = this.registerForm.get('establishment.categoryId')?.value;
    if (!categoryId) return [];
    return this.subcategories.filter(sub => sub.parentId === categoryId);
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

  // Getters para acessar os formulários
  get responsibleForm(): FormGroup {
    return this.registerForm.get('responsible') as FormGroup;
  }

  get addressForm(): FormGroup {
    return this.registerForm.get('address') as FormGroup;
  }

  get establishmentForm(): FormGroup {
    return this.registerForm.get('establishment') as FormGroup;
  }
}
