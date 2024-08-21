import calcsTravel from "../../services/calcsTravel.js";

export default (req, res) => {
    res.status(200).json({isCalc: calcsTravel.isCalc});
}