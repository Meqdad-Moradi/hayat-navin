import '@angular/compiler';
import { ɵresolveComponentResources as resolveComponentResources } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { PageHeader } from './page-header';

TestBed.initTestEnvironment(BrowserTestingModule, platformBrowserTesting());

describe('PageHeader', () => {
  let fixture: ComponentFixture<PageHeader>;

  beforeAll(async () => {
    await resolveComponentResources((url) =>
      readFile(resolve(process.cwd(), 'src/app/components/shared/page-header', url), 'utf-8'),
    );
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageHeader],
    }).compileComponents();

    fixture = TestBed.createComponent(PageHeader);
    fixture.componentRef.setInput('eyebrow', 'PEOPLE DIRECTORY');
    fixture.componentRef.setInput('title', 'Search persons');
    fixture.componentRef.setInput('titleId', 'persons-heading');
    fixture.componentRef.setInput('description', 'Browse registered people.');
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders its heading content and applies the supplied title id', () => {
    const header: HTMLElement = fixture.nativeElement;
    const title = header.querySelector('h1');

    expect(header.querySelector('p')?.textContent?.trim()).toBe('PEOPLE DIRECTORY');
    expect(title?.textContent?.trim()).toBe('Search persons');
    expect(title?.id).toBe('persons-heading');
    expect(header.textContent).toContain('Browse registered people.');
  });
});
