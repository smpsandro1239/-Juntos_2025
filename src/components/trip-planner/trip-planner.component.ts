import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GoogleGenAI, Type } from '@google/genai';
import { TripPlan, TripPlanDetails } from '../../models/trip-plan.model';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { L10nPipe } from '../../pipes/l10n.pipe';
import { MarkdownPipe } from '../../pipes/markdown.pipe';

@Component({
  selector: 'app-trip-planner',
  standalone: true,
  imports: [FormsModule, CommonModule, L10nPipe, MarkdownPipe],
  template: `
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Form Panel -->
      <div class="lg:col-span-1 bg-white p-6 rounded-lg shadow-lg h-fit sticky top-24">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">{{ 'planYourTrip' | l10n }}</h2>
        <form #form="ngForm" (ngSubmit)="generatePlan()">
          <div class="space-y-4">
            <div>
              <label for="destination" class="block text-sm font-medium text-gray-700">{{ 'destination' | l10n }}</label>
              <input type="text" name="destination" id="destination" [(ngModel)]="planDetails.destination" required class="mt-1 w-full border-gray-300 rounded-md shadow-sm" placeholder="Ex: Lisboa, Portugal">
            </div>
             <div>
              <label for="duration" class="block text-sm font-medium text-gray-700">{{ 'duration' | l10n }}</label>
              <input type="text" name="duration" id="duration" [(ngModel)]="planDetails.duration" required class="mt-1 w-full border-gray-300 rounded-md shadow-sm" placeholder="Ex: 3 dias">
            </div>
             <div>
              <label for="travelers" class="block text-sm font-medium text-gray-700">{{ 'travelers' | l10n }}</label>
              <input type="text" name="travelers" id="travelers" [(ngModel)]="planDetails.travelers" required class="mt-1 w-full border-gray-300 rounded-md shadow-sm" placeholder="Ex: Família com 2 crianças">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">{{ 'interests' | l10n }}</label>
              <div class="mt-2 grid grid-cols-2 gap-2">
                @for(interest of availableInterests; track interest) {
                   <label class="flex items-center p-2 border rounded-md cursor-pointer hover:bg-gray-50 has-[:checked]:bg-teal-50 has-[:checked]:border-teal-500">
                     <input type="checkbox" [name]="interest" [value]="interest" (change)="toggleInterest(interest)" class="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500">
                     <span class="ml-2 text-sm text-gray-700">{{ interest }}</span>
                   </label>
                }
              </div>
            </div>
          </div>
          <button type="submit" [disabled]="form.invalid || isGenerating()" class="w-full mt-6 bg-teal-500 text-white font-bold py-3 rounded-md hover:bg-teal-600 transition-colors disabled:bg-gray-400 flex items-center justify-center">
            @if(isGenerating()) {
              <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            }
            <span>{{ (isGenerating() ? 'generating' : 'generatePlan') | l10n }}</span>
          </button>
        </form>
      </div>

      <!-- Plan Display Panel -->
      <div class="lg:col-span-2">
        @if (generatedPlan(); as plan) {
          <div class="bg-white p-6 rounded-lg shadow-lg">
            <div class="flex justify-between items-start">
              <div>
                  <h2 class="text-3xl font-bold text-gray-800">{{ plan.title }}</h2>
                  <p class="text-gray-600">{{ plan.details.duration }} - {{ plan.details.travelers }}</p>
              </div>
              @if(authService.isLoggedIn()) {
                <button (click)="savePlan(plan)" class="bg-green-500 text-white font-semibold py-2 px-4 rounded hover:bg-green-600">
                    {{ 'savePlan' | l10n }}
                </button>
              }
            </div>
            <div class="mt-6 space-y-6">
              @for(day of plan.plan; track day.day) {
                <div class="border-l-4 border-teal-500 pl-4">
                  <h3 class="text-xl font-bold text-gray-700">{{ day.title }}</h3>
                  <div class="prose max-w-none mt-2" [innerHTML]="day.activities | markdown"></div>
                </div>
              }
            </div>
          </div>
        } @else {
          <div class="text-center p-12 bg-gray-100 rounded-lg border-2 border-dashed">
            <p class="text-gray-600">{{ 'fillFormToGenerate' | l10n }}</p>
          </div>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TripPlannerComponent {
  private ai: GoogleGenAI;
  authService = inject(AuthService);
  private toastService = inject(ToastService);

  planDetails: TripPlanDetails = {
    destination: '',
    duration: '',
    travelers: '',
    interests: []
  };

  availableInterests = ['Cultura', 'Comida', 'Ar Livre', 'Relaxamento', 'História', 'Arte'];
  isGenerating = signal(false);
  generatedPlan = signal<TripPlan | null>(null);

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env['API_KEY']! });
  }

  toggleInterest(interest: string) {
    const index = this.planDetails.interests.indexOf(interest);
    if (index > -1) {
      this.planDetails.interests.splice(index, 1);
    } else {
      this.planDetails.interests.push(interest);
    }
  }

  async generatePlan() {
    this.isGenerating.set(true);
    this.generatedPlan.set(null);

    const prompt = `
      Cria um roteiro de viagem detalhado para ${this.planDetails.destination} com duração de ${this.planDetails.duration} para ${this.planDetails.travelers}.
      Os interesses principais são: ${this.planDetails.interests.join(', ')}.
      O roteiro deve ser para famílias, focado em atividades divertidas e educativas.
      Para cada dia, sugere um título e uma lista de atividades em formato markdown.
      Fornece a resposta no formato JSON especificado.
    `;
    
    const schema = {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING },
            plan: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        day: { type: Type.INTEGER },
                        title: { type: Type.STRING },
                        activities: { type: Type.STRING }
                    },
                    required: ['day', 'title', 'activities']
                }
            }
        },
        required: ['title', 'plan']
    };

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: schema,
        }
      });
      
      const planData = JSON.parse(response.text);

      this.generatedPlan.set({
          id: Date.now(),
          title: planData.title,
          details: { ...this.planDetails },
          plan: planData.plan,
      });

    } catch (error) {
      console.error('Error generating plan:', error);
      this.toastService.show('Ocorreu um erro ao gerar o plano. Tente novamente.', 'error');
    } finally {
      this.isGenerating.set(false);
    }
  }

  savePlan(plan: TripPlan) {
      this.authService.addSavedPlan(plan);
      this.toastService.show('Plano guardado com sucesso!', 'success');
  }
}
