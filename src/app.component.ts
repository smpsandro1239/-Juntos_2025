import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { L10nService } from './services/l10n.service';
import { L10nPipe } from './pipes/l10n.pipe';
import { ToastComponent } from './components/toast/toast.component';
import { ActivityService } from './services/activity.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, L10nPipe, ToastComponent],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private authService = inject(AuthService);
  private activityService = inject(ActivityService);
  l10n = inject(L10nService);

  isOffline = this.activityService.isOffline;
  currentUser = this.authService.currentUser;
  currentLang = this.l10n.language;
  
  langDropdownOpen = this.authService.langDropdownOpen;
  mobileMenuOpen = this.authService.mobileMenuOpen;

  currentYear = new Date().getFullYear();

  logout(): void {
    this.authService.logout();
    this.mobileMenuOpen.set(false);
  }

  setLang(lang: 'en' | 'pt'): void {
    this.l10n.setLanguage(lang);
    this.langDropdownOpen.set(false);
  }
}
