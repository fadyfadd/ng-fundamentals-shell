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


@Component({
  selector: 'app-all-courses',
  imports: [MatTableModule, CommonModule, MatSortModule, MatPaginator, MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule],
  templateUrl: './all-courses.html',
  styleUrl: './all-courses.css',
})
export class AllCourses implements OnInit, AfterViewInit {


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

  ngOnInit(): void {

    this.dataSource.filterPredicate = (data: CourseDto, filter: string) => {
      const normalized = filter.trim().toLowerCase();
      console.log(data);
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


    let backendAddress = this.configService.get(APP_BACKEND_SERVER);
    this.http.get<CourseDto[]>(`${backendAddress}api/course/courses`).subscribe({
      next: (data) => {
        this.dataSource.data = data;
      },
      error: (error: HttpErrorResponse) => {

        if ( (error.status === 401 || error.status === 403)) {
          console.log(error.message)
          console.error('You are not authorized to view this content', error);
        }
        else {
          console.error('An error occurred while fetching courses', error);
        }

      }
    });

  }
}
