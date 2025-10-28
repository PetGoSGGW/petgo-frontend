import { ComponentFixture, TestBed} from '@angular/core/testing'; // Import 'async'
import { LogInFormComponent } from './log-in-form'; // Poprawiony import

describe('LogInFormComponent', () => { // Poprawiona nazwa
  let component: LogInFormComponent; // Poprawiony typ
  let fixture: ComponentFixture<LogInFormComponent>; // Poprawiony typ

  beforeEach(async () => { // Dodano 'async' dla 'compileComponents'
    await TestBed.configureTestingModule({ // 'await'
      imports: [LogInFormComponent], // Poprawiona nazwa
    }).compileComponents();

    fixture = TestBed.createComponent(LogInFormComponent); // Poprawiona nazwa
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});