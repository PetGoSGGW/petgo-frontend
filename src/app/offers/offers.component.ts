import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Nanny {
  name: string;
  username: string;
  rating: number;
  reviews: number;
  distance: number;
  rate: number;
  age: number;
  city: string;
  street: string;
  postal: string;
}

@Component({
  selector: 'app-offers',
  imports: [CommonModule],
  templateUrl: './offers.component.html',
  styleUrl: './offers.component.css',
})
export class OffersComponent {
  protected readonly nannies: Nanny[] = [
    {
      name: 'Julia',
      username: 'julia',
      rating: 4,
      reviews: 201,
      distance: 0.9,
      rate: 40,
      age: 22,
      city: 'Warszawa',
      street: 'ul. Długa 10',
      postal: '00-886',
    },
    {
      name: 'Kasia',
      username: 'kasia',
      rating: 4,
      reviews: 123,
      distance: 1.2,
      rate: 35,
      age: 26,
      city: 'Warszawa',
      street: 'ul. Długa 5',
      postal: '00-110',
    },
  ];

  protected reserve(name: string): void {
    alert(`Zarezerwowano: ${name}`);
  }
}
