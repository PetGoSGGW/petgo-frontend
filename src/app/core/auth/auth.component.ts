import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
  imports: [RouterOutlet, NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent {}
