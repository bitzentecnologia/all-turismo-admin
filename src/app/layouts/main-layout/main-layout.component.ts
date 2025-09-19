import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
  isSidebarOpen = true;
  isUserDropdownOpen = false;

  menuItems = [
    { 
      title: 'Home', 
      icon: 'home', 
      active: false,
      route: '/',
      mobileOnly: true
    },
    { 
      title: 'Meus cupons', 
      icon: 'diamond', 
      active: false,
      route: '/cupons'
    },
    { 
      title: 'Reservas', 
      icon: 'calendar', 
      active: false,
      route: '/reservas'
    },
    { 
      title: 'Usuários', 
      icon: 'users', 
      active: false,
      route: '/usuarios'
    },
    { 
      title: 'Minhas avaliações', 
      icon: 'star', 
      active: false,
      route: '/avaliacoes'
    },
    { 
      title: 'Minhas configurações', 
      icon: 'settings', 
      active: false,
      route: '/configuracoes'
    }
  ];

  boostItems = [
    { 
      title: 'Banners', 
      icon: 'image', 
      active: false,
      route: '/banners'
    }
  ];

  constructor(private router: Router) {
    // Set active item based on current route
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
    this.menuItems.forEach(menuItem => menuItem.active = false);
    this.boostItems.forEach(boostItem => boostItem.active = false);
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
    this.menuItems.forEach(menuItem => menuItem.active = false);
    this.boostItems.forEach(boostItem => boostItem.active = false);
  }

  logout() {
    // Aqui você implementaria a lógica de logout (limpar tokens, etc.)
    console.log('Logout realizado');
    
    // Redirecionar para a página de login
    this.router.navigate(['/login']);
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
}
