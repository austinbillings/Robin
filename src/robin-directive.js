angular.module('Robin').directive('robin', ['Robin', (Robin) => {
  return {
    restrict: 'E',
    controller: ($scope, Robin) => $scope.robin = Robin,
    link: (scope, el, attrs) => Robin.initialize(),
    template:
    `<modal-wrapper ng-if="!robin.is.hidden" ng-click="robin.clickClosed($event)">
      <modal ng-if="!robin.is.hidden">
        <ringo ng-if="robin.is.loading"></ringo>
        <span class="robin-icon" ng-hide="robin.is.loading" ng-class="robin.getIcon()"></span>
        <p ng-if="robin.live.text" ng-bind-html="robin.trust(robin.live.text)"></p>
        <div ng-if="robin.is.confirming">
          <button ng-click="robin.deny()">Nah</button>
          <button ng-click="robin.affirm()">Yea</button>
        </div>
      </modal>
    </modal-wrapper>`
  };
}]);
