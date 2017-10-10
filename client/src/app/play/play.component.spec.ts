import {ComponentFixture, TestBed, async} from "@angular/core/testing";
import {Play} from "./play";
import {Card} from "../Card/card";
import {PlayComponent} from "./play.component";
import {PlayListService} from "./play-list.service";
import {Observable} from "rxjs";
//import { PipeModule } from "../../pipe.module";

describe("Play component", () => {

    let playComponent: PlayComponent;
    let fixture: ComponentFixture<PlayComponent>;

    let playListServiceStub: {
        getCardById: (playId: string) => Observable<Card>
    };

    beforeEach(() => {
        // stub PlayService for test purposes
        playListServiceStub = {
            getCardById: (playId: string) => Observable.of([
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
            ].find(card => card._id === playId))
        };

        TestBed.configureTestingModule({
            //imports: [PipeModule],
            declarations: [PlayComponent],
            providers: [{provide: PlayListService, useValue: playListServiceStub}]
        })
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(PlayComponent);
            playComponent = fixture.componentInstance;
        });
    }));

    it("can retrieve Pat by ID", () => {
        playComponent.setId("pat_id");
        expect(playComponent.card).toBeDefined();
        expect(playComponent.card.word).toBe("Pat");
        expect(playComponent.card.example).toBe("pat@something.com");
    });

    it("returns undefined for Santa", () => {
        playComponent.setId("Santa");
        expect(playComponent.card).not.toBeDefined();
    });

});
