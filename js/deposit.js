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
      min: 3,
      max: 100000,
      currency: 'MYR',
      logoType: 'placeholder',
      logoStyle: 'background:linear-gradient(135deg,#003087 0%,#001f5c 100%);',
      logoText: 'Bank',
      instructions: 'Upload a screenshot of your payment receipt to notify us of your payment.',
      fields: ['amount', 'bank', 'reference', 'upload'],
      banks: [
        {
          id: 'aba',
          name: 'ABA BANK',
          min: 3,
          max: 100000,
          accountNumber: '013374386',
          accountName: 'CHON NAM',
          logo: 'assets/images/payments/banks/aba.svg'
        },
        {
          id: 'wing',
          name: 'WING BANK',
          min: 3,
          max: 100000,
          accountNumber: '0011223344',
          accountName: 'CHON NAM',
          logo: 'assets/images/payments/banks/wing.svg'
        },
        {
          id: 'acleda',
          name: 'ACLEDA BANK',
          min: 3,
          max: 100000,
          accountNumber: '0987654321',
          accountName: 'CHON NAM',
          logo: 'assets/images/payments/banks/acleda.svg'
        }
      ]
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
    bankId: null,
    amount: 0,
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

  function getCurrency(method) {
    return (method && method.currency) || 'MYR';
  }

  function getSelectedBank(method) {
    if (!method || !method.banks || !method.banks.length) return null;
    var id = state.bankId || method.banks[0].id;
    for (var i = 0; i < method.banks.length; i++) {
      if (method.banks[i].id === id) return method.banks[i];
    }
    return method.banks[0];
  }

  function getActiveLimits(method) {
    var bank = getSelectedBank(method);
    if (bank) {
      return { min: bank.min, max: bank.max };
    }
    return { min: method.min, max: method.max };
  }

  function formatAmount(value) {
    var n = Number(value);
    if (!isFinite(n)) n = 0;
    return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function formatRange(min, max) {
    return min + ' - ' + max.toLocaleString();
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
            '<span>Min <strong>' + method.min + ' ' + getCurrency(method) + '</strong></span>' +
            '<span class="dep-selected-method-sep">/</span>' +
            '<span>Max <strong>' + method.max.toLocaleString() + ' ' + getCurrency(method) + '</strong></span>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  var PRESET_AMOUNTS = [5, 10, 50, 100, 500, 1000];

  function renderPresetButtons() {
    return PRESET_AMOUNTS.map(function (amt) {
      var label = amt >= 1000 ? '1k' : String(amt);
      var active = Number(state.amount) === amt ? ' is-active' : '';
      return '<button type="button" class="dep-preset-btn' + active + '" data-dep-preset="' + amt + '">' + label + '</button>';
    }).join('');
  }

  function syncPresetButtons(amount) {
    var buttons = document.querySelectorAll('[data-dep-preset]');
    buttons.forEach(function (btn) {
      btn.classList.toggle('is-active', Number(btn.getAttribute('data-dep-preset')) === amount);
    });
  }

  function syncAmountDisplay(amount) {
    var el = document.getElementById('dep-amount-display-value');
    if (el) el.textContent = formatAmount(amount);
  }

  function renderSummary(method) {
    var limits = getActiveLimits(method);
    var balanceText = '0.00';
    var headerBal = document.querySelector('.header-balance-row span:last-child');
    if (headerBal) {
      balanceText = headerBal.textContent.trim();
      if (balanceText && balanceText.indexOf('.') === -1) balanceText = balanceText + '.00';
    }
    return (
      '<div class="dep-summary" aria-label="Deposit summary">' +
        '<div class="dep-summary-row"><span>Balance</span><strong>' + escapeHtml(balanceText) + '</strong></div>' +
        '<div class="dep-summary-row"><span>Min Deposit</span><strong id="dep-summary-min">' + limits.min + '</strong></div>' +
      '</div>'
    );
  }

  function renderBankPicker(method) {
    if (!method.banks || !method.banks.length) return '';
    var selected = getSelectedBank(method);
    var cards = method.banks.map(function (bank) {
      var isActive = selected && selected.id === bank.id;
      return (
        '<button type="button" class="dep-bank-card' + (isActive ? ' is-selected' : '') + '" data-dep-bank="' + escapeHtml(bank.id) + '" aria-pressed="' + (isActive ? 'true' : 'false') + '">' +
          '<span class="dep-bank-card-logo"><img src="' + escapeHtml(bank.logo) + '" alt="" width="72" height="24" /></span>' +
          '<span class="dep-bank-card-name">' + escapeHtml(bank.name) + '</span>' +
          '<span class="dep-bank-card-range">' + formatRange(bank.min, bank.max) + '</span>' +
        '</button>'
      );
    }).join('');

    return (
      '<section class="dep-panel dep-bank-pick" aria-labelledby="dep-bank-pick-title">' +
        '<h2 class="dep-panel-title" id="dep-bank-pick-title">Select Bank</h2>' +
        '<div class="dep-bank-grid" role="group" aria-label="Banks">' + cards + '</div>' +
      '</section>'
    );
  }

  function renderAmountSection(method) {
    var currency = getCurrency(method);
    var limits = getActiveLimits(method);
    var amountValue = state.amount > 0 ? String(state.amount) : '';
    return (
      '<section class="dep-panel dep-amount-panel" aria-labelledby="dep-amount-title">' +
        '<h2 class="dep-panel-title" id="dep-amount-title">Please Select or Enter Deposit Amount</h2>' +
        '<div class="profile-field dep-amount-field" id="dep-field-amount">' +
          '<div class="dep-preset-grid" aria-label="Quick deposit amounts">' +
            renderPresetButtons() +
          '</div>' +
          '<div class="dep-amount-input-wrap">' +
            '<span class="dep-amount-currency" aria-hidden="true">' + escapeHtml(currency) + '</span>' +
            '<input type="number" id="dep-amount-input" class="dep-amount-input" min="' + limits.min + '" max="' + limits.max + '" step="1" value="' + escapeHtml(amountValue) + '" inputmode="decimal" placeholder="Enter the amount (' + currency + ' ' + limits.min + ' - ' + currency + ' ' + limits.max.toLocaleString() + ')" />' +
          '</div>' +
          '<span class="profile-field-error" id="dep-amount-error" role="alert" hidden></span>' +
          '<p class="dep-amount-hint">' + currency + ' ' + limits.min + ' - ' + currency + ' ' + limits.max.toLocaleString() + '</p>' +
          '<div class="dep-amount-display" aria-live="polite">' +
            '<span class="dep-amount-display-label">Deposit Amount</span>' +
            '<div class="dep-amount-display-value-wrap">' +
              '<span class="dep-amount-display-currency">' + escapeHtml(currency) + '</span>' +
              '<strong class="dep-amount-display-value" id="dep-amount-display-value">' + formatAmount(state.amount) + '</strong>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</section>'
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

  function renderCopyRow(label, value, id, opts) {
    opts = opts || {};
    var showCopy = opts.copy !== false;
    return (
      '<div class="dep-account-row">' +
        '<div class="dep-account-main">' +
          '<span class="dep-account-label">' + escapeHtml(label) + '</span>' +
          '<span class="dep-account-value" id="' + id + '">' + escapeHtml(value) + '</span>' +
        '</div>' +
        (showCopy
          ? '<button type="button" class="dep-copy-btn" data-dep-copy-target="' + id + '" aria-label="Copy ' + escapeHtml(label) + '">' +
              '<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><rect x="4" y="4" width="8" height="8" rx="1" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M3 10V3a1 1 0 011-1h7" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>' +
            '</button>'
          : '') +
      '</div>'
    );
  }

  function renderBankSection(method) {
    var bank = getSelectedBank(method);
    if (!bank) {
      return (
        '<section class="dep-panel dep-account-panel">' +
          '<div class="dep-account-card">' +
            renderCopyRow('Bank Name', method.bankName || method.name, 'dep-bank-name', { copy: false }) +
            renderCopyRow('Account Number', method.accountNumber || '—', 'dep-account-number') +
            renderCopyRow('Account Name', method.accountHolder || '—', 'dep-account-holder') +
          '</div>' +
        '</section>'
      );
    }
    return (
      '<section class="dep-panel dep-account-panel" id="dep-account-panel">' +
        '<div class="dep-account-card">' +
          renderCopyRow('Bank Name', bank.name, 'dep-bank-name', { copy: false }) +
          renderCopyRow('Account Number', bank.accountNumber, 'dep-account-number') +
          renderCopyRow('Account Name', bank.accountName, 'dep-account-holder') +
        '</div>' +
      '</section>'
    );
  }

  function renderWalletSection(method) {
    return (
      '<fieldset class="profile-fieldset dep-details-section">' +
        '<legend>Wallet information</legend>' +
        '<div class="dep-info-card">' +
          '<div class="dep-info-row">' +
            '<div class="dep-info-main">' +
              '<span class="dep-info-label">Wallet number</span>' +
              '<span class="dep-info-value" id="dep-wallet-number">' + escapeHtml(method.walletNumber) + '</span>' +
            '</div>' +
            '<button type="button" class="dep-copy-btn" data-dep-copy-target="dep-wallet-number" aria-label="Copy Wallet number">' +
              '<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><rect x="4" y="4" width="8" height="8" rx="1" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M3 10V3a1 1 0 011-1h7" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>' +
            '</button>' +
          '</div>' +
        '</div>' +
      '</fieldset>'
    );
  }

  function renderCryptoSection(method) {
    return (
      '<fieldset class="profile-fieldset dep-details-section">' +
        '<legend>Cryptocurrency details</legend>' +
        '<div class="dep-info-card">' +
          '<div class="dep-info-row">' +
            '<div class="dep-info-main">' +
              '<span class="dep-info-label">Network</span>' +
              '<span class="dep-info-value" id="dep-crypto-network">' + escapeHtml(method.network) + '</span>' +
            '</div>' +
            '<button type="button" class="dep-copy-btn" data-dep-copy-target="dep-crypto-network" aria-label="Copy Network">' +
              '<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><rect x="4" y="4" width="8" height="8" rx="1" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M3 10V3a1 1 0 011-1h7" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>' +
            '</button>' +
          '</div>' +
          '<div class="dep-info-row">' +
            '<div class="dep-info-main">' +
              '<span class="dep-info-label">Wallet address</span>' +
              '<span class="dep-info-value" id="dep-crypto-address">' + escapeHtml(method.address) + '</span>' +
            '</div>' +
            '<button type="button" class="dep-copy-btn" data-dep-copy-target="dep-crypto-address" aria-label="Copy Wallet address">' +
              '<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><rect x="4" y="4" width="8" height="8" rx="1" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M3 10V3a1 1 0 011-1h7" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>' +
            '</button>' +
          '</div>' +
        '</div>' +
      '</fieldset>'
    );
  }

  function renderReferenceSection() {
    return (
      '<section class="dep-panel dep-reference-panel">' +
        '<div class="profile-field" id="dep-field-reference">' +
          '<label class="dep-field-label" for="dep-reference-input">Reference / Transaction ID (Optional)</label>' +
          '<div class="dep-reference-wrap">' +
            '<input type="text" id="dep-reference-input" class="profile-input dep-reference-input" placeholder="" value="' + escapeHtml(state.reference) + '" autocomplete="off" />' +
            '<button type="button" class="dep-copy-btn dep-copy-btn--ghost" data-dep-copy-target="dep-reference-input" data-dep-copy-input="dep-reference-input" aria-label="Copy reference">' +
              '<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><rect x="4" y="4" width="8" height="8" rx="1" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M3 10V3a1 1 0 011-1h7" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>' +
            '</button>' +
          '</div>' +
        '</div>' +
      '</section>'
    );
  }

  function renderUploadSection() {
    var fileLabel = state.fileName || 'Tap to upload file';
    var hasFile = !!state.fileName;
    return (
      '<section class="dep-panel dep-upload-panel">' +
        '<p class="dep-upload-required">Upload a screenshot or PDF of your payment receipt to notify us of your payment <span aria-hidden="true">*</span></p>' +
        '<div class="profile-field" id="dep-field-upload">' +
          '<label class="dep-upload-zone' + (hasFile ? ' has-file' : '') + '" id="dep-upload-zone" tabindex="0" role="button">' +
            '<input type="file" id="dep-upload-input" accept="image/*,.pdf" hidden />' +
            '<span class="dep-upload-inner">' +
              '<span class="dep-upload-icon-wrap" aria-hidden="true">' +
                '<svg class="dep-upload-icon-default" width="28" height="28" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M14 2v6h6M12 18v-6m0 0l-2.5 2.5M12 12l2.5 2.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
                '<svg class="dep-upload-icon-success" width="22" height="22" viewBox="0 0 24 24"><path d="M7 12.5l3.5 3.5L17 9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
              '</span>' +
              '<span class="dep-upload-text" id="dep-upload-label">' + escapeHtml(fileLabel) + '</span>' +
            '</span>' +
          '</label>' +
          '<span class="profile-field-error" id="dep-upload-error" role="alert" hidden></span>' +
        '</div>' +
      '</section>'
    );
  }

  function renderInstructions(method) {
    if (!method.instructions) return '';
    return (
      '<aside class="dep-notes-banner" aria-label="Notes">' +
        '<strong class="dep-notes-title">Notes :</strong> ' +
        '<span class="dep-notes-text">' + escapeHtml(method.instructions) + '</span>' +
      '</aside>'
    );
  }

  function renderTransferDetailsForm(method) {
    return (
      renderSummary(method) +
      '<div class="dep-details-card">' +
        renderInstructions(method) +
        renderBankPicker(method) +
        renderAmountSection(method) +
        renderBankSection(method) +
        renderReferenceSection() +
        renderUploadSection() +
      '</div>'
    );
  }

  function renderDetailsForm(method) {
    if (method.type === 'transfer' && method.banks) {
      return renderTransferDetailsForm(method);
    }

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

  function updateActionsBar(method) {
    var actions = document.getElementById('dep-details-actions');
    var backBottom = document.getElementById('dep-details-back-bottom');
    var isTransfer = method && method.type === 'transfer';
    if (actions) actions.classList.toggle('dep-details-actions--submit-only', !!isTransfer);
    if (backBottom) backBottom.hidden = !!isTransfer;
    if (submitBtn) submitBtn.classList.toggle('dep-btn-primary--section', !!isTransfer);
    if (submitLabel) {
      submitLabel.textContent = isTransfer
        ? 'Submit'
        : (method.type === 'card' || method.type === 'banking' ? 'Continue' : 'Submit deposit');
    }
  }

  function openDetails(methodId) {
    var method = METHODS[methodId];
    if (!method) return;

    state.methodId = methodId;
    state.bankId = method.banks && method.banks[0] ? method.banks[0].id : null;
    state.amount = method.type === 'transfer' ? 0 : (state.amount || method.min);
    if (method.type !== 'transfer' && (!state.amount || state.amount < method.min)) {
      state.amount = method.min;
    }

    if (detailsTitle) detailsTitle.textContent = method.type === 'transfer' ? 'Deposit' : ('Deposit via ' + method.name);
    if (detailsSub) {
      detailsSub.textContent = method.type === 'transfer'
        ? 'Complete your bank transfer details'
        : 'Enter your deposit details to continue';
    }

    updateActionsBar(method);

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
      amountInput.addEventListener('input', function () {
        state.amount = Number(amountInput.value) || 0;
        syncPresetButtons(state.amount);
        syncAmountDisplay(state.amount);
        clearFieldError('dep-field-amount', 'dep-amount-error');
      });
      syncAmountDisplay(state.amount);
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
        if (label) label.textContent = state.fileName || 'Tap to upload file';
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

  function selectBank(bankId) {
    var method = getMethod();
    if (!method || !method.banks) return;
    state.bankId = bankId;
    if (detailsContent) {
      detailsContent.innerHTML = renderDetailsForm(method);
      bindFieldEvents();
    }
  }

  function handleDetailsClick(e) {
    var bankBtn = e.target.closest('[data-dep-bank]');
    var presetBtn = e.target.closest('[data-dep-preset]');
    var copyBtn = e.target.closest('[data-dep-copy-target]');
    var amountInput = document.getElementById('dep-amount-input');

    if (bankBtn) {
      selectBank(bankBtn.getAttribute('data-dep-bank'));
      return;
    }

    if (presetBtn && amountInput) {
      var method = getMethod();
      var limits = method ? getActiveLimits(method) : { min: 1, max: 999999 };
      var preset = Number(presetBtn.getAttribute('data-dep-preset'));
      var next = Math.min(limits.max, Math.max(limits.min, preset));
      amountInput.value = String(next);
      state.amount = next;
      syncPresetButtons(next);
      syncAmountDisplay(next);
      clearFieldError('dep-field-amount', 'dep-amount-error');
      return;
    }

    if (copyBtn) {
      var inputId = copyBtn.getAttribute('data-dep-copy-input');
      if (inputId) {
        var input = document.getElementById(inputId);
        if (input) copyText(input.value || '');
        return;
      }
      var targetId = copyBtn.getAttribute('data-dep-copy-target');
      var target = document.getElementById(targetId);
      if (target) copyText(target.textContent);
      return;
    }
  }

  function copyText(text) {
    if (!text) {
      toast('Nothing to copy');
      return;
    }
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
    var limits = getActiveLimits(method);
    var currency = getCurrency(method);

    if (method.fields.indexOf('amount') !== -1 && amountInput) {
      var amount = Number(amountInput.value);
      state.amount = amount;
      if (!amount || amount <= 0) {
        setFieldError('dep-field-amount', 'dep-amount-error', 'Please enter a deposit amount.');
        valid = false;
      } else if (amount < limits.min) {
        setFieldError('dep-field-amount', 'dep-amount-error', 'Minimum deposit is ' + limits.min + ' ' + currency + '.');
        valid = false;
      } else if (amount > limits.max) {
        setFieldError('dep-field-amount', 'dep-amount-error', 'Maximum deposit is ' + limits.max.toLocaleString() + ' ' + currency + '.');
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
        submitLabel.textContent = method.type === 'transfer'
          ? 'Submit'
          : (method.type === 'card' || method.type === 'banking' ? 'Continue' : 'Submit deposit');
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
    var actions = document.getElementById('dep-details-actions');
    var backBottom = document.getElementById('dep-details-back-bottom');
    if (actions) actions.classList.remove('dep-details-actions--submit-only');
    if (backBottom) backBottom.hidden = false;
    if (submitBtn) submitBtn.classList.remove('dep-btn-primary--section');
    showStep('methods');
  }

  function resetFlow() {
    state.methodId = null;
    state.bankId = null;
    state.amount = 0;
    state.reference = '';
    state.file = null;
    state.fileName = '';
    isSubmitting = false;
    if (detailsContent) detailsContent.innerHTML = '';
    goBack();
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

  /* Deep-link for Figma / demos: ?step=details&method=touchngo */
  (function openStepFromQuery() {
    try {
      var params = new URLSearchParams(window.location.search);
      var step = (params.get('step') || '').toLowerCase();
      if (step !== '2' && step !== 'details') return;
      var methodId = params.get('method') || 'touchngo';
      if (!METHODS[methodId]) methodId = 'touchngo';
      openDetails(methodId);
    } catch (err) { /* ignore */ }
  })();
})();
