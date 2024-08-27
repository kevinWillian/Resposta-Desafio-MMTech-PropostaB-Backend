import db from '../../configs/database.js';
import Ajv from 'ajv';

const findInvId = (position, _travel_id) => {
    return new Promise((resolve, reject) => {
        db.itinerary.find({travel_id: _travel_id, position: position}).exec((err, res) =>{
            if(!err){
                resolve(res[0]._id);
            }else{
                reject(err)
            }
        });
    });
};
const findOriPos = (_id) => {
    return new Promise((resolve, reject) => {
        db.itinerary.find({_id}).exec((err, res) =>{
            if(!err){
                resolve(res[0].position);
            }else{
                reject(err)
            }
        });
    });
};

export default async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");

    const avj = new Ajv();
    const schema = {
        type: "object",
        properties: {
            _id: {type: "string"},
            address: {type: "string"},
            stay: {type: "integer"},
            position: {type: "integer"},
            travel_id: {type: "string"}
        },
        required: ["_id", "travel_id"],
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

    let upcased;
    let isUpPos = false;

    let oriPos;
    let invId;

    if(req.body.position){
        let isUpPos = false;
        invId = await findInvId(req.body.position, req.body.travel_id);
        oriPos = await findOriPos(req.body._id);
    }
    try {
        let _id = req.body._id;

        db.itinerary.find({ _id }, (err, response) => {
            if (err)
                res.status(500).json({ error: { code: '500', message: err.message }, payload: null });
            else if (response.length){

                upcased = response.slice()[0];

                if(req.body.address){
                    upcased.address = req.body.address;
                }
                if(req.body.stay){
                    upcased.stay = req.body.stay;
                }
                if(req.body.position){
                    upcased.position = req.body.position;
                    isUpPos = true;
                }

                try {
                    db.itinerary.update({_id}, upcased, {}, (err, response) => {
                        if (err)
                            res.status(500).json({ error: { code: '500', message: err.message }, payload: null });
                        else if (!response)
                            res.status(404).json({ error: 0, payload: { id: req.params.id } });
                        else{
                            if(isUpPos){
                                db.itinerary.update({_id: invId}, {$set: {position: oriPos}}, {}, (err, response) => {
                                    if(!err){
                                        res.status(200).json({status: "Ok"});
                                    }else{
                                        res.status(500).json({ error: { code: '500', message: err.message }, payload: null });
                                    }
                                })
                            }else{
                                res.status(200).json({"status":"Ok"});
                            }
                            db.itinerary.loadDatabase();
                        }
                    });
                } catch (err) {
                    res.status(500).json({ error: { code: '500', message: err.message }, payload: null });
                }
            }
            else
                res.status(404).json({ error: 0 });
            
        });
    } catch (err) {
        res.status(500).json({ error: { code: '500', message: err.message }, payload: null });
    }
}