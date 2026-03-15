import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentService } from '../../services/student.service';
import { DashboardStats } from '../../models/student.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <h2>📊 Dashboard</h2>

      <div class="stats-grid" *ngIf="stats">
        <div class="stat-card">
          <span class="stat-value">{{ stats.totalStudents }}</span>
          <span class="stat-label">Studenti inregistrati</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ stats.totalGrades }}</span>
          <span class="stat-label">Note inregistrate</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ stats.averageGrade | number:'1.2-2' }}</span>
          <span class="stat-label">Media generala</span>
        </div>
      </div>

      <p *ngIf="error" class="error">{{ error }}</p>
    </div>
  `,
  styles: [`
    .dashboard { padding: 1rem; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-top: 1.5rem; }
    .stat-card { background: white; border-radius: 12px; padding: 2rem; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .stat-value { display: block; font-size: 2.5rem; font-weight: 700; color: #1a1a2e; }
    .stat-label { display: block; margin-top: 0.5rem; color: #666; font-size: 0.9rem; }
    .error { color: #e53e3e; margin-top: 1rem; padding: 1rem; background: #fff5f5; border-radius: 8px; }
  `],
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  error = '';

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.studentService.getStats().subscribe({
      next: (data) => (this.stats = data),
      error: (err) => (this.error = 'Eroare la incarcarea statisticilor: ' + err.message),
    });
  }
}
