
// itchio.js

Module.register("ITCH-IO",{
	// default module config
	defaults: {
		text: "Retrieving games...",
		updateInterval: 10*1000, // 10 seconds
		animationSpeed: 3*1000, // 3 seconds

		maxWidth: '400px',
		maxHeight: '250px',
		
		// url from ITCH-IO with XML data for games
		gamelists: [{
			title: "[ Featured ]",
			url: "https://itch.io/feed/featured.xml"
		},
		{
			title: "[ Free ] ",
			url: "https://itch.io/games/top-rated/free/last-7-days.xml"
		}],
		limit: 7 // limit to showing 5 games from each list
	},
	
	// override dom generator
	getDom: function(){
		var wrapper = document.createElement("div");
		if(!this.loaded){
			wrapper.innerHTML = "Hello Xanthus";
			return wrapper;
		}
		
		// show current game 
		wrapper.innerHTML = "<b>"+this.games[this.currentGame].getElementsByTagName("plainTitle")[0].firstChild.nodeValue+ "</b>";		wrapper.innerHTML = "<b>"+this.games[this.currentGame].getElementsByTagName("plainTitle")[0].childNodes[0].nodeValue+" "+this.config.gamelists[this.currentGameList].title+"</b>";

		//wrapper.innerHTML = "Test";
		// description (includes an image) 
		wrapper.innerHTML += "<br>"+this.games[this.currentGame].getElementsByTagName("description")[0].firstChild.nodeValue;

		wrapper.classList.add("small","gameframe");
		wrapper.style.maxWidth = this.config.maxWidth;
		wrapper.style.maxHeight = this.config.maxHeight;
		return wrapper;
	},

	
	// all node helpers are loaded and system is ready to boot up 
	start: function() {
	        Log.log(this.name + ' is started! Xanthus');
			
		this.currentGameList = 0; 
		this.currentGame =0;

		// get first game list at startup
		
		var gamelist = this.config.gamelists[this.currentGameList];
		this.sendSocketNotification('GET_ITCHIO_GAMES', gamelist.url);
	},
	
	
	// loads games from XML 
	loadGames: function(data) {
		var parser = new DOMParser();
		var xmlDoc = parser.parseFromString(data,"text/xml");

		this.games = xmlDoc.getElementsByTagName("item");
	
		this.loaded = true;
		
		// rotate which game is showing at regular interval
		this.rotateIntervalID = setInterval(() => {
			this.rotateGame();
		}, this.config.updateInterval);
	},

	// rotate games
	rotateGame: function() {
		if(this.loaded){
			this.currentGame+=1;
			if(this.currentGame==this.config.limit){
				this.currentGame=0;
				this.currentGameList+=1;
				// loop gamelist to beginning
				if(this.currentGameList==this.config.gamelists.length){
					this.currentGameList=0;
				}
				// get new gamelist from next gamelist
				gamelist = this.config.gamelists[this.currentGameList];
				this.sendSocketNotification('GET_ITCHIO_GAMES', gamelist.url);

				// stop the rotation timer : it starts again when new list is loaded
				clearInterval(this.rotateIntervalID);
			}else{
				// only update page if we didnt move to a new list 
				this.updateDom(this.config.animationSpeed);
			}
		}
	},
	
	socketNotificationReceived: function(notification, payload) {
        	if (notification === "ITCHIO_RESULT") {
			this.loadGames(payload);
			this.updateDom(this.config.animationSpeed);
	        }
	},	
	
	getStyles: function(){
		return['ITCH-IO.css'];
	}	
});
