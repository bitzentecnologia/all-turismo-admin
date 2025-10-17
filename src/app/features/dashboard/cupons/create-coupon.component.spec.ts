import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateCouponComponent } from './create-coupon.component';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

describe('CreateCouponComponent', () => {
  let component: CreateCouponComponent;
  let fixture: ComponentFixture<CreateCouponComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockTitle: jasmine.SpyObj<Title>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockTitle = jasmine.createSpyObj('Title', ['setTitle']);

    await TestBed.configureTestingModule({
      imports: [CreateCouponComponent, FormsModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: Title, useValue: mockTitle },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateCouponComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('form submission', () => {
    beforeEach(() => {
      component.description = 'Test coupon description';
      component.dailyQuantity = '10';
      component.rules = 'Test rules';
      component.startDate = new Date('2025-01-01');
      component.endDate = new Date('2025-12-31');
      component.startTime = new Date('2025-01-01T10:00:00');
      component.endTime = new Date('2025-01-01T20:00:00');
    });

    it('should show success modal after successful submission', () => {
      expect(component.showSuccessModal).toBe(false);

      component.onSubmit();

      expect(component.showSuccessModal).toBe(true);
    });

    it('should not navigate immediately after submission', () => {
      component.onSubmit();

      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });

  describe('modal interactions', () => {
    it('should navigate to cupons page when modal is closed', () => {
      component.onModalClosed();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/cupons']);
    });

    it('should navigate to cupons page when view requests is clicked', () => {
      component.onViewRequests();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/cupons']);
    });

    it('should display modal in the template', () => {
      component.showSuccessModal = true;
      fixture.detectChanges();

      const modal = fixture.nativeElement.querySelector('app-coupon-success-modal');
      expect(modal).toBeTruthy();
    });
  });

  describe('cancel functionality', () => {
    it('should navigate to cupons page when cancel is clicked', () => {
      component.onCancel();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/cupons']);
    });
  });
});
