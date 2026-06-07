import { Component, inject, signal, WritableSignal } from '@angular/core';
import { StudentDocumentManagement } from './student-document-management/student-document-management';
import { MatFormField, MatLabel, MatOption, MatSelect } from "@angular/material/select";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { APP_BACKEND_SERVER, ConfigService } from '../../config-service';
import { Notification } from '../../notification';
import { StudentDto } from '../../dtos/student-dto';

@Component({
  selector: 'app-student-document-upload',
  imports: [StudentDocumentManagement, MatFormField, MatLabel, MatOption, MatSelect , ReactiveFormsModule],
  templateUrl: './student-document-upload.html',
  styleUrl: './student-document-upload.css',
})
export class StudentDocumentUpload {

  public formGroup: FormGroup;

  private http: HttpClient = inject(HttpClient);
  private formBuilder = inject(FormBuilder);
  notification = inject(Notification);
  configService  = inject(ConfigService);
  students: WritableSignal<StudentDto[]> = signal([]);

  


  constructor() {
    this.formGroup = this.formBuilder.group({
      studentId: ['']
    });

     
    let backendAddress = this.configService.get(APP_BACKEND_SERVER);
    this.http.get<StudentDto[]>(`${backendAddress}api/student/getStudents`).subscribe({
      next: (data) => {
        this.students.set(data);
      },
      error: (error: HttpErrorResponse) => {

        if ((error.status === 401 || error.status === 403)) {
          this.notification.showError('You are not authorized to perform this action');
        }
        else {
          this.notification.showError('An error occurred while fetching course categories');
        }

      }
    });
  }

}
