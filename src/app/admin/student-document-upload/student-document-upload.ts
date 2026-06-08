import { Component, computed, inject, signal, ViewChild, WritableSignal } from '@angular/core';
import { MatFormField, MatLabel, MatOption, MatSelect, MatSelectChange, MatError } from "@angular/material/select";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { APP_BACKEND_SERVER, ConfigService } from '../../config-service';
import { Notification } from '../../notification';
import { StudentDto } from '../../dtos/student-dto';
import { StudentDocumentDto } from '../../dtos/student-document-dto';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from "@angular/material/icon";
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-student-document-upload',
  imports: [MatFormField, MatLabel, MatOption, MatSelect, ReactiveFormsModule, MatButtonModule, MatIcon, MatError, MatInputModule, MatError],
  templateUrl: './student-document-upload.html',
  styleUrl: './student-document-upload.css',
})
export class StudentDocumentUpload {

  @ViewChild('form') mainForm!: NgForm;

  onFileSelected(event: Event) {

    const element = event.currentTarget as HTMLInputElement;

    if (element.files && element.files[0]) {
      this.uploadForm.get('name')?.setValue(element.files[0].name);
      this.uploadForm.get("file")?.setValue(element.files[0])
    }
    else {
      this.uploadForm.get('name')?.setValue('');
      this.uploadForm.get("file")?.setValue(null)
    }

  }

  onSubmit() {

    var formData = new FormData();
    formData.append('StudentId', this.formGroup.get('studentId')?.value);
    //formData.append('name', this.uploadForm.get('name')?.value);
    formData.append('File', this.uploadForm.get('file')?.value);

    let backendAddress = this.configService.get(APP_BACKEND_SERVER);
    this.http.post(`${backendAddress}api/student/addDocument`, formData).subscribe({
      next: (response) => {
        this.notification.showSuccess('Document Successfully Uploaded');
        //this.uploadForm.reset()


        this.mainForm.resetForm();
        this.fetchDocumentsForStudent(this.formGroup.get('studentId')?.value);
      },
      error: (error: HttpErrorResponse) => {

        if ((error.status === 401 || error.status === 403)) {
          this.notification.showError('You are not authorized to perform this action');
        }
        else {
          this.notification.showError('An error occurred while uploading the document');
        }

      }
    });
  }

  public uploadForm: FormGroup<any>;
  public formGroup: FormGroup;
  private http: HttpClient = inject(HttpClient);
  private formBuilder = inject(FormBuilder);
  notification = inject(Notification);
  configService = inject(ConfigService);
  students: WritableSignal<StudentDto[]> = signal([]);
  documents: WritableSignal<StudentDocumentDto[]> = signal([]);
  documentCount = computed(() => this.documents().length);

  deleteDocument(id: number | undefined) {


    this.notification.confirm('Are you sure you want to delete this document?', 'DELETE', 7000).then((confirmed) => {

      if (confirmed) {
        let backendAddress = this.configService.get(APP_BACKEND_SERVER);

        this.http.delete<StudentDocumentDto[]>(`${backendAddress}api/student/deleteDocument/${id}`).subscribe({
          next: (data) => {
            this.fetchDocumentsForStudent(this.formGroup.get('studentId')?.value);
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

    });

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

  fetchDocumentsForStudent(studentId: number | undefined) {

    let backendAddress = this.configService.get(APP_BACKEND_SERVER);

    this.http.get<StudentDocumentDto[]>(`${backendAddress}api/student/getAllDocumentsForStudent/${studentId}`).subscribe({
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

  studentSelected(event: MatSelectChange) {
    var id = event.value;

    if (!id) {
      this.documents.set([]);
      return;
    }

    this.fetchDocumentsForStudent(id);
  }


  constructor() {
    this.formGroup = this.formBuilder.group({
      studentId: ['']
    });

    this.uploadForm = this.formBuilder.group({
      studentId: [''],
      file: [null, [Validators.required]],
      name: ['', [Validators.required]]
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
