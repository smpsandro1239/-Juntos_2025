import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-order-success',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-md text-center">
        <div class="text-6xl mb-4">🎉</div>
        <h1 class="text-3xl font-bold text-gray-800 mb-4">Encomenda Realizada com Sucesso!</h1>
        <p class="text-gray-600 mb-8">Obrigado pela sua encomenda! O seu álbum de memórias está a ser preparado e será enviado em breve. O ID da sua encomenda é <strong>#{{ orderId }}</strong>.</p>
        <div class="flex justify-center space-x-4">
            <a routerLink="/" class="bg-gray-200 text-gray-800 py-2 px-6 rounded-md hover:bg-gray-300">Voltar ao Início</a>
            <a routerLink="/orders" class="bg-teal-500 text-white py-2 px-6 rounded-md hover:bg-teal-600">Ver Minhas Encomendas</a>
        </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderSuccessComponent {
    route = inject(ActivatedRoute);
    orderId = this.route.snapshot.queryParamMap.get('orderId');
}
