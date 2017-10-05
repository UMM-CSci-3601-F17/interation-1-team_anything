
import {Component, OnInit} from '@angular/core';
import {CardListService} from "./card-list.service";
import {Card} from "./card";

@Component({
    selector: 'card-component',
    styleUrls: ['./card.component.css'],
    templateUrl: 'card.component.html'
})
export class CardComponent implements OnInit {
    public card: Card = null;
    private id: string;

    constructor(private cardListService: CardListService) {
        // this.card = this.cardListService.getCards();
    }

    private subscribeToServiceForId() {
        if (this.id) {
            this.cardListService.getCardById(this.id).subscribe(
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
