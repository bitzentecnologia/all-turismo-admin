import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';
import { formatCnpj, formatCep, formatPhone, validateNumbersOnly as validateNumbers } from '../../../shared/utils/masks';
import { DropDownItem } from '../../../shared/models/dropdown.model';
import { RegisterFormData } from './register.model';
import { CepService } from '../../../shared/services/cep.service';
import { AuthService } from './auth.service';
import { cnpjValidator } from '@shared/utils/cnpj-validator';

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

  categories: DropDownItem[] = [];
  subcategories: DropDownItem[] = [];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private cepService: CepService,
    private cdr: ChangeDetectorRef,
    private titleService: Title,
    private authService: AuthService
  ) {}


  ngOnInit(): void {
    this.titleService.setTitle(`Registrar | ${environment.appName}`);
    this.initForm();

    // Load categories from API
    this.authService.getCategories().subscribe({
      next: (res) => (this.categories = res),
      error: (err) => console.error('Erro ao carregar categorias:', err),
    });
  }

  // Finalizar registro
  finishRegistration(): void {
    if (this.registerForm.valid) {
      const formData: RegisterFormData = this.registerForm.value;
      this.isLoading = true;

      this.authService.register(formData).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/registro-sucesso']);
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Erro no registro:', err);
        },
      });
    }
  }

  // Atualizar subcategorias ao mudar categoria
  onCategoryChange(categoryId: string): void {
    if (!categoryId) {
      this.subcategories = [];
      this.establishmentForm.patchValue({ subcategoryId: '' });
      return;
    }

    this.authService.getSubcategories(categoryId).subscribe({
      next: (res) => {
        this.subcategories = res.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
        this.establishmentForm.patchValue({ subcategoryId: '' });
      },
      error: (err) => console.error('Erro ao carregar subcategorias:', err)
    });
  }

  private initForm(): void {
    this.registerForm = this.fb.group({
      responsible: this.fb.group({
        name: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
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
        cnpj: ['', [Validators.required, Validators.minLength(18), cnpjValidator()]],
        categoryId: ['', Validators.required],
        subcategoryId: [''],
        phone: ['', [Validators.required, Validators.minLength(14)]],
        instagram: [''],
        description: ['', Validators.maxLength(100)],
        logoFile: [null],
        logoPreview: ['']
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
    console.log('Arquivo selecionado:', file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        console.log('Preview gerado:', e.target.result);
        this.registerForm.get('establishment.logoPreview')?.setValue(e.target.result);
        this.registerForm.get('establishment.logoFile')?.setValue(file);
        console.log('Valores do formulário após upload:', {
          logoPreview: this.registerForm.get('establishment.logoPreview')?.value,
          logoFile: this.registerForm.get('establishment.logoFile')?.value
        });
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  // Remover logo
  removeLogo(): void {
    this.registerForm.get('establishment.logoPreview')?.setValue('');
    this.registerForm.get('establishment.logoFile')?.setValue(null);
    this.cdr.detectChanges();
  }

  // Obter subcategorias filtradas por categoria
  getFilteredSubcategories(): DropDownItem[] {
    const categoryId = this.registerForm.get('establishment.categoryId')?.value;
    if (!categoryId) return [];
    return this.subcategories
      .filter(sub => sub.parentId === categoryId)
      .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
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
