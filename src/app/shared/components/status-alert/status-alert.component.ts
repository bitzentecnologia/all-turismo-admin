import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status-alert.component.html',
  styleUrls: ['./status-alert.component.scss'],
})
export class StatusAlertComponent {
  /**
   * Mensagem exibida no alerta.
   */
  @Input() message =
    'Seu cadastro está em análise. Enquanto o cadastro de seu estabelecimento estiver em análise, algumas funcionalidades estarão indisponíveis.';

  /**
   * Título opcional mostrado acima da mensagem.
   */
  @Input() title?: string;

  /**
   * Define o ícone exibido no alerta.
   */
  @Input() icon: 'clock' | 'info' = 'clock';
}
