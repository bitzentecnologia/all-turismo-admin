import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CouponSuccessModalComponent } from './coupon-success-modal.component';

describe('CouponSuccessModalComponent', () => {
  let component: CouponSuccessModalComponent;
  let fixture: ComponentFixture<CouponSuccessModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CouponSuccessModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CouponSuccessModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('visibility', () => {
    it('should not display modal when visible is false', () => {
      component.visible = false;
      fixture.detectChanges();

      const overlay = fixture.nativeElement.querySelector('.modal-overlay');
      expect(overlay).toBeNull();
    });

    it('should display modal when visible is true', () => {
      component.visible = true;
      fixture.detectChanges();

      const overlay = fixture.nativeElement.querySelector('.modal-overlay');
      expect(overlay).toBeTruthy();
    });

    it('should display correct title', () => {
      component.visible = true;
      fixture.detectChanges();

      const title = fixture.nativeElement.querySelector('.modal-title');
      expect(title.textContent).toBe('Solicitação enviada para análise');
    });

    it('should display correct message', () => {
      component.visible = true;
      fixture.detectChanges();

      const message = fixture.nativeElement.querySelector('.modal-message');
      expect(message.textContent.trim()).toBe(
        'A solicitação do seu novo cupom foi enviada para análise da nossa equipe. Retornaremos em breve.'
      );
    });
  });

  describe('close functionality', () => {
    it('should close modal when close button is clicked', () => {
      component.visible = true;
      fixture.detectChanges();

      const closeButton = fixture.nativeElement.querySelector('.close-button');
      closeButton.click();

      expect(component.visible).toBe(false);
    });

    it('should emit visibleChange event when closed', () => {
      spyOn(component.visibleChange, 'emit');
      component.visible = true;

      component.close();

      expect(component.visibleChange.emit).toHaveBeenCalledWith(false);
    });

    it('should emit closed event when closed', () => {
      spyOn(component.closed, 'emit');
      component.visible = true;

      component.close();

      expect(component.closed.emit).toHaveBeenCalled();
    });

    it('should close modal when backdrop is clicked', () => {
      component.visible = true;
      fixture.detectChanges();

      const overlay = fixture.nativeElement.querySelector('.modal-overlay');
      const event = new MouseEvent('click');
      Object.defineProperty(event, 'target', { value: overlay, enumerable: true });
      Object.defineProperty(event, 'currentTarget', { value: overlay, enumerable: true });

      component.onBackdropClick(event);

      expect(component.visible).toBe(false);
    });

    it('should not close modal when clicking inside modal container', () => {
      component.visible = true;
      fixture.detectChanges();

      const overlay = fixture.nativeElement.querySelector('.modal-overlay');
      const container = fixture.nativeElement.querySelector('.modal-container');
      const event = new MouseEvent('click');
      Object.defineProperty(event, 'target', { value: container, enumerable: true });
      Object.defineProperty(event, 'currentTarget', { value: overlay, enumerable: true });

      component.onBackdropClick(event);

      expect(component.visible).toBe(true);
    });
  });

  describe('view requests functionality', () => {
    it('should emit viewRequests event when button is clicked', () => {
      spyOn(component.viewRequests, 'emit');
      component.visible = true;
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('.view-requests-button');
      button.click();

      expect(component.viewRequests.emit).toHaveBeenCalled();
    });

    it('should close modal after emitting viewRequests event', () => {
      component.visible = true;
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('.view-requests-button');
      button.click();

      expect(component.visible).toBe(false);
    });
  });

  describe('accessibility', () => {
    it('should have proper ARIA attributes', () => {
      component.visible = true;
      fixture.detectChanges();

      const modal = fixture.nativeElement.querySelector('.modal-container');
      expect(modal.getAttribute('role')).toBe('dialog');
      expect(modal.getAttribute('aria-modal')).toBe('true');
      expect(modal.getAttribute('aria-labelledby')).toBe('modal-title');
    });

    it('should have aria-label on close button', () => {
      component.visible = true;
      fixture.detectChanges();

      const closeButton = fixture.nativeElement.querySelector('.close-button');
      expect(closeButton.getAttribute('aria-label')).toBe('Fechar modal');
    });
  });
});
