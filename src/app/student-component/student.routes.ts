import { Routes } from '@angular/router';

export const routes: Routes = [

    {
        "path": "", loadComponent: () => import("./student-components").then(m => m.StudentComponent), children: [
            { "path": "home", loadComponent: () => import("./home-Component/home-component").then(m => m.HomeComponent) },
            { "path": "", redirectTo: "home", pathMatch: "full" }
        ]
    },

];
