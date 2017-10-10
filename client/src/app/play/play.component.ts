import {Component, OnInit} from '@angular/core';
import {PlayListService} from "./play-list.service";
import {Card} from "../Card/card";

@Component({
    selector: 'play-component',
    styleUrls: ['./play.component.css'],
    templateUrl: 'play.component.html'
})
export class PlayComponent implements OnInit {
    public card: Card = null;
    private id: string;

    constructor(private playListService: PlayListService) {
        // this.users = this.playListService.getCards();
    }

    private subscribeToServiceForId() {
        if (this.id) {
            this.playListService.getCardById(this.id).subscribe(
                card => this.card = card,
                err => {
                    console.log(err);
                }
            );
        }
    }

    setId(id: string) {
        this.id = id;
        this.subscribeToServiceForId();
    }

    ngOnInit(): void {
        this.subscribeToServiceForId();
    }
}
