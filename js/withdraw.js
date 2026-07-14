/* withdraw.js — multi-step withdraw flow (methods → details → success) */
(function () {
  'use strict';

  if (document.body.dataset.page !== 'withdraw') return;

  var SUBMIT_MS = 1400;
  var BALANCE = 0;

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
      min: 50,
      max: 50000,
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
    'Maybank',
    'CIMB Bank',
    'Public Bank',
    'RHB Bank',
    'Hong Leong Bank',
    'AmBank',
    'Bank Islam',
    'Bank Rakyat',
    'OCBC Bank',
    'HSBC Bank'
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
    bankName: '',
    accountName: '',
    accountNumber: '',
    cryptoAddress: '',
    amount: ''
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
      return [
        'Bank transfer takes up to 24 hours to reflect in your bank account.',
        'If the entered and bank account details are inconsistent, the company reserves the right to reject the application.'
      ];
    }
    if (method.type === 'crypto') {
      return [
        'Crypto withdrawals may take up to 1 hour depending on network confirmation.',
        'Double-check the wallet address and network before submitting.'
      ];
    }
    return [
      'E-wallet withdrawals are usually processed within 15 minutes.',
      'Make sure the account name matches your registered profile.'
    ];
  }

  function minLabel(method) {
    return method.min != null ? method.min.toFixed(2) + ' MYR' : '—';
  }

  function renderSummary(method) {
    var notes = notesFor(method).map(function (n) {
      return '<li>' + escapeHtml(n) + '</li>';
    }).join('');

    return (
      '<div class="wd-summary">' +
        '<div class="dep-info-card wd-summary-card">' +
          '<div class="dep-info-row wd-summary-row"><span>Balance</span><strong>MYR ' + BALANCE.toFixed(2) + '</strong></div>' +
          '<div class="dep-info-row wd-summary-row"><span>Min Withdrawal</span><strong>' + escapeHtml(minLabel(method)) + '</strong></div>' +
        '</div>' +
        '<div class="wd-notes" role="note">' +
          '<span class="cpw-info-icon" aria-hidden="true">i</span>' +
          '<div class="wd-notes-copy">' +
            '<span class="wd-notes-title">Notes</span>' +
            '<ul>' + notes + '</ul>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  function renderBalanceAlert() {
    if (BALANCE > 0) return '';
    return (
      '<div class="wd-alert" role="alert">' +
        '<span class="wd-alert-icon" aria-hidden="true">!</span>' +
        '<p>Your Account Balance is ' + BALANCE.toFixed(2) + '</p>' +
      '</div>'
    );
  }

  function renderBankFields(method) {
    var options = ['<option value=\"\">Please Select Bank</option>'].concat(
      BANKS.map(function (bank) {
        var selected = state.bankName === bank ? ' selected' : '';
        return '<option value=\"' + escapeHtml(bank) + '\"' + selected + '>' + escapeHtml(bank) + '</option>';
      })
    ).join('');

    return (
      '<fieldset class="profile-fieldset dep-details-section">' +
        '<legend>Bank Account Info</legend>' +
        '<div class="profile-field" id="wd-field-bank">' +
          '<label for="wd-bank-name">Bank Name</label>' +
          '<select class="profile-select" id="wd-bank-name" required>' + options + '</select>' +
          '<span class="profile-field-error" id="wd-bank-error" role="alert" hidden></span>' +
        '</div>' +
        '<div class="profile-field" id="wd-field-account-name">' +
          '<label for="wd-account-name">Account Name</label>' +
          '<input class="profile-input" id="wd-account-name" type="text" placeholder="Enter Your Account Name" autocomplete="name" value="' + escapeHtml(state.accountName) + '" required />' +
          '<span class="profile-field-error" id="wd-account-name-error" role="alert" hidden></span>' +
        '</div>' +
        renderBalanceAlert() +
        '<div class="profile-field" id="wd-field-account-number">' +
          '<label for="wd-account-number">Account Number</label>' +
          '<input class="profile-input" id="wd-account-number" type="text" inputmode="numeric" placeholder="Enter Your Account Number" value="' + escapeHtml(state.accountNumber) + '" required />' +
          '<span class="profile-field-error" id="wd-account-number-error" role="alert" hidden></span>' +
        '</div>' +
        renderAmountField(method) +
      '</fieldset>'
    );
  }

  function renderAccountField(method) {
    return (
      '<fieldset class="profile-fieldset dep-details-section">' +
        '<legend>Account Info</legend>' +
        '<div class="profile-field" id="wd-field-account-name">' +
          '<label for="wd-account-name">Account Name</label>' +
          '<input class="profile-input" id="wd-account-name" type="text" placeholder="Enter Your Account Name" value="' + escapeHtml(state.accountName) + '" required />' +
          '<span class="profile-field-error" id="wd-account-name-error" role="alert" hidden></span>' +
        '</div>' +
        renderBalanceAlert() +
        '<div class="profile-field" id="wd-field-account-number">' +
          '<label for="wd-account-number">Account / Wallet ID</label>' +
          '<input class="profile-input" id="wd-account-number" type="text" placeholder="Enter Your Account Number" value="' + escapeHtml(state.accountNumber) + '" required />' +
          '<span class="profile-field-error" id="wd-account-number-error" role="alert" hidden></span>' +
        '</div>' +
        renderAmountField(method) +
      '</fieldset>'
    );
  }

  function renderCryptoFields(method) {
    return (
      '<fieldset class="profile-fieldset dep-details-section">' +
        '<legend>Wallet Info</legend>' +
        renderBalanceAlert() +
        '<div class="profile-field" id="wd-field-crypto">' +
          '<label for="wd-crypto-address">Wallet Address</label>' +
          '<input class="profile-input" id="wd-crypto-address" type="text" placeholder="Enter Your Wallet Address" value="' + escapeHtml(state.cryptoAddress) + '" required />' +
          '<span class="profile-field-error" id="wd-crypto-error" role="alert" hidden></span>' +
        '</div>' +
        renderAmountField(method) +
      '</fieldset>'
    );
  }

  function renderAmountField(method) {
    return (
      '<div class="profile-field dep-amount-field" id="wd-field-amount">' +
        '<label for="wd-amount-input">Amount</label>' +
        '<div class="dep-amount-input-wrap">' +
          '<span class="dep-amount-currency" aria-hidden="true">MYR</span>' +
          '<input type="number" id="wd-amount-input" class="dep-amount-input" min="' + method.min + '" max="' + method.max + '" step="0.01" value="' + escapeHtml(state.amount) + '" inputmode="decimal" placeholder="Please Enter Amount" />' +
        '</div>' +
        '<span class="profile-field-error" id="wd-amount-error" role="alert" hidden></span>' +
        '<p class="dep-amount-hint">Min ' + method.min + ' – Max ' + method.max.toLocaleString() + ' MYR</p>' +
      '</div>'
    );
  }

  function renderDetailsForm(method) {
    var html = renderSummary(method);
    if (method.fields.indexOf('bank') !== -1) {
      html += renderBankFields(method);
    } else if (method.fields.indexOf('crypto') !== -1) {
      html += renderCryptoFields(method);
    } else {
      html += renderAccountField(method);
    }
    return html;
  }

  function openDetails(methodId) {
    var method = METHODS[methodId];
    if (!method) return;

    state.methodId = methodId;
    if (detailsTitle) detailsTitle.textContent = method.name;
    if (detailsSub) detailsSub.textContent = 'Enter your withdrawal details to continue';
    if (submitLabel) submitLabel.textContent = 'Withdraw';
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
    var bank = document.getElementById('wd-bank-name');
    var accountName = document.getElementById('wd-account-name');
    var accountNumber = document.getElementById('wd-account-number');
    var crypto = document.getElementById('wd-crypto-address');
    var amount = document.getElementById('wd-amount-input');

    if (bank) {
      bank.addEventListener('change', function () {
        state.bankName = bank.value;
        clearFieldError('wd-field-bank', 'wd-bank-error');
      });
    }
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
        state.amount = amount.value;
        clearFieldError('wd-field-amount', 'wd-amount-error');
      });
    }
  }

  function validate() {
    var method = getMethod();
    if (!method) return false;
    var valid = true;
    var amount = Number(state.amount);

    if (method.fields.indexOf('bank') !== -1 && !state.bankName) {
      setFieldError('wd-field-bank', 'wd-bank-error', 'Please select a bank.');
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

    if (!state.amount || Number.isNaN(amount)) {
      setFieldError('wd-field-amount', 'wd-amount-error', 'Please enter an amount.');
      valid = false;
    } else if (amount < method.min) {
      setFieldError('wd-field-amount', 'wd-amount-error', 'Minimum withdrawal is ' + method.min + ' MYR.');
      valid = false;
    } else if (amount > method.max) {
      setFieldError('wd-field-amount', 'wd-amount-error', 'Maximum withdrawal is ' + method.max.toLocaleString() + ' MYR.');
      valid = false;
    } else if (amount > BALANCE) {
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
    if (submitLabel) submitLabel.textContent = loading ? 'Processing…' : 'Withdraw';
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
    showStep('methods');
  }

  function resetFlow() {
    state.methodId = null;
    state.bankName = '';
    state.accountName = '';
    state.accountNumber = '';
    state.cryptoAddress = '';
    state.amount = '';
    isSubmitting = false;
    if (detailsContent) detailsContent.innerHTML = '';
    showStep('methods');
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
  }

  init();
})();
