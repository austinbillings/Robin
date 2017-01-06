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
    accent: 'cyan',
    background: 'white',
    defaultIcon: 'comment-o',
    overlay: 'rgba(0, 0, 0, 0.8)',
    shadow: '0px 0px 10px rgba(0, 0, 0, 0.15)',
  }

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
    for (let key in service.defaults) {
      if (key && key in settings) service.settings[key] = settings[key];
    }
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

    robin input {
      width: 100%;
      margin: 10px auto 20px;
      padding: 10px;
      border-radius: 0;
      border: none;
      border-bottom: 1px solid ${settings.color};
      background: transparent;
      color: ${settings.color};
    }

    robin button {
      color: ${settings.color};
    }

    robin .robin-icon {
      font-size: ${settings.iconSize}px;
    }

    robin modal-wrapper,
    robin modal-wrapper.ng-enter.ng-enter-active {
      transition: ${settings.speed}s ease-in-out all;
      opacity: 1;
    }

    robin modal-wrapper.ng-enter,
    robin modal-wrapper.ng-leave.ng-leave-active {
      opacity: 0;
    }
    `;
  }

  return service;
})
