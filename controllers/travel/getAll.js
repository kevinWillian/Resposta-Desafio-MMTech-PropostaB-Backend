import db from '../../configs/database.js';

export default (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    try {
        db.travel.find({}).sort({createAt: -1}).exec((err, response) =>{
            if (err)
                res.status(500).json({ error: { code: '500', message: err.message }, payload: null });
            else
                res.status(200).json(response);
        })
    }catch (err) {
        res.status(500).json({ error: { code: '500', message: err.message }, payload: null });
    }
}