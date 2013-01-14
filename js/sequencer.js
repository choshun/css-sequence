/**
** 	initializer for SQC
 */

var SQNC = SQNC || {};

function Sequencer($scope){
	$scope.layers = [
		{
			css: 'background-color:red;', 
			order: 16,
			layer: 0
		},
		{
			css: 'background-color:pink;', 
			order: 1,
			layer: 1
		},
		{
			css: 'background-color:orange;', 
			order: 2,
			layer: 2
		}
	];
	$scope.transitions = [
		{
			css: 'background-color:red; height:10px;-moz-transform: skew(130deg, -100deg); -webkit-transform: skew(130deg, -100deg);',
			time: 0,
			layer: 0,
			id: 0
		},
		{
			css: 'background-color:red; height:50px; -moz-box-shadow: 0; -webkit-box-shadow: 0;',
			time: .5,
			layer: 2,
			id: 1
		},
		{
			css: 'background-color:pink; height:50px;',
			time: 1.0,
			layer: 1,
			id: 2
		},
		{
			css: 'background-color:green; height:100px; -moz-transform: skew(130deg, -100deg); -webkit-transform: skew(130deg, -100deg);',
			time: 4.0,
			layer: 0,
			id: 3
		},
		{
			css: 'background-color:red; height:100px;-moz-transform: skew(130deg, -100deg); -webkit-transform: skew(130deg, -100deg);',
			time: 6.0,
			layer: 1,
			id: 4
		},
		{
			css: 'background-color:green; height:50px;-moz-transform: skew(10deg, -90deg); -webkit-transform: skew(10deg, -90deg);-webkit-transition: all 1.5s ease-in-out; -moz-transition: all .5s ease-in-out;',
			time: 5.0,
			layer: 2,
			id: 5
		},
		{
			css: 'background-color:red; height:50px; -moz-box-shadow: 10px 100px 5px green; -webkit-box-shadow: 10px 100px 5px green;',
			time: 6.0,
			layer: 2,
			id: 6
		}
	];

	$scope.layers = _.sortBy( $scope.layers, 'order' );
	$scope.transitions = _.sortBy( $scope.transitions, 'time' );

	$scope.addLayer = function(){
		$scope.layers.push({
			css: 'background-color:orange;', 
			order: $scope.layers.length, 
			time:4
		});
	}

	$scope.layerFilter = function(item){
		if(item.layer === 0){
			return true;
		} else {
			return false;
		}
	}

	$scope.addTransition = function(){
		var triggersLength = $('#transport-layers').find('.trigger').length - 1,
			time,
			layer,
			id;

		$('#transport-layers').find('.trigger').each(function(){
			if ($(this).data('id') === triggersLength){
				time = $(this).data('time');
				layer = $(this).parent('.layer').index('#transport-layers .layer');
				id = $(this).data('id');
				
			}
		});

		$scope.transitions.push({
			css: 'background-color:green; height:100px;',
			time: time,
			layer: layer,
			id: id
		});

		$scope.transitions = _.sortBy( $scope.transitions, 'time' );
	}

}

angular.module('sequencerModule',[])
	.directive('sequencer', function(){
		return {
			restrict: 'C',
			replace: true,
			transclude: true,
			scope: { css:'@' },
			template: '<div>' +
				'<div class="css" style="{{layer.css}}" ng-transclude>{{layer.css}}</div>' +
				'</div>'
		}
	})
	.directive('transportWrapper', function($parse){
		return {
			restrict: 'C',
			// This HTML will replace the zippy directive.
			replace: true,
			transclude: true,
			scope: { transport:'@' },
			template: '<div>' +
				'<div class="transport" ng-transclude></div>' +
				
				'</div>',
			link: function(scope, element, attrs){
				var timeElapsed = 0;
				var $transitions = $('#transitions');
				var transitionCounter = 0;
				var timeReset = false;

				function init(){
					checkTransitions();
				}

				function checkTransitions(){
					var checkTransitionInterval = setInterval(function(){
						if(timeElapsed !== $('#time-elapsed').val()){
							timeReset = (timeElapsed > $('#time-elapsed').val());
							timeElapsed = $('#time-elapsed').val();
							if(timeReset){
								transitionCounter = 0;
							}
							checkTransition();
						}
					}, 200);
				}

				function checkTransition(){
					var nextTransition = $transitions.find('li:eq(' + transitionCounter +')');
					var time = nextTransition.children('.time').val();
					var layer = nextTransition.children('.layer').val();
					var css = nextTransition.children('.css').val();
					
					if(timeElapsed > time){
						$('#layers').find('li:eq(' + layer +')').children('input').val(css).trigger('input');
						if ($transitions.find('li:eq(' + parseInt(transitionCounter) +')').children('.time').val() !== undefined){
							transitionCounter++;
						}
					}
					
				}

				init();

			}

		}
	});

angular.module('SequencerApp',['components']);

$(function() {

	/* 
	 * global variables
	 * */
	SQNC.$sequencer = $('.sequencer');
	SQNC.sequencer = new Array();
	SQNC.isPlaying = true;

	/* 
	 * global objects
	 * */
	SQNC.grid = new SQNC.grid();
	SQNC.transport = new SQNC.transport();

	SQNC.transport.play();

});