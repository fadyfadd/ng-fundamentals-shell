import { Component, computed, inject, signal, WritableSignal } from '@angular/core';
import { MatFormField, MatLabel, MatOption, MatSelect, MatSelectChange } from "@angular/material/select";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { APP_BACKEND_SERVER, ConfigService } from '../../config-service';
import { Notification } from '../../notification';
import { StudentDto } from '../../dtos/student-dto';
import { StudentDocumentDto } from '../../dtos/student-document-dto';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-student-document-upload',
  imports: [MatFormField, MatLabel, MatOption, MatSelect, ReactiveFormsModule, MatButtonModule],
  templateUrl: './student-document-upload.html',
  styleUrl: './student-document-upload.css',
})
export class StudentDocumentUpload {
  deleteDocument(arg0: number | undefined) {
    throw new Error('Method not implemented.');
  }

  downloadDocument(id: number | undefined) {
    let backendAddress = this.configService.get(APP_BACKEND_SERVER);
    this.http.get(`${backendAddress}api/student/downloadDocument/${id}`, { responseType: 'blob', observe: 'response' }).subscribe({
      next: (response) => {
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(response.body!);
        a.href = objectUrl;

        var filename = 'document';
        const contentDisposition = response.headers.get('content-disposition');

        if (contentDisposition) {
          const parts = contentDisposition.split('filename=');
          if (parts.length > 1) {
            filename = parts[1].split(';')[0].trim();
          }
        }
        console.log("1. Full Header Keys:", response.headers.keys());
        console.log("2. Raw Content-Disposition:", response.headers.get('content-disposition'));
        a.download = filename;
        a.click();
        setTimeout(() => {
          URL.revokeObjectURL(objectUrl);
        }, 250);

      },
      error: (error: HttpErrorResponse) => {

        if ((error.status === 401 || error.status === 403)) {
          this.notification.showError('You are not authorized to perform this action');
        }
        else {
          this.notification.showError('An error occurred while downloading the document');
        }

      }
    });
  }

  studentSelected(event: MatSelectChange) {
    var id = event.value;
    let backendAddress = this.configService.get(APP_BACKEND_SERVER);

    if (!id) {
      this.documents.set([]);
      return;
    }

    this.http.get<StudentDocumentDto[]>(`${backendAddress}api/student/getAllDocumentsForStudent/${id}`).subscribe({
      next: (data) => {
        this.documents.set(data);
      },
      error: (error: HttpErrorResponse) => {

        if ((error.status === 401 || error.status === 403)) {
          this.notification.showError('You are not authorized to perform this action');
        }
        else {
          this.notification.showError('An error occurred while fetching student documents');
        }

      }
    });
  }

  public formGroup: FormGroup;

  private http: HttpClient = inject(HttpClient);
  private formBuilder = inject(FormBuilder);
  notification = inject(Notification);
  configService = inject(ConfigService);
  students: WritableSignal<StudentDto[]> = signal([]);
  documents: WritableSignal<StudentDocumentDto[]> = signal([]);
  documentCount = computed(() => this.documents().length);


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
          this.notification.showError('An error occurred while fetching student');
        }

      }
    });
  }

}
