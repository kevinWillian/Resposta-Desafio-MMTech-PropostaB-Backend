import api_key from './../../configs/ORS.js'
import axios from "axios";



export default (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");

    let api = axios.create({
        baseURL: "https://api.openrouteservice.org",
    });

    
    const query = req.query.search;

    if (!query) {
        return res.status(400).json({ error: 'A query parameter is required' });
    }

    try{
        api.get("/geocode/autocomplete", {
            params: {
                api_key: api_key,
                text: query,
                boundary_country: 'BR'
              }
        }).then((response) => {
            res.json(response.data.features);
        });
    } catch(err){
        console.log("ORS error: " +  err);
    }

};