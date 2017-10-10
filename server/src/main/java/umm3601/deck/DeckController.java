package umm3601.deck;

import com.google.gson.Gson;
import com.mongodb.*;
import com.mongodb.client.*;
import com.mongodb.client.model.*;
import com.mongodb.util.JSON;
import org.apache.commons.lang3.ArrayUtils;
import org.bson.Document;
import org.bson.types.ObjectId;
import spark.Response;
import spark.Request;
import java.util.Arrays;
import java.util.Iterator;
import java.util.Map;
import static com.mongodb.client.model.Filters.eq;

public class DeckController {
    private final Gson gson;
    private MongoDatabase database;
    private final MongoCollection<Document> deckCollection;


    public DeckController(MongoDatabase database) {
        gson = new Gson();
        this.database = database;
        deckCollection = database.getCollection("decks");
    }

    public String getDeck(Request req, Response res) {
        res.type("application/json");
        String id = req.params("id");
        String deck;
        try {
            deck = getDeck(id);
        } catch (IllegalArgumentException e) {
            res.status(400);
            res.body("The requested user id " + id + " wasn't a legal Mongo Object ID.\n" +
                "See 'https://docs.mongodb.com/manual/reference/method/ObjectId/' for more info.");
            return "";
        }

        if (deck != null) {
            return deck;
        } else {
            res.status(404);
            res.body("The requested deck with id " + id + " was not found");
        }
        return null;
    }

    public String getDeck(String id) {
        AggregateIterable<Document> deck = deckCollection.aggregate(Arrays.asList(
            Aggregates.match(new Document("_id", new ObjectId(id))),
            Aggregates.lookup("cards", "cards", "_id", "cards")
        ));

        return deck.first().toJson();
    }

    public String getDecks(Request req, Response res) {
        res.type("application/json");
        return getDecks(req.queryMap().toMap());
    }

    public String getDecks(Map<String, String[]> queryParams) {

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
        FindIterable<Document> matchingTodos = deckCollection.find(filterDoc);

        return JSON.serialize(matchingTodos);
    }


}
