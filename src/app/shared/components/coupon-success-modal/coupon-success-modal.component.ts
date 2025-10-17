import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-coupon-success-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './coupon-success-modal.component.html',
  styleUrls: ['./coupon-success-modal.component.scss'],
})
export class CouponSuccessModalComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() closed = new EventEmitter<void>();
  @Output() viewRequests = new EventEmitter<void>();

  close(): void {
    this.visible = false;
    this.visibleChange.emit(this.visible);
    this.closed.emit();
  }

  onViewRequests(): void {
    this.viewRequests.emit();
    this.close();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }
}
