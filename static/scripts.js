var lsomewhereApp = angular.module('lsomewhereApp', 
	['ngCookies', 'mentio', 'ngRoute', 'ui.tinymce']);

lsomewhereApp.config(function($httpProvider, $interpolateProvider, $routeProvider) {
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';

    $interpolateProvider.startSymbol('<%=');
    $interpolateProvider.endSymbol('=%>');

    $routeProvider
        .when('/', {
            templateUrl: 'examples.html',
            tab: 'examples',
            title: 'Ment.io examples'
        })
        .when('/examples', {
            templateUrl: 'examples.html',
            tab: 'examples',
            title: 'Ment.io examples'
        });
});

// lsomewhereApp.directive('contenteditable', ['$sce', function($sce) {
//     return {
//         restrict: 'A', // only activate on element attribute
//         require: '?ngModel', // get a hold of NgModelController
//         link: function(scope, element, attrs, ngModel) {
//             function read() {
//                 var html = element.html();
//                 // When we clear the content editable the browser leaves a <br> behind
//                 // If strip-br attribute is provided then we strip this out
//                 if (attrs.stripBr && html === '<br>') {
//                     html = '';
//                 }
//                 ngModel.$setViewValue(html);
//             }

//             if(!ngModel) return; // do nothing if no ng-model

//             // Specify how UI should be updated
//             ngModel.$render = function() {
//                 if (ngModel.$viewValue !== element.html()) {
//                     element.html($sce.getTrustedHtml(ngModel.$viewValue || ''));
//                 }
//             };

//             // Listen for change events to enable binding
//             element.on('blur keyup change', function() {
//                 scope.$apply(read);
//             });
//             read(); // initialize
//         }
//     };
// }])

lsomewhereApp.directive('fileModel', ['$parse', function($parse){
	return {
		restrict: 'A',
		link: function(scope, element, attrs){
			var model = $parse(attrs.fileModel);
			var modelSetter = model.assign;

			element.bind('change', function(){
				scope.$apply(function(){
					modelSetter(scope, element[0].files[0]);
				})
			})
		}
	}
}])

lsomewhereApp.service('fileFormUpload', ['$http', function($http){
	this.post = function(postUrl, data){
		var fd = new FormData();
		for(var key in data)
			fd.append(key, data[key]);
		$http.post(postUrl, fd, {
			transformRequest: angular.indentity,
			headers: { 'Content-Type': undefined }
			}).success(function(data) {
				alert("OK");
			});
	}
}])


lsomewhereApp.controller('commentCtrl', [
        '$scope',
        'fileFormUpload',
        function($scope, fileFormUpload) {

    $scope.comment = {};

	$scope.privacyLevel = [
		{name: '公開', value: 1},
		{name: '朋友', value: 2},
		{name: '朋友的朋友', value: 3},
		{name: '僅自己', value: 4}
	];

	$scope.submitForm = function(isFormValid, $event) {
		var obj = $event.target;
		
		if (!isFormValid) {
			$scope.formStatus = 1;
		} else {
			var postUrl = "/wade/post";
			fileFormUpload.post(postUrl, $scope.comment);
		}
	};
}]);


lsomewhereApp.controller('mentio-demo-ctrl', function ($scope, $rootScope, $http, $q, $sce, $timeout, mentioUtil) {

    $scope.tinyMceOptions = {
        init_instance_callback: function(editor) {
            $scope.iframeElement = editor.iframeElement;
        }
    };

    $scope.macros = {
        'brb': 'Be right back',
        'omw': 'On my way',
        '(smile)' : '<img src="http://a248.e.akamai.net/assets.github.com/images/icons/emoji/smile.png"' +
            ' height="20" width="20">'
    };

    // shows the use of dynamic values in mentio-id and mentio-for to link elements
    $scope.myIndexValue = "5";

    $scope.searchSimplePeople = function(term) {
        var peopleList = [];
        var postData = {
            'name': term,
        };

        return $http.post('/search_tags', postData).success(function(data) {
            $scope.simplePeople = [];
            angular.forEach(data.data, function(item) {
            	if (item.name.indexOf(term) != -1) {
                	$scope.simplePeople.push(item);
                }
            });
        });
    }

    $scope.getPeopleText = function(item) {
        // note item.label is sent when the typedText wasn't found
        return '[~<i>' + (item.name || item.label) + '</i>]';
    };

    $scope.getPeopleTextRaw = function(item) {
        return '@' + item.name;
    };

    $scope.resetDemo = function() {
        // finally enter content that will raise a menu after everything is set up
        $timeout(function() {
            var html = "Try me @ or add a macro like brb, omw, (smile)";
            var htmlContent = document.querySelector('#htmlContent');
            if (htmlContent) {
                var ngHtmlContent = angular.element(htmlContent);
                ngHtmlContent.html(html);
                ngHtmlContent.scope().htmlContent = html;
                // select right after the @
                mentioUtil.selectElement(null, htmlContent, [0], 8);
                ngHtmlContent.scope().$apply();
            }
        }, 0);
    };

    $rootScope.$on('$routeChangeSuccess', function (event, current) {
        $scope.resetDemo();
    });

    $scope.theTextArea = 'Type an # and some text';
    $scope.theTextArea2 = 'Type an @';
    // $scope.searchSimplePeople('');
    $scope.resetDemo();
})

// lsomewhereApp.filter('words', function () {
//     return function (input, words) {
//     	alert(words);
//         if (isNaN(words)) {
//             return input;
//         }
//         if (words <= 0) {
//             return '';
//         }
//         if (input) {
//             var inputWords = input.split(/\s+/);
//             if (inputWords.length > words) {
//                 input = inputWords.slice(0, words).join(' ') + '\u2026';
//             }
//         }
//         return input;
//     };
// });
