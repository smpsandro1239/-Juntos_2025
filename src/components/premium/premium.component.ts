import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-premium',
  standalone: true,
  template: `
    <div class="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-md text-center">
      <h1 class="text-3xl font-bold text-gray-800 mb-4">Desbloqueie o Miúdos&Cia Premium!</h1>
      <p class="text-gray-600 mb-8">Tenha acesso a funcionalidades exclusivas para planear as suas aventuras em família como nunca antes.</p>

      <div class="bg-teal-50 p-6 rounded-lg mb-8">
          <h2 class="text-2xl font-semibold text-teal-800 mb-4">Funcionalidades Premium</h2>
          <ul class="text-left space-y-2 text-gray-700">
              <li class="flex items-start"><span class="text-teal-500 mr-2">✔</span> <strong>Planeador de Viagens com IA:</strong> Crie itinerários personalizados.</li>
              <li class="flex items-start"><span class="text-teal-500 mr-2">✔</span> <strong>Álbuns de Fotos Ilimitados:</strong> Guarde todas as suas memórias.</li>
              <li class="flex items-start"><span class="text-teal-500 mr-2">✔</span> <strong>Descontos Exclusivos:</strong> Poupe em atividades e fornecedores.</li>
          </ul>
      </div>

      <button (click)="upgrade()" class="w-full bg-teal-500 text-white py-3 rounded-md text-lg font-bold hover:bg-teal-600">Tornar-me Premium por 9,99€/ano</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PremiumComponent {
    private authService = inject(AuthService);
    private router = inject(Router);

    upgrade(): void {
        this.authService.upgradeToPremium();
        alert('Parabéns! A sua conta é agora Premium.');
        this.router.navigate(['/profile']);
    }
}
