import { Component, ViewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomValidators } from '../../validations/custom-validators';
import { NgForm } from '@angular/forms'
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../config-service';
import { APP_BACKEND_SERVER } from '../../config-service';
import { HttpErrorResponse } from '@angular/common/http';
import {  NotificationService } from '../../notification-service';


@Component({
  selector: 'app-register-student',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './register-student-component.html',
  styleUrl: './register-student-component.css',
})
export class RegisterStudentComponent {

  registerForm: FormGroup;
  private configService: any = inject(ConfigService);
  private fb: FormBuilder = inject(FormBuilder);
  private notification = inject(NotificationService);

  @ViewChild('form') mainForm!: NgForm;

  getLocalDateTimeString() {
    const d = new Date();
    var currentDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    return currentDate;
  }

  constructor(

    private http: HttpClient,
  ) {

    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, CustomValidators.noWhitespace()]],
      lastName: ['', [Validators.required, CustomValidators.noWhitespace()]],
      userName: [
        '',
        [Validators.required, CustomValidators.noWhitespace(), Validators.minLength(6)],
      ],
      email: ['', [Validators.required, Validators.email, CustomValidators.noWhitespace()]],
      passwords: this.fb.group(
        {
          password: [
            '',
            [Validators.required, Validators.minLength(6), CustomValidators.noWhitespace()],
          ],
          confirmPassword: ['', []],
        },
        { validators: [this.passwordMatchValidator] },
      ),
      enrollmentDate: [
        (() => {
          return this.getLocalDateTimeString();
        })(),
        [Validators.required],
      ],
    });
  }

  onReset() {

    this.mainForm.resetForm();
    const d = new Date();
    var currentDate = this.getLocalDateTimeString();
    //this.registerForm.markAsPristine();
    //this.registerForm.markAsUntouched();
    //this.registerForm.reset();
    this.mainForm.resetForm({ enrollmentDate: currentDate });
  }

  private handleSubmitServerError(error: HttpErrorResponse) {
    var errors = Object.values(error.error.errors) as string[][];

    if (errors.length > 0) {
      const firstFieldErrors = errors[0];

      if (Array.isArray(firstFieldErrors) && firstFieldErrors.length > 0) {
        const firstError: string = firstFieldErrors[0];
        this.notification.showError(firstError);
      }
      else {
        this.notification.showError('Registration Error');
      }
    }
    else {
      this.notification.showError('Registration Error');
    }

  }

  onSubmit() {

    var student = {
      firstName: this.registerForm.get('firstName')?.value,
      lastName: this.registerForm.get('lastName')?.value,
      enrollmentDate: this.registerForm.get('enrollmentDate')?.value,
    };

    var applicationUser = {
      student: student,
      userName: this.registerForm.get('userName')?.value,
      email: this.registerForm.get('email')?.value,
      plainPassword: this.registerForm.get('passwords')?.get('password')?.value,
    };

    let backendAddress = this.configService.get(APP_BACKEND_SERVER);

    this.http.post(`${backendAddress}api/User/register/student`, applicationUser).subscribe({
      next: (response) => {

        this.notification.showSuccess('Profile  Successfully Registered');
        this.onReset();
        //this.mainForm.resetForm();
        //this.onReset();
      },
      error: (error: HttpErrorResponse) => {
        this.handleSubmitServerError(error);
      },
    });
  }

  passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (!password || password.trim().length === 0) {
      return null;
    }

    return password === confirmPassword ? null : { passwordMismatch: true };
  };

}
