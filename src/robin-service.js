angular.module('Robin').service('Robin', ['$timeout', '$rootScope', '$sce', '$q', 'RobinUI', function ($timeout, $rootScope, $sce, $q, RobinUI) {
  let fa = icon => 'fa fa-' + icon;

  let service = {
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
    fa: icon => ('fa fa-' + icon)
  };

  console.log('themes', RobinUI.themes);

  service.mode = state => {
    Object.keys(service.is).forEach(existingState => {
      service.is[existingState] = (state === existingState);
    });
  }

  service.defuse = () => {
    if (service.destruct) $timeout.cancel(service.destruct);
    service.destruct = false;
  }

  service.alert = (message, options = {}) => {
    service.mode('alerting');
    service.live.text = message;
    if (options.kind) service.live.kind = options.kind;
    if (options.icon) service.live.icon = options.icon;
    service.defuse();
    service.destruct = (RobinUI.settings.duration ? $timeout(service.exit, (RobinUI.settings.duration * 1000)) : false);
  }

  service.confirm = (message, options = {}) => {
    service.mode('confirming');
    service.live.text = message;
    if (options.kind) service.live.kind = options.kind;
    if (options.icon) service.live.icon = options.icon;
    service.hold = true;
    service.defuse();
    service.promise = $q.defer();
    return service.promise.promise;
  }

  service.affirm = value => {
    service.promise.resolve(value);
    service.hold = false;
    service.exit();
  }

  service.deny = () => {
    service.promise.reject();
    service.hold = false;
    service.exit();
  }

  service.clear = () => {
    Object.keys(service.live).forEach(key => {
      service.live[key] = null;
    });
  }

  service.exit = () => {
    if (!service.hold) {
      service.defuse();
      service.mode('hidden');
      service.clear();
    }
  }

  service.clickClosed = e => {
    if ($(e.target).find('modal').length) service.exit();
  }

  service.loading = (enabled = true) => {
    if (enabled) service.mode('loading');
    else service.exit();
  };

  service.getIcon = () => {
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
  }
  return service;
}]);
