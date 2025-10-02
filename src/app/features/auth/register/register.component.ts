import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';
import {
  formatCnpj,
  formatCep,
  formatPhone,
  validateNumbersOnly as validateNumbers,
} from '../../../shared/utils/masks';
import { DropDownItem } from '../../../shared/models/dropdown.model';
import { RegisterFormData } from './register.model';
import { CepService } from '../../../shared/services/cep.service';
import { RegisterService } from './register.service';
import { UploadService } from '../../../core/services/upload.service';
import { cnpjValidator } from '@shared/utils/cnpj-validator';
import { MatIconModule } from '@angular/material/icon';
import { OperatingHours } from './operating-hours.model';
import { timeFormatValidator, operatingHoursValidator } from './operating-hours.validators';
import { fillFormWithMockData, generateRandomMockData } from './register.mock';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  currentStep: number = 1;
  isLoading: boolean = false;
  isConsultingCep: boolean = false;
  registerForm!: FormGroup;
  showError: boolean = false;
  errorMessage: string = '';
  errorMessages: string[] = [];
  environment = environment;

  categories: DropDownItem[] = [];
  subcategories: DropDownItem[] = [];

  // Dias da semana para os horários (iniciando no domingo)
  daysOfWeek = [
    { key: 'sunday', label: 'Domingo' },
    { key: 'monday', label: 'Segunda-feira' },
    { key: 'tuesday', label: 'Terça-feira' },
    { key: 'wednesday', label: 'Quarta-feira' },
    { key: 'thursday', label: 'Quinta-feira' },
    { key: 'friday', label: 'Sexta-feira' },
    { key: 'saturday', label: 'Sábado' }
  ];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private cepService: CepService,
    private cdr: ChangeDetectorRef,
    private titleService: Title,
    private registerService: RegisterService,
    private uploadService: UploadService
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle(`Registrar | ${environment.appName}`);
    this.initForm();

    // Load categories from API
    this.registerService.getCategories().subscribe({
      next: res => (this.categories = res),
      error: err => console.error('Erro ao carregar categorias:', err),
    });
  }

  // Finalizar registro - NOVO PROCESSO EM 3 ETAPAS
  async finishRegistration(): Promise<void> {
    // Esconder mensagem de erro ao iniciar o processo
    this.hideErrorMessage();

    // Validar se o formulário está completo
    if (!this.registerForm.valid) {
      this.showErrorMessage('Por favor, preencha todos os campos obrigatórios corretamente.');
      return;
    }

    // Verificar se há logo e fotos para enviar
    const logoFile = this.registerForm.get('establishment.logoFile')?.value;
    const promotionPhotos = this.registerForm.get('promotion.photos')?.value || [];

    // Validar se logo está presente (obrigatório)
    if (!logoFile || !(logoFile instanceof File)) {
      this.showErrorMessage('É obrigatório enviar a logo do estabelecimento.');
      return;
    }

    // Validar se pelo menos 1 foto da promoção está presente (obrigatório)
    if (!promotionPhotos || promotionPhotos.length === 0) {
      this.showErrorMessage('É obrigatório enviar pelo menos 1 foto da promoção.');
      return;
    }

    // Iniciar processo de upload
    this.isLoading = true;

    try {
      // ETAPA 1: Upload da Logo (obrigatória)
      const logoId = await this.uploadFileAndGetId(logoFile, 'Logo');

      // ETAPA 2: Upload das Fotos da Promoção
      const photoIds = await this.uploadPromotionPhotos(promotionPhotos);

      // ETAPA 3: Salvar dados do registro
      this.saveRegistrationData(logoId, photoIds);

    } catch (error: any) {
      this.showErrorMessage('Erro ao enviar os arquivos. Tente novamente.');
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Método para fazer upload de um arquivo e retornar o ID
   * @param file Arquivo a ser enviado
   * @param fileType Tipo do arquivo (para logs)
   * @returns Promise com o ID do arquivo
   */
  private uploadFileAndGetId(file: File, fileType: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.uploadService.uploadFile(file).subscribe({
        next: (response: { id: string }) => {
          resolve(response.id);
        },
        error: (error: any) => {
          reject(error);
        }
      });
    });
  }

  // Método para fazer upload das fotos da promoção
  private async uploadPromotionPhotos(photos: any[]): Promise<string[]> {
    try {
      // Criar array de Promises para upload paralelo
      const uploadPromises = photos.map((photo, index) => {
        const photoNumber = index + 1;
        return this.uploadFileAndGetId(photo.file, `Foto ${photoNumber}`);
      });

      // Aguardar todos os uploads terminarem
      const photoIds = await Promise.all(uploadPromises);

      return photoIds;

    } catch (error: any) {
      this.showErrorMessage('Erro ao enviar as fotos. Tente novamente.');
      throw error;
    }
  }

  // Método para salvar os dados do registro (ETAPA 3)
  private saveRegistrationData(logoId: string, photoIds: string[]): void {
    const formValue = this.registerForm.value;

    // Preparar dados no formato da API
    const registrationData = {
      responsible: {
        name: formValue.responsible?.name || '',
        email: formValue.responsible?.email || '',
        password: formValue.responsible?.password || '',
        phone: formValue.responsible?.phone || ''
      },
      address: {
        cep: formValue.address?.cep || '',
        state: formValue.address?.state || '',
        city: formValue.address?.city || '',
        neighborhood: formValue.address?.neighborhood || '',
        street: formValue.address?.street || '',
        number: formValue.address?.number || '',
        complement: formValue.address?.complement || ''
      },
      establishment: {
        name: formValue.establishment?.name || '',
        cnpj: formValue.establishment?.cnpj || '',
        categoryId: formValue.establishment?.categoryId || '',
        subcategoryId: formValue.establishment?.subcategoryId || '',
        has_delivery: formValue.establishment?.has_delivery || false,
        phone: formValue.establishment?.phone || '',
        instagram: formValue.establishment?.instagram || '',
        description: formValue.establishment?.description || '',
        file_upload_id: logoId, // Logo (obrigatória)
        photo_company_1_id: photoIds[0] || null, // Primeira foto (obrigatória)
        photo_company_2_id: photoIds[1] || null, // Segunda foto (opcional)
        photo_company_3_id: photoIds[2] || null, // Terceira foto (opcional)
        promotion: formValue.promotion?.text || '' // Texto da promoção
      },
      operatingHours: (formValue.operatingHours || []).map((day: any) => ({
        dayOfWeek: day.dayOfWeek || '',
        startTime: day.startTime || '',
        endTime: day.endTime || '',
        isClosed: day.isClosed || false
      })),
      additionalInfo: {
        rulesItems: this.getCheckedItems(formValue.additionalInfo?.rulesItems || []),
        deliveryRulesItems: this.getCheckedItems(formValue.additionalInfo?.deliveryRulesItems || []),
        informationalItems: this.getCheckedInformationalItems(formValue.additionalInfo?.informationalItems || [])
      }
    };

    // Enviar dados para a API
    this.registerService.register(registrationData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.router.navigate(['/registro-sucesso']);
      },
      error: (error) => {
        this.isLoading = false;

        // Tratamento de erro com lista de mensagens
        let errorMsg = '';
        let errorList: string[] = [];

        if (error?.error?.message) {
          if (Array.isArray(error.error.message)) {
            errorList = error.error.message;
            errorMsg = '';
          } else {
            errorMsg = error.error.message;
          }
        } else if (error?.message) {
          if (Array.isArray(error.message)) {
            errorList = error.message;
            errorMsg = '';
          } else {
            errorMsg = error.message;
          }
        } else {
          errorMsg = 'Erro inesperado ao salvar o registro. Tente novamente.';
        }

        this.showErrorMessage(errorMsg, errorList);
      }
    });
  }

  // Método para filtrar apenas itens marcados como verificados (checked: true) para regras normais
  private getCheckedItems(items: any[]): any[] {
    return items
      .filter(item => item.checked === true)
      .map(item => ({
        name: item.name || '',
        checked: true
      }));
  }

  // Método para filtrar apenas itens informacionais marcados como verificados (checked: true)
  private getCheckedInformationalItems(items: any[]): any[] {
    return items
      .filter(item => item.checked === true)
      .map(item => ({
        id: item.id || '',
        name: item.name || '',
        checked: true,
        icon: item.icon || ''
      }));
  }

  // Atualizar subcategorias ao mudar categoria
  onCategoryChange(categoryId: string): void {
    this.establishmentForm.patchValue({ has_delivery: false });

    if (!categoryId) {
      this.subcategories = [];
      this.establishmentForm.patchValue({ subcategoryId: '' });
      return;
    }

    this.registerService.getSubcategories(categoryId).subscribe({
      next: res => {
        this.subcategories = res.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
        this.establishmentForm.patchValue({ subcategoryId: '' });
      },
      error: err => console.error('Erro ao carregar subcategorias:', err),
    });

    this.registerService
      .getInformationals(categoryId, this.establishmentForm.get('has_delivery')?.value)
      .subscribe({
        next: res => {
          if (!this.informationalItems) return;
          this.informationalItems.clear();

          res.forEach((sub: any) => {
            this.informationalItems.push(
              this.fb.group({
                id: [sub.id],
                name: [sub.text],
                checked: [false],
                icon: [sub.icon || ''],
              })
            );
          });
        },
        error: err => console.error('Erro ao carregar informações da categoria:', err),
      });

    this.registerService.getRulesTemplates(categoryId).subscribe({
      next: res => {
        if (!this.rulesItems) return;
        this.rulesItems.clear();

        res.forEach((sub: any) => {
          this.rulesItems.push(
            this.fb.group({
              name: [sub.text],
              checked: [true], // Pré-marcar todas as regras
            })
          );
        });
      },
      error: err => console.error('Erro ao carregar regras templates da categoria:', err),
    });

    this.registerService.getDeliveryRulesTemplates(categoryId).subscribe({
      next: res => {
        if (!this.deliveryRulesItems) return;
        this.deliveryRulesItems.clear();

        res.forEach((sub: any) => {
          this.deliveryRulesItems.push(
            this.fb.group({
              name: [sub.text],
              checked: [true], // Pré-marcar todas as regras de delivery
            })
          );
        });
      },
      error: err => console.error('Erro ao carregar regras templates da categoria:', err),
    });
  }

  private createOperatingHoursArray(): FormGroup[] {
    return this.daysOfWeek.map(day =>
      this.fb.group({
        dayOfWeek: [day.key],
        startTime: ['09:00', [timeFormatValidator()]],
        endTime: ['18:00', [timeFormatValidator()]],
        isClosed: [false]
      })
    );
  }

  private initForm(): void {
    this.registerForm = this.fb.group({
      responsible: this.fb.group({
        name: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        phone: ['', [Validators.required, Validators.minLength(14)]],
      }),
      address: this.fb.group({
        cep: ['', [Validators.required, Validators.minLength(8)]],
        state: ['', Validators.required],
        city: ['', Validators.required],
        neighborhood: ['', Validators.required],
        street: ['', Validators.required],
        number: ['', Validators.required],
        complement: [''],
      }),
      establishment: this.fb.group({
        name: ['', [Validators.required, Validators.minLength(2)]],
        cnpj: ['', [Validators.required, Validators.minLength(18), cnpjValidator()]],
        categoryId: ['', Validators.required],
        subcategoryId: ['', Validators.required],
        has_delivery: [false],
        phone: ['', [Validators.required, Validators.minLength(14)]],
        instagram: [''],
        description: ['', [Validators.required, Validators.maxLength(100)]],
        logoFile: [null, Validators.required],
        logoPreview: [''],
      }),
      additionalInfo: this.fb.group({
        informationalItems: this.fb.array([]),
        rulesItems: this.fb.array([]),
        deliveryRulesItems: this.fb.array([]),
      }),
      operatingHours: this.fb.array(this.createOperatingHoursArray(), [operatingHoursValidator()]),
      promotion: this.fb.group({
        text: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
        photos: this.fb.array([])
      }),
    });
  }

  // Navegação entre etapas
  nextStep(): void {
    // Forçar validação de todos os campos da etapa atual
    const formGroup = this.getCurrentStepFormGroup();
    if (formGroup) {
      this.markFormGroupTouched(formGroup);
    }

    if (this.validateCurrentStep()) {
      this.isLoading = true;

      setTimeout(() => {
        this.isLoading = false;
        if (this.currentStep < 5) {
          this.currentStep++;
        } else {
          this.finishRegistration();
        }
      }, 1000);
    } else {
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.scrollToTop();
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

    // Validação adicional para etapa 3 (estabelecimento)
    if (this.currentStep === 3) {
      const categoryId = this.registerForm.get('establishment.categoryId')?.value;
      const subcategoryId = this.registerForm.get('establishment.subcategoryId')?.value;
      const logoFile = this.registerForm.get('establishment.logoFile')?.value;

      // Debug do formulário establishment
      const establishmentForm = this.registerForm.get('establishment') as FormGroup;

      // Verificar erros de cada campo
      Object.keys(establishmentForm.controls).forEach(key => {
        const control = establishmentForm.get(key);
        if (control && control.invalid) {
        }
      });

      // Verificar se o logoFile é realmente um arquivo válido
      if (!logoFile || !(logoFile instanceof File)) {
        this.showErrorMessage('É obrigatório enviar a logo do estabelecimento para continuar.');
        return false;
      }

      if (!categoryId || !subcategoryId) {
        let missingFields = [];
        if (!categoryId) missingFields.push('categoria');
        if (!subcategoryId) missingFields.push('subcategoria');

        this.showErrorMessage(`É obrigatório selecionar: ${missingFields.join(', ')} para continuar.`);
        return false;
      }
    }

    // Validação adicional para etapa 4 (promoção)
    if (this.currentStep === 4) {
      const promotionPhotos = this.promotionPhotos;

      // Verificar se pelo menos 1 foto da promoção foi enviada
      if (!promotionPhotos || promotionPhotos.length === 0) {
        this.showErrorMessage('É obrigatório enviar pelo menos 1 foto da promoção para continuar.');
        return false;
      }
    }

    return true;
  }

  addRuleItem(): void {
    this.rulesItems.push(
      this.fb.group({
        name: [''],
        checked: [true], // Pré-marcar nova regra
      })
    );
  }

  removeRuleItem(index: number): void {
    this.rulesItems.removeAt(index);
  }

  addDeliveryRuleItem() {
    this.deliveryRulesItems.push(
      this.fb.group({
        name: [''],
        checked: [true], // Pré-marcar nova regra de delivery
      })
    );
  }

  removeDeliveryRuleItem(index: number) {
    this.deliveryRulesItems.removeAt(index);
  }

  // Métodos para horários de funcionamento
  get operatingHoursArray(): FormArray {
    return this.registerForm.get('operatingHours') as FormArray;
  }

  onDayClosedChange(index: number, isClosed: boolean): void {
    const dayFormGroup = this.operatingHoursArray.at(index) as FormGroup;
    dayFormGroup.patchValue({ isClosed });

    // Manter campos de horário sempre habilitados para enviar valores mesmo quando fechado
    dayFormGroup.get('startTime')?.enable();
    dayFormGroup.get('endTime')?.enable();
  }

  formatTime(event: any): void {
    const input = event.target;
    let value = input.value.replace(/\D/g, '');

    if (value.length >= 2) {
      value = value.substring(0, 2) + ':' + value.substring(2, 4);
    }

    if (value.length === 5) {
      value = value.substring(0, 5);
    }

    input.value = value;
  }

  getDayLabel(dayKey: string): string {
    const day = this.daysOfWeek.find(d => d.key === dayKey);
    return day ? day.label : dayKey;
  }

  // Métodos para promoção
  get promotionForm(): FormGroup {
    return this.registerForm.get('promotion') as FormGroup;
  }

  get promotionPhotos(): FormArray {
    return this.promotionForm.get('photos') as FormArray;
  }

  onPromotionPhotoSelected(event: any): void {
    const files = event.target.files;
    const currentPhotos = this.promotionPhotos.length;
    const remainingSlots = 3 - currentPhotos;

    if (remainingSlots <= 0) {
      alert('Você já adicionou o máximo de 3 fotos.');
      return;
    }

    const filesToAdd = Array.from(files).slice(0, remainingSlots);

    filesToAdd.forEach((file: any) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.promotionPhotos.push(
            this.fb.group({
              file: [file],
              preview: [e.target.result]
            })
          );
        };
        reader.readAsDataURL(file);
      }
    });
  }

  removePromotionPhoto(index: number): void {
    this.promotionPhotos.removeAt(index);
  }

  // Scroll para o topo da página
  scrollToTop(): void {
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 100);
  }

  // Exibir mensagem de erro
  showErrorMessage(message: string, messagesList: string[] = []): void {
    this.showError = true;
    this.errorMessage = message;
    this.errorMessages = messagesList;
    this.scrollToTop();
  }

  // Ocultar mensagem de erro
  hideErrorMessage(): void {
    this.showError = false;
    this.errorMessage = '';
    this.errorMessages = [];
  }

  // Preencher formulário com dados mock
  fillWithMockData(): void {
    fillFormWithMockData(this.registerForm);

    // Simular seleção de categoria para carregar subcategorias e regras
    const categoryId = this.registerForm.get('establishment.categoryId')?.value;
    if (categoryId) {
      this.onCategoryChange(categoryId);
    }

  }

  // Preencher formulário com dados aleatórios
  fillWithRandomMockData(): void {
    const randomData = generateRandomMockData();

    // Preencher dados básicos
    this.registerForm.patchValue({
      responsible: randomData.responsible,
      address: randomData.address,
      establishment: randomData.establishment,
      promotion: { text: randomData.promotion.text }
    });

    // Preencher horários
    const operatingHoursArray = this.registerForm.get('operatingHours') as FormArray;
    randomData.operatingHours.forEach((day, index) => {
      if (operatingHoursArray && operatingHoursArray.at(index)) {
        operatingHoursArray.at(index).patchValue(day);
      }
    });

    // Simular seleção de categoria para carregar subcategorias e regras
    const categoryId = randomData.establishment.categoryId;
    if (categoryId) {
      this.onCategoryChange(categoryId);
    }

  }



  private getCurrentStepFormGroup(): FormGroup | null {

    switch (this.currentStep) {
      case 1:
        const responsibleGroup = this.registerForm.get('responsible') as FormGroup;
        return responsibleGroup;
      case 2:
        const addressGroup = this.registerForm.get('address') as FormGroup;
        return addressGroup;
      case 3:
        const establishmentGroup = this.registerForm.get('establishment') as FormGroup;
        return establishmentGroup;
      case 4:
        // Validar tanto horários quanto promoção
        const operatingHoursGroup = this.registerForm.get('operatingHours')?.parent as FormGroup;
        const promotionGroup = this.registerForm.get('promotion') as FormGroup;
        // Retorna o grupo pai que contém ambos
        return this.registerForm;
      case 5:
        const additionalInfoGroup = this.registerForm.get('additionalInfo') as FormGroup;
        return additionalInfoGroup;
      default:
        return null;
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control) {
        control.markAsTouched();
        control.updateValueAndValidity();

        // Se for um FormGroup aninhado, marcar todos os campos como touched
        if (control instanceof FormGroup) {
          this.markFormGroupTouched(control);
        }
      }
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
      next: response => {
        // Preenche automaticamente os campos de endereço
        this.registerForm.patchValue({
          address: {
            cep: this.cepService.formatarCep(response.cep),
            state: response.uf,
            city: response.localidade,
            neighborhood: response.bairro,
            street: response.logradouro,
          },
        });
        this.isConsultingCep = false;
      },
      error: error => {
        // Limpa os campos de endereço em caso de erro
        this.registerForm.patchValue({
          address: {
            state: '',
            city: '',
            neighborhood: '',
            street: '',
          },
        });
        this.isConsultingCep = false;
      },
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

        const logoFileControl = this.registerForm.get('establishment.logoFile');

        logoFileControl?.markAsTouched();
        logoFileControl?.updateValueAndValidity();

        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    } else {
      // Limpar o campo se nenhum arquivo foi selecionado
      this.registerForm.get('establishment.logoPreview')?.setValue('');
      this.registerForm.get('establishment.logoFile')?.setValue(null);

      // Forçar validação e marcação como touched
      const logoFileControl = this.registerForm.get('establishment.logoFile');
      logoFileControl?.markAsTouched();
      logoFileControl?.updateValueAndValidity();
    }
  }

  // Remover logo
  removeLogo(): void {
    this.registerForm.get('establishment.logoPreview')?.setValue('');
    this.registerForm.get('establishment.logoFile')?.setValue(null);

    // Forçar validação e marcação como touched
    const logoFileControl = this.registerForm.get('establishment.logoFile');
    logoFileControl?.markAsTouched();
    logoFileControl?.updateValueAndValidity();

    this.cdr.detectChanges();
  }

  canShowDeliveryOption(): boolean {
    const categoryId = this.registerForm.get('establishment.categoryId')?.value;
    return this.categories.some(
      cat => cat.id === categoryId && cat.name.toLowerCase() === 'gastronomia'
    );
  }

  canShowDeliveryItemsRules(): boolean {
    const categoryId = this.registerForm.get('establishment.categoryId')?.value;
    const hasGastronomiaCategory = this.categories.some(
      cat => cat.id === categoryId && cat.name.toLowerCase() === 'gastronomia'
    );
    const hasDelivery = this.establishmentForm.get('has_delivery')?.value;

    return hasGastronomiaCategory && hasDelivery;
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

  get isStep4(): boolean {
    return this.currentStep === 4;
  }

  get isStep5(): boolean {
    return this.currentStep === 5;
  }

  get isLastStep(): boolean {
    return this.currentStep === 5;
  }

  get stepTitle(): string {
    switch (this.currentStep) {
      case 1:
        return 'Dados do responsável';
      case 2:
        return 'Endereço';
      case 3:
        return 'Estabelecimento';
      case 4:
        return 'Promoção obrigatória';
      case 5:
        return 'Regras e informações';
      default:
        return '';
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

  get additionalInfoForm(): FormGroup {
    return this.registerForm.get('additionalInfo') as FormGroup;
  }

  get informationalItems(): FormArray {
    return this.additionalInfoForm.get('informationalItems') as FormArray;
  }

  get rulesItems(): FormArray {
    return this.additionalInfoForm.get('rulesItems') as FormArray;
  }

  get deliveryRulesItems(): FormArray {
    return this.additionalInfoForm.get('deliveryRulesItems') as FormArray;
  }
}
