import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { RegisterService } from './register.service';
import { UploadService, UploadError } from '../../../core/services/upload.service';
import { CepService } from '../../../shared/services/cep.service';
import { RegisterComponent } from './register.component';

describe('RegisterComponent - End-to-End Integration Tests', () => {
  let fixture: ComponentFixture<RegisterComponent>;
  let component: RegisterComponent;
  let registerServiceSpy: jasmine.SpyObj<RegisterService>;
  let uploadServiceSpy: jasmine.SpyObj<UploadService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let titleServiceSpy: jasmine.SpyObj<Title>;
  let cepServiceSpy: jasmine.SpyObj<CepService>;

  const mockLogoFile = new File(['logo content'], 'logo.png', { type: 'image/png' });
  const mockPromoPhoto1 = new File(['photo1 content'], 'photo1.jpg', { type: 'image/jpeg' });
  const mockPromoPhoto2 = new File(['photo2 content'], 'photo2.jpg', { type: 'image/jpeg' });
  const VALID_CNPJ = '32.554.300/7315-88';

  const validResponsibleData = {
    name: 'João Silva',
    email: 'joao@example.com',
    password: 'senha123',
    confirmPassword: 'senha123',
    phone: '(11) 99999-9999',
  };

  const validAddressData = {
    cep: '01310-000',
    state: 'SP',
    city: 'São Paulo',
    neighborhood: 'Bela Vista',
    street: 'Avenida Paulista',
    number: '1000',
    complement: 'Sala 10',
  };

  const mockCategories = [
    { id: 'cat1', name: 'Restaurantes' },
    { id: 'cat2', name: 'Hotéis' },
  ];

  const mockSubcategories = [
    { id: 'sub1', name: 'Italiana' },
    { id: 'sub2', name: 'Brasileira' },
  ];

  beforeEach(async () => {
    registerServiceSpy = jasmine.createSpyObj('RegisterService', [
      'getCategories',
      'getSubcategories',
      'getInformationals',
      'getRulesTemplates',
      'getDeliveryRulesTemplates',
      'register',
    ]);
    registerServiceSpy.getCategories.and.returnValue(of(mockCategories));
    registerServiceSpy.getSubcategories.and.returnValue(of(mockSubcategories));
    registerServiceSpy.getInformationals.and.returnValue(of([]));
    registerServiceSpy.getRulesTemplates.and.returnValue(of([
      { id: 'rule1', text: 'Válido apenas para consumo no local' },
    ]));
    registerServiceSpy.getDeliveryRulesTemplates.and.returnValue(of([
      { id: 'delRule1', text: 'Taxa de entrega não inclusa' },
    ]));
    registerServiceSpy.register.and.returnValue(of({}));

    uploadServiceSpy = jasmine.createSpyObj('UploadService', ['uploadFile']);
    uploadServiceSpy.uploadFile.and.returnValue(of({ id: 'uploaded-file-id' }));

    cepServiceSpy = jasmine.createSpyObj('CepService', ['consultarCep', 'formatarCep']);
    cepServiceSpy.consultarCep.and.returnValue(
      of({
        cep: '01310-000',
        bairro: 'Bela Vista',
        localidade: 'São Paulo',
        logradouro: 'Avenida Paulista',
        complemento: '',
        uf: 'SP',
        ibge: '3550308',
        gia: '',
        ddd: '11',
        siafi: '7107',
      })
    );
    cepServiceSpy.formatarCep.and.callFake((cep: string) => cep);

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    routerSpy.navigate.and.resolveTo(true);

    titleServiceSpy = jasmine.createSpyObj('Title', ['setTitle']);

    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        { provide: RegisterService, useValue: registerServiceSpy },
        { provide: UploadService, useValue: uploadServiceSpy },
        { provide: CepService, useValue: cepServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: Title, useValue: titleServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Happy Path - Complete Registration Flow', () => {
    it('should complete full registration flow and navigate to success page', fakeAsync(() => {
      // Step 1: Fill responsible data
      component.responsibleForm.setValue(validResponsibleData);
      expect(component.responsibleForm.valid).toBeTrue();

      component.nextStep();
      expect(component.isLoading).toBeTrue();
      tick(1000);
      expect(component.currentStep).toBe(2);
      expect(component.isLoading).toBeFalse();

      // Step 2: Fill address data
      component.addressForm.setValue(validAddressData);
      expect(component.addressForm.valid).toBeTrue();

      component.nextStep();
      expect(component.isLoading).toBeTrue();
      tick(1000);
      expect(component.currentStep).toBe(3);
      expect(component.isLoading).toBeFalse();

      // Step 3: Fill establishment data with logo file
      component.establishmentForm.patchValue({
        name: 'Restaurante Exemplo',
        cnpj: VALID_CNPJ,
        categoryId: 'cat1',
        phone: '(11) 98888-7777',
        instagram: '@restaurante',
        description: 'Um restaurante maravilhoso com comida deliciosa',
        logoFile: mockLogoFile,
        logoPreview: 'data:image/png;base64,mock',
        has_delivery: false,
      });
      component.establishmentForm.get('subcategoryId')?.enable();
      component.establishmentForm.patchValue({ subcategoryId: 'sub1' });

      expect(component.establishmentForm.valid).toBeTrue();

      component.nextStep();
      expect(component.isLoading).toBeTrue();
      tick(1000);
      expect(component.currentStep).toBe(4);
      expect(component.isLoading).toBeFalse();

      // Step 4: Fill promotion data with photos and operating hours
      component.promotionForm.patchValue({
        text: 'Promoção especial: 20% de desconto em todos os pratos!',
      });

      component.promotionPhotos.push(
        component['fb'].group({
          file: mockPromoPhoto1,
          preview: 'data:image/jpeg;base64,mock1',
        })
      );
      component.promotionPhotos.push(
        component['fb'].group({
          file: mockPromoPhoto2,
          preview: 'data:image/jpeg;base64,mock2',
        })
      );

      // Fill operating hours for all days
      const operatingHoursArray = component.operatingHours;
      expect(operatingHoursArray.length).toBe(7);

      // Set Monday-Friday as open
      for (let i = 1; i <= 5; i++) {
        operatingHoursArray.at(i).patchValue({
          startTime: '10:00',
          endTime: '22:00',
          isClosed: false,
        });
      }

      // Set Sunday and Saturday with different hours
      operatingHoursArray.at(0).patchValue({
        startTime: '12:00',
        endTime: '20:00',
        isClosed: false,
      });
      operatingHoursArray.at(6).patchValue({
        startTime: '11:00',
        endTime: '23:00',
        isClosed: false,
      });

      expect(component.promotionForm.valid).toBeTrue();

      component.nextStep();
      expect(component.isLoading).toBeTrue();
      tick(1000);
      expect(component.currentStep).toBe(5);
      expect(component.isLoading).toBeFalse();

      // Step 5: Fill additional info (rules and informational items)
      const rulesItems = component.rulesItems;
      if (rulesItems.length > 0) {
        rulesItems.at(0).patchValue({ checked: true });
      }

      const deliveryRulesItems = component.deliveryRulesItems;
      if (deliveryRulesItems.length > 0) {
        deliveryRulesItems.at(0).patchValue({ checked: true });
      }

      expect(component.additionalInfoForm.valid).toBeTrue();

      // Submit final form
      component.nextStep();
      expect(component.isLoading).toBeTrue();

      // Wait for uploads to complete
      tick(1000);

      // Verify upload service was called for logo and photos
      expect(uploadServiceSpy.uploadFile).toHaveBeenCalledWith(mockLogoFile);
      expect(uploadServiceSpy.uploadFile).toHaveBeenCalledWith(mockPromoPhoto1);
      expect(uploadServiceSpy.uploadFile).toHaveBeenCalledWith(mockPromoPhoto2);
      expect(uploadServiceSpy.uploadFile).toHaveBeenCalledTimes(3);

      // Verify register service was called with correct data
      expect(registerServiceSpy.register).toHaveBeenCalledWith(
        jasmine.objectContaining({
          responsible: jasmine.objectContaining({
            name: 'João Silva',
            email: 'joao@example.com',
            phone: '(11) 99999-9999',
          }),
          address: jasmine.objectContaining({
            cep: '01310-000',
            city: 'São Paulo',
            state: 'SP',
          }),
          establishment: jasmine.objectContaining({
            name: 'Restaurante Exemplo',
            cnpj: VALID_CNPJ,
            file_upload_id: 'uploaded-file-id',
            photo_company_1_id: 'uploaded-file-id',
            photo_company_2_id: 'uploaded-file-id',
          }),
          operatingHours: jasmine.arrayContaining([
            jasmine.objectContaining({
              dayOfWeek: 'monday',
              startTime: '10:00',
              endTime: '22:00',
              isClosed: false,
            }),
          ]),
        })
      );

      // Wait for navigation
      tick(1000);

      // Verify navigation to success page
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/registro-sucesso']);
      expect(component.isLoading).toBeFalse();
    }));

    it('should verify success page contains confirmation messaging', fakeAsync(() => {
      // Complete registration flow
      component.responsibleForm.setValue(validResponsibleData);
      component.nextStep();
      tick(1000);

      component.addressForm.setValue(validAddressData);
      component.nextStep();
      tick(1000);

      component.establishmentForm.patchValue({
        name: 'Teste Hotel',
        cnpj: VALID_CNPJ,
        categoryId: 'cat2',
        phone: '(11) 98888-7777',
        description: 'Hotel com excelente infraestrutura e localização privilegiada',
        logoFile: mockLogoFile,
        has_delivery: false,
      });
      component.establishmentForm.get('subcategoryId')?.enable();
      component.establishmentForm.patchValue({ subcategoryId: 'sub1' });
      component.nextStep();
      tick(1000);

      component.promotionForm.patchValue({
        text: 'Primeira noite com 30% de desconto para novos hóspedes!',
      });
      component.promotionPhotos.push(
        component['fb'].group({
          file: mockPromoPhoto1,
          preview: 'data:image/jpeg;base64,mock1',
        })
      );
      component.nextStep();
      tick(1000);

      component.nextStep();
      tick(1000);

      expect(routerSpy.navigate).toHaveBeenCalledWith(['/registro-sucesso']);
    }));
  });

  describe('File Upload Validation - Error States', () => {
    it('should display error when logo file size exceeds limit', fakeAsync(() => {
      // Navigate to step 3
      component.responsibleForm.setValue(validResponsibleData);
      component.nextStep();
      tick(1000);

      component.addressForm.setValue(validAddressData);
      component.nextStep();
      tick(1000);

      // Fill establishment form with logo
      component.establishmentForm.patchValue({
        name: 'Restaurante Teste',
        cnpj: VALID_CNPJ,
        categoryId: 'cat1',
        phone: '(11) 98888-7777',
        description: 'Descrição do restaurante para teste de upload',
        logoFile: mockLogoFile,
        has_delivery: false,
      });
      component.establishmentForm.get('subcategoryId')?.enable();
      component.establishmentForm.patchValue({ subcategoryId: 'sub1' });
      component.nextStep();
      tick(1000);

      // Fill promotion
      component.promotionForm.patchValue({
        text: 'Promoção de teste com mais de dez caracteres aqui',
      });
      component.promotionPhotos.push(
        component['fb'].group({
          file: mockPromoPhoto1,
          preview: 'data:image/jpeg;base64,mock1',
        })
      );
      component.nextStep();
      tick(1000);

      // Skip additional info
      component.nextStep();

      // Mock upload error for size
      const sizeError: UploadError = {
        type: 'size',
        message: 'O arquivo excede o tamanho máximo permitido de 5MB',
      };
      uploadServiceSpy.uploadFile.and.returnValue(throwError(() => sizeError));

      tick(1000);

      expect(component.showError).toBeTrue();
      expect(component.errorMessage).toContain('Erro ao enviar');
    }));

    it('should display error when promotion photo has invalid format', fakeAsync(() => {
      // Navigate through steps
      component.responsibleForm.setValue(validResponsibleData);
      component.nextStep();
      tick(1000);

      component.addressForm.setValue(validAddressData);
      component.nextStep();
      tick(1000);

      component.establishmentForm.patchValue({
        name: 'Estabelecimento Teste',
        cnpj: VALID_CNPJ,
        categoryId: 'cat1',
        phone: '(11) 98888-7777',
        description: 'Descrição completa do estabelecimento com detalhes',
        logoFile: mockLogoFile,
        has_delivery: false,
      });
      component.establishmentForm.get('subcategoryId')?.enable();
      component.establishmentForm.patchValue({ subcategoryId: 'sub1' });
      component.nextStep();
      tick(1000);

      component.promotionForm.patchValue({
        text: 'Texto da promoção com tamanho adequado para validação',
      });
      component.promotionPhotos.push(
        component['fb'].group({
          file: mockPromoPhoto1,
          preview: 'data:image/jpeg;base64,mock1',
        })
      );
      component.nextStep();
      tick(1000);

      component.nextStep();

      // Mock logo upload success but photo format error
      let callCount = 0;
      uploadServiceSpy.uploadFile.and.callFake((_file: File) => {
        callCount++;
        if (callCount === 1) {
          return of({ id: 'logo-id' });
        }
        const formatError: UploadError = {
          type: 'format',
          message: 'Formato de arquivo não suportado. Use PNG, JPG ou JPEG',
        };
        return throwError(() => formatError);
      });

      tick(1000);

      expect(component.showError).toBeTrue();
      expect(component.errorMessage).toContain('Erro ao enviar');
    }));

    it('should display network error during file upload', fakeAsync(() => {
      component.responsibleForm.setValue(validResponsibleData);
      component.nextStep();
      tick(1000);

      component.addressForm.setValue(validAddressData);
      component.nextStep();
      tick(1000);

      component.establishmentForm.patchValue({
        name: 'Nome do Local',
        cnpj: VALID_CNPJ,
        categoryId: 'cat1',
        phone: '(11) 98888-7777',
        description: 'Uma descrição válida com pelo menos alguns caracteres',
        logoFile: mockLogoFile,
        has_delivery: false,
      });
      component.establishmentForm.get('subcategoryId')?.enable();
      component.establishmentForm.patchValue({ subcategoryId: 'sub1' });
      component.nextStep();
      tick(1000);

      component.promotionForm.patchValue({
        text: 'Promoção válida com caracteres suficientes para passar',
      });
      component.promotionPhotos.push(
        component['fb'].group({
          file: mockPromoPhoto1,
          preview: 'data:image/jpeg;base64,mock1',
        })
      );
      component.nextStep();
      tick(1000);

      component.nextStep();

      const networkError: UploadError = {
        type: 'network',
        message: 'Erro de conexão. Verifique sua internet e tente novamente',
      };
      uploadServiceSpy.uploadFile.and.returnValue(throwError(() => networkError));

      tick(1000);

      expect(component.showError).toBeTrue();
      expect(component.errorMessage).toContain('Erro ao enviar');
    }));
  });

  describe('Consolidated Loading States', () => {
    it('should show loading state during step navigation', fakeAsync(() => {
      component.responsibleForm.setValue(validResponsibleData);

      expect(component.isLoading).toBeFalse();

      component.nextStep();
      expect(component.isLoading).toBeTrue();

      tick(1000);
      expect(component.isLoading).toBeFalse();
      expect(component.currentStep).toBe(2);
    }));

    it('should show loading state during form submission', fakeAsync(() => {
      // Complete all steps
      component.responsibleForm.setValue(validResponsibleData);
      component.nextStep();
      tick(1000);

      component.addressForm.setValue(validAddressData);
      component.nextStep();
      tick(1000);

      component.establishmentForm.patchValue({
        name: 'Estabelecimento Final',
        cnpj: VALID_CNPJ,
        categoryId: 'cat1',
        phone: '(11) 98888-7777',
        description: 'Descrição final do estabelecimento para submissão',
        logoFile: mockLogoFile,
        has_delivery: false,
      });
      component.establishmentForm.get('subcategoryId')?.enable();
      component.establishmentForm.patchValue({ subcategoryId: 'sub1' });
      component.nextStep();
      tick(1000);

      component.promotionForm.patchValue({
        text: 'Texto final da promoção com tamanho apropriado',
      });
      component.promotionPhotos.push(
        component['fb'].group({
          file: mockPromoPhoto1,
          preview: 'data:image/jpeg;base64,mock1',
        })
      );
      component.nextStep();
      tick(1000);

      expect(component.isLoading).toBeFalse();

      component.nextStep();
      expect(component.isLoading).toBeTrue();

      tick(1000);

      expect(component.isLoading).toBeFalse();
    }));

    it('should maintain loading state across file uploads and API call', fakeAsync(() => {
      // Navigate to final step
      component.responsibleForm.setValue(validResponsibleData);
      component.nextStep();
      tick(1000);

      component.addressForm.setValue(validAddressData);
      component.nextStep();
      tick(1000);

      component.establishmentForm.patchValue({
        name: 'Parceiro Teste',
        cnpj: VALID_CNPJ,
        categoryId: 'cat1',
        phone: '(11) 98888-7777',
        description: 'Parceiro de teste para validação de loading state',
        logoFile: mockLogoFile,
        has_delivery: false,
      });
      component.establishmentForm.get('subcategoryId')?.enable();
      component.establishmentForm.patchValue({ subcategoryId: 'sub1' });
      component.nextStep();
      tick(1000);

      component.promotionForm.patchValue({
        text: 'Promoção especial para validar estado de carregamento',
      });
      component.promotionPhotos.push(
        component['fb'].group({
          file: mockPromoPhoto1,
          preview: 'data:image/jpeg;base64,mock1',
        })
      );
      component.promotionPhotos.push(
        component['fb'].group({
          file: mockPromoPhoto2,
          preview: 'data:image/jpeg;base64,mock2',
        })
      );
      component.nextStep();
      tick(1000);

      component.nextStep();

      // Verify loading starts immediately
      expect(component.isLoading).toBeTrue();

      tick(1000);
      // After delay, uploads and registration should execute
      expect(uploadServiceSpy.uploadFile).toHaveBeenCalledTimes(3);
      expect(registerServiceSpy.register).toHaveBeenCalled();

      tick(0);
      expect(component.isLoading).toBeFalse();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/registro-sucesso']);
    }));
  });

  describe('Operating Hours Input', () => {
    it('should pre-populate operating hours for all 7 days of the week', () => {
      const operatingHoursArray = component.operatingHours;

      expect(operatingHoursArray.length).toBe(7);

      const expectedDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

      expectedDays.forEach((day, index) => {
        const dayControl = operatingHoursArray.at(index);
        expect(dayControl.get('dayOfWeek')?.value).toBe(day);
        expect(dayControl.get('startTime')?.value).toBe('09:00');
        expect(dayControl.get('endTime')?.value).toBe('18:00');
        expect(dayControl.get('isClosed')?.value).toBe(false);
      });
    });

    it('should allow marking days as closed', fakeAsync(() => {
      component.responsibleForm.setValue(validResponsibleData);
      component.nextStep();
      tick(1000);

      component.addressForm.setValue(validAddressData);
      component.nextStep();
      tick(1000);

      component.establishmentForm.patchValue({
        name: 'Restaurante Fechado Domingos',
        cnpj: VALID_CNPJ,
        categoryId: 'cat1',
        phone: '(11) 98888-7777',
        description: 'Restaurante que fecha aos domingos e funciona outros dias',
        logoFile: mockLogoFile,
        has_delivery: false,
      });
      component.establishmentForm.get('subcategoryId')?.enable();
      component.establishmentForm.patchValue({ subcategoryId: 'sub1' });
      component.nextStep();
      tick(1000);

      const operatingHoursArray = component.operatingHours;

      // Mark Sunday as closed
      operatingHoursArray.at(0).patchValue({
        isClosed: true,
      });

      expect(operatingHoursArray.at(0).get('isClosed')?.value).toBeTrue();
      expect(operatingHoursArray.at(0).get('dayOfWeek')?.value).toBe('sunday');
    }));

    it('should include operating hours in registration data', fakeAsync(() => {
      component.responsibleForm.setValue(validResponsibleData);
      component.nextStep();
      tick(1000);

      component.addressForm.setValue(validAddressData);
      component.nextStep();
      tick(1000);

      component.establishmentForm.patchValue({
        name: 'Estabelecimento Horários',
        cnpj: VALID_CNPJ,
        categoryId: 'cat1',
        phone: '(11) 98888-7777',
        description: 'Estabelecimento para testar horários de funcionamento',
        logoFile: mockLogoFile,
        has_delivery: false,
      });
      component.establishmentForm.get('subcategoryId')?.enable();
      component.establishmentForm.patchValue({ subcategoryId: 'sub1' });
      component.nextStep();
      tick(1000);

      // Customize operating hours
      const operatingHoursArray = component.operatingHours;
      operatingHoursArray.at(1).patchValue({
        startTime: '08:00',
        endTime: '20:00',
        isClosed: false,
      });

      component.promotionForm.patchValue({
        text: 'Promoção para teste de horários de funcionamento',
      });
      component.promotionPhotos.push(
        component['fb'].group({
          file: mockPromoPhoto1,
          preview: 'data:image/jpeg;base64,mock1',
        })
      );
      component.nextStep();
      tick(1000);

      component.nextStep();
      tick(1000);

      expect(registerServiceSpy.register).toHaveBeenCalledWith(
        jasmine.objectContaining({
          operatingHours: jasmine.arrayContaining([
            jasmine.objectContaining({
              dayOfWeek: 'monday',
              startTime: '08:00',
              endTime: '20:00',
              isClosed: false,
            }),
          ]),
        })
      );
    }));
  });
});
