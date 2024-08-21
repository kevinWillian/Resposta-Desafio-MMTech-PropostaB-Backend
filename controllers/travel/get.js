import db from '../../configs/database.js';

export default (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    try {
        let _id = req.params.id;

        db.travel.find({ _id }, (err, response) => {
            if (err)
                res.status(500).json({ error: { code: '500', message: err.message }, payload: null });
            else
                res.status(200).json(response);
        });
    } catch (err) {
        res.status(500).json({ error: { code: '500', message: err.message }, payload: null });
    }
};