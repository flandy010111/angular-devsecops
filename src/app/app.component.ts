import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <nav class="navbar">
      <h1>🎓 Portal Studenti</h1>
      <div class="nav-links">
        <a routerLink="/dashboard">Dashboard</a>
        <a routerLink="/students">Studenti</a>
        <a routerLink="/search">Cautare</a>
      </div>
    </nav>
    <main class="container">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .navbar {
      background: #1a1a2e; color: white; padding: 1rem 2rem;
      display: flex; justify-content: space-between; align-items: center;
    }
    .nav-links a {
      color: #a8dadc; margin-left: 1.5rem; text-decoration: none;
      font-weight: 500;
    }
    .nav-links a:hover { color: white; }
    .container { max-width: 1200px; margin: 2rem auto; padding: 0 1rem; }
  `],
})
export class AppComponent {
  title = 'Portal Studenti';
}
