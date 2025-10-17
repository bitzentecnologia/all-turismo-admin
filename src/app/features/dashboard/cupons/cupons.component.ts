import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { StatusAlertComponent } from '@shared/components/status-alert/status-alert.component';

interface Coupon {
  id: string;
  title: string;
  description?: string;
  image: string;
  status: 'Ativo' | 'Finalizado' | 'Reprovado' | 'Em análise';
  startDate: string;
  endDate: string;
  usedToday: number;
  totalDaily: number;
}

@Component({
  selector: 'app-cupons',
  standalone: true,
  imports: [CommonModule, RouterLink, StatusAlertComponent, MatIconModule, FormsModule],
  templateUrl: './cupons.component.html',
  styleUrls: ['./cupons.component.scss']
})
export class CuponsComponent implements OnInit {
  searchQuery = '';
  selectedDate = '';
  activeTab: 'Ativas' | 'Finalizadas' | 'Reprovadas' | 'Em análise' = 'Ativas';
  
  fixedCoupon: Coupon = {
    id: 'fixed-1',
    title: 'Desconto fixo',
    description: '20% de desconto no rodízio de pizza',
    image: 'assets/images/pizza-coupon.jpg',
    status: 'Ativo',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    usedToday: 0,
    totalDaily: 0
  };

  coupons: Coupon[] = [
    {
      id: '1',
      title: 'Refrigerante 2L grátis na compra de uma pizza média',
      description: 'Válido apenas para consumo no local. Não acumulativo.',
      image: 'assets/images/pizza-coupon.jpg',
      status: 'Ativo',
      startDate: '10/01/2025',
      endDate: '15/01/2025',
      usedToday: 7,
      totalDaily: 15
    },
    {
      id: '2',
      title: '30% de desconto em pizzas grandes',
      description: 'Promoção especial de fim de semana. Todas as pizzas grandes.',
      image: 'assets/images/pizza-coupon.jpg',
      status: 'Ativo',
      startDate: '10/01/2025',
      endDate: '12/01/2025',
      usedToday: 12,
      totalDaily: 20
    },
    {
      id: '3',
      title: 'Sobremesa grátis no pedido acima de R$ 50',
      description: 'Escolha entre petit gateau ou brownie com sorvete.',
      image: 'assets/images/pizza-coupon.jpg',
      status: 'Em análise',
      startDate: '15/01/2025',
      endDate: '20/01/2025',
      usedToday: 0,
      totalDaily: 25
    },
    {
      id: '4',
      title: 'Combo família: 2 pizzas + 2 refrigerantes por R$ 79,90',
      description: 'Economize 25% no combo especial para família.',
      image: 'assets/images/pizza-coupon.jpg',
      status: 'Finalizado',
      startDate: '01/01/2025',
      endDate: '08/01/2025',
      usedToday: 30,
      totalDaily: 30
    },
    {
      id: '5',
      title: '50% na segunda pizza de calabresa',
      description: 'Compre uma pizza de calabresa e ganhe 50% na segunda.',
      image: 'assets/images/pizza-coupon.jpg',
      status: 'Reprovado',
      startDate: '05/01/2025',
      endDate: '10/01/2025',
      usedToday: 0,
      totalDaily: 10
    }
  ];

  constructor(private titleService: Title) {}

  ngOnInit(): void {
    this.titleService.setTitle(`Cupons | ${environment.appName}`);
  }

  get filteredCoupons(): Coupon[] {
    return this.coupons.filter(coupon => {
      const matchesStatus = coupon.status === this.activeTab;
      const matchesSearch = !this.searchQuery || 
        coupon.title.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }

  get usagePercentage(): number {
    return this.coupons.length > 0 
      ? (this.coupons[0].usedToday / this.coupons[0].totalDaily) * 100 
      : 0;
  }

  setActiveTab(tab: 'Ativas' | 'Finalizadas' | 'Reprovadas' | 'Em análise'): void {
    this.activeTab = tab;
  }

  viewCoupon(_couponId: string): void {
    // View coupon implementation
  }

  editCoupon(_couponId: string): void {
    // Edit coupon implementation
  }

  deleteCoupon(_couponId: string): void {
    // Delete coupon implementation
  }

  getUsagePercentage(coupon: Coupon): number {
    return (coupon.usedToday / coupon.totalDaily) * 100;
  }
}
