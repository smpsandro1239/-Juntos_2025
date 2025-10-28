import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleGenAI, Type } from '@google/genai';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { L10nPipe } from '../../pipes/l10n.pipe';
import { MarkdownPipe } from '../../pipes/markdown.pipe';
import { TripPlan } from '../../models/trip-plan.model';

@Component({
  selector: 'app-trip-planner',
  standalone: true,
  imports: [CommonModule, FormsModule, L10nPipe, MarkdownPipe],
  template: `
    <div class="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">{{ 'tripPlannerTitle' | l10n }}</h1>
      <p class="text-gray-600 mb-8">{{ 'tripPlannerSubtitle' | l10n }}</p>

      <form #form="ngForm" (ngSubmit)="generatePlan()">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Duration -->
          <div>
            <label for="duration" class="block text-sm font-medium text-gray-700">{{ 'duration' | l10n }}</label>
            <input type="text" id="duration" name="duration" required [(ngModel)]="planRequest.duration" class="mt-1 w-full border-gray-300 rounded-md shadow-sm">
          </div>
          
          <!-- Travelers -->
          <div>
            <label for="travelers" class="block text-sm font-medium text-gray-700">{{ 'travelers' | l10n }}</label>
            <input type="text" id="travelers" name="travelers" required [(ngModel)]="planRequest.travelers" class="mt-1 w-full border-gray-300 rounded-md shadow-sm">
          </div>
        </div>

        <!-- Interests -->
        <div class="mt-6">
          <label class="block text-sm font-medium text-gray-700">{{ 'interests' | l10n }}</label>
          <div class="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            @for (interest of availableInterests; track interest) {
              <label class="flex items-center p-3 border rounded-lg cursor-pointer transition-colors" [class.bg-teal-50]="planRequest.interests.has(interest)" [class.border-teal-500]="planRequest.interests.has(interest)">
                <input type="checkbox" [checked]="planRequest.interests.has(interest)" (change)="toggleInterest(interest)" class="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500">
                <span class="ml-3 text-sm font-medium text-gray-700">{{ interest | l10n }}</span>
              </label>
            }
          </div>
        </div>

        <button type="submit" [disabled]="form.invalid || isLoading()" class="w-full mt-8 bg-teal-500 text-white font-bold py-3 rounded-md hover:bg-teal-600 transition-colors disabled:bg-gray-400 flex items-center justify-center">
            @if(isLoading()) {
                <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                <span>{{ 'generatingPlan' | l10n }}</span>
            } @else {
               <span>{{ 'generatePlan' | l10n }}</span>
            }
        </button>
      </form>

      @if (errorMessage()) {
        <div class="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span class="block sm:inline">{{ errorMessage() }}</span>
        </div>
      }

      @if(generatedPlan()) {
        <div class="mt-10 border-t pt-8">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-2xl font-bold text-gray-800">{{ generatedPlan()?.title }}</h2>
                @if(isLoggedIn()){
                    <button (click)="savePlan()" class="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600 transition-colors">
                        {{ 'savePlan' | l10n }}
                    </button>
                }
            </div>
            <div class="prose max-w-none" [innerHTML]="generatedPlan()?.description | markdown"></div>
        </div>
      }
    </div>
  `,
  styles: [`
    .prose h1, .prose h2, .prose h3 { font-weight: bold; margin-bottom: 0.5em; margin-top: 1em; }
    .prose h1 { font-size: 1.875rem; }
    .prose h2 { font-size: 1.5rem; }
    .prose h3 { font-size: 1.25rem; }
    .prose p { margin-bottom: 1em; }
    .prose ul { list-style-type: disc; margin-left: 1.5rem; margin-bottom: 1em; }
    .prose li { margin-bottom: 0.25em; }
    .prose strong { font-weight: bold; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TripPlannerComponent {
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private ai: GoogleGenAI;

  isLoggedIn = this.authService.isLoggedIn;

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  generatedPlan = signal<Omit<TripPlan, 'id' | 'days'> | null>(null);
  
  planRequest = {
    duration: '3 dias',
    travelers: 'Família com 2 crianças',
    interests: new Set<string>(['cultural', 'outdoor'])
  };
  
  availableInterests = ['cultural', 'outdoor', 'sports', 'creative', 'food'];

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env['API_KEY']! });
  }

  toggleInterest(interest: string) {
    if (this.planRequest.interests.has(interest)) {
      this.planRequest.interests.delete(interest);
    } else {
      this.planRequest.interests.add(interest);
    }
  }

  async generatePlan() {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.generatedPlan.set(null);

    const interests = Array.from(this.planRequest.interests).join(', ');
    const prompt = `Cria um roteiro de viagem detalhado para Lisboa, Portugal.
      Duração: ${this.planRequest.duration}.
      Viajantes: ${this.planRequest.travelers}.
      Interesses: ${interests}.
      
      O output deve ser um JSON com um título para o plano e uma descrição em formato markdown.
      A descrição deve ser bem estruturada, com títulos para cada dia (e.g., "## Dia 1: Chegada e Exploração"), e sugestões de atividades com horários (e.g., "- **10:00:** Visita ao Oceanário de Lisboa.").
      Usa negrito e listas para uma boa formatação. Sugere atividades reais e adequadas ao perfil.
      Assume que a língua do output deve ser Português.
    `;
    
    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING }
            },
            required: ['title', 'description']
          }
        }
      });
      
      const text = response.text;
      const parsedPlan = JSON.parse(text);
      
      this.generatedPlan.set({
          title: parsedPlan.title,
          description: parsedPlan.description,
          details: {
              duration: this.planRequest.duration,
              travelers: this.planRequest.travelers,
              interests: Array.from(this.planRequest.interests)
          }
      });

    } catch (error) {
      console.error('Error generating plan:', error);
      this.errorMessage.set(this.authService.translate('errorGeneratingPlan'));
    } finally {
      this.isLoading.set(false);
    }
  }
  
  savePlan() {
      const plan = this.generatedPlan();
      if (!plan || !this.isLoggedIn()) return;
      
      const newPlan: TripPlan = {
          ...plan,
          id: Date.now(),
          days: [] // In a real app, you would parse the markdown to populate this
      };

      this.authService.addSavedPlan(newPlan);
      this.toastService.show(this.authService.translate('planSaved'), 'success');
  }
}
