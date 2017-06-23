/* Generated: Fri Jun 23 2017 17:13:26 GMT-0400 (Eastern Daylight Time)undefined */var app = angular.module('project', []);

angular.module('appStates', ['ui.router', 'ui.router.stateHelper'])
.config(function(stateHelperProvider, $urlRouterProvider) {
	$urlRouterProvider.when('/', ['$state', function($state) {
		$state.go('speechForm.home');
	}]);
});
app.controller('SpeechFormProjectCtrl', function() {
  
});
if ('webkitSpeechRecognition' in window) {
	app.directive('speechForm', function($timeout){
		return {
			scope: {
				speechResponse: '='
			},
			link: SpeechFormLink,
			templateUrl: "components/speechForm/speechForm.html"    			 
		};

		function SpeechFormLink($scope, $element, attrs){
			var formEl = $element[0].parentNode.parentNode.parentNode,
					requiredEl = formEl.querySelectorAll('.form-control'),
					micBtn = formEl.querySelector('.speech-btn'),
					final_transcript = '',
					recognizing = false,
					formIndex = 0,
					formDone = false,
					focusing = false,
					formLabelContent;
			console.log(requiredEl);
			var focusOnForm = function(){
				if(formIndex>0){
					requiredEl[formIndex-1].classList.remove('speech-form-focus');
					requiredEl[formIndex-1].value = final_transcript;
				}
				requiredEl[formIndex].classList.add('speech-form-focus');
				requiredEl[formIndex].focus();
				formLabelContent = requiredEl[formIndex].parentNode.parentNode.children[0].textContent;
				$scope.speechText = formIndex == 0 ? 'Please say your ' + formLabelContent : 'Now say your ' + formLabelContent;
				newSpeech();
				formIndex++;
			};

			var focusOnBtn = function(){
				$scope.speechText = 'Now say "submit" to go to next page.';
				newSpeech();
				formDone = true;
			};

			$scope.$watch('speechResponse',function(newValue, oldValue){
				if(focusing){
					console.log(newValue);
					if(!formDone){
							if(formIndex == requiredEl.length){
								requiredEl[formIndex-1].classList.remove('speech-form-focus');
								requiredEl[formIndex-1].value = final_transcript;
								focusOnBtn();	
							}
							else
								focusOnForm();
					}	else {
						$scope.done = true;
						formEl.submit();
						return;
					}
				}
			});

			micBtn.addEventListener("click", function(event){
				event.preventDefault();
				if(!focusing)
					focusOnForm();
				focusing = true;
				$scope.active = true;
			});

			var newSpeech = function(){
				var recognition = new webkitSpeechRecognition();
				//recognition.continuous = true;
				//recognition.interimResults = true;

				recognition.onstart = function() {
					recognizing = true;
				};

				recognition.onerror = function(event) {
					console.log(event.error);
				};

				recognition.onend = function() {
					recognizing = false;
				};

				recognition.onresult = function(event) {
					var interim_transcript = '';
					for (var i = event.resultIndex; i < event.results.length; ++i) {
						if (event.results[i].isFinal) {
							final_transcript += event.results[i][0].transcript;
						} else {
							interim_transcript += event.results[i][0].transcript;
						}								
					$scope.speechResponse = final_transcript;
					}
				};

				var two_line = /\n\n/g;
				var one_line = /\n/g;
				function linebreak(s) {
					return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
				}

				if (recognizing) {
					recognition.stop();
					return;
				}
				final_transcript = '';
				recognition.lang = 'en-US';
				recognition.start();
				recognition.onspeechend = function() {
					recognition.stop();
					console.log('Speech recognition has stopped.');
					$timeout(function(){document.querySelector('#main').click();},1000);
				}
			};
		}
	});
}
