import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { GoogleGenAI, Type } from '@google/genai';

// Assume process.env.API_KEY is available
declare const process: any;

interface TripPlan {
  tripTitle: string;
  dailyPlan: {
    day: number;
    activities: {
      time: string;
      description: string;
    }[];
  }[];
}

@Component({
  selector: 'app-trip-planner',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 class="text-3xl font-bold text-center mb-6">Planeador de Roteiros IA</h1>
      <p class="text-center text-gray-600 mb-8">Vamos planear a sua próxima aventura! Descreva a sua viagem e a nossa IA irá gerar um itinerário personalizado para si.</p>

      <form [formGroup]="plannerForm" (ngSubmit)="generatePlan()" class="bg-white p-6 rounded-lg shadow-md mb-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label for="destination" class="block text-sm font-medium text-gray-700">Destino</label>
            <input type="text" id="destination" formControlName="destination" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm">
          </div>
          <div>
            <label for="duration" class="block text-sm font-medium text-gray-700">Duração (dias)</label>
            <input type="number" id="duration" formControlName="duration" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm">
          </div>
          <div>
            <label for="interests" class="block text-sm font-medium text-gray-700">Interesses</label>
            <input type="text" id="interests" formControlName="interests" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm" placeholder="ex: museus, caminhadas, comida">
          </div>
        </div>
        <div class="text-center mt-6">
          <button type="submit" [disabled]="plannerForm.invalid || loading()" class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-gray-400">
            @if (loading()) {
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              A gerar...
            } @else {
              Gerar Roteiro
            }
          </button>
        </div>
      </form>

      @if (error()) {
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span class="block sm:inline">{{ error() }}</span>
        </div>
      }

      @if (tripPlan(); as plan) {
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-2xl font-bold mb-4">{{ plan.tripTitle }}</h2>
          <div class="space-y-6">
            @for (day of plan.dailyPlan; track day.day) {
              <div class="border-t pt-4">
                <h3 class="text-xl font-semibold mb-3">Dia {{ day.day }}</h3>
                <ul class="space-y-2">
                  @for (activity of day.activities; track $index) {
                    <li class="flex items-start">
                      <span class="bg-teal-500 text-white rounded-full h-8 w-8 text-sm flex items-center justify-center font-bold mr-4 flex-shrink-0">{{ activity.time }}</span>
                      <p class="text-gray-700">{{ activity.description }}</p>
                    </li>
                  }
                </ul>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TripPlannerComponent {
  private fb = inject(FormBuilder);
  private ai!: GoogleGenAI;

  plannerForm = this.fb.group({
    destination: ['Lisboa', Validators.required],
    duration: [3, [Validators.required, Validators.min(1)]],
    interests: ['museus, comida, parques', Validators.required],
  });

  loading = signal(false);
  tripPlan = signal<TripPlan | null>(null);
  error = signal<string | null>(null);

  constructor() {
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    } else {
      console.error('API key not found. Make sure process.env.API_KEY is set.');
      this.error.set('Funcionalidades IA desativadas. A chave da API não está configurada.');
      this.ai = {} as GoogleGenAI;
    }
  }

  async generatePlan(): Promise<void> {
    if (this.plannerForm.invalid) {
      return;
    }
    if (!this.ai.models?.generateContent) {
      this.error.set('Cliente IA não inicializado. Por favor, configure a sua chave de API.');
      return;
    }


    this.loading.set(true);
    this.tripPlan.set(null);
    this.error.set(null);

    const { destination, duration, interests } = this.plannerForm.value;
    const prompt = `Cria um roteiro de ${duration} dias para ${destination}. O viajante tem interesse em ${interests}. Fornece um plano detalhado para cada dia, com horários e descrições. O formato de resposta deve ser JSON.`;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              tripTitle: { type: Type.STRING },
              dailyPlan: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    day: { type: Type.INTEGER },
                    activities: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          time: { type: Type.STRING },
                          description: { type: Type.STRING },
                        },
                        required: ['time', 'description']
                      }
                    }
                  },
                  required: ['day', 'activities']
                }
              }
            },
            required: ['tripTitle', 'dailyPlan']
          }
        }
      });
      
      const jsonText = response.text.trim();
      const plan: TripPlan = JSON.parse(jsonText);
      this.tripPlan.set(plan);
    } catch (e) {
      console.error(e);
      this.error.set('Falha ao gerar o roteiro. Por favor, tente novamente.');
    } finally {
      this.loading.set(false);
    }
  }
}
