import { Routes } from '@angular/router';
import { roleGuard } from './role-guard';
import { UserRole } from './enums/user-role';

export const routes: Routes = [

    { "path": "admin", loadChildren: () => import("./admin-component/admin.routes").then(m => m.routes) , canActivate: [roleGuard], data: { roles: [UserRole.Administrator] } },
    { "path": "home", "loadComponent": () => import("./home-component/home-component").then(m => m.HomeComponent) },
    { "path": "login", loadComponent: () => import("./login-component/login-component").then(m => m.LoginComponent) },
    { "path": "student", loadChildren: () => import("./student-component/student.routes").then(m => m.routes), canActivate: [roleGuard], data: { roles: [UserRole.Student] } },
    { "path": "", "redirectTo": "home", pathMatch: "full" }

];
