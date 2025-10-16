import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';
import { StatusAlertComponent } from '@shared/components/status-alert/status-alert.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, StatusAlertComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  
  constructor(private titleService: Title) {}

  ngOnInit(): void {
    this.titleService.setTitle(`Dashboard | ${environment.appName}`);
  }
}
