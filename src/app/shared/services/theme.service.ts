import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'user-theme';
  private darkTheme = false;

  constructor() {
    // Load saved theme preference
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    console.log(savedTheme)
    if (savedTheme) {
      this.darkTheme = savedTheme === 'dark';
      this.applyTheme();
    } 
    // else if (window.matchMedia) {
    //   // Optional: Use system preference as default
    //   this.darkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    //   this.applyTheme();
    // }
  }

  toggleTheme(): void {
    this.darkTheme = !this.darkTheme;
    this.applyTheme();
    localStorage.setItem(this.THEME_KEY, this.darkTheme ? 'dark' : 'light');
  }

  isDarkTheme(): boolean {
    return this.darkTheme;
  }

  private applyTheme(): void {
    const theme = this.darkTheme ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
  }
}