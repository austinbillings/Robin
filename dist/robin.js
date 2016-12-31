'use strict';

angular.module('Robin', ['ngAnimate', 'Ringo']);
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

angular.module('Robin').service('RobinUI', function () {
  var service = {};

  service.defaults = {
    radius: 5,
    speed: 0.5,
    duration: 3,
    iconSize: 60,
    fontWeight: 300,
    border: 'none',
    color: 'black',
    background: 'white',
    defaultIcon: 'comment-o',
    overlay: 'rgba(0, 0, 0, 0.8)',
    shadow: '0px 0px 10px rgba(0, 0, 0, 0.15)'
  };

  service.themes = {
    dark: {
      background: 'transparent',
      overlay: 'rgba(0, 0, 0, 0.9)',
      color: 'white',
      border: 'none',
      shadow: false
    },
    light: {
      background: 'transparent',
      overlay: 'rgba(255, 255, 255, 0.9)',
      color: 'black',
      border: 'none',
      shadow: false
    },
    inverted: {
      background: 'black',
      color: 'white',
      overlay: 'rgba(255, 255, 255, 0.9)'
    },
    pro: {
      background: 'transparent',
      color: 'white',
      border: '1px solid rgba(255,255,255,0.2)',
      overlay: 'rgba(0, 0, 0, 0.95)',
      radius: 0
    },
    card: {
      background: 'white',
      color: 'black',
      border: 'none',
      overlay: 'transparent',
      radius: 10,
      shadow: '0px 0px 20px rgba(0, 0, 0, 0.2)'
    }
  };

  service.settings = angular.copy(service.defaults);

  service.removeExistingStyle = function () {
    var ex = document.getElementById('robinStyle');
    if (ex) ex.remove();
  };

  service.replaceStyle = function () {
    service.removeExistingStyle();
    var css = service.robinCss(service.settings);
    var tag = '<style id="robinStyle">' + css + '</style>';
    angular.element(document).find('head').append(tag);
  };

  service.applySettings = function (settings) {
    if (!settings || (typeof settings === 'undefined' ? 'undefined' : _typeof(settings)) != 'object') return;
    Object.keys(service.defaults).forEach(function (key) {
      if (settings.hasOwnProperty(key)) service.settings[key] = settings[key];
    });
  };

  service.initialize = function (settings) {
    if (settings) service.applySettings(settings);
    service.replaceStyle();
  };

  service.numberize = function (n) {
    return n === n + 0 ? n : parseInt(n.toLowerCase().replace('px', '').trim());
  };

  service.robinCss = function (settings) {
    settings.iconSize = service.numberize(settings.iconSize);
    settings.radius = service.numberize(settings.radius);
    return '\n    robin modal-wrapper {\n      top: 0;\n      left: 0;\n      width: 100vw;\n      height: 100vh;\n      display: flex;\n      position: fixed;\n      align-items: center;\n      justify-content: center;\n      background-color: ' + (settings.overlay || 'transparent') + ';\n    }\n    robin modal {\n      padding: 30px;\n      flex-basis: 300px;\n      text-align: center;\n      color: ' + settings.color + ';\n      border: ' + settings.border + ';\n      background: ' + settings.background + ';\n      border-radius: ' + settings.radius + 'px;\n      box-shadow: ' + (settings.shadow || 'none') + ';\n    }\n    robin .robin-icon {\n      color: ' + (settings.iconColor || settings.color) + ';\n      font-size: ' + settings.iconSize + 'px;\n      margin-bottom: 15px;\n    }\n    robin button {\n      color: ' + settings.color + ';\n    }\n    robin modal-wrapper {\n      transition: ' + settings.speed + 's ease-in-out all;\n    }\n    robin modal-wrapper {\n      transition: ' + settings.speed + 's ease-in-out all;\n      opacity: 1;\n    }\n    robin modal-wrapper.ng-enter, robin modal-wrapper.ng-leave.ng-leave-active {\n      opacity: 0;\n    }\n    robin modal-wrapper.ng-enter.ng-enter-active {\n      opacity: 1;\n    }';
  };

  return service;
});
'use strict';

angular.module('Robin').service('Robin', ['$timeout', '$rootScope', '$sce', '$q', 'RobinUI', function ($timeout, $rootScope, $sce, $q, RobinUI) {
  var fa = function fa(icon) {
    return 'fa fa-' + icon;
  };

  var service = {
    is: {
      alerting: false,
      confirming: false,
      prompting: false,
      loading: false,
      hidden: true
    },
    live: {
      kind: null,
      text: null,
      promise: null
    },
    hold: false,
    destruct: false,
    themes: RobinUI.themes,
    initialize: RobinUI.initialize,
    trust: $sce.trustAsHtml,
    fa: function fa(icon) {
      return 'fa fa-' + icon;
    }
  };

  console.log('themes', RobinUI.themes);

  service.mode = function (state) {
    Object.keys(service.is).forEach(function (existingState) {
      service.is[existingState] = state === existingState;
    });
  };

  service.defuse = function () {
    if (service.destruct) $timeout.cancel(service.destruct);
    service.destruct = false;
  };

  service.alert = function (message) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    service.mode('alerting');
    service.live.text = message;
    if (options.kind) service.live.kind = options.kind;
    if (options.icon) service.live.icon = options.icon;
    service.defuse();
    service.destruct = RobinUI.settings.duration ? $timeout(service.exit, RobinUI.settings.duration * 1000) : false;
  };

  service.confirm = function (message) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    service.mode('confirming');
    service.live.text = message;
    if (options.kind) service.live.kind = options.kind;
    if (options.icon) service.live.icon = options.icon;
    service.hold = true;
    service.defuse();
    service.promise = $q.defer();
    return service.promise.promise;
  };

  service.affirm = function (value) {
    service.promise.resolve(value);
    service.hold = false;
    service.exit();
  };

  service.deny = function () {
    service.promise.reject();
    service.hold = false;
    service.exit();
  };

  service.clear = function () {
    Object.keys(service.live).forEach(function (key) {
      service.live[key] = null;
    });
  };

  service.exit = function () {
    if (!service.hold) {
      service.defuse();
      service.mode('hidden');
      service.clear();
    }
  };

  service.clickClosed = function (e) {
    if ($(e.target).find('modal').length) service.exit();
  };

  service.loading = function () {
    var enabled = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

    if (enabled) service.mode('loading');else service.exit();
  };

  service.getIcon = function () {
    if (service.live.icon) return fa(service.live.icon);
    switch (service.live.kind) {
      case 'warning':
      case 'warn':
        return fa('exclamation-circle');
        break;
      case 'question':
        return fa('question-circle');
        break;
      default:
        return fa(RobinUI.settings.defaultIcon);
    }
  };
  return service;
}]);
'use strict';

angular.module('Robin').directive('robin', ['Robin', function (Robin) {
  return {
    restrict: 'E',
    controller: function controller($scope, Robin) {
      return $scope.robin = Robin;
    },
    link: function link(scope, el, attrs) {
      return Robin.initialize();
    },
    template: '<modal-wrapper ng-if="!robin.is.hidden" ng-click="robin.clickClosed($event)">\n      <modal ng-if="!robin.is.hidden">\n        <ringo ng-if="robin.is.loading"></ringo>\n        <span class="robin-icon" ng-hide="robin.is.loading" ng-class="robin.getIcon()"></span>\n        <p ng-if="robin.live.text" ng-bind-html="robin.trust(robin.live.text)"></p>\n        <div ng-if="robin.is.confirming">\n          <button ng-click="robin.deny()">Nah</button>\n          <button ng-click="robin.affirm()">Yea</button>\n        </div>\n      </modal>\n    </modal-wrapper>'
  };
}]);