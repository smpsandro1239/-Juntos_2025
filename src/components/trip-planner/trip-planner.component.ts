import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';
import { L10nPipe } from '../../pipes/l10n.pipe';
import { MarkdownPipe } from '../../pipes/markdown.pipe';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { TripPlan, TripPlanDetails } from '../../models/trip-plan.model';

// IMPORTANT: This key is NOT secure. In a real app, this logic should be on a server.
// We check for its existence for robustness.
declare const process: any;
const API_KEY = typeof process !== 'undefined' ? (process.env as any).API_KEY : null;

@Component({
  selector: 'app-trip-planner',
  standalone: true,
  imports: [CommonModule, FormsModule, L10nPipe, MarkdownPipe],
  templateUrl: './trip-planner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TripPlannerComponent {
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  
  private ai: GoogleGenAI | null = API_KEY ? new GoogleGenAI({apiKey: API_KEY}) : null;

  isPremium = this.authService.isPremium;
  isApiConfigured = signal(!!API_KEY);
  
  isLoading = signal(false);
  generatedPlan = signal<string | null>(null);
  
  planTitle = signal('');

  // Form model
  form = {
    destination: 'Lisboa',
    duration: 3,
    travelers: '2 adultos, 1 criança de 5 anos',
    interests: {
      'Ar Livre': false,
      'Museu': false,
      'Cultura': false,
      'Parque Temático': false
    }
  };

  async generatePlan() {
    if (!this.ai || !this.isPremium()) return;

    this.isLoading.set(true);
    this.generatedPlan.set('');
    
    const selectedInterests = Object.entries(this.form.interests)
      .filter(([, checked]) => checked)
      .map(([interest]) => interest);

    const prompt = `Cria um roteiro de viagem familiar detalhado para ${this.form.destination} com a duração de ${this.form.duration} dias. A família é composta por ${this.form.travelers}. Os seus interesses principais são: ${selectedInterests.join(', ')}. O formato da resposta deve ser em Markdown. Para cada dia, sugere 2 a 3 atividades, incluindo uma breve descrição, morada e preço estimado por pessoa. O idioma da resposta deve ser ${this.authService.translate('languageCode')}.`;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      this.generatedPlan.set(response.text);
    } catch (error) {
      console.error('Error generating plan:', error);
      this.generatedPlan.set(this.authService.translate('tripPlannerError'));
    } finally {
      this.isLoading.set(false);
    }
  }
  
  savePlan() {
    const planContent = this.generatedPlan();
    if (!planContent || !this.planTitle().trim()) {
      this.toastService.show(this.authService.translate('givePlanTitle'), 'error');
      return;
    }
    
    const details: TripPlanDetails = {
      destination: this.form.destination,
      duration: `${this.form.duration} dias`,
      travelers: this.form.travelers,
      interests: Object.entries(this.form.interests).filter(([,v]) => v).map(([k]) => k),
    };
    
    // A simplified parsing of the markdown for the model
    const planDays = planContent.split('## ').slice(1).map((dayText, index) => {
        const [dayTitle, ...activities] = dayText.split('\n');
        return {
            day: index + 1,
            title: dayTitle.trim(),
            activities: activities.join('\n').trim()
        };
    });

    const newPlan: Omit<TripPlan, 'id'> = {
        title: this.planTitle(),
        details,
        plan: planDays
    };

    this.authService.saveTripPlan(newPlan);
    this.toastService.show(this.authService.translate('planSaved'), 'success');
    this.generatedPlan.set(null); // Hide form after saving
  }
}
