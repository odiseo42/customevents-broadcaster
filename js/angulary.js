var $scope;
var app = angular.module('miniapp', []);
app.directive('editable', function() {
    return {
        restrict: 'A',
        scope: {field: '='},
        replace: false,
        template:
          '<span>'+
              '<input type="text" ng-model="field" ng-show="edit" ng-enter="edit=false"></input>'+
              '<span ng-show="!edit">{{field}}</span>'+
          '</span>',
        link: function(scope, element, attrs) {
            scope.edit = false;
            $(element).bind('click', function() {
              //console.log('clicked on '+scope.field);
              // create and dispatch the event
              var miniAppEvent = new CustomEvent("miniAppEvent",
                {
                  "detail":
                  {
                    "eventType": "Editing to-do item",
                    "item": scope.field
                  },
                bubbles: false
              });
              $('body').broadcast(miniAppEvent);

              scope.$apply(scope.edit = true);
            });
        }
    };
});

app.directive('listenForCustomEvents', function() {
    return {
        restrict: 'A',
        replace: false,
        link: function(scope, element, attrs) {
            scope.edit = false;

            var notif_area = $(element);
            element[0].addEventListener("miniAppEvent", function(e) {

              notif_area.fadeIn(1, function(){
                notif_area.html('I heard something: ' +e.detail.eventType + ', ['+ e.detail.item+']');
              }).delay(1000).fadeOut(function(){
                notif_area.html('');
              });

              console.log("Angular Listened to miniAppEvent: ", e);
            });
        }
    };
});

app.directive('ngEnter', function() {
    return function(scope, element, attrs) {
        element.bind('keypress', function(e) {
            if (e.charCode === 13 || e.keyCode ===13 ) {
              scope.$apply(attrs.ngEnter);
            }
        });
    };
});

function Ctrl($scope) {
    $scope.options = [
        {text: "Johnny", checked: true},
        {text: "Bbb", checked: true},
        {text: "Ccc", checked: true}
    ];

    $scope.selectedOptions = function() {
        var selValues = [];
        _.each($scope.options, function(option) {
            if (option.checked) {
                selValues.push(option.text);
            }
        });
        return selValues;
    };

    $scope.addOption = function() {
        $scope.options.push({
            text: $scope.optionText,
            checked: true
        });

        var miniAppEvent = new CustomEvent("miniAppEvent",
          {
            "detail":
            {
              "eventType": "Adding to-do item",
              "item": $scope.optionText
            },
            bubbles: false

        });
        $('body').broadcast(miniAppEvent);

        $scope.optionText = '';
    };
}
