import {Component, OnInit} from '@angular/core';
import {PlayListService} from "./play-list.service";
import {Card} from "../Card/card";
import {Observable} from "rxjs";

@Component({
    selector: 'play-list-component',
    templateUrl: 'play-list.component.html',
    styleUrls: ['./play-list.component.css'],
    providers: []
})

export class PlayListComponent implements OnInit {
    //These are public so that tests can reference them (.spec.ts)
    public cards: Card[];
    public filteredCards: Card[];

    public cardWord : string;
    public cardSynonym : string;


    //Inject the PlayListService into this component.
    //That's what happens in the following constructor.
    //
    //We can call upon the service for interacting
    //with the server.
    constructor(public playListService: PlayListService) {

    }


    public filterCards(searchWord: string, searchSynonym: string): Card[] {

        this.filteredCards = this.cards;

        //Filter by word
        if (searchWord != null) {
            searchWord = searchWord.toLocaleLowerCase();

            this.filteredCards = this.filteredCards.filter(card => {
                return !searchWord || card.word.toLowerCase().indexOf(searchWord) !== -1;
            });
        }

        //Filter by Synonym
        if (searchSynonym != null) {
            this.filteredCards = this.filteredCards.filter(card => {
                return !searchSynonym || card.synonym.toLowerCase().indexOf(searchWord) !== -1;
            });
        }

        return this.filteredCards;
    }

    /**
     * Starts an asynchronous operation to update the cards list
     *
     */
    refreshCards(): Observable<Card[]> {
        //Get Plays returns an Observable, basically a "promise" that
        //we will get the data from the server.
        //
        //Subscribe waits until the data is fully downloaded, then
        //performs an action on it (the first lambda)

        let cards : Observable<Card[]> = this.playListService.getCards();
        cards.subscribe(
            cards => {
                this.cards = cards;
                this.filterCards(this.cardWord, this.cardSynonym);
            },
            err => {
                console.log(err);
            });
        return cards;
    }

    ngOnInit(): void {
        this.refreshCards();
    }
}
