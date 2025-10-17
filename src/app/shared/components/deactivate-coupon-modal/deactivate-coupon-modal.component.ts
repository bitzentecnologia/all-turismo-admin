import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-deactivate-coupon-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './deactivate-coupon-modal.component.html',
  styleUrls: ['./deactivate-coupon-modal.component.scss']
})
export class DeactivateCouponModalComponent {
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() confirmDeactivation = new EventEmitter<void>();

  onClose(): void {
    this.closeModal.emit();
  }

  onConfirm(): void {
    this.confirmDeactivation.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}
