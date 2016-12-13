angular.module('Robin', ['Ringo'])
  .service('Robin', ['$timeout', '$q', '$rootScope', function ($timeout, $q, $rootScope) {
    var service = {};
    return service;
  }])
  .directive('robin', function () {
    return {
      template: 'I\'m a Robin!'
    };
  });
