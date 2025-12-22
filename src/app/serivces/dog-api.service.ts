import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Dog } from '../models/dog.model';
import { sampleDogs } from '../data/sample-data';

@Injectable()
export class DogApiService {
  public getDogs$(): Observable<Dog[]> {
    return of(sampleDogs);
  }
}
