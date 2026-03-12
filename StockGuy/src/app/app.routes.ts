import { Routes } from '@angular/router';
import {LandingPageComponent} from './landing-component/landing-page-component/landing-page-component';

export const routes: Routes = [
    {
        path:'',
        loadComponent: () => import('./landing-component/landing-page-component/landing-page-component').then(m => m.LandingPageComponent)
    },
    {path:'**', redirectTo: '', pathMatch: 'full'}
];
