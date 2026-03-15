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
  templateUrl: './student-search.component.html',
  styleUrls: ['./student-search.component.scss'],
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

  quickSearch(query: string): void {
    this.searchQuery = query;
    this.onSearch();
  }

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
        } else {
          this.highlightedResult = null;
        }
      },
      error: () => {
        this.results = [];
        this.searched = true;
      },
    });
  }
}
