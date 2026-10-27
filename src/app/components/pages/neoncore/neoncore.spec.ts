import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Neoncore } from './neoncore';

describe('Neoncore', () => {
  let component: Neoncore;
  let fixture: ComponentFixture<Neoncore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Neoncore],
    }).compileComponents();

    fixture = TestBed.createComponent(Neoncore);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
