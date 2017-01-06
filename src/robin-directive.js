angular.module('Robin').directive('robin', ['Robin', (Robin) => {
  return {
    restrict: 'E',
    scope: false,
    controller: ($scope, Robin) => $scope.robin = Robin,
    link: (scope, el, attrs) => {
      angular.element(el).on('keyup', (e) => {
        if (e.keyCode === 13) scope.robin.handleEnter(e);
        if (e.keyCode === 27) scope.robin.handleEscape(e);
      });
      Robin.initialize()
    },
    template:
    `<modal-wrapper ng-if="!robin.is.hidden || robin.is.loading" ng-click="robin.clickClosed($event)">
      <modal ng-if="!robin.is.hidden">
        <ringo ng-if="robin.is.loading" ring-size="{{robin.settings.iconSize * 2}}" ring-thickness="2" ring-color="{{robin.settings.color}}"></ringo>
        <span class="robin-icon" ng-hide="robin.is.loading" ng-class="robin.getIcon()"></span>
        <p ng-if="robin.live.text" ng-bind-html="robin.trust(robin.live.text)"></p>
        <input ng-if="robin.is.prompting" ng-model="robin.live.answer" autofocus="true" />
        <div ng-if="robin.is.confirming || robin.is.prompting">
          <button ng-click="robin.deny()">Nah</button>
          <button ng-click="robin.affirm()">Yea</button>
        </div>
      </modal>
    </modal-wrapper>`
  };
}]);
