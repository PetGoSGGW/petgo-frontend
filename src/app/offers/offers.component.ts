import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OffersService } from './offers.service';

@Component({
  selector: 'app-offers',
  imports: [CommonModule, FormsModule],
  templateUrl: './offers.component.html',
  styleUrl: './offers.component.css',
})
export class OffersComponent implements OnInit {
  private readonly offersService = inject(OffersService);
  private dogWalkers: DogWalker[] = [];
  protected search: string = '';

  ngOnInit(): void {
    this.offersService.getDogWalkers().subscribe({
      next: data => this.dogWalkers = data,
      error: err => console.error('Nie można pobrać wyprowadzaczy', err)
    });
  }

  protected reserve(name: string): void {
    alert(`Zarezerwowano: ${name}`);
  }

  protected filteredDogWalkers() {
    if (!this.search) return this.dogWalkers;
    return this.dogWalkers.filter(n =>
      n.city.toLowerCase().includes(this.search.toLowerCase())
    );
  }
}
