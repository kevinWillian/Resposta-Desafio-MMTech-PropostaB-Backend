import Calcs from './../../services/calcsTravel.js'

export default (req, res) => {
    let _travel_id = req.query.travel_id;

    try{
        const calc = new Calcs();
        calc.acalcRouteData(_travel_id);
        res.status(200).json({status: "Ok"});
    } catch(err){
        res.status(500).json({ error: { code: '500', message: err.message }, payload: null });
    }
    
}