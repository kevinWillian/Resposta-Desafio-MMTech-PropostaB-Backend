import db from '../../configs/database.js';
import Ajv from 'ajv';

export default (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(`Access-Control-Allow-Methods`, `POST`);
    res.header(`Access-Control-Allow-Headers`, `Content-Type`);

    var avj = new Ajv();

    const schema = {
        type: "object",
        properties: {
            name: {type: "string"},
        },
        required: ["name"],
        additionalProperties: false
    }

    const validate = avj.compile(schema);

    if(!validate(req.body)){
        res.status(400).json({error: {code: '400', message: 'bad request'}});
        return;
    }

    let regex = /^[a-zA-ZÀ-ÿ\s]+$/;
    if(!regex.test(req.body.name)){
        res.status(400).json({error: {code: '400', message: 'name invalid'}});
        return;
    }

    let add = req.body;
    add.createAt = Date.now();

    try {
        db.travel.insert(add, (err, response) => {
            if (err) res.status(500).json({ error: { message: err.message }, payload: null });
            else if (response.length) res.status(201).json({ error: 0, payload: { comments: response } });
            else{
                res.json({"status":"Ok"});
            }
        });
    } catch (err) {
        res.status(500).json({ error: { code: '500', message: err.message }, payload: null });
    }
}