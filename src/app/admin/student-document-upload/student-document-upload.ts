import { Component } from '@angular/core';
import { StudentDocumentManagement } from './student-document-management/student-document-management';

@Component({
  selector: 'app-student-document-upload',
  imports: [StudentDocumentManagement],
  templateUrl: './student-document-upload.html',
  styleUrl: './student-document-upload.css',
})
export class StudentDocumentUpload {}
