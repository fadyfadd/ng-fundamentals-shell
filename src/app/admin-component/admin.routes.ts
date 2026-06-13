import { Routes } from '@angular/router';

export const routes: Routes = [

    {
        path: "", loadComponent: () => import("./admin-component").then(m => m.AdminComponent),
        children: [
            { path: 'all-courses', loadComponent: () => import("./all-courses-component/all-courses-component").then(m => m.AllCoursesComponent) },
            { path: 'home', loadComponent: () => import("./home-admin-component/home-admin-component").then(m => m.HomeAdminComponent) },
            { path: 'register-student', loadComponent: () => import("./register-student-component/register-student-component").then(m => m.RegisterStudentComponent) },
            { path: 'student-document-upload', loadComponent: () => import("./student-document-upload-component/student-document-upload").then(m => m.StudentDocumentUploadComponent) },
            { path: 'register-teacher', loadComponent: () => import("./teacher-registration-component/teacher-registration-component").then(m => m.TeacherRegistrationComponent) },
            { path: "", redirectTo: "home", pathMatch: "full" }
        ]
    }

];



