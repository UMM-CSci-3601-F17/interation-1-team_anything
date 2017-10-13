// Imports
import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {UserListComponent} from "./users/user-list.component";
import {SageListComponent} from "./card/sage-list.component";
import {playComponent} from "./play/play.component";

// Route Configuration
export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'users', component: UserListComponent},
    {path: 'addcards', component: SageListComponent},
    {path: 'play', component: playComponent}
];

export const Routing: ModuleWithProviders = RouterModule.forRoot(routes);
