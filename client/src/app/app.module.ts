import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule, JsonpModule} from '@angular/http';
import {AppComponent} from './app.component';
import {NavbarComponent} from './navbar/navbar.component';
import {HomeComponent} from './home/home.component';
import {UserComponent} from "./users/user.component";
import {UserListComponent} from './users/user-list.component';
import {UserListService} from './users/user-list.service';
import {Routing} from './app.routes';
import {FormsModule} from '@angular/forms';
import {APP_BASE_HREF} from "@angular/common";
import {CardListService} from "./Card/card-list.service";
import {CardComponent} from "./Card/card.component";
import {CardListComponent} from "./Card/card-list.component";
import {PlayListService} from "./play/play-list.service";
import {PlayComponent} from "./play/play.component";
import {PlayListComponent} from "./play/play-list.component";


@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        JsonpModule,
        Routing,
        FormsModule,
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        NavbarComponent,
        UserListComponent,
        UserComponent,
        CardComponent,
        CardListComponent,
        PlayComponent,
        PlayListComponent
    ],
    providers: [
        UserListService,
        CardListService,
        PlayListService,
        {provide: APP_BASE_HREF, useValue: '/'}
    ],
    bootstrap: [AppComponent]
})

export class AppModule {
}
