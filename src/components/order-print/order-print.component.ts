import { Component, ChangeDetectionStrategy, inject, signal, computed, effect } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Album } from '../../models/album.model';
import { L10nPipe } from '../../pipes/l10n.pipe';

@Component({
  selector: 'app-order-print',
  standalone: true,
  imports: [FormsModule, CommonModule, CurrencyPipe, L10nPipe],
  template: `
    <div class="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h1 class="text-3xl font-bold text-gray-800 mb-6">{{ 'orderPrintTitle' | l10n }}</h1>
      @if (album()) {
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Order Form -->
            <form #form="ngForm" (ngSubmit)="placeOrder(form.value)">
                <div class="mb-4">
                    <h3 class="font-semibold text-lg mb-2">{{ 'coverType' | l10n }}</h3>
                    <select name="coverType" ngModel required class="w-full border-gray-300 rounded-md shadow-sm">
                        <option value="Capa Mole">{{ 'softCover' | l10n }} (+19.99€)</option>
                        <option value="Capa Dura">{{ 'hardCover' | l10n }} (+29.99€)</option>
                    </select>
                </div>

                <div class="mb-6">
                    <h3 class="font-semibold text-lg mb-2">{{ 'shippingAddress' | l10n }}</h3>
                    <div class="space-y-3">
                        <input type="text" name="name" ngModel required placeholder="{{ 'name' | l10n }}" class="w-full border-gray-300 rounded-md shadow-sm">
                        <input type="text" name="address" ngModel required placeholder="{{ 'address' | l10n }}" class="w-full border-gray-300 rounded-md shadow-sm">
                        <input type="text" name="postalCode" ngModel required placeholder="{{ 'postalCode' | l10n }}" class="w-full border-gray-300 rounded-md shadow-sm">
                        <input type="text" name="city" ngModel required placeholder="{{ 'city' | l10n }}" class="w-full border-gray-300 rounded-md shadow-sm">
                    </div>
                </div>

                <div class="border-t pt-4">
                    <div class="flex justify-between items-center text-xl font-bold">
                        <span>{{ 'total' | l10n }}:</span>
                        <span>{{ totalPrice(form.value.coverType) | currency:'EUR' }}</span>
                    </div>
                    <button type="submit" [disabled]="form.invalid" class="w-full mt-4 bg-teal-500 text-white py-3 rounded-md font-semibold hover:bg-teal-600 disabled:bg-gray-400">
                        {{ 'placeOrder' | l10n }}
                    </button>
                </div>
            </form>
            
            <!-- Album Preview -->
            <div class="bg-gray-50 p-4 rounded-lg border">
                <h3 class="font-semibold text-lg mb-2">{{ album()?.name }}</h3>
                <div class="grid grid-cols-4 gap-2">
                    @for (photo of album()?.photos; track photo.imageUrl) {
                        <img [src]="photo.imageUrl" [alt]="photo.activityName" class="aspect-square object-cover rounded">
                    }
                </div>
            </div>
        </div>
      } @else {
        <p>A carregar álbum...</p>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderPrintComponent {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private authService = inject(AuthService);
    
    albumId = signal<number>(0);
    album = signal<Album | undefined>(undefined);

    constructor() {
        const id = Number(this.route.snapshot.paramMap.get('albumId'));
        this.albumId.set(id);
        if (id) {
            this.album.set(this.authService.getAlbumById(id));
        }
    }

    totalPrice(coverType: string): number {
        if (coverType === 'Capa Dura') {
            return 29.99;
        }
        return 19.99;
    }

    placeOrder(formValue: any) {
        if (!this.album()) return;
        
        const order = this.authService.placeOrder({
            album: this.album()!,
            coverType: formValue.coverType,
            price: this.totalPrice(formValue.coverType),
            shippingAddress: {
                name: formValue.name,
                address: formValue.address,
                postalCode: formValue.postalCode,
                city: formValue.city,
            }
        });
        
        this.router.navigate(['/order-success'], { queryParams: { orderId: order.id } });
    }
}
