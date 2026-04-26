(() => {
  'use strict';

  const contact = {
    email: 'gianluca.moscatelli@moscatelli.co'
  };

  const saveContact = document.querySelector('#saveContact');
  const copyEmail = document.querySelector('#copyEmail');
  const labels = new Map();

  const fallbackCopy = (value) => {
    const element = document.createElement('textarea');
    element.value = value;
    element.setAttribute('readonly', '');
    element.style.position = 'fixed';
    element.style.left = '-9999px';
    element.style.top = '-9999px';
    document.body.appendChild(element);
    element.select();
    let copied = false;
    try {
      copied = document.execCommand('copy');
    } catch {
      copied = false;
    }
    element.remove();
    return copied;
  };

  const copyText = async (value) => {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(value);
        return true;
      } catch {
        return fallbackCopy(value);
      }
    }
    return fallbackCopy(value);
  };

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
  copyEmail?.addEventListener('click', async () => {
    const copied = await copyText(contact.email);
    confirm(copyEmail, copied ? 'Copied' : 'Select');
  });
})();
