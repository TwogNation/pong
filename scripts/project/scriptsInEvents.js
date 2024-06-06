


const scriptsInEvents = {

	async _btns_Event7_Act5(runtime, localVars)
	{
		const queryParams = new URLSearchParams(window.location.search)
		const token = queryParams.get('token');
		const gameId = queryParams.get('gameId');
		console.log("clicked")
					const textInstance = runtime.objects.ErrorText.getFirstInstance()
					textInstance.text = "PLEASE WAIT..."
					const button = runtime.objects.button.getFirstInstance();
					button.destroy(); 
		// Add a variable to track if the WebSocket is already connected or in the process of connecting
		let isWebSocketConnectingOrConnected = false; 
					
		try {
		    // Check if the WebSocket is already connected or in the process of connecting
		    if (!isWebSocketConnectingOrConnected) {
		        const webSocket = new WebSocket('wss://arcade.stage.legacyarcade.com/ws', [token, gameId]);
		        runtime.globalVars.webSocket = webSocket;
		
		        webSocket.onopen = (event) => {
		            isWebSocketConnectingOrConnected = true;  // Set the flag to true when connection is established
		            runtime.callFunction('startendless');
		        };
		
		        webSocket.onclose = (event) => {
		            isWebSocketConnectingOrConnected = false; // Reset the flag when the connection is closed
		        };
		
		        webSocket.onerror = (event) => {
		            isWebSocketConnectingOrConnected = false; // Reset the flag on error
		        };
		
		        runtime.globalVars.playable = 1;
		    }
		} catch (e) {
		    const textInstance = runtime.objects.ErrorText.getFirstInstance();
		    textInstance.text = "ERROR CONNECTING";
		    console.log("error connecting to server", e);
		}
		
		
	},

	async _btns_Event27_Act4(runtime, localVars)
	{
		runtime.globalVars.webSocket.close();
	},

	async _btns_Event27_Act5(runtime, localVars)
	{
		window.parent.postMessage("WebSocketClosed", "*");
	},

	async _game_center_Event14_Act2(runtime, localVars)
	{
		runtime.globalVars.webSocket.send("s:1")
		window.parent.postMessage({ type: 'score', message: 'Player scored a point' }, '*');
	},

	async Game_Event3_Act1(runtime, localVars)
	{
		runtime.globalVars.webSocket.onMessage = (event) => {
		    if (event.data.startsWith('s:')) {
		        const score_ = event.data.split(':')[1];
		        console.log("Score received from WebSocket:", score_);
		        
		        // Update the in-game score with the score received from the WebSocket
		        runtime.globalVars.score = parseInt(score_);
				console.log("Score updated from WebSocket:",  runtime.globalVars.score)
		    }
		}
	}

};

self.C3.ScriptsInEvents = scriptsInEvents;

