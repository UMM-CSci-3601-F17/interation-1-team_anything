import {ComponentFixture, TestBed, async} from "@angular/core/testing";
import {Card} from "./card";
import {CardComponent} from "./card.component";
import {CardListService} from "./card-list.service";
import {Observable} from "rxjs";
//import { PipeModule } from "../../pipe.module";

describe("Card component", () => {

    let cardComponent: CardComponent;
    let fixture: ComponentFixture<CardComponent>;

    let cardListServiceStub: {
        getCardById: (cardId: string) => Observable<Card>
    };

    beforeEach(() => {
        // stub CardService for test purposes
        cardListServiceStub = {
            getCardById: (cardId: string) => Observable.of([
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
            ].find(card => card._id === cardId))
        };

        TestBed.configureTestingModule({
            //imports: [PipeModule],
            declarations: [CardComponent],
            providers: [{provide: CardListService, useValue:cardListServiceStub}]
        })
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(CardComponent);
            cardComponent = fixture.componentInstance;
        });
    }));

    it("can retrieve Pat by ID", () => {
        cardComponent.setId("pat_id");
        expect(cardComponent.card).toBeDefined();
        expect(cardComponent.card.name).toBe("Pat");
        expect(cardComponent.ardail).toBe("pat@something.com");
    });

    it("returns undefined for Santa", () => {
        cardComponent.setId("Santa");
        expect(cardComponent.user).not.toBeDefined();
    });

});
