package umm3601.sage.deck;

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


    public DeckController(MongoDatabase database){
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

    public String getDeck(String id){
        AggregateIterable<Document> deck = deckCollection.aggregate(Arrays.asList(
            Aggregates.match(new Document("_id", new ObjectId(id))),
            Aggregates.lookup("cards", "cards", "_id", "cards")
        ));

        return deck.first().toJson();
    }

    public String getDecks(Request req, Response res){
        res.type("application/json");
        return getDecks(req.queryMap().toMap());
    }

    public String getDecks(Map<String, String[]> queryParams){
        Document filtering = new Document();
        if (queryParams.containsKey("name")){
            String  filterName = queryParams.get("name")[0];
            filtering = filtering.append("name", filterName);
        }

        AggregateIterable<Document> decks = deckCollection.aggregate(Arrays.asList(
            Aggregates.match(filtering),
            Aggregates.project(Projections.fields(
                Projections.include("name"),
                Projections.computed("count", new Document("$size", "$cards"))
            ))
        ));

        return JSON.serialize(decks);
    }




}
