/* ─────────────────────────────────────────
   MOSCATELLI — Private Contact Card
   copy · share · vCard confirmation
───────────────────────────────────────── */

(() => {
  'use strict';

  const contact = {
    fullName: 'Gianluca Moscatelli',
    organisation: 'MOSCATELLI',
    title: 'Founder & Creative Director',
    email: 'gianluca.moscatelli@moscatelli.co',
    phoneDisplay: '+39 328 151 8424',
    phoneCompact: '+393281518424',
    website: 'https://www.moscatelli.co'
  };

  const saveContact = document.querySelector('#saveContact');
  const copyEmail = document.querySelector('#copyEmail');
  const copyPhone = document.querySelector('#copyPhone');
  const shareContact = document.querySelector('#shareContact');

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

  const confirmOn = (button, message) => {
    const target = button?.querySelector('em') || button?.querySelector('.save-contact__meta');
    if (!target) return;

    const original = target.dataset.original || target.textContent;
    target.dataset.original = original;
    target.textContent = message;
    target.classList.add('is-visible');
    button.classList.add('is-confirmed');

    window.clearTimeout(button._moscatelliTimer);
    button._moscatelliTimer = window.setTimeout(() => {
      target.textContent = original;
      target.classList.remove('is-visible');
      button.classList.remove('is-confirmed');
    }, 1500);
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
