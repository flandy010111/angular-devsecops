import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { StudentSearchComponent } from './student-search.component';

describe('StudentSearchComponent', () => {
  let component: StudentSearchComponent;
  let fixture: ComponentFixture<StudentSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentSearchComponent, HttpClientTestingModule, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentSearchComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not search on empty query', () => {
    component.searchQuery = '   ';
    component.onSearch();
    expect(component.searched).toBeFalse();
  });

  it('should initialize with empty results', () => {
    expect(component.results).toEqual([]);
    expect(component.searched).toBeFalse();
  });
});
