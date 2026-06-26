/**
 * Recharge Slot Injector
 * Reads <script type="text/html" data-recharge-slot="..."> templates and injects
 * their content into matching Recharge Affinity portal slot containers.
 * Acts as a fallback — the Recharge SDK may handle some slots natively.
 */
(function () {
  'use strict';

  function getTemplates() {
    var map = new Map();
    document.querySelectorAll('script[type="text/html"][data-recharge-slot]').forEach(function (tpl) {
      map.set(tpl.getAttribute('data-recharge-slot'), tpl.innerHTML.trim());
    });
    return map;
  }

  function slotMatches(pattern, target) {
    if (pattern === target) return true;
    if (pattern.startsWith('*.')) {
      var suffix = pattern.slice(1);
      return target.endsWith(suffix) || target === suffix.slice(1);
    }
    return false;
  }

  function inject() {
    var templates = getTemplates();
    if (!templates.size) return;

    var targets = document.querySelectorAll(
      '[data-slot], [data-recharge-slot-target], [data-rc-slot]'
    );

    targets.forEach(function (el) {
      if (el._rcSlotInjected) return;

      var name =
        el.getAttribute('data-slot') ||
        el.getAttribute('data-recharge-slot-target') ||
        el.getAttribute('data-rc-slot');

      templates.forEach(function (html, pattern) {
        if (slotMatches(pattern, name)) {
          el.innerHTML = html;
          el._rcSlotInjected = true;

          document.dispatchEvent(
            new CustomEvent('Recharge::slot::mounted', {
              detail: { name: name.split('.').pop(), fullName: name }
            })
          );
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }

  var observer = new MutationObserver(function () {
    inject();
  });

  var root = document.body || document.documentElement;
  observer.observe(root, { childList: true, subtree: true });
})();
