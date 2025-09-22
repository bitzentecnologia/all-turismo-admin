import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, RouterLink } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { UserRole } from '@shared/models/login.model';

type MenuItem = {
  title: string;
  icon: string;
  route: string;
  active?: boolean;
  mobileOnly?: boolean;
};

type BoostItem = {
  title: string;
  icon: string;
  route: string;
  active?: boolean;
  mobileOnly?: boolean;
};

type AllMenus = Record<UserRole, MenuItem[]>;

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent {
  isSidebarOpen = true;
  isUserDropdownOpen = false;

  role: UserRole | null = null;

  menuItems: MenuItem[] = [];

  boostItems: BoostItem[] = [];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    // Set active item based on current route
    this.role = this.authService.getUserRole();
    this.menuItems = this.role === 'ADMIN' ? this.allMenus.ADMIN : this.allMenus.COSTUMER;
    this.boostItems = this.role === 'ADMIN' ? this.allBoosts.ADMIN : this.allBoosts.COSTUMER;
    this.setActiveItemByRoute();

    // Listen for window resize to handle mobile detection
    window.addEventListener('resize', () => {
      // Optional: Add any resize-specific logic here if needed
    });
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleUserDropdown() {
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
  }

  setActiveItem(item: any) {
    this.menuItems.forEach(menuItem => (menuItem.active = false));
    this.boostItems.forEach(boostItem => (boostItem.active = false));
    item.active = true;

    // Navigate to the route
    this.router.navigate([item.route]);

    // Close sidebar on mobile when clicking menu items
    this.closeSidebarOnMobile();
  }

  private closeSidebarOnMobile() {
    // Check if screen width is mobile (768px or less)
    const mobileBreakpoint = 768;
    const isMobile = window.innerWidth <= mobileBreakpoint;
    if (isMobile) {
      this.isSidebarOpen = false;
    }
  }

  resetActiveItems() {
    this.menuItems.forEach(menuItem => (menuItem.active = false));
    this.boostItems.forEach(boostItem => (boostItem.active = false));
  }

  logout() {
    this.authService.logout();

    this.router.navigate(['/login']);
  }

  getName(): string {
    return this.authService.getUserName() || 'Usuário';
  }

  private setActiveItemByRoute() {
    const currentRoute = this.router.url;

    // Find and set active item based on current route
    const allItems = [...this.menuItems, ...this.boostItems];
    const activeItem = allItems.find(item => item.route === currentRoute);

    if (activeItem) {
      this.setActiveItem(activeItem);
    } else if (currentRoute === '/' || currentRoute === '') {
      // Set home as active when on root route
      const homeItem = this.menuItems.find(item => item.icon === 'home');
      if (homeItem) {
        this.setActiveItem(homeItem);
      }
    }
  }

  allMenus: AllMenus = {
    COSTUMER: [
      {
        title: 'Home',
        icon: 'home',
        active: false,
        route: '/',
        mobileOnly: true,
      },
      {
        title: 'Meus cupons',
        icon: 'diamond',
        active: false,
        route: '/cupons',
      },
      {
        title: 'Reservas',
        icon: 'calendar',
        active: false,
        route: '/reservas',
      },
      {
        title: 'Usuários',
        icon: 'users',
        active: false,
        route: '/usuarios',
      },
      {
        title: 'Minhas avaliações',
        icon: 'star',
        active: false,
        route: '/avaliacoes',
      },
      {
        title: 'Minhas configurações',
        icon: 'settings',
        active: false,
        route: '/configuracoes',
      },
    ],
    ADMIN: [
      {
        title: 'Parceiros',
        icon: 'users',
        route: '/parceiros',
      },
      {
        title: 'Configurações',
        icon: 'settings',
        route: '/confuguracoes',
      },
    ],
  };

  allBoosts = {
    COSTUMER: [
      {
        title: 'Banners',
        icon: 'image',
        active: false,
        route: '/banners',
      },
    ],
    ADMIN: [],
  };
}
