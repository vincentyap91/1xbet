/* deposit.js — multi-step deposit flow (methods → details → success) */
(function () {
  'use strict';

  if (document.body.dataset.page !== 'deposit') return;

  var STEP_MS = 220;
  var SUBMIT_MS = 1400;

  var METHODS = {
    touchngo: {
      id: 'touchngo',
      name: "Touch 'n Go",
      type: 'ewallet',
      min: 10,
      max: 5000,
      logo: 'assets/images/payments/touchngo.png',
      logoType: 'img',
      walletNumber: '60123456789',
      instructions: 'Scan the QR code with your Touch \'n Go app and transfer the exact deposit amount.',
      fields: ['amount', 'qr', 'wallet']
    },
    grabpay: {
      id: 'grabpay',
      name: 'GrabPay',
      type: 'ewallet',
      min: 10,
      max: 5000,
      logo: 'assets/images/payments/grabpay.png',
      logoType: 'img',
      walletNumber: '60198765432',
      instructions: 'Scan the QR code with GrabPay and complete the transfer.',
      fields: ['amount', 'qr', 'wallet']
    },
    duitnow: {
      id: 'duitnow',
      name: 'DuitNow',
      type: 'ewallet',
      min: 10,
      max: 10000,
      logo: 'assets/images/payments/duitnow.png',
      logoType: 'img',
      walletNumber: 'DUITNOW@1XBET',
      instructions: 'Use DuitNow to transfer funds to the wallet ID below.',
      fields: ['amount', 'qr', 'wallet']
    },
    help2pay: {
      id: 'help2pay',
      name: 'Help2Pay',
      type: 'ewallet',
      min: 20,
      max: 15000,
      logo: 'assets/images/payments/help2pay.png',
      logoType: 'img',
      walletNumber: 'H2P-1733760863',
      instructions: 'Transfer via Help2Pay using the wallet reference below.',
      fields: ['amount', 'wallet']
    },
    visa: {
      id: 'visa',
      name: 'Visa',
      type: 'card',
      min: 10,
      max: 20000,
      logoType: 'placeholder',
      logoStyle: 'background:linear-gradient(135deg,#1a1f71 0%,#1a1f71 100%);',
      logoText: 'Visa',
      instructions: 'Enter the amount and continue to the secure card payment page.',
      fields: ['amount']
    },
    mastercard: {
      id: 'mastercard',
      name: 'Mastercard',
      type: 'card',
      min: 10,
      max: 20000,
      logoType: 'placeholder',
      logoStyle: 'background:linear-gradient(135deg,#eb001b 0%,#f79e1b 100%);',
      logoText: 'Mastercard',
      instructions: 'Enter the amount and continue to the secure card payment page.',
      fields: ['amount']
    },
    fpx: {
      id: 'fpx',
      name: 'FPX',
      type: 'banking',
      min: 20,
      max: 30000,
      logoType: 'placeholder',
      logoStyle: 'background:linear-gradient(135deg,#003087 0%,#001f5c 100%);',
      logoText: 'FPX',
      instructions: 'You will be redirected to the FPX payment gateway after confirming.',
      fields: ['amount']
    },
    'bank-transfer': {
      id: 'bank-transfer',
      name: 'Bank Transfer',
      type: 'transfer',
      min: 50,
      max: 50000,
      logoType: 'placeholder',
      logoStyle: 'background:linear-gradient(135deg,#003087 0%,#001f5c 100%);',
      logoText: 'FPX',
      bankName: 'Maybank',
      accountNumber: '512345678901',
      accountHolder: '1xBet Malaysia Sdn Bhd',
      instructions: 'Transfer the exact amount to the account below, then upload your payment receipt.',
      fields: ['amount', 'bank', 'qr', 'reference', 'upload']
    },
    bitcoin: {
      id: 'bitcoin',
      name: 'Bitcoin',
      type: 'crypto',
      min: 50,
      max: 100000,
      logo: 'assets/images/payments/bitcoin.png',
      logoType: 'img',
      network: 'Bitcoin',
      address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      instructions: 'Send only Bitcoin (BTC) to the address below. Include network fees in your transfer.',
      fields: ['amount', 'crypto', 'qr']
    },
    ethereum: {
      id: 'ethereum',
      name: 'Ethereum',
      type: 'crypto',
      min: 50,
      max: 100000,
      logoType: 'placeholder',
      logoStyle: 'background:linear-gradient(135deg,#627eea 0%,#3c56c8 100%);',
      logoText: 'ETH',
      network: 'Ethereum (ERC-20)',
      address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
      instructions: 'Send only Ethereum (ETH) on the ERC-20 network.',
      fields: ['amount', 'crypto', 'qr']
    },
    'tether-erc20': {
      id: 'tether-erc20',
      name: 'Tether ERC20',
      type: 'crypto',
      min: 20,
      max: 100000,
      logo: 'assets/images/payments/tether.png',
      logoType: 'img',
      network: 'Ethereum (ERC-20)',
      address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
      instructions: 'Send only USDT on the ERC-20 network.',
      fields: ['amount', 'crypto', 'qr']
    },
    'tether-trc20': {
      id: 'tether-trc20',
      name: 'Tether TRC20',
      type: 'crypto',
      min: 20,
      max: 100000,
      logo: 'assets/images/payments/tether.png',
      logoType: 'img',
      network: 'TRON (TRC-20)',
      address: 'TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf',
      instructions: 'Send only USDT on the TRC-20 network.',
      fields: ['amount', 'crypto', 'qr']
    },
    usdc: {
      id: 'usdc',
      name: 'USD Coin (USDC)',
      type: 'crypto',
      min: 20,
      max: 100000,
      logoType: 'placeholder',
      logoStyle: 'background:linear-gradient(135deg,#2775ca 0%,#1a5da8 100%);',
      logoText: 'USDC',
      network: 'Ethereum (ERC-20)',
      address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb2',
      instructions: 'Send only USDC on the ERC-20 network.',
      fields: ['amount', 'crypto', 'qr']
    },
    litecoin: {
      id: 'litecoin',
      name: 'Litecoin',
      type: 'crypto',
      min: 20,
      max: 50000,
      logoType: 'placeholder',
      logoStyle: 'background:linear-gradient(135deg,#bfbbbb 0%,#9a9797 100%);color:#333;',
      logoText: 'LTC',
      network: 'Litecoin',
      address: 'ltc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      instructions: 'Send only Litecoin (LTC) to the address below.',
      fields: ['amount', 'crypto', 'qr']
    }
  };

  var stepMethods = document.getElementById('dep-step-methods');
  var stepDetails = document.getElementById('dep-step-details');
  var stepSuccess = document.getElementById('dep-step-success');
  var detailsContent = document.getElementById('dep-details-content');
  var detailsTitle = document.getElementById('dep-details-title');
  var detailsSub = document.getElementById('dep-details-sub');
  var submitBtn = document.getElementById('dep-details-submit');
  var submitLabel = submitBtn && submitBtn.querySelector('.dep-btn-label');
  var submitSpinner = submitBtn && submitBtn.querySelector('.dep-btn-spinner');

  var state = {
    methodId: null,
    amount: 50,
    reference: '',
    file: null,
    fileName: ''
  };

  var isSubmitting = false;
  var activeStep = 'methods';

  function toast(msg) {
    if (typeof window.showToast === 'function') {
      window.showToast(msg);
    }
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function getMethod() {
    return state.methodId ? METHODS[state.methodId] : null;
  }

  function methodLogoHtml(method, large) {
    if (method.logoType === 'img') {
      return '<img class="dep-method-logo-img' + (large ? ' dep-method-logo-img--lg' : '') + '" src="' + escapeHtml(method.logo) + '" alt="" />';
    }
    return '<div class="pay-logo-placeholder' + (large ? ' dep-method-logo-placeholder--lg' : '') + '" style="' + method.logoStyle + '">' + escapeHtml(method.logoText) + '</div>';
  }

  function showStep(step) {
    var steps = [
      { el: stepMethods, name: 'methods' },
      { el: stepDetails, name: 'details' },
      { el: stepSuccess, name: 'success' }
    ];

    steps.forEach(function (s) {
      if (!s.el) return;
      var isActive = s.name === step;
      s.el.hidden = !isActive;
      s.el.classList.toggle('is-active', isActive);
      s.el.classList.toggle('is-entering', isActive);
    });

    requestAnimationFrame(function () {
      steps.forEach(function (s) {
        if (s.el) s.el.classList.remove('is-entering');
      });
    });

    activeStep = step;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function renderMethodCard(method) {
    return (
      '<div class="dep-selected-method is-selected">' +
        '<div class="dep-selected-method-logo">' + methodLogoHtml(method, true) + '</div>' +
        '<div class="dep-selected-method-info">' +
          '<div class="dep-selected-method-name">' + escapeHtml(method.name) + '</div>' +
          '<div class="dep-selected-method-limits">' +
            '<span>Min <strong>' + method.min + ' MYR</strong></span>' +
            '<span class="dep-selected-method-sep">/</span>' +
            '<span>Max <strong>' + method.max.toLocaleString() + ' MYR</strong></span>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  var PRESET_AMOUNTS = [5, 10, 50, 100, 500, 1000];

  function renderPresetButtons() {
    return PRESET_AMOUNTS.map(function (amt) {
      var label = amt >= 1000 ? '1k' : String(amt);
      var active = state.amount === amt ? ' is-active' : '';
      return '<button type="button" class="dep-preset-btn' + active + '" data-dep-preset="' + amt + '">' + label + '</button>';
    }).join('');
  }

  function syncPresetButtons(amount) {
    var buttons = document.querySelectorAll('[data-dep-preset]');
    buttons.forEach(function (btn) {
      btn.classList.toggle('is-active', Number(btn.getAttribute('data-dep-preset')) === amount);
    });
  }

  function renderAmountSection(method) {
    return (
      '<fieldset class="profile-fieldset dep-details-section">' +
        '<legend>Deposit amount</legend>' +
        '<div class="profile-field dep-amount-field" id="dep-field-amount">' +
          '<label for="dep-amount-input">Amount (MYR)</label>' +
          '<div class="dep-preset-grid" aria-label="Quick deposit amounts">' +
            renderPresetButtons() +
          '</div>' +
          '<div class="dep-amount-input-wrap">' +
            '<span class="dep-amount-currency" aria-hidden="true">MYR</span>' +
            '<input type="number" id="dep-amount-input" class="dep-amount-input" min="' + method.min + '" max="' + method.max + '" step="1" value="' + state.amount + '" inputmode="decimal" placeholder="0" />' +
          '</div>' +
          '<span class="profile-field-error" id="dep-amount-error" role="alert" hidden></span>' +
          '<p class="dep-amount-hint">Allowed range: ' + method.min + ' – ' + method.max.toLocaleString() + ' MYR</p>' +
        '</div>' +
      '</fieldset>'
    );
  }

  function renderQrSection(label) {
    return (
      '<fieldset class="profile-fieldset dep-details-section">' +
        '<legend>' + escapeHtml(label || 'QR code') + '</legend>' +
        '<div class="dep-qr-wrap">' +
          '<div class="dep-qr-frame">' +
            '<img class="dep-qr-image" src="assets/images/qr-code.jpg" alt="Payment QR code" width="180" height="180" />' +
          '</div>' +
          '<a href="assets/images/qr-code.jpg" download="deposit-qr-code.jpg" class="dep-qr-download">' +
            '<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M7 2v6M4.5 5.5L7 8l2.5-2.5M3 11h8" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
            'Download QR Code' +
          '</a>' +
        '</div>' +
      '</fieldset>'
    );
  }

  function renderCopyRow(label, value, id) {
    return (
      '<div class="dep-info-row">' +
        '<div class="dep-info-main">' +
          '<span class="dep-info-label">' + escapeHtml(label) + '</span>' +
          '<span class="dep-info-value" id="' + id + '">' + escapeHtml(value) + '</span>' +
        '</div>' +
        '<button type="button" class="dep-copy-btn" data-dep-copy-target="' + id + '" aria-label="Copy ' + escapeHtml(label) + '">' +
          '<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><rect x="4" y="4" width="8" height="8" rx="1" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M3 10V3a1 1 0 011-1h7" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>' +
        '</button>' +
      '</div>'
    );
  }

  function renderBankSection(method) {
    return (
      '<fieldset class="profile-fieldset dep-details-section">' +
        '<legend>Bank account information</legend>' +
        '<div class="dep-info-card">' +
          renderCopyRow('Bank name', method.bankName, 'dep-bank-name') +
          renderCopyRow('Account number', method.accountNumber, 'dep-account-number') +
          renderCopyRow('Account holder', method.accountHolder, 'dep-account-holder') +
        '</div>' +
      '</fieldset>'
    );
  }

  function renderWalletSection(method) {
    return (
      '<fieldset class="profile-fieldset dep-details-section">' +
        '<legend>Wallet information</legend>' +
        '<div class="dep-info-card">' +
          renderCopyRow('Wallet number', method.walletNumber, 'dep-wallet-number') +
        '</div>' +
      '</fieldset>'
    );
  }

  function renderCryptoSection(method) {
    return (
      '<fieldset class="profile-fieldset dep-details-section">' +
        '<legend>Cryptocurrency details</legend>' +
        '<div class="dep-info-card">' +
          renderCopyRow('Network', method.network, 'dep-crypto-network') +
          renderCopyRow('Wallet address', method.address, 'dep-crypto-address') +
        '</div>' +
      '</fieldset>'
    );
  }

  function renderReferenceSection() {
    return (
      '<fieldset class="profile-fieldset dep-details-section">' +
        '<legend>Reference / Transaction ID <span class="dep-optional">(optional)</span></legend>' +
        '<div class="profile-field" id="dep-field-reference">' +
          '<label for="dep-reference-input">Transaction reference</label>' +
          '<input type="text" id="dep-reference-input" class="profile-input" placeholder="Enter reference or transaction ID" value="' + escapeHtml(state.reference) + '" autocomplete="off" />' +
        '</div>' +
      '</fieldset>'
    );
  }

  function renderUploadSection() {
    var fileLabel = state.fileName || 'Tap to upload file';
    var hasFile = !!state.fileName;
    return (
      '<fieldset class="profile-fieldset dep-details-section">' +
        '<legend>Upload payment receipt</legend>' +
        '<div class="profile-field" id="dep-field-upload">' +
          '<label class="dep-upload-zone' + (hasFile ? ' has-file' : '') + '" id="dep-upload-zone" tabindex="0" role="button">' +
            '<input type="file" id="dep-upload-input" accept="image/*,.pdf" hidden />' +
            '<span class="dep-upload-inner">' +
              '<span class="dep-upload-icon-wrap" aria-hidden="true">' +
                '<svg class="dep-upload-icon-default" width="22" height="22" viewBox="0 0 24 24"><path d="M12 16V4m0 0l-4 4m4-4l4 4M4 18v2h16v-2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
                '<svg class="dep-upload-icon-success" width="22" height="22" viewBox="0 0 24 24"><path d="M7 12.5l3.5 3.5L17 9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
              '</span>' +
              '<span class="dep-upload-text" id="dep-upload-label">' + escapeHtml(fileLabel) + '</span>' +
              '<span class="dep-upload-hint">Upload a screenshot or PDF of your payment receipt</span>' +
              '<span class="dep-upload-formats">PNG, JPG, PDF</span>' +
            '</span>' +
          '</label>' +
          '<span class="profile-field-error" id="dep-upload-error" role="alert" hidden></span>' +
        '</div>' +
      '</fieldset>'
    );
  }

  function highlightNotes(text) {
    var escaped = escapeHtml(text);
    return escaped.replace(/Scan the QR code/gi, '<span class="dep-notes-accent">Scan the QR code</span>');
  }

  function renderInstructions(method) {
    if (!method.instructions) return '';
    return (
      '<div class="dep-promo-banner dep-notes-banner">' +
        '<strong>Notes:</strong> ' + highlightNotes(method.instructions) +
      '</div>'
    );
  }

  function renderDetailsForm(method) {
    var html = renderMethodCard(method) + renderInstructions(method);

    if (method.fields.indexOf('amount') !== -1) {
      html += renderAmountSection(method);
    }
    if (method.fields.indexOf('bank') !== -1) {
      html += renderBankSection(method);
    }
    if (method.fields.indexOf('wallet') !== -1) {
      html += renderWalletSection(method);
    }
    if (method.fields.indexOf('crypto') !== -1) {
      html += renderCryptoSection(method);
    }
    if (method.fields.indexOf('qr') !== -1) {
      html += renderQrSection(method.type === 'crypto' ? 'Payment QR code' : 'QR code');
    }
    if (method.fields.indexOf('reference') !== -1) {
      html += renderReferenceSection();
    }
    if (method.fields.indexOf('upload') !== -1) {
      html += renderUploadSection();
    }

    return html;
  }

  function openDetails(methodId) {
    var method = METHODS[methodId];
    if (!method) return;

    state.methodId = methodId;

    if (detailsTitle) detailsTitle.textContent = 'Deposit via ' + method.name;
    if (detailsSub) detailsSub.textContent = 'Enter your deposit details to continue';

    if (submitLabel) {
      submitLabel.textContent = method.type === 'card' || method.type === 'banking' ? 'Continue' : 'Submit deposit';
    }

    if (detailsContent) {
      detailsContent.innerHTML = renderDetailsForm(method);
      bindFieldEvents();
    }

    showStep('details');
  }

  function bindFieldEvents() {
    var amountInput = document.getElementById('dep-amount-input');
    var referenceInput = document.getElementById('dep-reference-input');
    var uploadInput = document.getElementById('dep-upload-input');
    var uploadZone = document.getElementById('dep-upload-zone');

    if (amountInput) {
      amountInput.value = String(state.amount);
      amountInput.addEventListener('input', function () {
        state.amount = Number(amountInput.value) || 0;
        syncPresetButtons(state.amount);
        clearFieldError('dep-field-amount', 'dep-amount-error');
      });
    }

    if (referenceInput) {
      referenceInput.value = state.reference;
      referenceInput.addEventListener('input', function () {
        state.reference = referenceInput.value;
      });
    }

    if (uploadInput && uploadZone) {
      uploadZone.addEventListener('click', function () { uploadInput.click(); });
      uploadZone.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          uploadInput.click();
        }
      });
      uploadInput.addEventListener('change', function () {
        var file = uploadInput.files && uploadInput.files[0];
        state.file = file || null;
        state.fileName = file ? file.name : '';
        var label = document.getElementById('dep-upload-label');
        var hint = uploadZone.querySelector('.dep-upload-hint');
        if (label) label.textContent = state.fileName || 'Tap to upload file';
        if (hint) {
          hint.textContent = file
            ? 'Tap again to replace this file'
            : 'Upload a screenshot or PDF of your payment receipt';
        }
        uploadZone.classList.toggle('has-file', !!file);
        clearFieldError('dep-field-upload', 'dep-upload-error');
      });
      if (state.fileName) {
        var label = document.getElementById('dep-upload-label');
        if (label) label.textContent = state.fileName;
        uploadZone.classList.add('has-file');
      }
    }
  }

  function handleDetailsClick(e) {
    var presetBtn = e.target.closest('[data-dep-preset]');
    var copyBtn = e.target.closest('[data-dep-copy-target]');
    var amountInput = document.getElementById('dep-amount-input');

    if (presetBtn && amountInput) {
      var method = getMethod();
      var min = method ? method.min : 1;
      var max = method ? method.max : 999999;
      var preset = Number(presetBtn.getAttribute('data-dep-preset'));
      var next = Math.min(max, Math.max(min, preset));
      amountInput.value = String(next);
      state.amount = next;
      syncPresetButtons(next);
      clearFieldError('dep-field-amount', 'dep-amount-error');
      return;
    }

    if (copyBtn) {
      var targetId = copyBtn.getAttribute('data-dep-copy-target');
      var target = document.getElementById(targetId);
      if (target) copyText(target.textContent);
      return;
    }
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        toast('Copied successfully');
      }).catch(function () {
        toast('Copied successfully');
      });
    } else {
      toast('Copied successfully');
    }
  }

  function setFieldError(fieldId, errorId, message) {
    var field = document.getElementById(fieldId);
    var error = document.getElementById(errorId);
    if (field) field.classList.add('has-error');
    if (error) {
      error.textContent = message;
      error.hidden = false;
    }
  }

  function clearFieldError(fieldId, errorId) {
    var field = document.getElementById(fieldId);
    var error = document.getElementById(errorId);
    if (field) field.classList.remove('has-error');
    if (error) {
      error.textContent = '';
      error.hidden = true;
    }
  }

  function validate() {
    var method = getMethod();
    if (!method) return false;

    var valid = true;
    var amountInput = document.getElementById('dep-amount-input');

    if (method.fields.indexOf('amount') !== -1 && amountInput) {
      var amount = Number(amountInput.value);
      state.amount = amount;
      if (!amount || amount <= 0) {
        setFieldError('dep-field-amount', 'dep-amount-error', 'Please enter a deposit amount.');
        valid = false;
      } else if (amount < method.min) {
        setFieldError('dep-field-amount', 'dep-amount-error', 'Minimum deposit is ' + method.min + ' MYR.');
        valid = false;
      } else if (amount > method.max) {
        setFieldError('dep-field-amount', 'dep-amount-error', 'Maximum deposit is ' + method.max.toLocaleString() + ' MYR.');
        valid = false;
      } else {
        clearFieldError('dep-field-amount', 'dep-amount-error');
      }
    }

    if (method.fields.indexOf('upload') !== -1 && !state.file) {
      setFieldError('dep-field-upload', 'dep-upload-error', 'Please upload your payment receipt.');
      valid = false;
    } else {
      clearFieldError('dep-field-upload', 'dep-upload-error');
    }

    return valid;
  }

  function setSubmitting(loading) {
    isSubmitting = loading;
    if (!submitBtn) return;
    var method = getMethod();
    submitBtn.disabled = loading;
    submitBtn.classList.toggle('is-loading', loading);
    if (submitLabel) {
      if (loading) {
        submitLabel.textContent = 'Processing…';
      } else if (method) {
        submitLabel.textContent = method.type === 'card' || method.type === 'banking' ? 'Continue' : 'Submit deposit';
      }
    }
    if (submitSpinner) submitSpinner.hidden = !loading;
  }

  function submitDeposit() {
    if (isSubmitting) return;
    if (!validate()) return;

    setSubmitting(true);

    setTimeout(function () {
      setSubmitting(false);
      showStep('success');
      toast('Deposit submitted — demo only. No real transaction has been made.');
    }, SUBMIT_MS);
  }

  function goBack() {
    showStep('methods');
  }

  function resetFlow() {
    state.methodId = null;
    state.amount = 50;
    state.reference = '';
    state.file = null;
    state.fileName = '';
    isSubmitting = false;
    if (detailsContent) detailsContent.innerHTML = '';
    showStep('methods');
  }

  function initMethodSelection() {
    if (!stepMethods) return;

    stepMethods.addEventListener('click', function (e) {
      var card = e.target.closest('.pay-method-card[data-method-id]');
      if (!card || activeStep !== 'methods') return;
      openDetails(card.dataset.methodId);
    });

    stepMethods.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      var card = e.target.closest('.pay-method-card[data-method-id]');
      if (!card || activeStep !== 'methods') return;
      e.preventDefault();
      openDetails(card.dataset.methodId);
    });
  }

  function initActions() {
    var backTop = document.getElementById('dep-details-back');
    var backBottom = document.getElementById('dep-details-back-bottom');
    var successAgain = document.getElementById('dep-success-again');

    if (backTop) backTop.addEventListener('click', goBack);
    if (backBottom) backBottom.addEventListener('click', goBack);
    if (submitBtn) submitBtn.addEventListener('click', submitDeposit);
    if (successAgain) successAgain.addEventListener('click', resetFlow);
    if (detailsContent) detailsContent.addEventListener('click', handleDetailsClick);
  }

  initMethodSelection();
  initActions();
})();
