/* MOSCATELLI — Contact Card v4 */
(() => {
  'use strict';

  const contact = {
    fullName: 'Gianluca Moscatelli',
    organisation: 'MOSCATELLI',
    title: 'Founder & Creative Director',
    email: 'gianluca.moscatelli@moscatelli.co',
    phoneDisplay: '+39 328 151 8424'
  };

  const shareContact = document.querySelector('#shareContact');
  const copyEmail = document.querySelector('#copyEmail');
  const copyPhone = document.querySelector('#copyPhone');
  const saveContact = document.querySelector('#saveContact');

  const originalLabels = new Map();
  const canonicalFallback = 'https://www.moscatelli.co/gianluca';

  const pageUrl = () => {
    const current = window.location.href;
    if (!current || current.startsWith('file:')) return canonicalFallback;
    return current.split('#')[0];
  };

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

  const confirmOn = (element, message) => {
    if (!element) return;
    if (!originalLabels.has(element)) {
      originalLabels.set(element, element.textContent.trim());
    }
    element.textContent = message;
    element.classList.add('is-confirmed');
    window.clearTimeout(element._moscatelliTimer);
    element._moscatelliTimer = window.setTimeout(() => {
      element.textContent = originalLabels.get(element);
      element.classList.remove('is-confirmed');
    }, 1450);
  };

  saveContact?.addEventListener('click', () => {
    confirmOn(saveContact, 'Ready');
  });

  copyEmail?.addEventListener('click', async () => {
    const copied = await copyText(contact.email);
    confirmOn(copyEmail, copied ? 'Copied' : 'Select');
  });

  copyPhone?.addEventListener('click', async () => {
    const copied = await copyText(contact.phoneDisplay);
    confirmOn(copyPhone, copied ? 'Copied' : 'Select');
  });

  shareContact?.addEventListener('click', async () => {
    const data = {
      title: `${contact.fullName} — ${contact.organisation}`,
      text: `${contact.fullName}, ${contact.title}`,
      url: pageUrl()
    };

    if (navigator.share && navigator.canShare?.(data) !== false) {
      try {
        await navigator.share(data);
        confirmOn(shareContact, 'Shared');
        return;
      } catch (error) {
        if (error?.name === 'AbortError') return;
      }
    }

    const copied = await copyText(data.url);
    confirmOn(shareContact, copied ? 'Link Copied' : 'Copy Link');
  });
})();
