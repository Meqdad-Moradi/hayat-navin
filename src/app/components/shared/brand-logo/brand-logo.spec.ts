import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrandLogo } from './brand-logo';

describe('BrandLogo', () => {
  let fixture: ComponentFixture<BrandLogo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandLogo],
    }).compileComponents();

    fixture = TestBed.createComponent(BrandLogo);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the Hayat Navin brand link', () => {
    const link: HTMLAnchorElement = fixture.nativeElement.querySelector('a');

    expect(link.getAttribute('aria-label')).toBe('Hayat Navin home');
    expect(link.getAttribute('href')).toBe('/');
    expect(link.textContent).toContain('hayat');
    expect(link.textContent).toContain('navin');
    expect(link.querySelector('mat-icon')?.textContent?.trim()).toBe('spa');
  });
});
