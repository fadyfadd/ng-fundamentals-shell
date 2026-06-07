import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentDocumentManagement } from './student-document-management';

describe('StudentDocumentManagement', () => {
  let component: StudentDocumentManagement;
  let fixture: ComponentFixture<StudentDocumentManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentDocumentManagement],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentDocumentManagement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
