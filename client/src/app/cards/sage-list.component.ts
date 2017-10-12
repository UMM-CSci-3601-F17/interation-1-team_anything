import {Component, OnInit} from '@angular/core';
import {SageListService} from "./sage-list.service";
import {Sage} from "./sage";
import {Observable} from "rxjs";

@Component({
    selector: 'sage-list-component',
    templateUrl: 'sage-list.component.html',
    styleUrls: ['./sage-list.component.css'],
    providers: []
})

export class SageListComponent implements OnInit {

    public sages: Sage[];
    private cardAddSuccess : Boolean = false;

    public newWord: string;
    public newSynonym: string;
    public newAntonym: string;
    public newGeneralization: string;
    public newExample: string;



    constructor(public sageListService: SageListService) {

    }

    addNewCard(word: string, synonym: string, antonym : string, generalization : string, example : string) : void{

            //Here we clear all the fields, there's probably a better way
            //of doing this could be with forms or something else
            this.newWord = null;
            this.newSynonym = null;
            this.newAntonym = null;
            this.newGeneralization = null;
            this.newExample = null;

            this.sageListService.addNewCard(word, synonym, antonym, generalization, example).subscribe(
                succeeded => {
                    this.cardAddSuccess = succeeded;
                    this.refreshDeck();
                });

    }

    refreshDeck(): Observable<Sage[]> {
        //Get Users returns an Observable, basically a "promise" that
        //we will get the data from the server.
        //
        //Subscribe waits until the data is fully downloaded, then
        //performs an action on it (the first lambda)

        let cards : Observable<Sage[]> = this.sageListService.getCards();
        cards.subscribe(
            cards => {
                this.cards = cards;
            },
            err => {
                console.log(err);
            });
        return cards;
    }

    ngOnInit(): void {
        this.refreshDeck();
    }

}
