
// itchio.js

Module.register("MMM-ITCH-IO",{
	// default module config
	defaults: {
		loadingText: "Retrieving games...",
		updateInterval: 10*1000, // 10 seconds
		animationSpeed: 3*1000, // 3 seconds

		maxWidth: '100%',
		maxHeight: '250px',
		borderRadius: '25px',
		
		descriptionLimit: 125, // character limit for description
		
		// url from itch.io with XML data for games
		// additional lists can be added by adding .xml to 
		// a search/filter on https://itch.io
		gamelists: [{
			listTitle: "[ Featured ]",
			url: "https://itch.io/feed/featured.xml"
		},
		{
			listTitle: "[ Free ]",
			url: "https://itch.io/games/top-rated/free/last-7-days.xml"
		}],
		limit: 7 // limit to showing 7 games from each list
	},
	
	// override dom generator
	getDom: function(){
		var wrapper = document.createElement("div");
		if(!this.loaded){
			wrapper.innerHTML = this.config.loadingText;
			return wrapper;
		}
		
		// show current game 
		var currentGame = this.games[this.currentGame];
		wrapper.innerHTML = "<div class='gameTitle'>"+currentGame.getElementsByTagName("plainTitle")[0].firstChild.nodeValue+ "</b>";		wrapper.innerHTML = "<b>"+this.games[this.currentGame].getElementsByTagName("plainTitle")[0].childNodes[0].nodeValue+"</div>";
		
		// description (includes an image, we need to separate these)
		var description = currentGame.getElementsByTagName("description")[0].firstChild.nodeValue;
		var imgIndex = description.indexOf("<img");
		var descriptionTxt = description.substring(0,imgIndex);
		var descriptionImg = description.substring(imgIndex);

		// limit description length based on configuration
		if(descriptionTxt.length > this.config.descriptionLimit){
			descriptionTxt = descriptionTxt.substring(0,this.config.descriptionLimit);
			descriptionTxt += "...";
		}
		
		// add description, image, and listTitle below
		wrapper.innerHTML += "<div>"+descriptionTxt+"</div>";
		wrapper.innerHTML += "<div>"+descriptionImg+"</div>";
		wrapper.innerHTML += "<div>"+this.config.gamelists[this.currentGameList].listTitle+"</div>";

		// update image style based on configuration
		var img = wrapper.getElementsByTagName("img")[0];
		img.style.maxWidth = this.config.maxWidth;
		img.style.maxHeight = this.config.maxHeight;
		img.style.borderRadius = this.config.borderRadius;

		// wrapper style (text, etc.)
		wrapper.classList.add("small");	

		return wrapper;
	},

	
	// all node helpers are loaded and system is ready to boot up 
	start: function() {
	        Log.log(this.name + ' is started!');
			
		this.currentGameList = 0; 
		this.currentGame = 0;

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
			if(this.currentGame==this.config.limit || this.currentGame==this.games.length){
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
		return ["MMM-ITCH-IO.css"];
	}	
});
