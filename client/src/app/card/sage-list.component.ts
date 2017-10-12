import {Component, OnInit} from '@angular/core';
import {createcardsListService} from "./sage-list.service";
import {Sage} from "./sage";
import {Observable} from "rxjs";

@Component({
    selector: 'sage-list-component',
    templateUrl: 'sage-list.component.html',
    styleUrls: ['./sage-list.component.css'],
    providers: []
})

export class createcardListComponent implements OnInit {
    //These are public so that tests can reference them (.spec.ts)
    public sages: Sage[];
    public allcards: Sage[];
    private sageAddSuccess : Boolean = false;

    public sageWord : string;
    public sageSynonym : string;
    public sageAntonym : string;
    public sageGeneralization : string;
    public sageExample : string;


    //Inject the SageListService into this component.
    //That's what happens in the following constructor.
    //
    //We can call upon the service for interacting
    //with the server.
    constructor(public sageListService: createcardsListService) {

    }

    addNewSage(word: string, synonym: string, antonym : string, generalization : string, example : string) : void{
        if(word != null && synonym != null && antonym != null && generalization != null && example != null) {
            //Here we clear all the fields, there's probably a better way
            //of doing this could be with forms or something else
            this.sageWord = null;
            this.sageSynonym = null;
            this.sageAntonym = null;
            this.sageGeneralization = null;
            this.sageExample = null;

            this.sageListService.addNewSage(word, synonym, antonym, generalization, example).subscribe(
                succeeded => {
                    this.sageAddSuccess = succeeded;
                    this.refreshSages();
                });
        } else {
            console.log("Failed to add card, missing params");
        }
    }

    showSages() : Sage[] {
        this.allcards = this.sages;
        return this.allcards;
    }

    refreshSages(): Observable<Sage[]> {
        let sages : Observable<Sage[]> = this.sageListService.getSages();
        sages.subscribe(
            sages => {
                this.sages = sages;
            },
            err => {
                console.log(err);
            });
        return sages;
    }

    ngOnInit(): void {
        this.refreshSages();
    }

}
