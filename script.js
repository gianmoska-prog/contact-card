/* ─────────────────────────────────────────
   MOSCATELLI — Contact Card Interactions
   vCard · Copy · Share
───────────────────────────────────────── */

(() => {
  'use strict';

  const contact = {
    firstName: 'Gianluca',
    lastName: 'Moscatelli',
    fullName: 'Gianluca Moscatelli',
    organisation: 'MOSCATELLI',
    title: 'Founder',
    email: 'gianluca.moscatelli@moscatelli.co',
    phoneDisplay: '+39 328 151 8424',
    phone: '+393281518424',
    website: 'https://www.moscatelli.co',
    linkedIn: 'https://www.linkedin.com/in/gianluca-moscatelli-86b758232/',
    instagram: 'https://www.instagram.com/gianluca__moscatelli',
    locationCity: 'Roma',
    locationCountry: 'Italia'
  };

  const selectors = {
    saveContact: '#saveContact',
    saveLabel: '.btn-save-label',
    copyEmail: '#copyEmail',
    copyPhone: '#copyPhone',
    shareContact: '#shareContact',
    confirm: '.utility-confirm'
  };

  const saveButton = document.querySelector(selectors.saveContact);
  const saveLabel = saveButton?.querySelector(selectors.saveLabel);
  const copyEmailButton = document.querySelector(selectors.copyEmail);
  const copyPhoneButton = document.querySelector(selectors.copyPhone);
  const shareButton = document.querySelector(selectors.shareContact);

  const getCardUrl = () => {
    const href = window.location.href;
    if (!href || href.startsWith('file:')) return contact.website;
    return href.split('#')[0];
  };

  const toVCardLine = (value) => String(value).replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');

  const buildVCard = () => {
    const lines = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `N:${toVCardLine(contact.lastName)};${toVCardLine(contact.firstName)};;;`,
      `FN:${toVCardLine(contact.fullName)}`,
      `ORG:${toVCardLine(contact.organisation)}`,
      `TITLE:${toVCardLine(contact.title)}`,
      `EMAIL;TYPE=INTERNET,WORK:${toVCardLine(contact.email)}`,
      `TEL;TYPE=CELL:${toVCardLine(contact.phoneDisplay)}`,
      `URL;TYPE=Website:${toVCardLine(contact.website)}`,
      `URL;TYPE=LinkedIn:${toVCardLine(contact.linkedIn)}`,
      `URL;TYPE=Instagram:${toVCardLine(contact.instagram)}`,
      `ADR;TYPE=WORK:;;;;${toVCardLine(contact.locationCity)};;${toVCardLine(contact.locationCountry)}`,
      'END:VCARD'
    ];

    return `${lines.join('\r\n')}\r\n`;
  };

  const downloadVCard = () => {
    const blob = new Blob([buildVCard()], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'Gianluca-Moscatelli.vcf';
    link.rel = 'noopener';
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const fallbackCopy = (text) => {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.top = '-9999px';
    area.style.left = '-9999px';
    document.body.appendChild(area);
    area.select();

    let success = false;
    try {
      success = document.execCommand('copy');
    } catch {
      success = false;
    }

    area.remove();
    return success;
  };

  const copyText = async (text) => {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch {
        return fallbackCopy(text);
      }
    }
    return fallbackCopy(text);
  };

  const showUtilityConfirmation = (button, message = 'Copied') => {
    const confirm = button?.querySelector(selectors.confirm);
    if (!confirm) return;

    confirm.textContent = message;
    confirm.classList.add('visible');

    window.clearTimeout(confirm._moscatelliTimer);
    confirm._moscatelliTimer = window.setTimeout(() => {
      confirm.classList.remove('visible');
      window.setTimeout(() => {
        confirm.textContent = '';
      }, 300);
    }, 1400);
  };

  const showSaveConfirmation = () => {
    if (!saveButton || !saveLabel) return;

    const original = saveLabel.textContent;
    saveButton.classList.add('is-confirmed');
    saveLabel.textContent = 'Contact Ready';

    window.clearTimeout(saveButton._moscatelliTimer);
    saveButton._moscatelliTimer = window.setTimeout(() => {
      saveLabel.textContent = original;
      saveButton.classList.remove('is-confirmed');
    }, 1600);
  };

  saveButton?.addEventListener('click', () => {
    downloadVCard();
    showSaveConfirmation();
  });

  copyEmailButton?.addEventListener('click', async () => {
    const copied = await copyText(contact.email);
    showUtilityConfirmation(copyEmailButton, copied ? 'Copied' : 'Select');
  });

  copyPhoneButton?.addEventListener('click', async () => {
    const copied = await copyText(contact.phoneDisplay);
    showUtilityConfirmation(copyPhoneButton, copied ? 'Copied' : 'Select');
  });

  shareButton?.addEventListener('click', async () => {
    const shareData = {
      title: `${contact.fullName} — ${contact.organisation}`,
      text: `${contact.fullName}, ${contact.title} at ${contact.organisation}`,
      url: getCardUrl()
    };

    if (navigator.share && navigator.canShare?.(shareData) !== false) {
      try {
        await navigator.share(shareData);
        showUtilityConfirmation(shareButton, 'Shared');
        return;
      } catch (error) {
        if (error?.name === 'AbortError') return;
      }
    }

    const copied = await copyText(shareData.url);
    showUtilityConfirmation(shareButton, copied ? 'Link Copied' : 'Copy Link');
  });
})();
