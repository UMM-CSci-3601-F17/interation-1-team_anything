import {Component, OnInit} from '@angular/core';
import {playService} from "./play.service";
import {Play} from "./play";
import {Observable} from "rxjs";
@Component({
    selector: 'play-component',
    templateUrl: 'play.component.html',
    styleUrls: ['./play.component.css'],
    providers: []
})

export class playComponent implements OnInit {
    //These are public so that tests can reference them (.spec.ts)
    public sages: Play[];
    public allcards: Play[];

    public score: number = 0;
    public random: number[] = [1,2,3,4];
    public numberNow:number = 0;

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
    constructor(public sageListService: playService) {

    }

    showSages() : Play[] {
        this.allcards = this.sages;
        return this.allcards;
    }


    refreshSages(): Observable<Play[]> {
        //Get Users returns an Observable, basically a "promise" that
        //we will get the data from the server.
        //
        //Subscribe waits until the data is fully downloaded, then
        //performs an action on it (the first lambda)

        let plays : Observable<Play[]> = this.sageListService.getSages();
        plays.subscribe(
            sages => {
                this.sages = sages;
            },
            err => {
                console.log(err);
            });
        return plays;
    }

    ngOnInit(): void {
        this.refreshSages();
    }

    randomizeSages() {
        if(this.random.length > 0) {
            let randnum = Math.floor(Math.random() * this.random.length);
            this.numberNow = this.random[randnum];
            this.random.splice(randnum, 1);
        } else {
            console.log("All Hints Used");
        }
    }
}
