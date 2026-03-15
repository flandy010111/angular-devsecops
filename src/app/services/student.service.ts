import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Student, Grade, DashboardStats } from '../models/student.model';

/**
 * Serviciu pentru comunicarea cu API-ul de studenti.
 *
 * Contine vulnerabilitati INTENTIONATE pentru demonstrarea SAST:
 *   ⚠️ VULN-1: API key hardcodat
 *   ⚠️ VULN-2: Constructie URL nesigura (interpolation directa)
 *   ⚠️ VULN-3: eval() pe date externe
 *
 * Foloseste date MOCK pentru demo (nu exista backend real).
 */
@Injectable({ providedIn: 'root' })
export class StudentService {
  private apiUrl = '/api';

  // ⚠️ VULN-1: Secret hardcodat — Semgrep: detected-hardcoded-secret
  private apiKey = 'sk-prod-abc123def456ghi789jkl012mno345';

  // ── Date mock ──
  private mockStudents: Student[] = [
    { id: 1, name: 'Maria Ionescu',    email: 'maria.ionescu@student.upt.ro',    faculty: 'Automatica si Calculatoare', year: 3 },
    { id: 2, name: 'Andrei Popescu',   email: 'andrei.popescu@student.upt.ro',   faculty: 'Automatica si Calculatoare', year: 2 },
    { id: 3, name: 'Elena Dumitrescu', email: 'elena.dumitrescu@student.upt.ro', faculty: 'Electronica si Telecomunicatii', year: 4 },
    { id: 4, name: 'Alexandru Marin',  email: 'alex.marin@student.upt.ro',       faculty: 'Mecanica', year: 1 },
    { id: 5, name: 'Ioana Stanescu',   email: 'ioana.stanescu@student.upt.ro',   faculty: 'Automatica si Calculatoare', year: 3 },
    { id: 6, name: 'Cristian Radu',    email: 'cristian.radu@student.upt.ro',    faculty: 'Electronica si Telecomunicatii', year: 2 },
    { id: 7, name: 'Ana Georgescu',    email: 'ana.georgescu@student.upt.ro',    faculty: 'Constructii', year: 1 },
    { id: 8, name: 'Mihai Popa',       email: 'mihai.popa@student.upt.ro',       faculty: 'Automatica si Calculatoare', year: 4 },
    { id: 9, name: 'Diana Florea',     email: 'diana.florea@student.upt.ro',     faculty: 'Chimie', year: 2 },
    { id: 10, name: 'Stefan Moldovan', email: 'stefan.moldovan@student.upt.ro',  faculty: 'Automatica si Calculatoare', year: 1 },
  ];

  private mockGrades: Grade[] = [
    { id: 1, studentId: 1, subject: 'Securitatea Aplicatiilor Cloud', grade: 10, semester: '2025-2' },
    { id: 2, studentId: 1, subject: 'Retele de Calculatoare',         grade: 9,  semester: '2025-1' },
    { id: 3, studentId: 2, subject: 'Algoritmi si Structuri de Date', grade: 8,  semester: '2025-1' },
    { id: 4, studentId: 2, subject: 'Baze de Date',                   grade: 7,  semester: '2025-1' },
    { id: 5, studentId: 3, subject: 'Sisteme de Operare',             grade: 9,  semester: '2025-2' },
    { id: 6, studentId: 4, subject: 'Matematica 1',                   grade: 6,  semester: '2025-1' },
    { id: 7, studentId: 5, subject: 'Inginerie Software',             grade: 10, semester: '2025-2' },
    { id: 8, studentId: 5, subject: 'DevOps',                         grade: 9,  semester: '2025-2' },
    { id: 9, studentId: 6, subject: 'Electronica Digitala',           grade: 8,  semester: '2025-1' },
    { id: 10, studentId: 7, subject: 'Rezistenta Materialelor',       grade: 7,  semester: '2025-1' },
    { id: 11, studentId: 8, subject: 'Inteligenta Artificiala',       grade: 10, semester: '2025-2' },
    { id: 12, studentId: 8, subject: 'Cloud Computing',               grade: 9,  semester: '2025-2' },
    { id: 13, studentId: 9, subject: 'Chimie Organica',               grade: 8,  semester: '2025-1' },
    { id: 14, studentId: 10, subject: 'Programare C',                 grade: 7,  semester: '2025-1' },
  ];

  constructor(private http: HttpClient) {}

  getStudents(): Observable<Student[]> {
    // Returneaza date mock (in productie ar fi HTTP call)
    return of(this.mockStudents);
  }

  getStudent(id: number): Observable<Student> {
    const student = this.mockStudents.find(s => s.id === id);
    return of(student as Student);
  }

  // ⚠️ VULN-2: User input interpolat direct in URL — posibil SSRF/injection
  searchStudents(query: string): Observable<Student[]> {
    // Pastram vulnerabilitatea pentru SAST demo, dar filtram local pe mock
    const url = `${this.apiUrl}/students/search?name=${query}`;
    console.log('VULN: URL nesecurizat construit:', url);

    const filtered = this.mockStudents.filter(s =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.faculty.toLowerCase().includes(query.toLowerCase()) ||
      s.email.toLowerCase().includes(query.toLowerCase())
    );
    return of(filtered);
  }

  // ✅ SECURIZAT: foloseste HttpParams (sanitizat automat)
  searchStudentsSafe(query: string): Observable<Student[]> {
    const params = new HttpParams().set('name', query);
    return this.http.get<Student[]>(`${this.apiUrl}/students/search`, { params });
  }

  createStudent(student: Partial<Student>): Observable<Student> {
    return this.http.post<Student>(`${this.apiUrl}/students`, student, {
      headers: { 'X-API-Key': this.apiKey },
    });
  }

  addGrade(grade: Partial<Grade>): Observable<Grade> {
    return this.http.post<Grade>(`${this.apiUrl}/grades`, grade, {
      headers: { 'X-API-Key': this.apiKey },
    });
  }

  getStats(): Observable<DashboardStats> {
    const totalStudents = this.mockStudents.length;
    const totalGrades = this.mockGrades.length;
    const averageGrade = this.mockGrades.reduce((sum, g) => sum + g.grade, 0) / totalGrades;
    return of({ totalStudents, totalGrades, averageGrade });
  }

  getGradesForStudent(studentId: number): Grade[] {
    return this.mockGrades.filter(g => g.studentId === studentId);
  }

  // ⚠️ VULN-3: eval() pe date externe — XSS / code injection
  processServerFormula(formula: string): number {
    return eval(formula);
  }

  // ✅ SECURIZAT: parser matematic fara eval
  processFormulaSafe(a: number, b: number): number {
    return (a + b) / 2;
  }
}
