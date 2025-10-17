import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeactivateCouponModalComponent } from './deactivate-coupon-modal.component';

describe('DeactivateCouponModalComponent', () => {
  let component: DeactivateCouponModalComponent;
  let fixture: ComponentFixture<DeactivateCouponModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeactivateCouponModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeactivateCouponModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit modalClose when closeModal is called', () => {
    spyOn(component.modalClose, 'emit');
    spyOn(component.visibleChange, 'emit');

    component.closeModal();

    expect(component.visible).toBe(false);
    expect(component.visibleChange.emit).toHaveBeenCalledWith(false);
    expect(component.modalClose.emit).toHaveBeenCalled();
  });

  it('should display modal when visible is true', () => {
    component.visible = true;
    fixture.detectChanges();

    const modalOverlay = fixture.nativeElement.querySelector('.modal-overlay');
    expect(modalOverlay).toBeTruthy();
  });

  it('should hide modal when visible is false', () => {
    component.visible = false;
    fixture.detectChanges();

    const modalOverlay = fixture.nativeElement.querySelector('.modal-overlay');
    expect(modalOverlay).toBeFalsy();
  });
});
