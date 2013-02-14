/**
**	Handles all events with the sequencer, pushes updated values to angular's object states.
 */

var SQNC = SQNC || {};

(function($) {

	SQNC.grid = function (options){
		
		var $body = $('body'), 
			$sequencer = SQNC.$sequencer,
			$transitions = $('#transitions'),
			$transportLayers = $('#transport-layers'),
			$layers = $transportLayers.find('.layer'),
			$ticker = $('#ticker');

		var leftOffset = $layers.offset().left;
			
		var commandKeyIsOn = false,
			sequenceWidth = $sequencer.width(),
			cursorX = 0,
			cursorY = 0;
		
		function init(){
			bindWindowForTrackActions();
			bindTrackActions();
			setTransitionTriggersPositions();
			bindTriggerHoverState();
		}

		function bindWindowForTrackActions(){
			$(document).on('keydown', function(e){
				checkCommandKeyStatus(e);
				checkSpacebarStatus(e);
			});
			$(document).on('keyup', function(e){
				destroyCommandKeyStatus(e);
			});
		}
		
		function checkCommandKeyStatus(e){
			if (e.metaKey) {
				commandKeyIsOn = true;
				console.log('control on');

				$body.addClass('control-on');
			}
		}

		function destroyCommandKeyStatus(e){
			if (!e.metaKey) {
				commandKeyIsOn = false;
				console.log('control off');
				$body.removeClass('control-on');
			}
		}

		function checkSpacebarStatus(e){
			if (e.which === 32) {
				e.preventDefault();
				if(SQNC.isPlaying === true){
					SQNC.isPlaying = false;
					$body.removeClass('playing');
				} else {
					SQNC.isPlaying = true;
					$body.addClass('playing');
					SQNC.transport.play();
				}
				
			}
		}
	
		function bindTrackActions(){
			$transportLayers.on('click', '.layer', function(e){
				
				var $target = $(e.target),
					$this = $(this);

				cursorX = (window.Event) ? e.pageX : event.clientX;
				cursorX = cursorX - $transportLayers.offset().left;
				cursorY = (window.Event) ? e.pageY : event.clientY;

				if(commandKeyIsOn){
					if($target.attr('class') === 'trigger') {
						//$target.remove();
						
						var arrayIndex = $target.data('trigger-key');
						
						SQNC.sequencer.splice(arrayIndex , 1);
						triggerKey--;
						//SQC.triggerKeyCount--;
						console.log(SQNC.sequencer);
						
					} else{
						addTrigger({
							$target: $target,
							position: cursorX
						});
					}
				}
			});
		}
		
		function setTransitionTriggersPositions(){
			var idCounter = 0;
			$transitions.find('li').each(function(){
				var $this = $(this);
				var time = $this.find('.time').val();
				var layer = $this.find('.layer').val();
				$('#transport-layers .layer:eq(' + layer + ')').append('<div class = "trigger" style="left:' + parseInt(findTriggerLeftPositionFromTime(time) - 5) + 'px" data-id="' + idCounter + '" />');
				idCounter++;
			});
		}

		function findTriggerLeftPositionFromTime(time){
			var position = (time / 10) * ($transportLayers.width() - leftOffset * 2);
			return position;
		}

		function findTriggerTimeFromLeftPosition(position){
			var time = position / ($transportLayers.width() - leftOffset * 2) * 10;
			return time;
		}
		
		function setTickerPosition(time){
			var width = $transportLayers.width();
			var timePosition = (((width - (leftOffset * 2))/10) * time) + leftOffset;
			$ticker.css('left', timePosition)
		}

		function addTrigger(options){
			var triggersLength = $transportLayers.find('.trigger').length;
			var position = parseInt(cursorX - leftOffset - 5);
			options.$target.append('<div class = "trigger" style="left:' + position + 'px" data-id="' + triggersLength + '" data-time="' + findTriggerTimeFromLeftPosition(position) + '"/>');
			SQNC.sequencer.push(cursorX);
			console.log(SQNC.sequencer);
			addTransition();
		}

		function addTransition(){
			$('#add-transition').click();
		}

		function bindTriggerHoverState(){
			$('#transport-layers').delegate('.trigger','mouseenter', function(){
				$('#transport-layers .trigger').removeClass('focus');
				var $this = $(this);
				$this.addClass('focus');
				var id = $this.data('id');
				revealCSSDisplay(id);
			});
		}

		function revealCSSDisplay(id){
			$('#transitions input').each(function(){
				var $this = $(this);
				$this.removeClass('active');
				if ($this.hasClass('id') && $this.val() == id){
					$(this).parent().children('.css').addClass('active');
				}
			});
		}

		init();

		return{
			setTickerPosition : setTickerPosition
		}
		
	}
	
})(jQuery);