
import * as mongoDB from "mongodb";

var order:mongoDB.Collection;
var product:mongoDB.Collection;
var user:mongoDB.Collection;

class Mongo {
    static order:mongoDB.Collection;
    static product:mongoDB.Collection;
    static user:mongoDB.Collection;
}

var mongo = new Mongo()

const uri = "mongodb+srv://client1:client1@cluster0.pz1ji.mongodb.net/?retryWrites=true&w=majority";
const connect  = async () => {
    console.log('444\n')
    const client: mongoDB.MongoClient = new mongoDB.MongoClient(uri);
    await client.connect();
    
    const db: mongoDB.Db = client.db("e_commerce_db");
    Mongo.order = db.collection("orders");
    Mongo.product = db.collection("products");
    Mongo.user = db.collection("users");

    console.log(`Successfully connected to database: ${db.databaseName} and collections: ${Mongo.order.collectionName}, ${Mongo.product.collectionName}, ${Mongo.user.collectionName}`);
}
const customSetup = async () => {
    await Mongo.user.createIndex({ "email": 1 }, { unique: true })
}
async function initDatabase() {
    await connect();
    await customSetup();
}

export default Mongo;
export { initDatabase }