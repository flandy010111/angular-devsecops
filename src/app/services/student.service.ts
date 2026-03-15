import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student, Grade, DashboardStats } from '../models/student.model';

/**
 * Serviciu pentru comunicarea cu API-ul de studenti.
 *
 * Contine vulnerabilitati INTENTIONATE pentru demonstrarea SAST:
 *   ⚠️ VULN-1: API key hardcodat
 *   ⚠️ VULN-2: Constructie URL nesigura (interpolation directa)
 *   ⚠️ VULN-3: eval() pe date externe
 */
@Injectable({ providedIn: 'root' })
export class StudentService {
  private apiUrl = '/api';

  // ⚠️ VULN-1: Secret hardcodat — Semgrep: detected-hardcoded-secret
  private apiKey = 'sk-prod-abc123def456ghi789jkl012mno345';

  constructor(private http: HttpClient) {}

  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.apiUrl}/students`, {
      headers: { 'X-API-Key': this.apiKey },
    });
  }

  getStudent(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/students/${id}`);
  }

  // ⚠️ VULN-2: User input interpolat direct in URL — posibil SSRF/injection
  searchStudents(query: string): Observable<Student[]> {
    const url = `${this.apiUrl}/students/search?name=${query}`;
    return this.http.get<Student[]>(url);
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
    return this.http.get<DashboardStats>(`${this.apiUrl}/stats`);
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
