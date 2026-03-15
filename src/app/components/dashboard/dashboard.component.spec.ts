import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DashboardComponent } from './dashboard.component';
import { StudentService } from '../../services/student.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent, HttpClientTestingModule],
      providers: [StudentService],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load stats on init', () => {
    expect(component.stats).toBeTruthy();
    expect(component.stats!.totalStudents).toBe(10);
    expect(component.stats!.totalGrades).toBe(14);
  });

  it('should have no error initially', () => {
    expect(component.error).toBe('');
  });

  it('should calculate average grade', () => {
    expect(component.stats!.averageGrade).toBeGreaterThan(0);
    expect(component.stats!.averageGrade).toBeLessThanOrEqual(10);
  });
});
