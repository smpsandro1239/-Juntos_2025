import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleGenAI, Type } from '@google/genai';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { L10nPipe } from '../../pipes/l10n.pipe';
import { MarkdownPipe } from '../../pipes/markdown.pipe';
import { TripPlan } from '../../models/trip-plan.model';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-trip-planner',
  standalone: true,
  imports: [CommonModule, FormsModule, L10nPipe, MarkdownPipe, RouterLink],
  template: `
    <div class="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
      <div class="text-center">
        <h1 class="text-4xl font-extrabold text-gray-800">{{ 'tripPlannerTitle' | l10n }}</h1>
        <p class="mt-2 text-lg text-gray-600">{{ 'tripPlannerSubtitle' | l10n }}</p>
      </div>

      @if (authService.isPremium()) {
        <div class="mt-8">
          <form #form="ngForm" (ngSubmit)="generatePlan()">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label for="destination" class="block text-sm font-medium text-gray-700">{{ 'destination' | l10n }}</label>
                <input type="text" id="destination" name="destination" [(ngModel)]="planDetails.destination" required class="mt-1 w-full border-gray-300 rounded-md shadow-sm">
              </div>
              <div>
                <label for="duration" class="block text-sm font-medium text-gray-700">{{ 'duration' | l10n }}</label>
                <input type="text" id="duration" name="duration" [(ngModel)]="planDetails.duration" required class="mt-1 w-full border-gray-300 rounded-md shadow-sm">
              </div>
              <div class="md:col-span-2">
                <label for="travelers" class="block text-sm font-medium text-gray-700">{{ 'travelers' | l10n }}</label>
                <input type="text" id="travelers" name="travelers" [(ngModel)]="planDetails.travelers" required class="mt-1 w-full border-gray-300 rounded-md shadow-sm">
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700">{{ 'interestsLabel' | l10n }}</label>
                <div class="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  @for(interest of availableInterests; track interest) {
                    <label class="flex items-center space-x-2 p-2 border rounded-md cursor-pointer hover:bg-gray-50" [class.bg-teal-50]="planDetails.interests.includes(interest)" [class.border-teal-400]="planDetails.interests.includes(interest)">
                      <input type="checkbox" [value]="interest" (change)="toggleInterest(interest)" [checked]="planDetails.interests.includes(interest)" class="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500">
                      <span>{{ interest }}</span>
                    </label>
                  }
                </div>
              </div>
            </div>
            <button type="submit" [disabled]="form.invalid || isGenerating()" class="w-full bg-teal-500 text-white font-bold py-3 rounded-md hover:bg-teal-600 transition-colors disabled:bg-gray-400">
              {{ (isGenerating() ? 'generatingPlan' : 'generatePlan') | l10n }}
            </button>
          </form>

          @if (generatedPlan()) {
            <div class="mt-10 border-t pt-8">
              <h2 class="text-3xl font-bold text-gray-800">{{ generatedPlan()!.title }}</h2>
              <div class="mt-6 space-y-6">
                @for(day of generatedPlan()!.plan; track day.day) {
                  <div class="border-l-4 border-teal-500 pl-4">
                    <h3 class="text-2xl font-bold text-gray-700">{{ day.title }}</h3>
                    <div class="prose max-w-none mt-2" [innerHTML]="day.activities | markdown"></div>
                  </div>
                }
              </div>
              <div class="mt-8 text-center">
                <button (click)="savePlan()" class="bg-green-500 text-white font-bold py-2 px-6 rounded hover:bg-green-600 transition-colors">
                  {{ 'savePlan' | l10n }}
                </button>
              </div>
            </div>
          } @else if (isGenerating()) {
             <div class="mt-10 text-center">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
                <p class="mt-4 text-gray-600 font-semibold">{{ 'generatingPlan' | l10n }}</p>
                <p class="text-sm text-gray-500">{{ generatingMessage() }}</p>
            </div>
          }
        </div>
      } @else {
        <div class="mt-12 text-center bg-yellow-50 p-8 rounded-lg border border-yellow-200">
            <h2 class="text-2xl font-bold text-yellow-800">⭐ {{ 'premiumFeature1' | l10n }}</h2>
            <p class="mt-2 text-yellow-700">{{ 'premiumFeature1Desc' | l10n }}</p>
            <a routerLink="/premium" class="mt-6 inline-block bg-yellow-400 text-yellow-900 font-bold py-3 px-6 rounded-lg hover:bg-yellow-500 transition-colors">
                {{ 'becomePremium' | l10n }}
            </a>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TripPlannerComponent {
  authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  isGenerating = signal(false);
  generatingMessage = signal('');
  generatedPlan = signal<Omit<TripPlan, 'id'> | null>(null);

  planDetails = {
    destination: 'Lisboa',
    duration: '3 dias',
    travelers: '2 adultos e 2 crianças (5 e 8 anos)',
    interests: ['Ar Livre', 'Cultura']
  };

  availableInterests = ['Ar Livre', 'Cultura', 'Arte', 'Gastronomia', 'Vida Selvagem', 'História'];

  private ai: GoogleGenAI | null = null;
  private messageInterval: any;

  constructor() {
    if (this.authService.isPremium()) {
      try {
        this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
      } catch(e) {
        console.error("Failed to initialize GoogleGenAI", e);
        this.toastService.show("Could not initialize AI service.", 'error');
      }
    }
  }

  toggleInterest(interest: string): void {
    const interests = this.planDetails.interests;
    const index = interests.indexOf(interest);
    if (index > -1) {
      interests.splice(index, 1);
    } else {
      interests.push(interest);
    }
  }

  async generatePlan() {
    if (!this.ai) {
        this.toastService.show('AI service not available.', 'error');
        return;
    }
    
    this.isGenerating.set(true);
    this.generatedPlan.set(null);
    this.startGeneratingMessages();

    const prompt = `Cria um roteiro de viagem familiar para ${this.planDetails.destination} com a duração de ${this.planDetails.duration}. Os viajantes são ${this.planDetails.travelers}. Os seus interesses principais são: ${this.planDetails.interests.join(', ')}. O output deve ser um JSON com a seguinte estrutura: { "title": "Um título criativo para a viagem", "plan": [{"day": número do dia, "title": "um título para o dia", "activities": "uma descrição em markdown das atividades para o dia, com sugestões de locais e horários"}] }. Responde apenas com o JSON.`;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              plan: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    day: { type: Type.NUMBER },
                    title: { type: Type.STRING },
                    activities: { type: Type.STRING }
                  },
                  required: ['day', 'title', 'activities']
                }
              }
            },
            required: ['title', 'plan']
          }
        }
      });

      const text = response.text.trim();
      const planData = JSON.parse(text);
      this.generatedPlan.set({
        details: { ...this.planDetails },
        ...planData
      });
    } catch (error) {
      console.error('Error generating plan:', error);
      this.toastService.show('Ocorreu um erro ao gerar o plano. Tente novamente.', 'error');
    } finally {
      this.isGenerating.set(false);
      this.stopGeneratingMessages();
    }
  }
  
  savePlan() {
    if (!this.generatedPlan()) return;
    this.authService.savePlan(this.generatedPlan()!);
    this.toastService.show(this.authService.translate('planSaved'), 'success');
    this.router.navigate(['/saved-plans']);
  }

  private startGeneratingMessages(): void {
    const messages = [
      this.authService.translate('generatingPlanMessage1'),
      this.authService.translate('generatingPlanMessage2'),
      this.authService.translate('generatingPlanMessage3'),
    ];
    let index = 0;
    this.generatingMessage.set(messages[index]);
    this.messageInterval = setInterval(() => {
      index = (index + 1) % messages.length;
      this.generatingMessage.set(messages[index]);
    }, 3000);
  }

  private stopGeneratingMessages(): void {
    clearInterval(this.messageInterval);
    this.generatingMessage.set('');
  }
}
