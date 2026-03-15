import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { StudentService } from '../../services/student.service';
import { Student } from '../../models/student.model';

/**
 * Componenta de cautare studenti.
 *
 * ⚠️ VULN: Foloseste bypassSecurityTrustHtml() — XSS prin innerHTML
 * Semgrep va detecta bypass-ul Angular DomSanitizer.
 */
@Component({
  selector: 'app-student-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="search-page">
      <h2>🔍 Cautare Studenti</h2>

      <div class="search-box">
        <input
          type="text"
          [(ngModel)]="searchQuery"
          placeholder="Cauta dupa nume..."
          (keyup.enter)="onSearch()"
        />
        <button (click)="onSearch()">Cauta</button>
      </div>

      <!-- ⚠️ VULN: innerHTML cu continut nesanitizat — XSS -->
      <div *ngIf="highlightedResult" [innerHTML]="highlightedResult"></div>

      <div class="results" *ngIf="results.length > 0">
        <div class="result-card" *ngFor="let s of results">
          <strong>{{ s.name }}</strong>
          <span>{{ s.faculty }} — Anul {{ s.year }}</span>
          <small>{{ s.email }}</small>
        </div>
      </div>

      <p *ngIf="searched && results.length === 0" class="no-results">
        Niciun rezultat pentru "{{ searchQuery }}".
      </p>
    </div>
  `,
  styles: [`
    .search-page { padding: 1rem; }
    .search-box { display: flex; gap: 0.5rem; margin: 1.5rem 0; }
    .search-box input { flex: 1; padding: 0.75rem 1rem; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 1rem; }
    .search-box button { padding: 0.75rem 1.5rem; background: #1a1a2e; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem; }
    .search-box button:hover { background: #2d2d52; }
    .results { display: grid; gap: 1rem; margin-top: 1rem; }
    .result-card { background: white; padding: 1rem 1.5rem; border-radius: 10px; box-shadow: 0 2px 6px rgba(0,0,0,0.06); display: flex; flex-direction: column; gap: 0.25rem; }
    .result-card strong { color: #1a1a2e; }
    .result-card small { color: #999; }
    .no-results { color: #888; margin-top: 1rem; }
  `],
})
export class StudentSearchComponent {
  searchQuery = '';
  results: Student[] = [];
  searched = false;
  highlightedResult: SafeHtml | null = null;

  constructor(
    private studentService: StudentService,
    private sanitizer: DomSanitizer,
  ) {}

  onSearch(): void {
    if (!this.searchQuery.trim()) return;

    this.studentService.searchStudents(this.searchQuery).subscribe({
      next: (data) => {
        this.results = data;
        this.searched = true;

        // ⚠️ VULN: bypassSecurityTrustHtml cu input utilizator
        // Permite XSS daca serverul returneaza HTML malitios
        if (data.length > 0) {
          const raw = `<p>Rezultate pentru: <b>${this.searchQuery}</b> (${data.length} gasite)</p>`;
          this.highlightedResult = this.sanitizer.bypassSecurityTrustHtml(raw);
        }
      },
      error: () => {
        this.results = [];
        this.searched = true;
      },
    });
  }
}
