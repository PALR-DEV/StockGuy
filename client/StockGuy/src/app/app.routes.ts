import { Routes } from '@angular/router';
import {LandingPageComponent} from './home-component/landing-page-component/landing-page-component';

export const routes: Routes = [
    // {
    //     path:'',
    //     loadComponent: () => import('./home-component/landing-page-component/landing-page-component').then(m => m.LandingPageComponent)
    // },

    {
        path:'stocks',
        loadComponent: () => import('./home-component/stock-list-component/stock-list-component').then(m => m.StockListComponent)
    },

    {
        path:'login',
        loadComponent: () => import('./login/login-component/login-component').then(m => m.LoginComponent)

    },
    {path:'**', redirectTo: 'stocks', pathMatch: 'full'}


    
];
