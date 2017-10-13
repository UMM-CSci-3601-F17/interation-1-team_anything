import {ComponentFixture, TestBed, async} from "@angular/core/testing";
import {Sage} from "./sage";
import {SageListComponent} from "./sage-list.component";
import {SageListService} from "./sage-list.service";
import {Observable} from "rxjs";
import {FormsModule} from "@angular/forms";
import {SharedModule} from "../shared.module";
import {MATERIAL_COMPATIBILITY_MODE} from "@angular/material";


describe("Sage Card list", () => {

    let cardList: SageListComponent;
    let fixture: ComponentFixture<SageListComponent>;

    let sageListServiceStub: {
        getSages: () => Observable<Sage[]>
    };

    beforeEach(() => {
        // stub SageService for test purposes
        sageListServiceStub = {
            getSages: () => Observable.of([
                {
                    _id: "mundane_id",
                    word: "mundane",
                    synonym: "ordinary",
                    antonym: "unusual",
                    generalization: "I don't know",
                    example: "I had a mundane day"
                },
                {
                    _id: "light_id",
                    word: "light",
                    synonym: "weightless",
                    antonym: "heavy",
                    generalization: "I don't know again",
                    example: "A feather is light"
                },
                {
                    _id: "dark_id",
                    word: "dark",
                    synonym: "no light",
                    antonym: "bright",
                    generalization: "This confuses me",
                    example: "The cave was dark"
                }
            ])
        };

        TestBed.configureTestingModule({
            imports: [SharedModule],
            declarations: [SageListComponent],
            // providers:    [ SageListService ]  // NO! Don't provide the real service!
            // Provide a test-double instead
            providers: [{provide: SageListService, useValue: sageListServiceStub},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        })
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(SageListComponent);
            cardList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it("contains all the cards", () => {
        expect(cardList.sages.length).toBe(3);
    });

    it("contains a card with word 'mundane'", () => {
        expect(cardList.sages.some((sage: Sage) => sage.word === "mundane")).toBe(true);
    });

    it("contain a card with word 'light'", () => {
        expect(cardList.sages.some((sage: Sage) => sage.word === "light")).toBe(true);
    });

    it("doesn't contain a card with word 'Santa'", () => {
        expect(cardList.sages.some((sage: Sage) => sage.word === "Santa")).toBe(false);
    });

});


describe("Misbehaving Sage List", () => {
    let sageList: SageListComponent;
    let fixture: ComponentFixture<SageListComponent>;

    let sageListServiceStub: {
        getSages: () => Observable<Sage[]>
    };

    beforeEach(() => {
        // stub SageService for test purposes
        sageListServiceStub = {
            getSages: () => Observable.create(observer => {
                observer.error("Error-prone observable");
            })
        };

        TestBed.configureTestingModule({
            imports: [FormsModule, SharedModule],
            declarations: [SageListComponent],
            providers: [{provide: SageListService, useValue: sageListServiceStub},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        })
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(SageListComponent);
            sageList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it("generates an error if we don't set up a SageListService", () => {
        // Since the observer throws an error, we don't expect sages to be defined.
        expect(sageList.sages).toBeUndefined();
    });
});

