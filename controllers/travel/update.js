import db from '../../configs/database.js';
import Ajv from 'ajv';

export default (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    const avj = new Ajv();
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

    if(req.body.name){
        let regex = /^[a-zA-ZÀ-ÿ\s]+$/;
        if(!regex.test(req.body.name)){
            res.status(400).json({error: {code: '400', message: 'name invalid'}});
            return;
        }

    }

    try{
        db.travel.update({_id: req.params.id}, req.body, {}, (err, response) => {
            if (err)
                res.status(500).json({ error: { code: '500', message: err.message }, payload: null });
            else{
                res.status(200).json({"status":"Ok"});
                db.travel.loadDatabase();
            }
        });
    } catch(err){
        res.status(500).json({ error: { code: '500', message: err.message }, payload: null });
    }
}