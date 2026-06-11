import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { APP_BACKEND_SERVER, ConfigService } from '../config-service';
import { JwtTokenDto } from '../dtos/jwt-token-dto';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserRole } from '../enums/user-role';
import { AuthenticationService } from '../authentication-service';
import { NotificationService } from '../notification-service';

@Component({
  selector: 'app-login',
  imports: [MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule, ReactiveFormsModule, RouterLink, RouterLinkActive],
  templateUrl: './login-component.html',
  styleUrls: ['./login-component.css'],
})
export class LoginComponent implements OnInit {

  ngOnInit() {
    this.authentication.clearAuthentication();
  }

  logout(event: PointerEvent) {
    event.preventDefault();
    this.router.navigate(['/home']);
  }

  private http = inject(HttpClient);
  private router = inject(Router);
  private notification = inject(NotificationService);

  private fb = inject(FormBuilder);

  loginForm: FormGroup = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(4)]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });


  private configService: any = inject(ConfigService);
  private authentication: any = inject(AuthenticationService);

  public onSubmit() {
    if (this.loginForm.invalid)
      return;
    let backendAddress = this.configService.get(APP_BACKEND_SERVER);
    this.http.post<JwtTokenDto>(`${backendAddress}api/user/login`, {
      userName: this.loginForm.get('username')?.value,
      password: this.loginForm.get('password')?.value

    }).subscribe(
      {
        next: (response: JwtTokenDto) => {

          if (response.role === UserRole.Student) {
            this.authentication.setAuthentication(response);
            this.router.navigate(["/student", "home"]);
          }
          else {
            this.authentication.setAuthentication(response);
            this.router.navigate(["/admin", "home"]);
          }

        },
        error: (error: HttpErrorResponse) => {


          if (error?.error && error.error.serverCode === "4455ebd2") {
            this.notification.showError("Login failed. Please check your credentials and try again.");
          }
          else {
            this.notification.showError("An unexpected error occurred. Please try again later");
          }

        }
      }
    );

  }

}
