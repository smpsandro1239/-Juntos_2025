import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if(user(); as u) {
        <div class="bg-white p-6 rounded-lg shadow-md">
            <h1 class="text-3xl font-bold mb-4">Olá, {{ u.name }}!</h1>
            <p class="text-gray-600 mb-6">{{ u.email }}</p>

            @if(!u.isPremium) {
                <div class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
                    <p class="font-bold">Torne-se Premium!</p>
                    <p>Desbloqueie funcionalidades exclusivas como o Planeador de Viagens.</p>
                    <a routerLink="/premium" class="text-yellow-800 font-bold hover:underline">Fazer Upgrade Agora</a>
                </div>
            } @else {
                 <div class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6" role="alert">
                    <p class="font-bold">Conta Premium Ativa!</p>
                    <p>Obrigado por fazer parte da nossa comunidade premium.</p>
                </div>
            }

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <a routerLink="/trip-planner" class="block p-6 bg-teal-500 text-white rounded-lg shadow hover:bg-teal-600">
                    <h3 class="font-bold text-xl">Planeador de Viagens</h3>
                    <p>Organize as suas próximas aventuras.</p>
                </a>
                <a routerLink="/albums" class="block p-6 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600">
                    <h3 class="font-bold text-xl">Meus Álbuns</h3>
                    <p>Recorde os seus melhores momentos.</p>
                </a>
                 <a routerLink="/orders" class="block p-6 bg-indigo-500 text-white rounded-lg shadow hover:bg-indigo-600">
                    <h3 class="font-bold text-xl">Minhas Encomendas</h3>
                    <p>Veja o seu histórico de encomendas.</p>
                </a>
            </div>
        </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  private authService = inject(AuthService);
  user = this.authService.currentUser;
}
