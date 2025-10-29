import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// !! Waits for amplify_outputs file !!
// import { Amplify } from 'aws-amplify';
// import outputs from '../../amplify_outputs.json';

// Amplify.configure(outputs);

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [RouterOutlet],
})
export class AppComponent {}
