// src/components/navbar/navbar.js
import { navIcons } from './icons.js';

export const renderNavbar = () => {
  const currentPath = window.location.pathname;

  const items = [
    { label: 'Home', href: '/assets/page/Home.html', key: 'home' },
    { label: 'Cart', href: '/assets/page/cart.html', key: 'cart' },
    { label: 'Orders', href: '/assets/page/orders.html', key: 'orders' },
    { label: 'Wallet', href: '/assets/page/wallet.html', key: 'wallet' },
    { label: 'Profile', href: '/assets/page/profile.html', key: 'profile' },
  ];

  return `
    <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 pt-3 pb-4 px-12 flex justify-between items-center z-50">
      ${items.map(item => {
        const isActive = currentPath.includes(item.href);
        const colorClass = isActive ? 'text-black' : 'text-gray-400';
        
        return `
          <a href="${item.href}" class="flex flex-col items-center gap-1 group ${colorClass} hover:text-black transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              ${navIcons[item.key]}
            </svg>
            <span class="text-xs ${isActive ? 'font-bold' : 'font-medium'}">${item.label}</span>
          </a>
        `;
      }).join('')}
    </nav>
  `;
};