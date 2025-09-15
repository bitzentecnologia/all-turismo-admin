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
    { id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', name: 'Gastronomia' },
    { id: 'b2c3d4e5-f6g7-8901-bcde-f23456789012', name: 'Lazer' },
    { id: 'c3d4e5f6-g7h8-9012-cdef-345678901234', name: 'Serviços' },
    { id: 'd4e5f6g7-h8i9-0123-defg-456789012345', name: 'Hotelaria' },
    { id: 'e5f6g7h8-i9j0-1234-efgh-567890123456', name: 'Shows' }
  ];

  subcategories: DropDownItem[] = [
    // GASTRONOMIA
    { id: 'f6g7h8i9-j0k1-2345-fghi-678901234567', parentId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', name: 'Buffet' },
    { id: 'g7h8i9j0-k1l2-3456-ghij-789012345678', parentId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', name: 'A la carte' },
    { id: 'h8i9j0k1-l2m3-4567-hijk-890123456789', parentId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', name: 'Frutos do mar' },
    { id: 'i9j0k1l2-m3n4-5678-ijkl-901234567890', parentId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', name: 'Churrascaria' },
    { id: 'j0k1l2m3-n4o5-6789-jklm-012345678901', parentId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', name: 'Japonesa' },
    { id: 'k1l2m3n4-o5p6-7890-klmn-123456789012', parentId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', name: 'Chinesa' },
    { id: 'l2m3n4o5-p6q7-8901-lmno-234567890123', parentId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', name: 'Australiana' },
    { id: 'm3n4o5p6-q7r8-9012-mnop-345678901234', parentId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', name: 'Coreana' },
    { id: 'n4o5p6q7-r8s9-0123-nopq-456789012345', parentId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', name: 'Mexicana' },
    { id: 'o5p6q7r8-s9t0-1234-opqr-567890123456', parentId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', name: 'Arabe' },
    { id: 'p6q7r8s9-t0u1-2345-pqrs-678901234567', parentId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', name: 'Indiana' },
    { id: 'q7r8s9t0-u1v2-3456-qrst-789012345678', parentId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', name: 'Siria' },
    { id: 'r8s9t0u1-v2w3-4567-rstu-890123456789', parentId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', name: 'Vegetariana' },
    { id: 's9t0u1v2-w3x4-5678-stuv-901234567890', parentId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', name: 'Pizzaria' },
    { id: 't0u1v2w3-x4y5-6789-tuvw-012345678901', parentId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', name: 'Cantinas' },
    { id: 'u1v2w3x4-y5z6-7890-uvwx-123456789012', parentId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', name: 'Casa de massas' },
    { id: 'v2w3x4y5-z6a7-8901-vwxy-234567890123', parentId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', name: 'Beachclub' },
    { id: 'w3x4y5z6-a7b8-9012-wxyz-345678901234', parentId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', name: 'Bar' },
    { id: 'x4y5z6a7-b8c9-0123-xyza-456789012345', parentId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', name: 'Hamburgeria' },
    { id: 'y5z6a7b8-c9d0-1234-yzab-567890123456', parentId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', name: 'Lanchonete' },
    { id: 'z6a7b8c9-d0e1-2345-zabc-678901234567', parentId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', name: 'Pub' },
    { id: 'a7b8c9d0-e1f2-3456-abcd-789012345678', parentId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', name: 'Biastro' },
    { id: 'b8c9d0e1-f2g3-4567-bcde-890123456789', parentId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', name: 'Fast food' },
    { id: 'c9d0e1f2-g3h4-5678-cdef-901234567890', parentId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', name: 'Temakeria' },
    { id: 'd0e1f2g3-h4i5-6789-defg-012345678901', parentId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', name: 'Creperia' },
    { id: 'e1f2g3h4-i5j6-7890-efgh-123456789012', parentId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', name: 'Cafeteria' },
    { id: 'f2g3h4i5-j6k7-8901-fghi-234567890123', parentId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', name: 'Padaria' },
    { id: 'g3h4i5j6-k7l8-9012-ghij-345678901234', parentId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', name: 'Foodtruck' },
    { id: 'h4i5j6k7-l8m9-0123-hijk-456789012345', parentId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', name: 'Vinicola' },

    // EVENTOS
    { id: 'i5j6k7l8-m9n0-1234-ijkl-567890123456', parentId: 'e5f6g7h8-i9j0-1234-efgh-567890123456', name: 'Show' },
    { id: 'j6k7l8m9-n0o1-2345-jklm-678901234567', parentId: 'e5f6g7h8-i9j0-1234-efgh-567890123456', name: 'Congresso' },
    { id: 'k7l8m9n0-o1p2-3456-klmn-789012345678', parentId: 'e5f6g7h8-i9j0-1234-efgh-567890123456', name: 'Conferencia' },
    { id: 'l8m9n0o1-p2q3-4567-lmno-890123456789', parentId: 'e5f6g7h8-i9j0-1234-efgh-567890123456', name: 'Concerto' },
    { id: 'm9n0o1p2-q3r4-5678-mnop-901234567890', parentId: 'e5f6g7h8-i9j0-1234-efgh-567890123456', name: 'Festival' },
    { id: 'n0o1p2q3-r4s5-6789-nopq-012345678901', parentId: 'e5f6g7h8-i9j0-1234-efgh-567890123456', name: 'Espetaculo teatral' },
    { id: 'o1p2q3r4-s5t6-7890-opqr-123456789012', parentId: 'e5f6g7h8-i9j0-1234-efgh-567890123456', name: 'Exposição' },
    { id: 'p2q3r4s5-t6u7-8901-pqrs-234567890123', parentId: 'e5f6g7h8-i9j0-1234-efgh-567890123456', name: 'Torneio' },
    { id: 'q3r4s5t6-u7v8-9012-qrst-345678901234', parentId: 'e5f6g7h8-i9j0-1234-efgh-567890123456', name: 'Maratona' },
    { id: 'r4s5t6u7-v8w9-0123-rstu-456789012345', parentId: 'e5f6g7h8-i9j0-1234-efgh-567890123456', name: 'Confraternização' },
    { id: 's5t6u7v8-w9x0-1234-stuv-567890123456', parentId: 'e5f6g7h8-i9j0-1234-efgh-567890123456', name: 'Samba' },
    { id: 't6u7v8w9-x0y1-2345-tuvw-678901234567', parentId: 'e5f6g7h8-i9j0-1234-efgh-567890123456', name: 'Pagode' },
    { id: 'u7v8w9x0-y1z2-3456-uvwx-789012345678', parentId: 'e5f6g7h8-i9j0-1234-efgh-567890123456', name: 'Blues' },
    { id: 'v8w9x0y1-z2a3-4567-vwxy-890123456789', parentId: 'e5f6g7h8-i9j0-1234-efgh-567890123456', name: 'Jazz' },
    { id: 'w9x0y1z2-a3b4-5678-wxyz-901234567890', parentId: 'e5f6g7h8-i9j0-1234-efgh-567890123456', name: 'Sertanejo' },
    { id: 'x0y1z2a3-b4c5-6789-xyza-012345678901', parentId: 'e5f6g7h8-i9j0-1234-efgh-567890123456', name: 'Funk' },
    { id: 'y1z2a3b4-c5d6-7890-yzab-123456789012', parentId: 'e5f6g7h8-i9j0-1234-efgh-567890123456', name: 'Tecno' },
    { id: 'z2a3b4c5-d6e7-8901-zabc-234567890123', parentId: 'e5f6g7h8-i9j0-1234-efgh-567890123456', name: 'Dj' },
    { id: 'a3b4c5d6-e7f8-9012-abcd-345678901234', parentId: 'e5f6g7h8-i9j0-1234-efgh-567890123456', name: 'Lual' },
    { id: 'b4c5d6e7-f8g9-0123-bcde-456789012345', parentId: 'e5f6g7h8-i9j0-1234-efgh-567890123456', name: 'Jantar harmonizado' },
    { id: 'c5d6e7f8-g9h0-1234-cdef-567890123456', parentId: 'e5f6g7h8-i9j0-1234-efgh-567890123456', name: 'Aniversario' },
    { id: 'd6e7f8g9-h0i1-2345-defg-678901234567', parentId: 'e5f6g7h8-i9j0-1234-efgh-567890123456', name: 'Casamento' },
    { id: 'e7f8g9h0-i1j2-3456-efgh-789012345678', parentId: 'e5f6g7h8-i9j0-1234-efgh-567890123456', name: 'Cha de bebe' },
    { id: 'f8g9h0i1-j2k3-4567-fghi-890123456789', parentId: 'e5f6g7h8-i9j0-1234-efgh-567890123456', name: 'Formatura' },
    { id: 'g9h0i1j2-k3l4-5678-ghij-901234567890', parentId: 'e5f6g7h8-i9j0-1234-efgh-567890123456', name: 'Lancamento produto' },

    // LAZER
    { id: 'h0i1j2k3-l4m5-6789-hijk-012345678901', parentId: 'b2c3d4e5-f6g7-8901-bcde-f23456789012', name: 'Mergulho' },
    { id: 'i1j2k3l4-m5n6-7890-ijkl-123456789012', parentId: 'b2c3d4e5-f6g7-8901-bcde-f23456789012', name: 'Sandboard' },
    { id: 'j2k3l4m5-n6o7-8901-jklm-234567890123', parentId: 'b2c3d4e5-f6g7-8901-bcde-f23456789012', name: 'Surf' },
    { id: 'k3l4m5n6-o7p8-9012-klmn-345678901234', parentId: 'b2c3d4e5-f6g7-8901-bcde-f23456789012', name: 'Canoagem' },
    { id: 'l4m5n6o7-p8q9-0123-lmno-456789012345', parentId: 'b2c3d4e5-f6g7-8901-bcde-f23456789012', name: 'Rafting' },
    { id: 'm5n6o7p8-q9r0-1234-mnop-567890123456', parentId: 'b2c3d4e5-f6g7-8901-bcde-f23456789012', name: 'Paraquedismo' },
    { id: 'n6o7p8q9-r0s1-2345-nopq-678901234567', parentId: 'b2c3d4e5-f6g7-8901-bcde-f23456789012', name: 'Bungee jumping' },
    { id: 'o7p8q9r0-s1t2-3456-opqr-789012345678', parentId: 'b2c3d4e5-f6g7-8901-bcde-f23456789012', name: 'Windsurf' },
    { id: 'p8q9r0s1-t2u3-4567-pqrs-890123456789', parentId: 'b2c3d4e5-f6g7-8901-bcde-f23456789012', name: 'Kitesurf' },
    { id: 'q9r0s1t2-u3v4-5678-qrst-901234567890', parentId: 'b2c3d4e5-f6g7-8901-bcde-f23456789012', name: 'Tirolesa' },
    { id: 'r0s1t2u3-v4w5-6789-rstu-012345678901', parentId: 'b2c3d4e5-f6g7-8901-bcde-f23456789012', name: 'Rapel' },
    { id: 's1t2u3v4-w5x6-7890-stuv-123456789012', parentId: 'b2c3d4e5-f6g7-8901-bcde-f23456789012', name: 'Escalada' },
    { id: 't2u3v4w5-x6y7-8901-tuvw-234567890123', parentId: 'b2c3d4e5-f6g7-8901-bcde-f23456789012', name: 'Parque tematico' },
    { id: 'u3v4w5x6-y7z8-9012-uvwx-345678901234', parentId: 'b2c3d4e5-f6g7-8901-bcde-f23456789012', name: 'Trilhas' },
    { id: 'v4w5x6y7-z8a9-0123-vwxy-456789012345', parentId: 'b2c3d4e5-f6g7-8901-bcde-f23456789012', name: 'Banana boat' },
    { id: 'w5x6y7z8-a9b0-1234-wxyz-567890123456', parentId: 'b2c3d4e5-f6g7-8901-bcde-f23456789012', name: 'Locação lanchas' },

    // HOTELARIA
    { id: 'x6y7z8a9-b0c1-2345-xyza-678901234567', parentId: 'd4e5f6g7-h8i9-0123-defg-456789012345', name: 'Fazenda' },
    { id: 'y7z8a9b0-c1d2-3456-yzab-789012345678', parentId: 'd4e5f6g7-h8i9-0123-defg-456789012345', name: 'Resorts' },
    { id: 'z8a9b0c1-d2e3-4567-zabc-890123456789', parentId: 'd4e5f6g7-h8i9-0123-defg-456789012345', name: 'Pousada' },
    { id: 'a9b0c1d2-e3f4-5678-abcd-901234567890', parentId: 'd4e5f6g7-h8i9-0123-defg-456789012345', name: 'Albergue' },
    { id: 'b0c1d2e3-f4g5-6789-bcde-012345678901', parentId: 'd4e5f6g7-h8i9-0123-defg-456789012345', name: 'Aparthotel' },
    { id: 'c1d2e3f4-g5h6-7890-cdef-123456789012', parentId: 'd4e5f6g7-h8i9-0123-defg-456789012345', name: 'Motel' },
    { id: 'd2e3f4g5-h6i7-8901-defg-234567890123', parentId: 'd4e5f6g7-h8i9-0123-defg-456789012345', name: 'Hostel' },
    { id: 'e3f4g5h6-i7j8-9012-efgh-345678901234', parentId: 'd4e5f6g7-h8i9-0123-defg-456789012345', name: 'Hospedaria' },
    { id: 'f4g5h6i7-j8k9-0123-fghi-456789012345', parentId: 'd4e5f6g7-h8i9-0123-defg-456789012345', name: 'Estalagem' },

    // SERVIÇOS
    { id: 'g5h6i7j8-k9l0-1234-ghij-567890123456', parentId: 'c3d4e5f6-g7h8-9012-cdef-345678901234', name: 'Locação de carro' },
    { id: 'h6i7j8k9-l0m1-2345-hijk-678901234567', parentId: 'c3d4e5f6-g7h8-9012-cdef-345678901234', name: 'Barbeiro' },
    { id: 'i7j8k9l0-m1n2-3456-ijkl-789012345678', parentId: 'c3d4e5f6-g7h8-9012-cdef-345678901234', name: 'Chaveiro' },
    { id: 'j8k9l0m1-n2o3-4567-jklm-890123456789', parentId: 'c3d4e5f6-g7h8-9012-cdef-345678901234', name: 'Cosmeticos' },
    { id: 'k9l0m1n2-o3p4-5678-klmn-901234567890', parentId: 'c3d4e5f6-g7h8-9012-cdef-345678901234', name: 'Reparo de roupas' },
    { id: 'l0m1n2o3-p4q5-6789-lmno-012345678901', parentId: 'c3d4e5f6-g7h8-9012-cdef-345678901234', name: 'Boutique' },
    { id: 'm1n2o3p4-q5r6-7890-mnop-123456789012', parentId: 'c3d4e5f6-g7h8-9012-cdef-345678901234', name: 'Loja de roupas' }
  ];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private cepService: CepService,
    private cdr: ChangeDetectorRef,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle(`Registrar | ${environment.appName}`);
    this.initForm();
    console.log('Formulário inicializado:', this.registerForm.value);
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

  // Finalizar registro
  finishRegistration(): void {
    if (this.registerForm.valid) {
      const formData: RegisterFormData = this.registerForm.value;
      console.log('Registro finalizado:', formData);
      this.router.navigate(['/registro-sucesso']);
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
