angular.module('Robin').service('RobinUI', function () {
  let service = {};

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
    shadow: '0px 0px 10px rgba(0, 0, 0, 0.15)',
  }

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
  }

  service.settings = angular.copy(service.defaults);

  service.removeExistingStyle = function () {
    let ex = document.getElementById('robinStyle');
    if (ex) ex.remove();
  }

  service.replaceStyle = function () {
    service.removeExistingStyle();
    let css = service.robinCss(service.settings);
    let tag = `<style id="robinStyle">${css}</style>`;
    angular.element(document).find('head').append(tag);
  }

  service.applySettings = function (settings) {
    if (!settings || typeof settings != 'object') return;
    Object.keys(service.defaults).forEach(function (key) {
      if (settings.hasOwnProperty(key)) service.settings[key] = settings[key];
    });
  }

  service.initialize = function (settings) {
    if (settings) service.applySettings(settings);
    service.replaceStyle();
  }

  service.numberize = (n) => {
    return (n === n + 0 ? n : parseInt(n.toLowerCase().replace('px', '').trim()));
  }

  service.robinCss = function (settings) {
    settings.iconSize = service.numberize(settings.iconSize);
    settings.radius = service.numberize(settings.radius);
    return `
    robin modal-wrapper {
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      display: flex;
      position: fixed;
      align-items: center;
      justify-content: center;
      background-color: ${settings.overlay || 'transparent'};
    }
    robin modal {
      padding: 30px;
      flex-basis: 300px;
      text-align: center;
      color: ${settings.color};
      border: ${settings.border};
      background: ${settings.background};
      border-radius: ${settings.radius}px;
      box-shadow: ${settings.shadow || 'none'};
    }
    robin .robin-icon {
      color: ${settings.iconColor || settings.color};
      font-size: ${settings.iconSize}px;
      margin-bottom: 15px;
    }
    robin button {
      color: ${settings.color};
    }
    robin modal-wrapper {
      transition: ${settings.speed}s ease-in-out all;
    }
    robin modal-wrapper {
      transition: ${settings.speed}s ease-in-out all;
      opacity: 1;
    }
    robin modal-wrapper.ng-enter, robin modal-wrapper.ng-leave.ng-leave-active {
      opacity: 0;
    }
    robin modal-wrapper.ng-enter.ng-enter-active {
      opacity: 1;
    }`;
  }

  return service;
})
