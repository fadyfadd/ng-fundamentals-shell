import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { inject } from "@angular/core";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatOption, MatSelect } from '@angular/material/select';

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



  public constructor(@Inject(MAT_DIALOG_DATA) public data: { id: number } = { id: 0 }) {
    console.log(this.data);
  }
  public dialogRef: MatDialogRef<AddEditCourse> = inject(MatDialogRef<AddEditCourse>);

}
