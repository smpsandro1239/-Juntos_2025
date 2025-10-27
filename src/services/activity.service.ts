import { computed, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { Activity } from '../models/activity.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  // --- State ---
  private activities: WritableSignal<Activity[]> = signal<Activity[]>([
    {
      id: 1,
      title: 'Parque Infantil da Estrela',
      category: 'Ar Livre',
      imageUrl: 'https://picsum.photos/seed/park1/600/400',
      distance: 2.3,
      price: 'Grátis',
      ageRange: '2-10 anos',
      tags: ['Parque Infantil', 'Natureza'],
      isFavorite: false,
      description: 'Um clássico jardim de Lisboa, com um parque infantil que faz as delícias dos mais novos e um café com esplanada para os pais relaxarem. Tem também um lago com patos e gansos.',
      location: { lat: 38.715, lng: -9.16 }
    },
    {
      id: 2,
      title: 'Museu da Marioneta',
      category: 'Cultura',
      imageUrl: 'https://picsum.photos/seed/museum2/600/400',
      distance: 4.1,
      price: '€5 / pessoa',
      ageRange: '4+ anos',
      tags: ['Chuva OK', 'Educativo'],
      isFavorite: true,
      description: 'Instalado no Convento das Bernardas, este museu apresenta uma impressionante coleção de marionetas de todo o mundo. Uma viagem fascinante pela história do teatro de marionetas.',
      location: { lat: 38.706, lng: -9.15 }
    },
    {
      id: 3,
      title: 'Praia de Carcavelos',
      category: 'Praia',
      imageUrl: 'https://picsum.photos/seed/beach3/600/400',
      distance: 15.5,
      price: 'Grátis',
      ageRange: 'Todas as idades',
      tags: ['Sol', 'Areia', 'Mar'],
      isFavorite: false,
      description: 'Uma das praias mais populares da linha de Cascais. Com um extenso areal, é ideal para construir castelos de areia, jogar à bola e dar os primeiros passos no surf.',
      location: { lat: 38.678, lng: -9.335 }
    },
    {
      id: 4,
      title: 'KidZania Lisboa',
      category: 'Parque Temático',
      imageUrl: 'https://picsum.photos/seed/kidzania4/600/400',
      distance: 8.9,
      price: '€22 / criança',
      ageRange: '4-15 anos',
      tags: ['Chuva OK', 'Diversão'],
      isFavorite: false,
      description: 'Uma cidade à escala das crianças onde podem "brincar aos adultos". Desde ser bombeiro, médico ou jornalista, as crianças podem experimentar mais de 60 profissões.',
      location: { lat: 38.755, lng: -9.17 }
    },
     {
      id: 5,
      title: 'Oceanário de Lisboa',
      category: 'Natureza',
      imageUrl: 'https://picsum.photos/seed/oceanario5/600/400',
      distance: 10.2,
      price: '€19 / adulto',
      ageRange: 'Todas as idades',
      tags: ['Chuva OK', 'Animais'],
      isFavorite: true,
      description: 'Considerado um dos melhores aquários do mundo, o Oceanário é a casa de milhares de animais marinhos. Uma experiência imersiva e educativa para toda a família.',
      location: { lat: 38.763, lng: -9.094 }
    },
    {
      id: 6,
      title: 'Trilho da Cascata',
      category: 'Aventura',
      imageUrl: 'https://picsum.photos/seed/hike6/600/400',
      distance: 25.0,
      price: 'Grátis',
      ageRange: '6+ anos',
      tags: ['Natureza', 'Caminhada'],
      isFavorite: false,
      description: 'Um percurso pedestre no Parque Natural da Arrábida que culmina numa pequena e refrescante cascata. Ideal para famílias aventureiras que gostam de contacto com a natureza.',
      location: { lat: 38.48, lng: -9.05 }
    }
  ]);

  // --- Filter State ---
  selectedCategory = signal<string | null>(null);
  showOnlyFree = signal(false);
  showRainyDayOk = signal(false);

  // --- Derived State & Selectors ---
  uniqueCategories: Signal<string[]> = computed(() => 
    [...new Set(this.activities().map(a => a.category))]
  );

  filteredActivities: Signal<Activity[]> = computed(() => {
    const allActivities = this.activities();
    const category = this.selectedCategory();
    const freeOnly = this.showOnlyFree();
    const rainyOk = this.showRainyDayOk();

    return allActivities.filter(activity => {
      const categoryMatch = !category || activity.category === category;
      const freeMatch = !freeOnly || activity.price === 'Grátis';
      const rainyMatch = !rainyOk || activity.tags.includes('Chuva OK');
      return categoryMatch && freeMatch && rainyMatch;
    });
  });

  getActivityById(id: Signal<number | undefined>): Signal<Activity | undefined> {
    return computed(() => {
      const activityId = id();
      if (activityId === undefined) return undefined;
      return this.activities().find(a => a.id === activityId);
    });
  }
  
  // --- Actions ---
  setCategoryFilter(category: string | null) {
    this.selectedCategory.set(category);
  }

  toggleFreeFilter() {
    this.showOnlyFree.update(val => !val);
  }

  toggleRainyDayFilter() {
    this.showRainyDayOk.update(val => !val);
  }
  
  toggleFavorite(id: number) {
    this.activities.update(activities =>
      activities.map(activity =>
        activity.id === id
          ? { ...activity, isFavorite: !activity.isFavorite }
          : activity
      )
    );
  }
}
