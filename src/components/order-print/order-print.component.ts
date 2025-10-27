import { Component, ChangeDetectionStrategy, inject, signal, OnInit, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Album } from '../../models/album.model';
import { User } from '../../models/user.model';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-order-print',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  template: `
    @if(album(); as alb) {
      <div class="max-w-4xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-2 text-teal-600">Encomendar Impressão</h2>
        <p class="text-center text-gray-600 mb-8">Transforme as suas memórias digitais num tesouro físico!</p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Order Summary -->
            <div class="bg-white p-6 rounded-lg shadow-md">
                <h3 class="text-xl font-semibold mb-4 border-b pb-2">Resumo da Encomenda</h3>
                <img [src]="alb.photos[0]?.imageUrl || 'https://picsum.photos/seed/placeholder/400/300'" [alt]="alb.name" class="w-full h-40 object-cover rounded-lg mb-4">
                <h4 class="text-lg font-bold">{{ alb.name }}</h4>
                <p class="text-gray-600">{{ alb.photos.length }} fotos</p>
                <div class="mt-4 pt-4 border-t space-y-2">
                    <div class="flex justify-between"><span>Capa:</span> <strong>{{ orderForm.get('coverType')?.value }}</strong></div>
                    <div class="flex justify-between"><span>Custo base:</span> <span>{{ basePrice() }}€</span></div>
                    <div class="flex justify-between text-xl font-bold"><span>Total:</span> <span>{{ totalPrice() }}€</span></div>
                </div>
            </div>

            <!-- Form -->
            <div class="bg-white p-6 rounded-lg shadow-md">
                 <form [formGroup]="orderForm" (ngSubmit)="placeOrder()">
                    <div class="space-y-4">
                        <div>
                            <label class="block text-gray-700 font-bold mb-2">Tipo de Capa</label>
                            <select formControlName="coverType" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                <option value="Capa Mole">Capa Mole</option>
                                <option value="Capa Dura">Capa Dura</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-gray-700 font-bold mb-2">Nome Completo</label>
                            <input type="text" formControlName="name" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                        </div>
                         <div>
                            <label class="block text-gray-700 font-bold mb-2">Morada</label>
                            <input type="text" formControlName="address" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-gray-700 font-bold mb-2">Cód. Postal</label>
                                <input type="text" formControlName="postalCode" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                            </div>
                            <div>
                                <label class="block text-gray-700 font-bold mb-2">Cidade</label>
                                <input type="text" formControlName="city" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                            </div>
                        </div>
                        <div class="pt-4">
                            <button type="submit" [disabled]="orderForm.invalid" class="w-full bg-teal-500 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline disabled:bg-gray-400">
                                Confirmar Encomenda
                            </button>
                        </div>
                    </div>
                 </form>
            </div>
        </div>
      </div>
    } @else {
      <div class="text-center py-12">
        <p class="text-gray-500 text-lg">Álbum não encontrado ou sem fotos para imprimir.</p>
         <a routerLink="/albums" class="text-teal-600 hover:underline font-semibold mt-2 inline-block">Voltar aos seus Álbuns</a>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderPrintComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  album = signal<Album | null>(null);
  currentUser = this.authService.currentUser;

  orderForm = this.fb.group({
    coverType: ['Capa Mole', Validators.required],
    name: [this.currentUser()?.name || '', Validators.required],
    address: ['', Validators.required],
    postalCode: ['', Validators.required],
    city: ['', Validators.required],
  });

  basePrice = computed(() => this.orderForm.get('coverType')?.value === 'Capa Dura' ? 29.99 : 19.99);
  totalPrice = computed(() => this.basePrice());

  ngOnInit(): void {
    const albumIdParam = this.route.snapshot.paramMap.get('albumId');
    if (albumIdParam) {
      const albumId = +albumIdParam;
      const foundAlbum = this.authService.getAlbumById(albumId);
      if (foundAlbum && foundAlbum.photos.length > 0) {
        this.album.set(foundAlbum);
      }
    }
  }

  placeOrder(): void {
    if (this.orderForm.invalid || !this.album()) return;

    const formValue = this.orderForm.value;
    const orderData: Omit<Order, 'id' | 'date'> = {
        album: this.album()!,
        coverType: formValue.coverType as 'Capa Mole' | 'Capa Dura',
        price: this.totalPrice(),
        shippingAddress: {
            name: formValue.name!,
            address: formValue.address!,
            postalCode: formValue.postalCode!,
            city: formValue.city!,
        }
    };

    this.authService.placeOrder(orderData);
    this.router.navigate(['/order-success']);
  }
}
