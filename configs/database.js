import Datastore from 'nedb'

let db = {};

if(!db.travel){
    db.travel = new Datastore({
        filename: "./data/travel.db",
        autoload: true,
    });
}

if(!db.itinerary){
    db.itinerary = new Datastore({
        filename: "./data/itinerary.db",
        autoload: true,
    });
}

if(!db.routeData){
    db.routeData = new Datastore({
        filename: "./data/routedata.db",
        autoload: true,
    });
}

export default db;