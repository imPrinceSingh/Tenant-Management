import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {
  isSideNavOpen = signal<boolean>(false);

  toggleSideNav(){
    this.isSideNavOpen.update((current)=>!current)
  }

  constructor() { }
}
