/** 
 * Keeps time
 */


var SQNC = SQNC || {};

(function($) {
	SQNC.transport = function (options){
		
		var defaults = {
			length: 10, //in seconds
			interval: 50 //in ms
		};
		var settings = {};
		$.extend(settings, defaults, options);

		var start = new Date().getTime(),
		  	nextGrain = null,
	        time = 0,  
	        elapsed = elapsed || '.0',
			tempo = 60;
		
		var $sequencer = $('#sequencer');
		var sequencerWidth = $sequencer.width();
		
		init = function(){
			keepTime();
		}
		
		function keepTime(){
		    grain();
		}
		
		function grain() {  
			time += settings.interval;  
	        elapsed = (Math.floor(time / 100) / 10) % settings.length; 
	        SQNC.grid.setTickerPosition(elapsed);
	        if (Math.round(elapsed) === elapsed) { 
				elapsed += '.0'; 
			}  
			document.title = elapsed; 
			$('#time-elapsed').val(elapsed);
			if(SQNC.isPlaying === true){
				play();
			} 
	    }
		
	    function play(){
	    	var diff = (new Date().getTime() - start) - time;
			window.setTimeout(grain, (settings.interval - diff));
	    }
		
		init();
		
		return{
			play : play
		}

	}	
})(jQuery)