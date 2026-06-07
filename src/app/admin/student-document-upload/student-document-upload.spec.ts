import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentDocumentUpload } from './student-document-upload';

describe('StudentDocumentUpload', () => {
  let component: StudentDocumentUpload;
  let fixture: ComponentFixture<StudentDocumentUpload>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentDocumentUpload],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentDocumentUpload);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
