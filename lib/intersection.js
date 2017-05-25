"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.observe = observe;
exports.unobserve = unobserve;
var INSTANCE_MAP = new Map();
var OBSERVER_MAP = new Map();

/**
 * Monitor element, and trigger callback when element becomes visible
 * @param element {HTMLElement}
 * @param callback {Function} - Called with inView
 * @param threshold {Number} Number between 0 and 1, indicating how much of the element should be visible before triggering
 */
function observe(element, callback) {
  var threshold = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  if (!element || !callback) return;
  var observerInstance = OBSERVER_MAP.get(threshold);
  if (!observerInstance) {
    observerInstance = new IntersectionObserver(onChange, { threshold: threshold });
    OBSERVER_MAP.set(threshold, observerInstance);
  }

  INSTANCE_MAP.set(element, {
    callback: callback,
    visible: false,
    threshold: threshold
  });
  observerInstance.observe(element);
}

/**
 * Stop observing an element. If an element is removed from the DOM or otherwise destroyed,
 * make sure to call this method.
 * @param element {HTMLElement}
 */
function unobserve(element) {
  if (!element) return;
  var instance = INSTANCE_MAP.get(element);

  if (instance) {
    INSTANCE_MAP.delete(element);

    var observerInstance = OBSERVER_MAP.get(instance.threshold);
    if (observerInstance) {
      observerInstance.unobserve(element);
    }

    // Check if we are stilling observing any elements with the same threshold.
    var itemsLeft = false;
    INSTANCE_MAP.forEach(function (item) {
      if (item.threshold === instance.threshold) {
        itemsLeft = true;
      }
    });

    if (observerInstance && !itemsLeft) {
      // No more elements to observe for threshold, disconnect observer
      observerInstance.disconnect();
      OBSERVER_MAP.delete(instance.threshold);
    }
  }
}

function onChange(changes) {
  changes.forEach(function (intersection) {
    if (INSTANCE_MAP.has(intersection.target)) {
      var isIntersecting = intersection.isIntersecting,
          intersectionRatio = intersection.intersectionRatio,
          target = intersection.target;

      var _INSTANCE_MAP$get = INSTANCE_MAP.get(target),
          callback = _INSTANCE_MAP$get.callback,
          visible = _INSTANCE_MAP$get.visible,
          threshold = _INSTANCE_MAP$get.threshold;

      // Trigger on 0 ratio only when not visible. This is fallback for browsers without isIntersecting support


      var inView = visible ? intersectionRatio > threshold : intersectionRatio >= threshold;

      if (isIntersecting !== undefined) {
        // If isIntersecting is defined, ensure that the element is actually intersecting.
        // Otherwise it reports a threshold of 0
        inView = inView && isIntersecting;
      }

      INSTANCE_MAP.set(target, {
        callback: callback,
        visible: inView,
        threshold: threshold
      });

      if (callback) {
        callback(inView);
      }
    }
  });
}

exports.default = {
  observe: observe,
  unobserve: unobserve
};