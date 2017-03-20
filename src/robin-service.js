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
      promise: null,
      icon: null,
      answer: null
    },
    load: (...input) => {
      input.forEach(item => {
        if (typeof item == 'object') {
          Object.keys(service.live).forEach(prop => {
            if (prop in item) service.live[prop] = item[prop];
          });
        }
        if (typeof item == 'string') {
          service.live.text = item;
        }
      })
    },
    hold: false,
    destruct: false,
    themes: RobinUI.themes,
    settings: RobinUI.settings,
    initialize: RobinUI.initialize,
    trust: $sce.trustAsHtml,
    fa: icon => ('fa fa-' + icon)
  };

  service.mode = state => {
    for (let key in service.is) {
      service.is[key] = (key === state);
    }
  }

  service.defuse = () => {
    if (service.destruct) $timeout.cancel(service.destruct);
    service.destruct = false;
  }

  service.alert = (message, options = {}) => {
    service.mode('alerting');
    service.load(message, options);
    service.defuse();
    service.destruct = (RobinUI.settings.duration ? $timeout(service.exit, (RobinUI.settings.duration * 1000)) : false);
  }

  service.notify = (message, options = {}) => {
    service.mode('alerting');
    service.load(message, options);
    service.defuse();
    service.hold = true;
  }

  service.confirm = (message, options = {}) => {
    service.mode('confirming');
    service.load(message, options);
    service.hold = true;
    service.defuse();
    service.promise = $q.defer();
    return service.promise.promise;
  }

  service.prompt = (message, options = {}) => {
    service.mode('prompting');
    service.load(message, options);
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

  service.continue = () => {
    if (service.is.confirming || service.is.notifying)
      return service.affirm(true);
    if (service.is.prompting && service.live.answer !== null)
      return service.affirm(service.live.answer);
    return false;
  }

  service.handleEnter = (e) => {
    service.continue();
  }

  service.handleEscape = (e) => {
    if (service.hold) service.deny();
    service.exit();
  }

  service.clear = () => {
    for (let key in service.live) {
      service.live[key] = null;
    };
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
    if (enabled !== false) {
      if (typeof enabled === 'string') service.live.text = enabled;
      service.mode('loading');
    } else {
      service.exit();
    }
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
