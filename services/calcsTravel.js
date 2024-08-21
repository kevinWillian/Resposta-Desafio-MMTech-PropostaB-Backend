import axios from "axios";
import db from '../configs/database.js';
import api_key from './../configs/ORS.js'

const findIts = (_travel_id) => {
    return new Promise((resolve, reject) => {
        db.itinerary.find({travel_id: _travel_id}).sort({position: 1}).exec((err, res) =>{
            if(!err){
                resolve(res)
            }else{
                reject(err)
            }
        });
    });
};

class calcsTravel {
    static isCalc = false;
    api = axios.create({
        baseURL: "https://api.openrouteservice.org",
    });

    acalcRouteData = async (_travel_id) => {

        calcsTravel.isCalc = true;
        
        let arrayIts = await findIts(_travel_id);

        let cordss = [];

        const cordsPromises = arrayIts.map((e) => {
            return this.api.get("/geocode/search/", {
              params: {
                text: e.address
              },
              headers: {
                'Authorization': api_key
              }
            }).then((res) => {
              let cords = res.data.features[0].geometry.coordinates;
              return [cords[0], cords[1]]; // Retorna as coordenadas
            });
        });

        const allCoordinates = await Promise.all(cordsPromises);

        cordss.push(...allCoordinates.filter(coord => coord !== null));

        let routeDatas = [];

        const dataPromises = cordss.map((e, indx) => {
            if (indx != (cordss.length - 1)) {
                return this.api.post("/v2/directions/driving-car/json", {
                    coordinates: [
                        [e[0], e[1]],
                        [cordss[indx + 1][0], cordss[indx + 1][1]],
                    ]
                }, {
                    headers: {
                        Authorization: `Bearer ${api_key}`,
                        'Content-Type': 'application/json',
                    }
                }).then((res) => {
                    let dist = res.data.routes[0].summary.distance;
                    let durt = (res.data.routes[0].summary.duration * 1000);
                    return { duration: durt, distance: dist };
                });
            }
            return null;
        });
        
        const validDataPromises = dataPromises.filter(p => p !== null);
        
        const allDatas = await Promise.all(validDataPromises);
        
        routeDatas.push(...allDatas);

        let totalstay = 0;

        arrayIts.forEach((e) => {
            totalstay += e.stay;
        });

        let totaldur = 0;
        
        routeDatas.forEach((e) => {
            totaldur += e.duration;
        });

        totaldur += totalstay;
        
        let totaldis = 0;
        
        routeDatas.forEach((e) => {
            totaldis += e.distance;
        });
        
        routeDatas.push({duration: totaldur, distance: totaldis});
        
        let newData = {
            _id: _travel_id,
            travel_id: _travel_id,
            data: routeDatas
        }

        db.routeData.update({_id: _travel_id}, newData, { upsert: true }, (err, response) => {
            if(err){
                console.log("db error: " + err);
            }
        });

        db.routeData.loadDatabase();
        db.itinerary.loadDatabase();

        calcsTravel.isCalc = false;

    }
}

export default calcsTravel;