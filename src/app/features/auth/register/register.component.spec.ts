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
