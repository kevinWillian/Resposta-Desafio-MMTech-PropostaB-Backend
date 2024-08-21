import db from '../../configs/database.js';
import Ajv from 'ajv';
import Calcs from './../../services/calcsTravel.js'

export default (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(`Access-Control-Allow-Methods`, `POST`);
    res.header(`Access-Control-Allow-Headers`, `Content-Type`);

    var avj = new Ajv();

    const schema = {
        type: "object",
        properties: {
            travel_id: {type: "string"},
            address: {type: "string"},
            stay: {type: "integer"},
            position: {type: "integer"}
        },
        required: ["travel_id", "address", "stay", "position"],
        additionalProperties: false
    }

    const validate = avj.compile(schema);

    if(!validate(req.body)){
        res.status(400).json({error: {code: '400', message: 'bad request'}});
        return;
    }

    try {
        db.itinerary.insert(req.body, (err, response) => {
            if (err) res.status(500).json({ error: { message: err.message }, payload: null });
            else if (response.length) res.status(201).json({ error: 0, payload: { comments: response } });
            else{
                db.itinerary.loadDatabase();
                res.json({"status":"Ok"});
            }
        });
    } catch (err) {
        res.status(500).json({ error: { code: '500', message: err.message }, payload: null });
    }
}