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

@Component({
  selector: 'app-add-edit-course',
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelect, MatOption],
  templateUrl: './add-edit-course.html',
  styleUrl: './add-edit-course.css',
})
export class AddEditCourse {

  onSubmit(event: Event) {
    event.preventDefault();
    this.dialogRef.close('Course data submitted!');
  }


  public categories: WritableSignal<CourseCategoryDto[]> = signal([]);
  private http: HttpClient = inject(HttpClient);
  private configService = inject(ConfigService);
  private notification = inject(Notification)


  public constructor(@Inject(MAT_DIALOG_DATA) public data: { id: number } = { id: 0 }) {
     
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
          console.log('Course data fetched successfully', data);
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
