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

/**
 * Controller that manages requests for info about users.
 */
public class SageController {

    private final Gson gson;
    private MongoDatabase database;
    private final MongoCollection<Document> sageCollection;

    /**
     * Construct a controller for users.
     *
     * @param database the database containing user data
     */
    public SageController(MongoDatabase database) {
        gson = new Gson();
        this.database = database;
        sageCollection = database.getCollection("sages");
    }


    /**
     * Get a JSON response with a list of all the users in the database.
     *
     * @param req the HTTP request
     * @param res the HTTP response
     * @return one user in JSON formatted string and if it fails it will return text with a different HTTP status code
     */
    public String getSage(Request req, Response res){
        res.type("application/json");
        String id = req.params("id");
        String sage;
        try {
            sage = getSage(id);
        } catch (IllegalArgumentException e) {
            // This is thrown if the ID doesn't have the appropriate
            // form for a Mongo Object ID.
            // https://docs.mongodb.com/manual/reference/method/ObjectId/
            res.status(400);
            res.body("The requested sage id " + id + " wasn't a legal Mongo Object ID.\n" +
                "See 'https://docs.mongodb.com/manual/reference/method/ObjectId/' for more info.");
            return "";
        }
        if (sage != null) {
            return sage;
        } else {
            res.status(404);
            res.body("The requested sage with id " + id + " was not found");
            return "";
        }
    }


    /**
     * Get the single user specified by the `id` parameter in the request.
     *
     * @param id the Mongo ID of the desired user
     * @return the desired user as a JSON object if the user with that ID is found,
     * and `null` if no user with that ID is found
     */
    public String getSage(String id) {
        FindIterable<Document> jsonSages
            = sageCollection
            .find(eq("_id", new ObjectId(id)));

        Iterator<Document> iterator = jsonSages.iterator();
        if (iterator.hasNext()) {
            Document sage = iterator.next();
            return sage.toJson();
        } else {
            // We didn't find the desired user
            return null;
        }
    }


    /**
     * @param req
     * @param res
     * @return an array of users in JSON formatted String
     */
    public String getSages(Request req, Response res)
    {
        res.type("application/json");
        return getSages(req.queryMap().toMap());
    }

    /**
     * @param queryParams
     * @return an array of Users in a JSON formatted string
     */
    public String getSages(Map<String, String[]> queryParams) {

        Document filterDoc = new Document();

        //FindIterable comes from mongo, Document comes from Gson
        FindIterable<Document> matchingSages = sageCollection.find(filterDoc);

        return JSON.serialize(matchingSages);
    }

    /**
     *
     * @param req
     * @param res
     * @return
     */
    public boolean addNewSage(Request req, Response res)
    {

        res.type("application/json");
        Object o = JSON.parse(req.body());
        try {
            if(o.getClass().equals(BasicDBObject.class))
            {
                try {
                    BasicDBObject dbO = (BasicDBObject) o;

                    String word = dbO.getString("word");
                    String synonym = dbO.getString("synonym");
                    String antonym = dbO.getString("antonym");
                    String generalization = dbO.getString("generalization");
                    String example = dbO.getString("example");

                    System.err.println("Adding new sage card [word=" + word + ", synonym=" + synonym + " antonym=" + antonym + " generalization=" + generalization + ", example=" + example + ']');
                    return addNewSage(word, synonym, antonym, generalization, example);
                }
                catch(NullPointerException e)
                {
                    System.err.println("A value was malformed or omitted, new sage request failed.");
                    return false;
                }

            }
            else
            {
                System.err.println("Expected BasicDBObject, received " + o.getClass());
                return false;
            }
        }
        catch(RuntimeException ree)
        {
            ree.printStackTrace();
            return false;
        }
    }

    /**
     *
     * @param word
     * @param synonym
     * @param antonym
     * @param generalization
     * @param example
     * @return
     */
    public boolean addNewSage(String word, String synonym, String antonym, String generalization, String example) {

        Document newSage = new Document();
        newSage.append("word", word);
        newSage.append("synonym", synonym);
        newSage.append("antonym", antonym);
        newSage.append("generalization", generalization);
        newSage.append("example", example);

        try {
            sageCollection.insertOne(newSage);
        }
        catch(MongoException me)
        {
            me.printStackTrace();
            return false;
        }

        return true;
    }




}

