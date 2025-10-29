import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { L10nPipe } from '../../pipes/l10n.pipe';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, L10nPipe],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  error = signal<string | null>(null);

  login(form: NgForm): void {
    const { email, password } = form.value;
    const success = this.authService.login(email, password);
    if (success) {
      this.router.navigate(['/profile']);
    } else {
      this.error.set('Email ou password inválidos.');
    }
  }

  loginAsPremium(): void {
    const success = this.authService.login('premium@juntos.pt', 'qualquer');
    if (success) {
      this.router.navigate(['/profile']);
    }
  }
}
