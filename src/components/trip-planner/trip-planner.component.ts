import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GoogleGenAI } from '@google/genai';
import { MarkdownPipe } from '../../pipes/markdown.pipe';
import { L10nPipe } from '../../pipes/l10n.pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trip-planner',
  standalone: true,
  imports: [CommonModule, FormsModule, MarkdownPipe, L10nPipe],
  template: `
    <div class="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-800 text-center mb-2">{{ 'tripPlannerTitle' | l10n }}</h1>
      <p class="text-gray-600 text-center mb-8">{{ 'tripPlannerDescription' | l10n }}</p>

      <form (ngSubmit)="generateItinerary()">
        <textarea 
          [(ngModel)]="prompt"
          name="prompt"
          rows="4"
          class="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
          placeholder="{{ 'tripPlannerPlaceholder' | l10n }}"
        ></textarea>
        <button 
          type="submit" 
          [disabled]="isLoading() || !prompt.trim()"
          class="mt-4 w-full bg-teal-500 text-white py-3 rounded-md font-semibold hover:bg-teal-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
        >
          @if(isLoading()) {
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ 'generatingItinerary' | l10n }}</span>
          } @else {
            <span>{{ 'generateItinerary' | l10n }}</span>
          }
        </button>
      </form>

      @if (itinerary()) {
        <div class="mt-8 border-t pt-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">{{ 'itinerary' | l10n }}</h2>
            <div class="prose max-w-none" [innerHTML]="itinerary() | markdown"></div>
        </div>
      }
      @if (error()) {
        <div class="mt-8 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p><strong>Error:</strong> {{ error() }}</p>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TripPlannerComponent {
  prompt = signal('');
  itinerary = signal('');
  isLoading = signal(false);
  error = signal('');
  
  private ai: GoogleGenAI | null = null;

  constructor() {
    try {
        // This will be undefined in the browser, but we'll handle it gracefully
        const apiKey = process.env.API_KEY;
        if (apiKey) {
            this.ai = new GoogleGenAI({ apiKey });
        } else {
            console.warn('API_KEY environment variable not found.');
            this.error.set('API key for Gemini is not configured. This feature is disabled.');
        }
    } catch (e) {
        console.error('Failed to initialize GoogleGenAI', e);
        this.error.set('Could not initialize the AI service.');
    }
  }

  async generateItinerary() {
    if (!this.prompt().trim() || !this.ai) {
        if (!this.ai) {
            this.error.set('AI service is not available. Please configure an API key.');
        }
        return;
    }

    this.isLoading.set(true);
    this.itinerary.set('');
    this.error.set('');

    const fullPrompt = `You are a helpful assistant specializing in family-friendly travel in Portugal. 
    Create a detailed, day-by-day travel itinerary based on the user's request. 
    Provide practical tips like opening times, suggested duration, and kid-friendly food spots nearby if possible. 
    Format the output using Markdown.
    
    User request: "${this.prompt()}"`;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{role: 'user', parts: [{text: fullPrompt}]}]
      });
      this.itinerary.set(response.text);
    } catch (e: any) {
      console.error(e);
      this.error.set('An error occurred while generating the itinerary. Please try again.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
