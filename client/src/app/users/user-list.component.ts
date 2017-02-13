import { Component, OnInit } from '@angular/core';
import { UserListService } from "./user-list.service";
import { FormsModule } from '@angular/forms';
import { FilterBy } from "./filter.pipe";

@Component({
    selector: 'user-list-component',
    templateUrl: 'user-list.component.html'
})

export class UserListComponent implements OnInit {
    public users: any;

    constructor(private userListService: UserListService) {
        // this.users = this.userListService.getUsers();
    }

    ngOnInit(): void {
        this.users = this.userListService.getUsers();
    }
}
