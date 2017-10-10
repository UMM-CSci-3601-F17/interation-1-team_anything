import {ComponentFixture, TestBed, async} from "@angular/core/testing";
import {Card} from "../Card/card";
import {PlayListComponent} from "./play-list.component";
import {PlayListService} from "./play-list.service";
import {Observable} from "rxjs";
import {FormsModule} from "@angular/forms"; //for [(ngModule)] to not break tests


describe("Play list", () => {

    let playList: PlayListComponent;
    let fixture: ComponentFixture<PlayListComponent>;

    let playListServiceStub: {
        getCards: () => Observable<Card[]>
    };

    beforeEach(() => {
        // stub PlayService for test purposes
        playListServiceStub = {
            getCards: () => Observable.of([
                {
                    _id: "chris_id",
                    word: "Chris",
                    synonym: "25",
                    antonym: "UMM",
                    generalization: "chris@this.that",
                    example: "I have none"
                },
                {
                    _id: "pat_id",
                    word: "Pat",
                    synonym: '37',
                    antonym: "IBM",
                    generalization: "pat@something.com",
                    example: "no"
                },
                {
                    _id: "jamie_id",
                    word: "Jamie",
                    synonym: '37',
                    antonym: "Frogs, Inc.",
                    generalization: "jamie@frogs.com",
                    example: "I don't want to"
                }
            ])
        };

        TestBed.configureTestingModule({
            imports: [FormsModule],
            declarations: [PlayListComponent],
            // providers:    [ PlayListService ]  // NO! Don't provide the real service!
            // Provide a test-double instead
            providers: [{provide: PlayListService, useValue: playListServiceStub}]
        })
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(PlayListComponent);
            playList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it("contains all the cards", () => {
        expect(playList.cards.length).toBe(3);
    });

    it("contains a card named 'Chris'", () => {
        expect(playList.cards.some((card: Card) => card.word === "Chris")).toBe(true);
    });

    it("contain a card named 'Jamie'", () => {
        expect(playList.cards.some((card: Card) => card.word === "Jamie")).toBe(true);
    });

    it("doesn't contain a card named 'Santa'", () => {
        expect(playList.cards.some((card: Card) => card.word === "Santa")).toBe(false);
    });

    it("has two cards that are 37 years old", () => {
        expect(playList.cards.filter((card: Card) => card.synonym === '37').length).toBe(2);
    });

    it("play list filters by name", () => {
        expect(playList.filteredCards.length).toBe(3);
        playList.cardWord = "a";
        let a : Observable<Card[]> = playList.refreshCards();
        a.do(x => Observable.of(x))
            .subscribe(x =>
            {
                expect(playList.filteredCards.length).toBe(2);
            });
    });

    it("play list filters by age", () => {
        expect(playList.filteredCards.length).toBe(3);
        playList.cardSynonym = "37";
        let a : Observable<Card[]> = playList.refreshCards();
        a.do(x => Observable.of(x))
            .subscribe(x =>
            {
                expect(playList.filteredCards.length).toBe(2);
            });
    });

    it("play list filters by name and age", () => {
        expect(playList.filteredCards.length).toBe(3);
        playList.cardSynonym = "37";
        playList.cardWord = "i";
        let a : Observable<Card[]> = playList.refreshCards();
        a.do(x => Observable.of(x))
            .subscribe(x =>
            {
                expect(playList.filteredCards.length).toBe(1);
            });
    });

});

describe("Misbehaving play List", () => {
    let playList: PlayListComponent;
    let fixture: ComponentFixture<PlayListComponent>;

    let playListServiceStub: {
        getCards: () => Observable<Card[]>
    };

    beforeEach(() => {
        // stub PlayService for test purposes
        playListServiceStub = {
            getCards: () => Observable.create(observer => {
                observer.error("Error-prone observable");
            })
        };

        TestBed.configureTestingModule({
            imports: [FormsModule],
            declarations: [PlayListComponent],
            providers: [{provide: PlayListService, useValue: playListServiceStub}]
        })
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(PlayListComponent);
            playList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it("generates an error if we don't set up a PlayListService", () => {
        // Since the observer throws an error, we don't expect cards to be defined.
        expect(playList.cards).toBeUndefined();
    });
});
