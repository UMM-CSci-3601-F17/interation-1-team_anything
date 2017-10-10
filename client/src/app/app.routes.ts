// Imports
import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {UserListComponent} from "./users/user-list.component";
import {CardListComponent} from "./Card/card-list.component";
import {PlayListComponent} from "./play/play-list.component";

// Route Configuration
export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'teachers', component: CardListComponent},
    {path: 'play', component:PlayListComponent}
];

export const Routing: ModuleWithProviders = RouterModule.forRoot(routes);
