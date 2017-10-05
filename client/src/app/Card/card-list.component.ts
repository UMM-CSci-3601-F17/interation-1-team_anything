import {Component, OnInit} from '@angular/core';
import {CardListService} from "./card-list.service";
import {Card} from "./card";
import {Observable} from "rxjs";

@Component({
    selector: 'card-list-component',
    templateUrl: 'card-list.component.html',
    styleUrls: ['./card-list.component.css'],
    providers: []
})

export class CardListComponent implements OnInit {
    //These are public so that tests can reference them (.spec.ts)
    public cards: Card[];
    public filteredCards: Card[];
    private cardAddSuccess : Boolean = false;

    public cardWord : string;
    public cardSynonym : string;
    public cardAntonym : string;
    public cardGeneralization : string;
    public cardExample : string;

    public newCardWord:string;
    public newCardSynonym: string;
    public newCardAntonym: string;
    public newCardGeneralization: string;
    public newCardExample: string;


    //Inject the UserListService into this component.
    //That's what happens in the following constructor.
    //
    //We can call upon the service for interacting
    //with the server.
    constructor(public cardListService: CardListService) {

    }

    public addNewCard(word: string, synonym: string, antonym : string, generalization : string, example : string) : void{

        //Here we clear all the fields, there's probably a better way
        //of doing this could be with forms or something else
        this.newCardWord = null;
        this.newCardSynonym = null;
        this.newCardAntonym = null;
        this.newCardGeneralization = null;
        this.newCardExample = null;

        this.cardListService.addNewCard(word, synonym, antonym, generalization, example).subscribe(
            succeeded => {
                this.cardAddSuccess = succeeded;
                // Once we added a new User, refresh our user list.
                // There is a more efficient method where we request for
                // this new user from the server and add it to users, but
                // for this lab it's not necessary
                this.refreshCards();
            });
    }



    public filterCards(searchWord: string, searchSynonym: string, searchAntonym: string, searchGeneralization: string, searchExample: string): Card[] {

        this.filteredCards = this.cards;

        //Filter by word
        if (searchWord != null) {
            searchWord = searchWord.toLocaleLowerCase();

            this.filteredCards = this.filteredCards.filter(card => {
                return !searchWord || card.word.toLowerCase().indexOf(searchWord) !== -1;
            });
        }

        //Filter by synonym
        if (searchSynonym != null) {
            this.filteredCards = this.filteredCards.filter(card => {
                return !searchSynonym || card.synonym == searchSynonym;
            });
        }

        //Filter by antonym
        if (searchAntonym != null) {
            this.filteredCards = this.filteredCards.filter(card => {
                return !searchAntonym || card.synonym == searchAntonym;
            });
        }
        //Filter by generalization
        if (searchGeneralization != null) {
            this.filteredCards = this.filteredCards.filter(card => {
                return !searchGeneralization || card.synonym == searchGeneralization;
            });
        }
        //Filter by examples
        if (searchExample != null) {
            this.filteredCards = this.filteredCards.filter(card => {
                return !searchExample || card.synonym == searchExample;
            });
        }


        return this.filteredCards;
    }

    /**
     * Starts an asynchronous operation to update the users list
     *
     */
    refreshCards(): Observable<Card[]> {
        //Get Users returns an Observable, basically a "promise" that
        //we will get the data from the server.
        //
        //Subscribe waits until the data is fully downloaded, then
        //performs an action on it (the first lambda)

        let cards : Observable<Card[]> = this.cardListService.getCards();
        cards.subscribe(
            cards => {
                this.cards = cards;
                this.filterCards(this.cardWord, this.cardSynonym, this.cardAntonym, this.cardGeneralization, this.cardExample);
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
