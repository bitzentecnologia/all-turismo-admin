import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private titleService: Title,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle(`Login | ${environment.appName}`);
  }

  onSubmit(): void {
    if (!this.email || !this.password) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    this.isLoading = true;

    this.loginService.login(this.email, this.password).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/']);
      },
      error: err => {
        this.isLoading = false;
        console.error(err);
        alert('Falha no login');
      },
    });
  }

  onForgotPassword(): void {
    // Implementar funcionalidade de recuperação de senha
    alert('Funcionalidade de recuperação de senha será implementada');
  }

  onRegister(): void {
    // Redirecionar para página de cadastro
    this.router.navigate(['/registrar']);
  }
}
