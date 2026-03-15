import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentService } from '../../services/student.service';
import { Student } from '../../models/student.model';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="student-list">
      <h2>👥 Lista Studentilor</h2>

      <div class="table-container" *ngIf="students.length > 0">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nume</th>
              <th>Email</th>
              <th>Facultate</th>
              <th>An</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let s of students">
              <td>{{ s.id }}</td>
              <td>{{ s.name }}</td>
              <td>{{ s.email }}</td>
              <td>{{ s.faculty }}</td>
              <td>{{ s.year }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p *ngIf="students.length === 0 && !loading" class="empty">
        Niciun student inregistrat.
      </p>
      <p *ngIf="loading" class="loading">Se incarca...</p>
    </div>
  `,
  styles: [`
    .student-list { padding: 1rem; }
    .table-container { overflow-x: auto; margin-top: 1rem; }
    table { width: 100%; border-collapse: collapse; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    th { background: #1a1a2e; color: white; padding: 0.75rem 1rem; text-align: left; }
    td { padding: 0.75rem 1rem; border-bottom: 1px solid #eee; }
    tr:hover td { background: #f7fafc; }
    .empty, .loading { margin-top: 1rem; color: #666; }
  `],
})
export class StudentListComponent implements OnInit {
  students: Student[] = [];
  loading = true;

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.studentService.getStudents().subscribe({
      next: (data) => {
        this.students = data;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }
}
