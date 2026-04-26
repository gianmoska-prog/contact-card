(() => {
  'use strict';

  const saveContact = document.querySelector('#saveContact');
  const labels = new Map();

  const confirm = (element, message) => {
    if (!element) return;
    if (!labels.has(element)) labels.set(element, element.textContent.trim());
    element.textContent = message;
    element.classList.add('is-confirmed');
    clearTimeout(element._timer);
    element._timer = setTimeout(() => {
      element.textContent = labels.get(element);
      element.classList.remove('is-confirmed');
    }, 1400);
  };

  saveContact?.addEventListener('click', () => confirm(saveContact, 'Ready'));
})();
