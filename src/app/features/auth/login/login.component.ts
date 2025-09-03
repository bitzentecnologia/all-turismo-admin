import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  isLoading: boolean = false;

  constructor(private router: Router) {}

  onSubmit(): void {
    if (!this.email || !this.password) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    this.isLoading = true;
    
    // Simular processo de login
    setTimeout(() => {
      this.isLoading = false;
      // Aqui você implementaria a lógica real de autenticação
      console.log('Login attempt:', { email: this.email, password: this.password });
      
      // Redirecionar para a tela principal após login bem-sucedido
      this.router.navigate(['/']);
    }, 1000);
  }

  onForgotPassword(): void {
    // Implementar funcionalidade de recuperação de senha
    alert('Funcionalidade de recuperação de senha será implementada');
  }

  onRegister(): void {
    // Implementar redirecionamento para página de cadastro
    alert('Funcionalidade de cadastro será implementada');
  }
}
