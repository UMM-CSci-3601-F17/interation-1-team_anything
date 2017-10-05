import {ComponentFixture, TestBed, async} from "@angular/core/testing";
import {Card} from "./card";
import {CardListComponent} from "./card-list.component";
import {CardListService} from "./card-list.service";
import {Observable} from "rxjs";
import {FormsModule} from "@angular/forms"; //for [(ngModule)] to not break tests


describe("Card list", () => {

    let cardList: CardListComponent;
    let fixture: ComponentFixture<CardListComponent>;

    let cardListServiceStub: {
        getCards: () => Observable<Card[]>
    };

    beforeEach(() => {
        // stub UserService for test purposes
        cardListServiceStub = {
            getCards: () => Observable.of([
                {
                    _id: "chris_id",
                    name: "Chris",
                    age: 25,
                    company: "UMM",
                    email: "chris@this.that"
                },
                {
                    _id: "pat_id",
                    name: "Pat",
                    age: 37,
                    company: "IBM",
                    email: "pat@something.com"
                },
                {
                    _id: "jamie_id",
                    name: "Jamie",
                    age: 37,
                    company: "Frogs, Inc.",
                    email: "jamie@frogs.com"
                }
            ])
        };

        TestBed.configureTestingModule({
            imports: [FormsModule],
            declarations: [CardListComponent],
            // providers:    [ CardListService ]  // NO! Don't provide the real service!
            // Provide a test-double instead
            providers: [{provide: CardListService, useValue: cardListServiceStub}]
        })
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(CardListComponent);
            cardList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it("contains all the users", () => {
        expect(cardList.cards.length).toBe(3);
    });

    it("contains a user named 'Chris'", () => {
        expect(cardList.cards.some((card: Card) => card.word === "Chris")).toBe(true);
    });

    it("contain a user named 'Jamie'", () => {
        expect(cardList.cards.some((card: Card) => card.word === "Jamie")).toBe(true);
    });

    it("doesn't contain a user named 'Santa'", () => {
        expect(cardList.cards.some((card: Card) => card.word === "Santa")).toBe(false);
    });

    it("has two users that are 37 years old", () => {
        expect(cardList.cards.filter((card: Card) => card.synonym === "synonym").length).toBe(2);
    });

    it("card list filters by word", () => {
        expect(cardList.filteredCards.length).toBe(3);
        cardList.cardWord = "a";
        let a : Observable<Card[]> = cardList.refreshCards();
        a.do(x => Observable.of(x))
            .subscribe(x =>
            {
                expect(cardList.filteredCards.length).toBe(2);
            });
    });
    // add  more filtering for all the categories we want to filter
});

describe("Misbehaving Card List", () => {
    let userList: CardListComponent;
    let fixture: ComponentFixture<CardListComponent>;

    let cardListServiceStub: {
        getCards: () => Observable<Card[]>
    };

    beforeEach(() => {
        // stub UserService for test purposes
        cardListServiceStub = {
            getCards: () => Observable.create(observer => {
                observer.error("Error-prone observable");
            })
        };

        TestBed.configureTestingModule({
            imports: [FormsModule],
            declarations: [CardListComponent],
            providers: [{provide: CardListService, useValue: cardListServiceStub}]
        })
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(CardListComponent);
            cardList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it("generates an error if we don't set up a UserListService", () => {
        // Since the observer throws an error, we don't expect users to be defined.
        expect(cardList.cards).toBeUndefined();
    });
});
