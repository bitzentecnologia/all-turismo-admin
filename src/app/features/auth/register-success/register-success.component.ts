import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-register-success',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './register-success.component.html',
  styleUrls: ['./register-success.component.scss']
})
export class RegisterSuccessComponent implements OnInit, AfterViewInit {

  constructor(private router: Router, private titleService: Title) {}

  ngOnInit(): void {
    this.titleService.setTitle(`Registro Concluído | ${environment.appName}`);
    // Rola para o topo da página quando a tela carrega
    window.scrollTo(0, 0);
  }

  ngAfterViewInit(): void {
    // Focus on the success title for screen readers
    setTimeout(() => {
      const successTitle = document.getElementById('success-title');
      if (successTitle) {
        successTitle.focus();
      }
    }, 100);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
