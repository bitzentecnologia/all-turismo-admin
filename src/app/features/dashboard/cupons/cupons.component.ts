import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-cupons',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cupons.component.html',
  styleUrls: ['./cupons.component.scss']
})
export class CuponsComponent implements OnInit {
  
  constructor(private titleService: Title) {}

  ngOnInit(): void {
    this.titleService.setTitle(`Cupons | ${environment.appName}`);
  }
}
