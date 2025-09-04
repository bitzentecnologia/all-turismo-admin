import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-success',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './register-success.component.html',
  styleUrls: ['./register-success.component.scss']
})
export class RegisterSuccessComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Rola para o topo da página quando a tela carrega
    window.scrollTo(0, 0);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
