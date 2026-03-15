import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { StudentService } from './student.service';

describe('StudentService', () => {
  let service: StudentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(StudentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch students list', () => {
    const mockStudents = [
      { id: 1, name: 'Maria Ionescu', email: 'maria@test.com', faculty: 'Info', year: 2 },
    ];

    service.getStudents().subscribe((students) => {
      expect(students.length).toBe(1);
      expect(students[0].name).toBe('Maria Ionescu');
    });

    const req = httpMock.expectOne('/api/students');
    expect(req.request.method).toBe('GET');
    req.flush(mockStudents);
  });

  it('should fetch single student by id', () => {
    const mock = { id: 1, name: 'Test', email: 't@t.com', faculty: 'F', year: 1 };

    service.getStudent(1).subscribe((s) => {
      expect(s.id).toBe(1);
    });

    const req = httpMock.expectOne('/api/students/1');
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('should search students with query in URL', () => {
    service.searchStudents('Maria').subscribe();

    const req = httpMock.expectOne('/api/students/search?name=Maria');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should search students safely with HttpParams', () => {
    service.searchStudentsSafe('Ion').subscribe();

    const req = httpMock.expectOne((r) => r.url === '/api/students/search');
    expect(req.request.params.get('name')).toBe('Ion');
    req.flush([]);
  });

  it('should create a student', () => {
    const newStudent = { name: 'Nou', email: 'nou@t.com', faculty: 'Mate', year: 1 };

    service.createStudent(newStudent).subscribe((s) => {
      expect(s.name).toBe('Nou');
    });

    const req = httpMock.expectOne('/api/students');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newStudent);
    req.flush({ id: 2, ...newStudent });
  });

  it('should fetch dashboard stats', () => {
    service.getStats().subscribe((stats) => {
      expect(stats.totalStudents).toBe(10);
    });

    const req = httpMock.expectOne('/api/stats');
    req.flush({ totalStudents: 10, totalGrades: 50, averageGrade: 7.5 });
  });

  it('processFormulaSafe should calculate average', () => {
    expect(service.processFormulaSafe(8, 10)).toBe(9);
    expect(service.processFormulaSafe(5, 7)).toBe(6);
  });
});
