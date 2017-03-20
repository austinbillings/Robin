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
    accent: 'cyan',
    background: 'white',
    defaultIcon: 'comment-o',
    overlay: 'rgba(0, 0, 0, 0.8)',
    shadow: '0px 0px 10px rgba(0, 0, 0, 0.15)'
  };

  service.themes = {
    dark: {
      background: 'transparent',
      overlay: 'rgba(0, 0, 0, 0.92)',
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
      color: 'white',
      background: 'black',
      overlay: 'rgba(255, 255, 255, 0.9)'
    },
    pro: {
      radius: 3,
      shadow: 'none',
      color: 'white',
      overlay: 'rgba(0, 0, 0, 0.9)',
      background: 'rgba(0, 0, 0, 0.5)',
      border: '1px solid rgba(255,255,255,0.2)'
    },
    card: {
      radius: 10,
      color: 'black',
      border: 'none',
      background: 'white',
      overlay: 'transparent',
      shadow: '0px 0px 20px rgba(0, 0, 0, 0.2)'
    },
    plaque: {
      radius: 2,
      color: 'white',
      background: 'rgba(0, 0, 0, 0.9)',
      overlay: 'transparent',
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
    for (var key in service.defaults) {
      if (key && key in settings) service.settings[key] = settings[key];
    }
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
    return '\n    robin modal-wrapper {\n      top: 0;\n      left: 0;\n      width: 100vw;\n      height: 100vh;\n      display: flex;\n      position: fixed;\n      align-items: center;\n      justify-content: center;\n      background-color: ' + (settings.overlay || 'transparent') + ';\n    }\n\n    robin modal {\n      padding: 30px;\n      flex-basis: 300px;\n      text-align: center;\n      color: ' + settings.color + ';\n      border: ' + settings.border + ';\n      background: ' + settings.background + ';\n      border-radius: ' + settings.radius + 'px;\n      box-shadow: ' + (settings.shadow || 'none') + ';\n    }\n\n    robin input {\n      width: 100%;\n      margin: 10px auto 20px;\n      padding: 10px;\n      border-radius: 0;\n      border: none;\n      border-bottom: 1px solid ' + settings.color + ';\n      background: transparent;\n      color: ' + settings.color + ';\n    }\n\n    robin button {\n      color: ' + settings.color + ';\n    }\n\n    robin .robin-icon {\n      font-size: ' + settings.iconSize + 'px;\n    }\n\n    robin modal-wrapper,\n    robin modal-wrapper.ng-enter.ng-enter-active {\n      transition: ' + settings.speed + 's ease-in-out all;\n      opacity: 1;\n    }\n\n    robin modal-wrapper.ng-enter,\n    robin modal-wrapper.ng-leave.ng-leave-active {\n      opacity: 0;\n    }\n    ';
  };

  return service;
});
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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
      promise: null,
      icon: null,
      answer: null
    },
    load: function load() {
      for (var _len = arguments.length, input = Array(_len), _key = 0; _key < _len; _key++) {
        input[_key] = arguments[_key];
      }

      input.forEach(function (item) {
        if ((typeof item === 'undefined' ? 'undefined' : _typeof(item)) == 'object') {
          Object.keys(service.live).forEach(function (prop) {
            if (prop in item) service.live[prop] = item[prop];
          });
        }
        if (typeof item == 'string') {
          service.live.text = item;
        }
      });
    },
    hold: false,
    destruct: false,
    themes: RobinUI.themes,
    settings: RobinUI.settings,
    initialize: RobinUI.initialize,
    trust: $sce.trustAsHtml,
    fa: function fa(icon) {
      return 'fa fa-' + icon;
    }
  };

  service.mode = function (state) {
    for (var key in service.is) {
      service.is[key] = key === state;
    }
  };

  service.defuse = function () {
    if (service.destruct) $timeout.cancel(service.destruct);
    service.destruct = false;
  };

  service.alert = function (message) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    service.mode('alerting');
    service.load(message, options);
    service.defuse();
    service.destruct = RobinUI.settings.duration ? $timeout(service.exit, RobinUI.settings.duration * 1000) : false;
  };

  service.notify = function (message) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    service.mode('alerting');
    service.load(message, options);
    service.defuse();
    service.hold = true;
  };

  service.confirm = function (message) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    service.mode('confirming');
    service.load(message, options);
    service.hold = true;
    service.defuse();
    service.promise = $q.defer();
    return service.promise.promise;
  };

  service.prompt = function (message) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    service.mode('prompting');
    service.load(message, options);
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

  service.continue = function () {
    if (service.is.confirming || service.is.notifying) return service.affirm(true);
    if (service.is.prompting && service.live.answer !== null) return service.affirm(service.live.answer);
    return false;
  };

  service.handleEnter = function (e) {
    service.continue();
  };

  service.handleEscape = function (e) {
    if (service.hold) service.deny();
    service.exit();
  };

  service.clear = function () {
    for (var key in service.live) {
      service.live[key] = null;
    };
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

    if (enabled !== false) {
      if (typeof enabled === 'string') service.live.text = enabled;
      service.mode('loading');
    } else {
      service.exit();
    }
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
    scope: false,
    controller: function controller($scope, Robin) {
      return $scope.robin = Robin;
    },
    link: function link(scope, el, attrs) {
      angular.element(el).on('keyup', function (e) {
        if (e.keyCode === 13) scope.robin.handleEnter(e);
        if (e.keyCode === 27) scope.robin.handleEscape(e);
      });
      Robin.initialize();
    },
    template: '<modal-wrapper ng-if="!robin.is.hidden || robin.is.loading" ng-click="robin.clickClosed($event)">\n      <modal ng-if="!robin.is.hidden">\n        <ringo ng-if="robin.is.loading" ring-size="{{robin.settings.iconSize * 2}}" ring-thickness="2" ring-color="{{robin.settings.color}}"></ringo>\n        <span class="robin-icon" ng-hide="robin.is.loading" ng-class="robin.getIcon()"></span>\n        <p ng-if="robin.live.text" ng-bind-html="robin.trust(robin.live.text)"></p>\n        <input ng-if="robin.is.prompting" ng-model="robin.live.answer" autofocus="true" />\n        <div ng-if="robin.is.confirming || robin.is.prompting">\n          <button ng-click="robin.deny()">Nah</button>\n          <button ng-click="robin.affirm()">Yea</button>\n        </div>\n      </modal>\n    </modal-wrapper>'
  };
}]);