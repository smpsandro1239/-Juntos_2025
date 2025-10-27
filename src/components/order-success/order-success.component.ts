import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-order-success',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="max-w-2xl mx-auto text-center py-12">
      <div class="bg-white p-8 rounded-lg shadow-md">
        <svg class="w-24 h-24 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <h2 class="text-3xl font-bold text-teal-600 mb-2">Encomenda Recebida!</h2>
        <p class="text-gray-600 mb-6">Obrigado! O seu álbum de memórias está a ser preparado e será enviado em breve.</p>
        <div class="flex justify-center gap-4">
          <a routerLink="/orders" class="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-full">
            Ver as Minhas Encomendas
          </a>
          <a routerLink="/" class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-full">
            Continuar a Descobrir
          </a>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderSuccessComponent {}
