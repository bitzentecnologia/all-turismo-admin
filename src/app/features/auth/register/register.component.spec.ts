import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { of } from 'rxjs';
import { RegisterService } from './register.service';
import { UploadService } from '../../../core/services/upload.service';
import { CepService } from '../../../shared/services/cep.service';
import { RegisterComponent } from './register.component';

describe('RegisterComponent - Steps 1 and 2', () => {
  let fixture: ComponentFixture<RegisterComponent>;
  let component: RegisterComponent;
  let registerServiceSpy: jasmine.SpyObj<RegisterService>;
  let uploadServiceSpy: jasmine.SpyObj<UploadService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let titleServiceSpy: jasmine.SpyObj<Title>;
  let cepServiceSpy: jasmine.SpyObj<CepService>;
  const validResponsibleForm = {
    name: 'João Silva',
    email: 'joao@example.com',
    password: 'senha123',
    confirmPassword: 'senha123',
    phone: '(11) 99999-9999',
  };

  const validAddressForm = {
    cep: '01310-000',
    state: 'SP',
    city: 'São Paulo',
    neighborhood: 'Bela Vista',
    street: 'Avenida Paulista',
    number: '1000',
    complement: '',
  };

  beforeEach(async () => {
    registerServiceSpy = jasmine.createSpyObj('RegisterService', [
      'getCategories',
      'getSubcategories',
      'getInformationals',
      'getRulesTemplates',
      'getDeliveryRulesTemplates',
      'register',
    ]);
    registerServiceSpy.getCategories.and.returnValue(of([]));
    registerServiceSpy.getSubcategories.and.returnValue(of([]));
    registerServiceSpy.getInformationals.and.returnValue(of([]));
    registerServiceSpy.getRulesTemplates.and.returnValue(of([]));
    registerServiceSpy.getDeliveryRulesTemplates.and.returnValue(of([]));
    registerServiceSpy.register.and.returnValue(of({}));

    uploadServiceSpy = jasmine.createSpyObj('UploadService', ['uploadFile']);
    uploadServiceSpy.uploadFile.and.returnValue(of({ id: 'file-id' }));

    cepServiceSpy = jasmine.createSpyObj('CepService', ['consultarCep', 'formatarCep']);
    cepServiceSpy.consultarCep.and.returnValue(
      of({
        cep: '00000-000',
        bairro: 'Centro',
        localidade: 'Cidade',
        logradouro: 'Rua',
        complemento: '',
        uf: 'SP',
        ibge: '1234567',
        gia: '',
        ddd: '11',
        siafi: '1234',
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

  it('should keep step 1 active when responsible form is invalid', () => {
    component.nextStep();

    const responsible = component.responsibleForm;
    expect(component.currentStep).toBe(1);
    expect(responsible.invalid).toBeTrue();

    ['name', 'email', 'password', 'confirmPassword', 'phone'].forEach(controlName => {
      expect(responsible.get(controlName)?.touched).withContext(controlName).toBeTrue();
    });
  });

  it('should advance to step 2 when responsible form is valid', fakeAsync(() => {
    component.responsibleForm.setValue(validResponsibleForm);

    component.nextStep();
    expect(component.isLoading).toBe(true);

    tick(1000);
    expect(component.currentStep).toBe(2);
    expect(component.isLoading).toBe(false);
  }));

  it('should block progression when passwords do not match', () => {
    component.responsibleForm.patchValue({
      name: 'Maria Souza',
      email: 'maria@example.com',
      password: 'senha123',
      confirmPassword: 'senha999',
      phone: '(11) 99999-9999',
    });

    component.nextStep();

    const confirmControl = component.responsibleForm.get('confirmPassword');
    expect(component.currentStep).toBe(1);
    expect(component.responsibleForm.invalid).toBeTrue();
    expect(confirmControl?.hasError('passwordMismatch')).toBeTrue();
    expect(confirmControl?.touched).toBeTrue();
  });

  it('should keep step 2 active when address form is invalid', fakeAsync(() => {
    component.responsibleForm.setValue(validResponsibleForm);
    component.nextStep();
    tick(1000);

    expect(component.currentStep).toBe(2);
    component.nextStep();

    expect(component.currentStep).toBe(2);
    expect(component.addressForm.invalid).toBeTrue();

    ['cep', 'state', 'city', 'neighborhood', 'street', 'number', 'complement'].forEach(controlName => {
      expect(component.addressForm.get(controlName)?.touched).withContext(controlName).toBeTrue();
    });
  }));

  it('should advance to step 3 when address form is valid', fakeAsync(() => {
    component.responsibleForm.setValue(validResponsibleForm);
    component.nextStep();
    tick(1000);

    component.addressForm.setValue(validAddressForm);
    component.nextStep();
    expect(component.isLoading).toBe(true);

    tick(1000);
    expect(component.currentStep).toBe(3);
    expect(component.isLoading).toBe(false);
  }));

  it('should format cep input and auto fill address when consultCep succeeds', () => {
    component.addressForm.reset({
      cep: '',
      state: '',
      city: '',
      neighborhood: '',
      street: '',
      number: '',
      complement: '',
    });

    component.formatCep({ target: { value: '12345678' } } as any);

    expect(cepServiceSpy.consultarCep).toHaveBeenCalledWith('12345678');
    expect(cepServiceSpy.formatarCep).toHaveBeenCalledWith('00000-000');
    expect(component.addressForm.get('cep')?.value).toBe('00000-000');
    expect(component.addressForm.get('state')?.value).toBe('SP');
    expect(component.addressForm.get('city')?.value).toBe('Cidade');
    expect(component.addressForm.get('neighborhood')?.value).toBe('Centro');
    expect(component.addressForm.get('street')?.value).toBe('Rua');
    expect(component.isConsultingCep).toBe(false);
  });
});

describe('RegisterComponent - Step 3 Logo Upload Loading Indicator', () => {
  let fixture: ComponentFixture<RegisterComponent>;
  let component: RegisterComponent;
  let registerServiceSpy: jasmine.SpyObj<RegisterService>;
  let uploadServiceSpy: jasmine.SpyObj<UploadService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let titleServiceSpy: jasmine.SpyObj<Title>;
  let cepServiceSpy: jasmine.SpyObj<CepService>;
  const mockLogoFile = new File(['logo content'], 'logo.png', { type: 'image/png' });
  const VALID_CNPJ = '32.554.300/7315-88';

  const validResponsibleForm = {
    name: 'João Silva',
    email: 'joao@example.com',
    password: 'senha123',
    confirmPassword: 'senha123',
    phone: '(11) 99999-9999',
  };

  const validAddressForm = {
    cep: '01310-000',
    state: 'SP',
    city: 'São Paulo',
    neighborhood: 'Bela Vista',
    street: 'Avenida Paulista',
    number: '1000',
    complement: '',
  };

  beforeEach(async () => {
    registerServiceSpy = jasmine.createSpyObj('RegisterService', [
      'getCategories',
      'getSubcategories',
      'getInformationals',
      'getRulesTemplates',
      'getDeliveryRulesTemplates',
      'register',
    ]);
    registerServiceSpy.getCategories.and.returnValue(of([{ id: 'cat1', name: 'Categoria 1' }]));
    registerServiceSpy.getSubcategories.and.returnValue(of([{ id: 'sub1', name: 'Subcategoria 1' }]));
    registerServiceSpy.getInformationals.and.returnValue(of([]));
    registerServiceSpy.getRulesTemplates.and.returnValue(of([]));
    registerServiceSpy.getDeliveryRulesTemplates.and.returnValue(of([]));
    registerServiceSpy.register.and.returnValue(of({}));

    uploadServiceSpy = jasmine.createSpyObj('UploadService', ['uploadFile']);
    uploadServiceSpy.uploadFile.and.returnValue(of({ id: 'file-id' }));

    cepServiceSpy = jasmine.createSpyObj('CepService', ['consultarCep', 'formatarCep']);
    cepServiceSpy.consultarCep.and.returnValue(
      of({
        cep: '00000-000',
        bairro: 'Centro',
        localidade: 'Cidade',
        logradouro: 'Rua',
        complemento: '',
        uf: 'SP',
        ibge: '1234567',
        gia: '',
        ddd: '11',
        siafi: '1234',
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

  it('should show loading indicator when logo upload begins', fakeAsync(() => {
    // Navigate to step 3
    component.responsibleForm.setValue(validResponsibleForm);
    component.nextStep();
    tick(1000);

    component.addressForm.setValue(validAddressForm);
    component.nextStep();
    tick(1000);

    expect(component.currentStep).toBe(3);
    expect(component.isUploadingLogo).toBeFalse();

    component.establishmentForm.patchValue({
      name: 'Restaurante Teste',
      cnpj: VALID_CNPJ,
      categoryId: 'cat1',
      phone: '(11) 98888-7777',
      description: 'Descrição do restaurante',
      logoFile: mockLogoFile,
      logoPreview: 'data:image/png;base64,mock',
      has_delivery: false,
    });
    component.establishmentForm.get('subcategoryId')?.enable();
    component.establishmentForm.patchValue({ subcategoryId: 'sub1' });
    component.nextStep();
    tick(1000);

    component.promotionForm.patchValue({
      text: 'Promoção válida de teste',
    });
    component.promotionPhotos.push(
      component['fb'].group({
        file: mockLogoFile,
        preview: 'data:image/png;base64,mock',
      })
    );
    component.nextStep();
    tick(1000);

    expect(component.isLoading).toBeFalse();

    component.nextStep();
    expect(component.isLoading).toBeTrue();
  }));
});

describe('RegisterComponent - Step 4 Photo Upload Loading Indicator', () => {
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
  const mockPromoPhoto3 = new File(['photo3 content'], 'photo3.jpg', { type: 'image/jpeg' });
  const VALID_CNPJ = '32.554.300/7315-88';

  const validResponsibleForm = {
    name: 'João Silva',
    email: 'joao@example.com',
    password: 'senha123',
    confirmPassword: 'senha123',
    phone: '(11) 99999-9999',
  };

  const validAddressForm = {
    cep: '01310-000',
    state: 'SP',
    city: 'São Paulo',
    neighborhood: 'Bela Vista',
    street: 'Avenida Paulista',
    number: '1000',
    complement: '',
  };

  beforeEach(async () => {
    registerServiceSpy = jasmine.createSpyObj('RegisterService', [
      'getCategories',
      'getSubcategories',
      'getInformationals',
      'getRulesTemplates',
      'getDeliveryRulesTemplates',
      'register',
    ]);
    registerServiceSpy.getCategories.and.returnValue(of([{ id: 'cat1', name: 'Categoria 1' }]));
    registerServiceSpy.getSubcategories.and.returnValue(of([{ id: 'sub1', name: 'Subcategoria 1' }]));
    registerServiceSpy.getInformationals.and.returnValue(of([]));
    registerServiceSpy.getRulesTemplates.and.returnValue(of([]));
    registerServiceSpy.getDeliveryRulesTemplates.and.returnValue(of([]));
    registerServiceSpy.register.and.returnValue(of({}));

    uploadServiceSpy = jasmine.createSpyObj('UploadService', ['uploadFile']);
    uploadServiceSpy.uploadFile.and.returnValue(of({ id: 'uploaded-file-id' }));

    cepServiceSpy = jasmine.createSpyObj('CepService', ['consultarCep', 'formatarCep']);
    cepServiceSpy.consultarCep.and.returnValue(
      of({
        cep: '00000-000',
        bairro: 'Centro',
        localidade: 'Cidade',
        logradouro: 'Rua',
        complemento: '',
        uf: 'SP',
        ibge: '1234567',
        gia: '',
        ddd: '11',
        siafi: '1234',
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

  function navigateToStep4(): void {
    component.responsibleForm.setValue(validResponsibleForm);
    component.nextStep();
    tick(1000);

    component.addressForm.setValue(validAddressForm);
    component.nextStep();
    tick(1000);

    component.establishmentForm.patchValue({
      name: 'Restaurante Teste',
      cnpj: VALID_CNPJ,
      categoryId: 'cat1',
      phone: '(11) 98888-7777',
      description: 'Descrição do restaurante',
      logoFile: mockLogoFile,
      logoPreview: 'data:image/png;base64,mock',
      has_delivery: false,
    });
    component.establishmentForm.get('subcategoryId')?.enable();
    component.establishmentForm.patchValue({ subcategoryId: 'sub1' });
    component.nextStep();
    tick(1000);

    expect(component.currentStep).toBe(4);
  }

  describe('Successful Upload', () => {
    it('should show loading indicator when promotional photo upload begins', fakeAsync(() => {
      navigateToStep4();

      component.promotionForm.patchValue({
        text: 'Promoção válida de teste',
      });
      component.promotionPhotos.push(
        component['fb'].group({
          file: mockPromoPhoto1,
          preview: 'data:image/jpeg;base64,mock1',
        })
      );

      expect(component.isLoading).toBeFalse();

      component.nextStep();
      tick(1000);

      component.nextStep();
      expect(component.isLoading).toBeTrue();
    }));

    it('should persist loading indicator during promotional photo upload', fakeAsync(() => {
      navigateToStep4();

      component.promotionForm.patchValue({
        text: 'Promoção válida de teste',
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
      expect(component.isLoading).toBeTrue();

      tick(500);
      expect(component.isLoading).toBeTrue();
    }));

    it('should remove loading indicator when promotional photo upload completes successfully', fakeAsync(() => {
      navigateToStep4();

      component.promotionForm.patchValue({
        text: 'Promoção válida de teste',
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
      expect(component.isLoading).toBeTrue();

      tick(1000);

      expect(uploadServiceSpy.uploadFile).toHaveBeenCalledWith(mockLogoFile);
      expect(uploadServiceSpy.uploadFile).toHaveBeenCalledWith(mockPromoPhoto1);
      expect(component.isLoading).toBeFalse();
    }));

    it('should handle multiple promotional photo uploads (2 photos) with loading indicator', fakeAsync(() => {
      navigateToStep4();

      component.promotionForm.patchValue({
        text: 'Promoção válida de teste',
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

      expect(component.isLoading).toBeFalse();

      component.nextStep();
      expect(component.isLoading).toBeTrue();

      tick(1000);

      expect(uploadServiceSpy.uploadFile).toHaveBeenCalledWith(mockPromoPhoto1);
      expect(uploadServiceSpy.uploadFile).toHaveBeenCalledWith(mockPromoPhoto2);
      expect(uploadServiceSpy.uploadFile).toHaveBeenCalledTimes(3);
      expect(component.isLoading).toBeFalse();
    }));

    it('should handle maximum promotional photo uploads (3 photos) with loading indicator', fakeAsync(() => {
      navigateToStep4();

      component.promotionForm.patchValue({
        text: 'Promoção válida de teste',
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
      component.promotionPhotos.push(
        component['fb'].group({
          file: mockPromoPhoto3,
          preview: 'data:image/jpeg;base64,mock3',
        })
      );
      component.nextStep();
      tick(1000);

      expect(component.isLoading).toBeFalse();

      component.nextStep();
      expect(component.isLoading).toBeTrue();

      tick(1000);

      expect(uploadServiceSpy.uploadFile).toHaveBeenCalledWith(mockPromoPhoto1);
      expect(uploadServiceSpy.uploadFile).toHaveBeenCalledWith(mockPromoPhoto2);
      expect(uploadServiceSpy.uploadFile).toHaveBeenCalledWith(mockPromoPhoto3);
      expect(uploadServiceSpy.uploadFile).toHaveBeenCalledTimes(4);
      expect(component.isLoading).toBeFalse();
    }));
  });

  describe('Failed Upload', () => {
    it('should remove loading indicator when promotional photo upload fails with size error', fakeAsync(() => {
      navigateToStep4();

      component.promotionForm.patchValue({
        text: 'Promoção válida de teste',
      });
      component.promotionPhotos.push(
        component['fb'].group({
          file: mockPromoPhoto1,
          preview: 'data:image/jpeg;base64,mock1',
        })
      );
      component.nextStep();
      tick(1000);

      const sizeError = {
        type: 'size',
        message: 'O arquivo excede o tamanho máximo permitido de 5MB',
      };
      uploadServiceSpy.uploadFile.and.returnValue(throwError(() => sizeError));

      component.nextStep();
      expect(component.isLoading).toBeTrue();

      tick(1000);

      expect(component.isLoading).toBeFalse();
      expect(component.showError).toBeTrue();
      expect(component.errorMessage).toContain('Erro ao enviar');
    }));

    it('should remove loading indicator when promotional photo upload fails with format error', fakeAsync(() => {
      navigateToStep4();

      component.promotionForm.patchValue({
        text: 'Promoção válida de teste',
      });
      component.promotionPhotos.push(
        component['fb'].group({
          file: mockPromoPhoto1,
          preview: 'data:image/jpeg;base64,mock1',
        })
      );
      component.nextStep();
      tick(1000);

      const formatError = {
        type: 'format',
        message: 'Formato de arquivo não suportado. Use PNG, JPG ou JPEG',
      };
      uploadServiceSpy.uploadFile.and.returnValue(throwError(() => formatError));

      component.nextStep();
      expect(component.isLoading).toBeTrue();

      tick(1000);

      expect(component.isLoading).toBeFalse();
      expect(component.showError).toBeTrue();
      expect(component.errorMessage).toContain('Erro ao enviar');
    }));

    it('should remove loading indicator when promotional photo upload fails with network error', fakeAsync(() => {
      navigateToStep4();

      component.promotionForm.patchValue({
        text: 'Promoção válida de teste',
      });
      component.promotionPhotos.push(
        component['fb'].group({
          file: mockPromoPhoto1,
          preview: 'data:image/jpeg;base64,mock1',
        })
      );
      component.nextStep();
      tick(1000);

      const networkError = {
        type: 'network',
        message: 'Erro de conexão. Verifique sua internet e tente novamente',
      };
      uploadServiceSpy.uploadFile.and.returnValue(throwError(() => networkError));

      component.nextStep();
      expect(component.isLoading).toBeTrue();

      tick(1000);

      expect(component.isLoading).toBeFalse();
      expect(component.showError).toBeTrue();
      expect(component.errorMessage).toContain('Erro ao enviar');
    }));

    it('should remove loading indicator when one of multiple promotional photo uploads fails', fakeAsync(() => {
      navigateToStep4();

      component.promotionForm.patchValue({
        text: 'Promoção válida de teste',
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

      let callCount = 0;
      uploadServiceSpy.uploadFile.and.callFake((_file: File) => {
        callCount++;
        if (callCount === 1) {
          return of({ id: 'logo-id' });
        } else if (callCount === 2) {
          return of({ id: 'photo1-id' });
        }
        const error = {
          type: 'timeout',
          message: 'O upload excedeu o tempo limite',
        };
        return throwError(() => error);
      });

      component.nextStep();
      expect(component.isLoading).toBeTrue();

      tick(1000);

      expect(component.isLoading).toBeFalse();
      expect(component.showError).toBeTrue();
    }));
  });

  describe('Edge Cases - Maximum File Count Validation', () => {
    it('should prevent adding more than 3 promotional photos', fakeAsync(() => {
      navigateToStep4();

      component.promotionForm.patchValue({
        text: 'Promoção válida de teste',
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
      component.promotionPhotos.push(
        component['fb'].group({
          file: mockPromoPhoto3,
          preview: 'data:image/jpeg;base64,mock3',
        })
      );

      expect(component.promotionPhotos.length).toBe(3);
      expect(component.canAddMorePhotos()).toBeFalse();
    }));

    it('should allow adding photos when under the 3 photo limit', fakeAsync(() => {
      navigateToStep4();

      expect(component.promotionPhotos.length).toBe(0);
      expect(component.canAddMorePhotos()).toBeTrue();

      component.promotionPhotos.push(
        component['fb'].group({
          file: mockPromoPhoto1,
          preview: 'data:image/jpeg;base64,mock1',
        })
      );

      expect(component.promotionPhotos.length).toBe(1);
      expect(component.canAddMorePhotos()).toBeTrue();

      component.promotionPhotos.push(
        component['fb'].group({
          file: mockPromoPhoto2,
          preview: 'data:image/jpeg;base64,mock2',
        })
      );

      expect(component.promotionPhotos.length).toBe(2);
      expect(component.canAddMorePhotos()).toBeTrue();
    }));

    it('should validate minimum promotional photo requirement (at least 1 photo)', fakeAsync(() => {
      navigateToStep4();

      component.promotionForm.patchValue({
        text: 'Promoção válida de teste',
      });
      component.nextStep();
      tick(1000);

      expect(component.promotionPhotos.length).toBe(0);

      component.nextStep();
      tick(1000);

      expect(component.showError).toBeTrue();
      expect(component.errorMessage).toContain('pelo menos 1 foto');
      expect(component.isLoading).toBeFalse();
    }));

    it('should successfully upload with exactly 1 promotional photo (minimum)', fakeAsync(() => {
      navigateToStep4();

      component.promotionForm.patchValue({
        text: 'Promoção válida de teste',
      });
      component.promotionPhotos.push(
        component['fb'].group({
          file: mockPromoPhoto1,
          preview: 'data:image/jpeg;base64,mock1',
        })
      );
      component.nextStep();
      tick(1000);

      expect(component.promotionPhotos.length).toBe(1);

      component.nextStep();
      expect(component.isLoading).toBeTrue();

      tick(1000);

      expect(uploadServiceSpy.uploadFile).toHaveBeenCalledTimes(2);
      expect(component.isLoading).toBeFalse();
      expect(component.showError).toBeFalse();
    }));
  });

  describe('Loading State Consistency', () => {
    it('should not show loading indicator before upload starts', fakeAsync(() => {
      navigateToStep4();

      component.promotionForm.patchValue({
        text: 'Promoção válida de teste',
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
    }));

    it('should maintain consistent loading state across logo and promotional photo uploads', fakeAsync(() => {
      navigateToStep4();

      component.promotionForm.patchValue({
        text: 'Promoção válida de teste',
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

      expect(component.isLoading).toBeTrue();

      tick(1000);

      expect(uploadServiceSpy.uploadFile).toHaveBeenCalledWith(mockLogoFile);
      expect(uploadServiceSpy.uploadFile).toHaveBeenCalledWith(mockPromoPhoto1);
      expect(uploadServiceSpy.uploadFile).toHaveBeenCalledWith(mockPromoPhoto2);
      expect(component.isLoading).toBeFalse();
    }));

    it('should clear loading indicator after registration API call completes', fakeAsync(() => {
      navigateToStep4();

      component.promotionForm.patchValue({
        text: 'Promoção válida de teste',
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
      expect(component.isLoading).toBeTrue();

      tick(1000);

      expect(registerServiceSpy.register).toHaveBeenCalled();
      expect(component.isLoading).toBeFalse();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/registro-sucesso']);
    }));
  });
});
