import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { ConfigService } from '../../config-service';
import { APP_BACKEND_SERVER } from '../../config-service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { BehaviorSubject } from 'rxjs';
import { CourseDto } from "../../dtos/course-dto"
import { CommonModule } from '@angular/common';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { AddEditCourse } from '../add-edit-course/add-edit-course';
import { Notification } from '../../notification';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OperationStatus } from '../../enums/operation-status';


@Component({
  selector: 'app-all-courses',
  imports: [MatTableModule, CommonModule, MatSortModule, MatPaginator, MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule],
  templateUrl: './all-courses.html',
  styleUrl: './all-courses.css',
})
export class AllCourses implements OnInit, AfterViewInit {


  private snackBar = inject(MatSnackBar);


  deleteCourse(id: number) {
    const snackRef = this.snackBar.open('Delete this course?', 'CONFIRM', {
      duration: 5000,
    });

    this.notification.confirm("Are you sure you want to delete the selected row").then((value: boolean) => {
      if (value) {

      }
    })
  }

  public editCourse(id: number) {
    var ref = this.dialog.open(AddEditCourse, {
      width: '400px',
      data: { id: id }
    });

    ref.afterClosed().subscribe(result => {
      let h = result as OperationStatus;
      if (h != null && h == OperationStatus.Success)
        this.fetchCourses()

    });
  }

  private dialog = inject(MatDialog);
  private notification = inject(Notification)

  public createNewCourse() {
    var ref = this.dialog.open(AddEditCourse, {
      width: '400px',
      data: { id: 0 }
    });

    ref.afterClosed().subscribe(result => {
      let h = result as OperationStatus;
      if (h != null && h == OperationStatus.Success)
        this.fetchCourses()
    });

  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  @ViewChild(MatSort) sort!: MatSort;
  dataSource = new MatTableDataSource<CourseDto>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;



  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

  }

  private http: HttpClient = inject(HttpClient);
  private configService: any = inject(ConfigService);
  public courses$: BehaviorSubject<CourseDto[]> = new BehaviorSubject<CourseDto[]>([]);

  public displayedColumns: string[] = ['id', 'title', 'categoryId', 'categoryName', 'actions'];

  fetchCourses() {
    let backendAddress = this.configService.get(APP_BACKEND_SERVER);
    this.http.get<CourseDto[]>(`${backendAddress}api/course/courses`).subscribe({
      next: (data) => {
        this.dataSource.data = data;
      },
      error: (error: HttpErrorResponse) => {

        if ((error.status === 401 || error.status === 403)) {
          this.notification.showError('You are not authorized to view this content');
        }
        else {
          this.notification.showError('An error occurred while fetching courses');
        }

      }
    });
  }

  ngOnInit(): void {
    this.fetchCourses();
    this.dataSource.filterPredicate = (data: CourseDto, filter: string) => {
      const normalized = filter.trim().toLowerCase();

      return (
        (data.courseCategory?.id?.toString().toLowerCase().includes(normalized) ?? false) ||
        (data.title?.toLowerCase().includes(normalized) ?? false) ||
        (data.courseCategory?.name?.toLowerCase().includes(normalized) ?? false)
      );
    };

    this.dataSource.sortingDataAccessor = (item, property) => {

      switch (property) {

        case 'categoryName':
          return item.courseCategory?.name ?? '';
        case 'categoryId':
          return item.courseCategory?.id ?? 0;
        default:
          return (item as any)[property];
      }
    };



  }
}
