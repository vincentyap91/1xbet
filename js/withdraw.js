/* withdraw.js — multi-step withdraw flow (methods → details → success)
   Step 2 layout/tokens aligned with deposit step 2 (DESIGN_SYSTEM.md) */
(function () {
  'use strict';

  if (document.body.dataset.page !== 'withdraw') return;

  var SUBMIT_MS = 1400;
  var PRESET_AMOUNTS = [5, 10, 50, 100, 500, 1000];

  var METHODS = {
    touchngo: {
      id: 'touchngo',
      name: "Touch 'n Go",
      type: 'ewallet',
      min: 10,
      max: 5000,
      fields: ['amount', 'account']
    },
    grabpay: {
      id: 'grabpay',
      name: 'GrabPay',
      type: 'ewallet',
      min: 10,
      max: 5000,
      fields: ['amount', 'account']
    },
    duitnow: {
      id: 'duitnow',
      name: 'DuitNow',
      type: 'ewallet',
      min: 10,
      max: 10000,
      fields: ['amount', 'account']
    },
    visa: {
      id: 'visa',
      name: 'Visa',
      type: 'card',
      min: 20,
      max: 20000,
      fields: ['amount', 'account']
    },
    mastercard: {
      id: 'mastercard',
      name: 'Mastercard',
      type: 'card',
      min: 20,
      max: 20000,
      fields: ['amount', 'account']
    },
    fpx: {
      id: 'fpx',
      name: 'FPX',
      type: 'banking',
      min: 20,
      max: 30000,
      fields: ['amount', 'bank']
    },
    'bank-transfer': {
      id: 'bank-transfer',
      name: 'Normal Bank Transfer',
      type: 'transfer',
      min: 3,
      max: 100000,
      fields: ['amount', 'bank']
    },
    bitcoin: {
      id: 'bitcoin',
      name: 'Bitcoin',
      type: 'crypto',
      min: 50,
      max: 100000,
      fields: ['amount', 'crypto']
    },
    tether: {
      id: 'tether',
      name: 'Tether TRC20',
      type: 'crypto',
      min: 20,
      max: 100000,
      fields: ['amount', 'crypto']
    },
    ethereum: {
      id: 'ethereum',
      name: 'Ethereum',
      type: 'crypto',
      min: 20,
      max: 100000,
      fields: ['amount', 'crypto']
    }
  };

  var BANKS = [
    {
      id: 'aba',
      name: 'ABA BANK',
      min: 3,
      max: 100000,
      logo: 'assets/images/payments/banks/aba.svg'
    },
    {
      id: 'wing',
      name: 'WING BANK',
      min: 3,
      max: 100000,
      logo: 'assets/images/payments/banks/wing.svg'
    },
    {
      id: 'acleda',
      name: 'ACLEDA BANK',
      min: 3,
      max: 100000,
      logo: 'assets/images/payments/banks/acleda.svg'
    }
  ];

  var stepMethods = document.getElementById('wd-step-methods');
  var stepDetails = document.getElementById('wd-step-details');
  var stepSuccess = document.getElementById('wd-step-success');
  var detailsContent = document.getElementById('wd-details-content');
  var detailsTitle = document.getElementById('wd-details-title');
  var detailsSub = document.getElementById('wd-details-sub');
  var submitBtn = document.getElementById('wd-details-submit');
  var submitLabel = submitBtn && submitBtn.querySelector('.dep-btn-label');
  var submitSpinner = submitBtn && submitBtn.querySelector('.dep-btn-spinner');

  var state = {
    methodId: null,
    bankId: '',
    accountName: '',
    accountNumber: '',
    cryptoAddress: '',
    amount: 0
  };

  var isSubmitting = false;
  var activeStep = 'methods';

  function toast(msg) {
    if (typeof window.showToast === 'function') {
      window.showToast(msg);
      return;
    }
    var el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { el.hidden = true; }, 2200);
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

  function readBalance() {
    var headerBal = document.querySelector('.header-balance-row span:last-child');
    if (!headerBal) return 0;
    var n = Number(String(headerBal.textContent).replace(/[^\d.-]/g, ''));
    return isFinite(n) ? n : 0;
  }

  function getSelectedBank() {
    if (!state.bankId) return BANKS[0] || null;
    for (var i = 0; i < BANKS.length; i++) {
      if (BANKS[i].id === state.bankId) return BANKS[i];
    }
    return BANKS[0] || null;
  }

  function getActiveLimits(method) {
    var bank = (method.fields.indexOf('bank') !== -1) ? getSelectedBank() : null;
    if (bank) return { min: bank.min, max: bank.max };
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
    });

    activeStep = step;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function notesFor(method) {
    if (method.type === 'transfer' || method.type === 'banking') {
      return 'Upload accurate bank details. Transfers may take up to 24 hours. Mismatched account details can be rejected.';
    }
    if (method.type === 'crypto') {
      return 'Crypto withdrawals may take up to 1 hour. Double-check the wallet address and network before submitting.';
    }
    return 'E-wallet withdrawals are usually processed within 15 minutes. Account name must match your registered profile.';
  }

  function renderSummary(method) {
    var limits = getActiveLimits(method);
    var balance = readBalance();
    return (
      '<div class="dep-summary" aria-label="Withdrawal summary">' +
        '<div class="dep-summary-row"><span>Balance</span><strong>' + formatAmount(balance) + '</strong></div>' +
        '<div class="dep-summary-row"><span>Min Withdrawal</span><strong id="wd-summary-min">' + limits.min + '</strong></div>' +
      '</div>'
    );
  }

  function renderNotes(method) {
    return (
      '<aside class="dep-notes-banner" aria-label="Notes">' +
        '<strong class="dep-notes-title">Notes :</strong> ' +
        '<span class="dep-notes-text">' + escapeHtml(notesFor(method)) + '</span>' +
      '</aside>'
    );
  }

  function renderBalanceAlert() {
    var balance = readBalance();
    if (balance > 0) return '';
    return (
      '<div class="wd-alert" role="alert">' +
        '<span class="wd-alert-icon" aria-hidden="true">!</span>' +
        '<p>Your Account Balance is ' + formatAmount(balance) + '</p>' +
      '</div>'
    );
  }

  function renderBankPicker(method) {
    if (method.fields.indexOf('bank') === -1) return '';
    var selected = getSelectedBank();
    var cards = BANKS.map(function (bank) {
      var isActive = selected && selected.id === bank.id;
      return (
        '<button type="button" class="dep-bank-card' + (isActive ? ' is-selected' : '') + '" data-wd-bank="' + escapeHtml(bank.id) + '" aria-pressed="' + (isActive ? 'true' : 'false') + '">' +
          '<span class="dep-bank-card-logo"><img src="' + escapeHtml(bank.logo) + '" alt="" width="72" height="24" /></span>' +
          '<span class="dep-bank-card-name">' + escapeHtml(bank.name) + '</span>' +
          '<span class="dep-bank-card-range">' + formatRange(bank.min, bank.max) + '</span>' +
        '</button>'
      );
    }).join('');

    return (
      '<section class="dep-panel dep-bank-pick" aria-labelledby="wd-bank-pick-title">' +
        '<h2 class="dep-panel-title" id="wd-bank-pick-title">Select Bank</h2>' +
        '<div class="dep-bank-grid" role="group" aria-label="Banks">' + cards + '</div>' +
        '<span class="profile-field-error" id="wd-bank-error" role="alert" hidden></span>' +
      '</section>'
    );
  }

  function renderPresetButtons() {
    return PRESET_AMOUNTS.map(function (amt) {
      var label = amt >= 1000 ? '1k' : String(amt);
      var active = Number(state.amount) === amt ? ' is-active' : '';
      return '<button type="button" class="dep-preset-btn' + active + '" data-wd-preset="' + amt + '">' + label + '</button>';
    }).join('');
  }

  function syncPresetButtons(amount) {
    document.querySelectorAll('[data-wd-preset]').forEach(function (btn) {
      btn.classList.toggle('is-active', Number(btn.getAttribute('data-wd-preset')) === amount);
    });
  }

  function syncAmountDisplay(amount) {
    var el = document.getElementById('wd-amount-display-value');
    if (el) el.textContent = formatAmount(amount);
  }

  function renderAmountSection(method) {
    var limits = getActiveLimits(method);
    var amountValue = state.amount > 0 ? String(state.amount) : '';
    return (
      '<section class="dep-panel dep-amount-panel" aria-labelledby="wd-amount-title">' +
        '<h2 class="dep-panel-title" id="wd-amount-title">Please Select or Enter Withdrawal Amount</h2>' +
        '<div class="profile-field dep-amount-field" id="wd-field-amount">' +
          '<div class="dep-preset-grid" aria-label="Quick withdrawal amounts">' +
            renderPresetButtons() +
          '</div>' +
          '<div class="dep-amount-input-wrap">' +
            '<span class="dep-amount-currency" aria-hidden="true">MYR</span>' +
            '<input type="number" id="wd-amount-input" class="dep-amount-input" min="' + limits.min + '" max="' + limits.max + '" step="0.01" value="' + escapeHtml(amountValue) + '" inputmode="decimal" placeholder="Enter the amount (MYR ' + limits.min + ' - MYR ' + limits.max.toLocaleString() + ')" />' +
          '</div>' +
          '<span class="profile-field-error" id="wd-amount-error" role="alert" hidden></span>' +
          '<p class="dep-amount-hint">MYR ' + limits.min + ' - MYR ' + limits.max.toLocaleString() + '</p>' +
          '<div class="dep-amount-display" aria-live="polite">' +
            '<span class="dep-amount-display-label">Withdrawal Amount</span>' +
            '<div class="dep-amount-display-value-wrap">' +
              '<span class="dep-amount-display-currency">MYR</span>' +
              '<strong class="dep-amount-display-value" id="wd-amount-display-value">' + formatAmount(state.amount) + '</strong>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</section>'
    );
  }

  function renderBankAccountFields() {
    return (
      '<section class="dep-panel">' +
        '<h2 class="dep-panel-title">Bank Account Info</h2>' +
        renderBalanceAlert() +
        '<div class="profile-field" id="wd-field-account-name">' +
          '<label class="dep-field-label" for="wd-account-name">Account Name</label>' +
          '<input class="profile-input" id="wd-account-name" type="text" placeholder="Enter Your Account Name" autocomplete="name" value="' + escapeHtml(state.accountName) + '" required />' +
          '<span class="profile-field-error" id="wd-account-name-error" role="alert" hidden></span>' +
        '</div>' +
        '<div class="profile-field" id="wd-field-account-number">' +
          '<label class="dep-field-label" for="wd-account-number">Account Number</label>' +
          '<input class="profile-input" id="wd-account-number" type="text" inputmode="numeric" placeholder="Enter Your Account Number" value="' + escapeHtml(state.accountNumber) + '" required />' +
          '<span class="profile-field-error" id="wd-account-number-error" role="alert" hidden></span>' +
        '</div>' +
      '</section>'
    );
  }

  function renderWalletAccountFields() {
    return (
      '<section class="dep-panel">' +
        '<h2 class="dep-panel-title">Account Info</h2>' +
        renderBalanceAlert() +
        '<div class="profile-field" id="wd-field-account-name">' +
          '<label class="dep-field-label" for="wd-account-name">Account Name</label>' +
          '<input class="profile-input" id="wd-account-name" type="text" placeholder="Enter Your Account Name" value="' + escapeHtml(state.accountName) + '" required />' +
          '<span class="profile-field-error" id="wd-account-name-error" role="alert" hidden></span>' +
        '</div>' +
        '<div class="profile-field" id="wd-field-account-number">' +
          '<label class="dep-field-label" for="wd-account-number">Account / Wallet ID</label>' +
          '<input class="profile-input" id="wd-account-number" type="text" placeholder="Enter Your Account Number" value="' + escapeHtml(state.accountNumber) + '" required />' +
          '<span class="profile-field-error" id="wd-account-number-error" role="alert" hidden></span>' +
        '</div>' +
      '</section>'
    );
  }

  function renderCryptoFields() {
    return (
      '<section class="dep-panel">' +
        '<h2 class="dep-panel-title">Wallet Info</h2>' +
        renderBalanceAlert() +
        '<div class="profile-field" id="wd-field-crypto">' +
          '<label class="dep-field-label" for="wd-crypto-address">Wallet Address</label>' +
          '<input class="profile-input" id="wd-crypto-address" type="text" placeholder="Enter Your Wallet Address" value="' + escapeHtml(state.cryptoAddress) + '" required />' +
          '<span class="profile-field-error" id="wd-crypto-error" role="alert" hidden></span>' +
        '</div>' +
      '</section>'
    );
  }

  function renderDetailsForm(method) {
    var body = renderNotes(method);

    if (method.fields.indexOf('bank') !== -1) {
      body += renderBankPicker(method) + renderBankAccountFields();
    } else if (method.fields.indexOf('crypto') !== -1) {
      body += renderCryptoFields();
    } else {
      body += renderWalletAccountFields();
    }

    body += renderAmountSection(method);

    return (
      renderSummary(method) +
      '<div class="dep-details-card">' + body + '</div>'
    );
  }

  function updateActionsBar() {
    var actions = document.getElementById('wd-details-actions');
    var backBottom = document.getElementById('wd-details-back-bottom');
    if (actions) actions.classList.add('dep-details-actions--submit-only');
    if (backBottom) backBottom.hidden = true;
    if (submitBtn) submitBtn.classList.add('dep-btn-primary--section');
    if (submitLabel) submitLabel.textContent = 'Submit';
  }

  function openDetails(methodId) {
    var method = METHODS[methodId];
    if (!method) return;

    state.methodId = methodId;
    state.bankId = method.fields.indexOf('bank') !== -1 ? BANKS[0].id : '';
    state.amount = 0;

    if (detailsTitle) detailsTitle.textContent = 'Withdraw';
    if (detailsSub) detailsSub.textContent = 'Complete your withdrawal details';
    updateActionsBar();

    if (detailsContent) {
      detailsContent.innerHTML = renderDetailsForm(method);
      bindFieldEvents();
    }
    showStep('details');
  }

  function clearFieldError(fieldId, errorId) {
    var field = document.getElementById(fieldId);
    var error = document.getElementById(errorId);
    if (field) field.classList.remove('has-error');
    if (error) {
      error.hidden = true;
      error.textContent = '';
    }
  }

  function setFieldError(fieldId, errorId, message) {
    var field = document.getElementById(fieldId);
    var error = document.getElementById(errorId);
    if (field) field.classList.add('has-error');
    if (error) {
      error.hidden = false;
      error.textContent = message;
    }
  }

  function bindFieldEvents() {
    var accountName = document.getElementById('wd-account-name');
    var accountNumber = document.getElementById('wd-account-number');
    var crypto = document.getElementById('wd-crypto-address');
    var amount = document.getElementById('wd-amount-input');

    if (accountName) {
      accountName.addEventListener('input', function () {
        state.accountName = accountName.value;
        clearFieldError('wd-field-account-name', 'wd-account-name-error');
      });
    }
    if (accountNumber) {
      accountNumber.addEventListener('input', function () {
        state.accountNumber = accountNumber.value;
        clearFieldError('wd-field-account-number', 'wd-account-number-error');
      });
    }
    if (crypto) {
      crypto.addEventListener('input', function () {
        state.cryptoAddress = crypto.value;
        clearFieldError('wd-field-crypto', 'wd-crypto-error');
      });
    }
    if (amount) {
      amount.addEventListener('input', function () {
        state.amount = Number(amount.value) || 0;
        syncPresetButtons(state.amount);
        syncAmountDisplay(state.amount);
        clearFieldError('wd-field-amount', 'wd-amount-error');
      });
      syncAmountDisplay(state.amount);
    }
  }

  function selectBank(bankId) {
    var method = getMethod();
    if (!method) return;
    state.bankId = bankId;
    clearFieldError('wd-field-bank', 'wd-bank-error');
    if (detailsContent) {
      detailsContent.innerHTML = renderDetailsForm(method);
      bindFieldEvents();
    }
  }

  function handleDetailsClick(e) {
    var bankBtn = e.target.closest('[data-wd-bank]');
    var presetBtn = e.target.closest('[data-wd-preset]');
    var amountInput = document.getElementById('wd-amount-input');

    if (bankBtn) {
      selectBank(bankBtn.getAttribute('data-wd-bank'));
      return;
    }

    if (presetBtn && amountInput) {
      var method = getMethod();
      var limits = method ? getActiveLimits(method) : { min: 1, max: 999999 };
      var preset = Number(presetBtn.getAttribute('data-wd-preset'));
      var next = Math.min(limits.max, Math.max(limits.min, preset));
      amountInput.value = String(next);
      state.amount = next;
      syncPresetButtons(next);
      syncAmountDisplay(next);
      clearFieldError('wd-field-amount', 'wd-amount-error');
    }
  }

  function validate() {
    var method = getMethod();
    if (!method) return false;
    var valid = true;
    var amount = Number(state.amount);
    var limits = getActiveLimits(method);
    var balance = readBalance();

    if (method.fields.indexOf('bank') !== -1 && !state.bankId) {
      var bankErr = document.getElementById('wd-bank-error');
      if (bankErr) {
        bankErr.hidden = false;
        bankErr.textContent = 'Please select a bank.';
      }
      valid = false;
    }

    if (method.fields.indexOf('bank') !== -1 || method.fields.indexOf('account') !== -1) {
      if (!state.accountName.trim()) {
        setFieldError('wd-field-account-name', 'wd-account-name-error', 'Enter your account name.');
        valid = false;
      }
      if (!state.accountNumber.trim()) {
        setFieldError('wd-field-account-number', 'wd-account-number-error', 'Enter your account number.');
        valid = false;
      }
    }

    if (method.fields.indexOf('crypto') !== -1 && !state.cryptoAddress.trim()) {
      setFieldError('wd-field-crypto', 'wd-crypto-error', 'Enter your wallet address.');
      valid = false;
    }

    if (!state.amount || Number.isNaN(amount) || amount <= 0) {
      setFieldError('wd-field-amount', 'wd-amount-error', 'Please enter an amount.');
      valid = false;
    } else if (amount < limits.min) {
      setFieldError('wd-field-amount', 'wd-amount-error', 'Minimum withdrawal is ' + limits.min + ' MYR.');
      valid = false;
    } else if (amount > limits.max) {
      setFieldError('wd-field-amount', 'wd-amount-error', 'Maximum withdrawal is ' + limits.max.toLocaleString() + ' MYR.');
      valid = false;
    } else if (amount > balance) {
      setFieldError('wd-field-amount', 'wd-amount-error', 'Amount exceeds your available balance.');
      valid = false;
    }

    return valid;
  }

  function setSubmitting(loading) {
    isSubmitting = loading;
    if (!submitBtn) return;
    submitBtn.disabled = loading;
    submitBtn.classList.toggle('is-loading', loading);
    if (submitLabel) submitLabel.textContent = loading ? 'Processing…' : 'Submit';
    if (submitSpinner) submitSpinner.hidden = !loading;
  }

  function submitWithdraw() {
    if (isSubmitting) return;
    if (!validate()) {
      toast('Please check the highlighted fields');
      return;
    }

    setSubmitting(true);
    setTimeout(function () {
      setSubmitting(false);
      showStep('success');
      toast('Withdrawal submitted — demo only. No real transaction has been made.');
    }, SUBMIT_MS);
  }

  function goBack() {
    var actions = document.getElementById('wd-details-actions');
    var backBottom = document.getElementById('wd-details-back-bottom');
    if (actions) actions.classList.remove('dep-details-actions--submit-only');
    if (backBottom) backBottom.hidden = false;
    if (submitBtn) submitBtn.classList.remove('dep-btn-primary--section');
    showStep('methods');
  }

  function resetFlow() {
    state.methodId = null;
    state.bankId = '';
    state.accountName = '';
    state.accountNumber = '';
    state.cryptoAddress = '';
    state.amount = 0;
    isSubmitting = false;
    if (detailsContent) detailsContent.innerHTML = '';
    goBack();
  }

  function init() {
    if (!stepMethods || !stepDetails) return;

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

    var backTop = document.getElementById('wd-details-back');
    var backBottom = document.getElementById('wd-details-back-bottom');
    var successAgain = document.getElementById('wd-success-again');

    if (backTop) backTop.addEventListener('click', goBack);
    if (backBottom) backBottom.addEventListener('click', goBack);
    if (submitBtn) submitBtn.addEventListener('click', submitWithdraw);
    if (successAgain) successAgain.addEventListener('click', resetFlow);
    if (detailsContent) detailsContent.addEventListener('click', handleDetailsClick);
  }

  init();
})();
