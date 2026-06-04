import { Component, Inject, signal, WritableSignal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { inject } from "@angular/core";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatOption, MatSelect } from '@angular/material/select';
import { CourseCategoryDto, CourseDto } from '../../dtos/course-dto';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { APP_BACKEND_SERVER, ConfigService } from '../../config-service';
import { Notification } from '../../notification';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomValidators } from '../../validations/custom-validators';
import { OperationStatus } from '../../enums/operation-status';


@Component({
  selector: 'app-add-edit-course',
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelect, MatOption, ReactiveFormsModule],
  templateUrl: './add-edit-course.html',
  styleUrl: './add-edit-course.css',
})
export class AddEditCourse {

  onSubmit(event: Event) {
    event.preventDefault();


    if (this.courseForm.get("id")?.value > 0) {

      let backendAddress = this.configService.get(APP_BACKEND_SERVER);
     
      var course: CourseDto = {
        id: this.courseForm.get("id")?.value,
        title: this.courseForm.get("title")?.value,
        courseCategoryId: this.courseForm.get("categoryid")?.value
      };

      this.http.put(`${backendAddress}api/course/update`, course).subscribe({
        next: (response) => {
          this.notification.showSuccess('Course Successfully Added');
        },
        error: (error: HttpErrorResponse) => {
          this.notification.showSuccess('Course not Successfully Added');
        },
      });
    }

    this.dialogRef.close(OperationStatus.Success);
  }


  public categories: WritableSignal<CourseCategoryDto[]> = signal([]);
  private http: HttpClient = inject(HttpClient);
  private configService = inject(ConfigService);
  private notification = inject(Notification)
  courseForm!: FormGroup;


  public constructor(@Inject(MAT_DIALOG_DATA) public data: { id: number } = { id: 0 }, private fb: FormBuilder) {


    this.courseForm = this.fb.group({
      id: ['', Validators.required],
      categoryid: ['', Validators.required],
      title: ['', [Validators.required, CustomValidators.noWhitespace()]]
    });

    this.courseForm.get("id")?.setValue(this.data.id);
    let backendAddress = this.configService.get(APP_BACKEND_SERVER);
    this.http.get<CourseCategoryDto[]>(`${backendAddress}api/course/categories`).subscribe({
      next: (data) => {
        this.categories.set(data);
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

    if (this.data.id && this.data.id > 0) {
      this.http.get<CourseDto>(`${backendAddress}api/course/${this.data.id}`).subscribe({
        next: (data) => {
        
          this.courseForm.get("title")?.setValue(data.title);
          this.courseForm.get("categoryid")?.setValue(data.courseCategoryId);
          this.courseForm.get("id")?.setValue(data.id);
        },
        error: (error: HttpErrorResponse) => {

          if ((error.status === 401 || error.status === 403)) {
            this.notification.showError('You are not authorized to perform this action');
          }
          else {
            this.notification.showError('An error occurred while fetching course data');
          }

        }
      });
    }
  }
  public dialogRef: MatDialogRef<AddEditCourse> = inject(MatDialogRef<AddEditCourse>);

}
