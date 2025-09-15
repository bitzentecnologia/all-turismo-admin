import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {
  
  constructor(private router: Router, private titleService: Title) {}

  ngOnInit(): void {
    this.titleService.setTitle(`Página Não Encontrada | ${environment.appName}`);
  }

  voltarParaHome(): void {
    this.router.navigate(['/']);
  }

  voltarAnterior(): void {
    window.history.back();
  }
}
