// Imports
import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {UserListComponent} from "./users/user-list.component";
import {CardListComponent} from "./Card/card-list.component";

// Route Configuration
export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'users', component: UserListComponent},
    {path: 'teachers', component: CardListComponent}
];

export const Routing: ModuleWithProviders = RouterModule.forRoot(routes);
