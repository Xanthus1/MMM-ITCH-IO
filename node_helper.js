 // node helper for ITCH-IO module for Magic Mirror 2 
 // By Xanthus1
 
const NodeHelper = require('node_helper');
const request = require('request');

module.exports = NodeHelper.create({

    start: function() {
        console.log("Xan: Starting node_helper for: " + this.name);
    },

	getGamesXML: function(url) {
		var xhttp = new XMLHttpRequest();
		xhttp.open("GET",url,true);
		xhttp.onreadystatechange = function() {
			if(this.readyState == 4){
				if(this.status == 200){
					self.sendSocketNotification('ITCHIO_RESULT', this.responseXML);
				}
				else{
					self.sendSocketNotification('ITCHIO_RESULT', "Error Retreiving Games");
				}
			}
		};
		xhttp.send();
	},

    getGames: function(url) {
        request({
            url: url,
            method: 'GET'
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                var result = body;
			//	console.log(response.statusCode); // check
                this.sendSocketNotification('ITCHIO_RESULT', result);
            }
		else{
			this.sendSocketNotification('ITCHIO_RESULT', error);    
		}
        });
	
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === 'GET_ITCHIO_GAMES') {
            this.getGames(payload);
        }
    }
});
