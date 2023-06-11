var request = require('request');


async function getRestaurant(req, res, next) {
    const { location, radius, name } = req.body;
    try {
        let placeList = [];
        var options = {
            'method': 'GET',
            'url': 'https://maps.googleapis.com/maps/api/place/search/json?location=' + location + '&radius=' + radius + '&name=' + name + '&key=AIzaSyCzeJMBG7dupF95sa6qz5USqXYLJlGpjI4&type=restaurant',
        };
        request(options, function (error, response) {
            if (error) throw new Error(error);
            const value = JSON.parse(response.body);
            for (var i = 0; i < value.results.length; i++) {
                const { place_id, opening_hours } = value.results[i];
                let temp = {
                    "open_now": null
                }
                placeList.push({
                    place_id: place_id,
                    open_now: opening_hours == null ? temp.open_now : opening_hours.open_now
                });
            }
            if (placeList.length > 0) {
                res.send({
                    message: "Data Fetched",
                    data: placeList
                });
            } else {
                res.send({
                    message: "Data Not Found",
                    data: []
                });
            }
        });
    } catch (error) {
        res.send({ message: "Logical Error" });
    }
}

async function getRestaurantDetails(req, res, next) {
    const { location, radius, name } = req.body;
    const Id = req.headers['authorization'].split(" ")[1];
    try {
        let placeList = [];
        let placeValues = [];
        var options = {
            'method': 'GET',
            'url': 'https://maps.googleapis.com/maps/api/place/search/json?location=' + location + '&radius=' + radius + '&name=' + name + '&key=AIzaSyCzeJMBG7dupF95sa6qz5USqXYLJlGpjI4&type=restaurant',
        };
        request(options, function (error, response) {
            if (error) throw new Error(error);
            const value = JSON.parse(response.body);
            for (var i = 0; i < value.results.length; i++) {
                const { place_id, opening_hours } = value.results[i];
                let temp = { "open_now": null };
                placeList.push({
                    place_id: place_id,
                    open_now: opening_hours == null ? temp.open_now : opening_hours.open_now
                });
            }
            if (placeList.length > 0) {
                for (var i = 0; i < placeList.length; i++) {
                    placeValues.push({ 'place_id[]': placeList[i].place_id });
                }
                var options = {
                    'method': 'POST',
                    'url': 'https://api.myprojectstaging.com/BeforeBite/api/GetAllRestaurants',
                    'headers': {
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + Id
                    },
                    formData: {
                        'place_id[]': placeValues.toString(),
                    }
                };
                console.log(options.formData);
                console.log(placeValues);
                console.log(placeList);
                request(options, function (error, response) {
                    if (error) throw new Error(error);
                    if (response) {
                        res.send(
                            JSON.parse(response.body)
                        );
                    } else {
                        res.send(
                            JSON.parse(response.body)
                        );
                    }
                });


            } else {
                res.send({
                    message: "Data Not Found",
                    data: []
                });
            }
        });
    } catch (error) {
        res.send({ message: "Logical Error" });
    }
}

module.exports = {
    getRestaurant,
    getRestaurantDetails
};
