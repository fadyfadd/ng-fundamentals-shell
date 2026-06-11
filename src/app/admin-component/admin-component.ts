import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet, Router, RouterLinkActive } from "@angular/router";
 
@Component({
  selector: 'app-admin',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-component.html',
  styleUrl: './admin-component.css',
})
export class AdminComponent {

  private router = inject(Router);
  logout(event: MouseEvent) {
    event.preventDefault();
    this.router.navigate(['/login']);
  }
}
