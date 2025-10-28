import { Injectable, signal } from '@angular/core';
import { Toast } from '../models/toast.model';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts = signal<Toast[]>([]);

  show(message: string, type: Toast['type'] = 'info') {
    const newToast: Toast = {
      id: Date.now(),
      message,
      type
    };
    this.toasts.update(toasts => [...toasts, newToast]);
    setTimeout(() => this.remove(newToast.id), 5000);
  }

  remove(id: number) {
    this.toasts.update(toasts => toasts.filter(t => t.id !== id));
  }
}
