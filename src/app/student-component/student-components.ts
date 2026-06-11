import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-student',
  imports: [RouterOutlet , RouterLink , RouterLinkActive],
  templateUrl: './student-component.html',
  styleUrls: ['./student-component.css'],
})
export class StudentComponent {}
