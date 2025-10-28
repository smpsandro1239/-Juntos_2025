import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed bottom-5 right-5 z-50 space-y-3">
      @for (toast of toasts(); track toast.id) {
        <div 
          class="flex items-center p-4 rounded-lg shadow-lg text-white animate-fade-in-up"
          [class.bg-green-500]="toast.type === 'success'"
          [class.bg-red-500]="toast.type === 'error'"
          [class.bg-blue-500]="toast.type === 'info'"
        >
          <span class="mr-3">{{ toast.message }}</span>
          <button (click)="toastService.remove(toast.id)" class="font-bold text-xl leading-none">&times;</button>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes fade-in-up {
        from {
            opacity: 0;
            transform: translateY(1rem);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    .animate-fade-in-up {
        animation: fade-in-up 0.3s ease-out forwards;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent {
  toastService = inject(ToastService);
  toasts = this.toastService.toasts;
}
