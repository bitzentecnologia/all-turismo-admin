import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-deactivate-coupon-modal',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './deactivate-coupon-modal.component.html',
  styleUrls: ['./deactivate-coupon-modal.component.scss']
})
export class DeactivateCouponModalComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() modalClose = new EventEmitter<void>();

  closeModal(): void {
    this.visible = false;
    this.visibleChange.emit(this.visible);
    this.modalClose.emit();
  }
}
