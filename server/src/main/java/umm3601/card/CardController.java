package umm3601.card;

import com.google.gson.Gson;
import com.mongodb.*;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.util.JSON;
import org.bson.Document;
import org.bson.types.ObjectId;
import spark.Request;
import spark.Response;

import java.util.Iterator;
import java.util.Map;

import static com.mongodb.client.model.Filters.eq;


public class CardController {

    private final Gson gson;
    private MongoDatabase database;
    private final MongoCollection<Document> cardCollection;

    public CardController(MongoDatabase database) {
        gson = new Gson();
        this.database = database;
        cardCollection = database.getCollection("cards");
    }

    public String getCard(Request req, Response res){
        res.type("application/json");
        String id = req.params("id");
        String deck;
        try {
            deck = getCard(id);
        }
        catch (IllegalArgumentException e){
            res.status(400);
            res.body("The requested card id " + id + " wasn't a legal Mongo Object ID.\n" +
                "See 'https://docs.mongodb.com/manual/reference/method/ObjectId/' for more info.");
            return "";
        }

        if(deck != null){
            return deck;
        }
        else {
            res.status(404);
            res.body("The requested card with id " + id + " was not found");
        }
        return null;
    }

    public String getCard(String id){
        Iterable<Document> jsonCards
            = cardCollection
            .find(eq("_id", new ObjectId(id)));
        Iterator<Document> iterator = jsonCards.iterator();
        if (iterator.hasNext()) {
            Document card = iterator.next();
            return card.toJson();
        } else {
            // We didn't find the desired deck
            return null;
        }
    }

    public String getCards(Request req, Response res)
    {
        res.type("application/json");
        return getCards(req.queryMap().toMap());
    }

    /**
     * @param queryParams
     * @return an array of Users in a JSON formatted string
     */
    public String getCards(Map<String, String[]> queryParams) {

        Document filterDoc = new Document();

        if (queryParams.containsKey("word")) {
            String targetWord = (queryParams.get("word")[0]);
            filterDoc = filterDoc.append("word", targetWord);
        }

        if (queryParams.containsKey("synonym")) {
            String targetSynonym = (queryParams.get("synonym")[0]);
            filterDoc = filterDoc.append("synonym", targetSynonym);
        }

        if (queryParams.containsKey("antonym")) {
            String targetAntonym = (queryParams.get("antonym")[0]);
            filterDoc = filterDoc.append("antonym", targetAntonym);
        }

        if (queryParams.containsKey("general_sense")) {
            String targetGeneralization = (queryParams.get("general_sense")[0]);
            filterDoc = filterDoc.append("general_sense", targetGeneralization);
        }

        if (queryParams.containsKey("example_usage")) {
            String targetExamples = (queryParams.get("example_usage")[0]);
            filterDoc = filterDoc.append("example_usage", targetExamples);
        }


        //FindIterable comes from mongo, Document comes from Gson
        Iterable<Document> matchingCards = cardCollection.find(filterDoc);

        return JSON.serialize(matchingCards);
    }

    public boolean addNewCard(String word, String synonym, String antonym, String general, String example) {

        Document newCard = new Document();
        newCard.append("word", word);
        newCard.append("synonym", synonym);
        newCard.append("antonym", antonym);
        newCard.append("general", general);
        newCard.append("example", example);

        try {
            cardCollection.insertOne(newCard);
        }
        catch(MongoException ree)
        {
            ree.printStackTrace();
            return false;
        }

        return true;
    }

}
