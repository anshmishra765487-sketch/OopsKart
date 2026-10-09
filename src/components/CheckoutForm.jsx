import { useState } from 'react';
import { BadgeCheck, ShieldAlert, Wand2 } from 'lucide-react';
import { useChaos } from '../hooks/useChaos.jsx';
import { useSound } from '../hooks/useSound.jsx';

const PAYMENT_OPTIONS = [
  {
    id: 'dignity',
    label: 'Dignity Instalments',
    detail: '0% interest, 100% emotional cost.',
  },
  {
    id: 'pigeon',
    label: 'Pay the pigeon on delivery',
    detail: 'Honour system. The pigeon keeps no records.',
  },
  {
    id: 'vibes',
    label: 'Existential Credit',
    detail: 'Settle the balance in vibes, at your leisure.',
  },
];

const FICTIONAL_CUSTOMER = {
  fullName: 'Ada Placeholder',
  email: 'ada@example.com',
  phone: '9876543210',
  address: '42 Nowhere Lane, Block C',
  city: 'Bengaluru',
  pincode: '560001',
  payment: 'dignity',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values) {
  const errors = {};
  if (!values.fullName.trim() || values.fullName.trim().length < 2) {
    errors.fullName = 'Please enter a name of at least 2 characters.';
  }
  if (!EMAIL_RE.test(values.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }
  const digits = values.phone.replace(/\D/g, '');
  if (digits.length !== 10) {
    errors.phone = 'Please enter a 10-digit phone number.';
  }
  if (!values.address.trim() || values.address.trim().length < 6) {
    errors.address = 'Please enter an address of at least 6 characters.';
  }
  if (!values.city.trim()) {
    errors.city = 'Please enter a city.';
  }
  if (!/^\d{6}$/.test(values.pincode.trim())) {
    errors.pincode = 'Please enter a 6-digit PIN code.';
  }
  if (!values.payment) {
    errors.payment = 'Please pick a (fictional) payment method.';
  }
  return errors;
}

export default function CheckoutForm({ onPlaceOrder, defaultValues = {} }) {
  const { record } = useChaos();
  const { play } = useSound();
  const [values, setValues] = useState({
    fullName: defaultValues.fullName || '',
    email: defaultValues.email || '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    payment: 'dignity',
  });
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const errors = validate(values);

  const setField = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) return;
  };

  const blurField = (name) => setTouched((prev) => ({ ...prev, [name]: true }));

  const showError = (name) => touched[name] && errors[name];

  const fillFictional = () => {
    setValues(FICTIONAL_CUSTOMER);
    setTouched({});
    record({ weight: 1 });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const allTouched = Object.keys(values).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {},
    );
    setTouched(allTouched);

    const found = validate(values);
    const firstKey = Object.keys(found)[0];
    if (firstKey) {
      record({
        weight: 2,
        message: 'Validation blocked you. That part is actually good UX. Enjoy it.',
        type: 'warn',
      });
      play('error');
      const el = document.getElementById(firstKey);
      el?.classList.add('oops-shake');
      window.setTimeout(() => el?.classList.remove('oops-shake'), 500);
      el?.focus();
      return;
    }

    setSubmitting(true);
    record({ weight: 6 });
    window.setTimeout(() => {
      setSubmitting(false);
      play('fanfare');
      onPlaceOrder(values);
    }, 650);
  };

  const fieldClass = (name) =>
    `w-full rounded-xl border bg-navy-900/70 px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none ${
      showError(name)
        ? 'border-red-400/70 focus:border-red-400'
        : 'border-white/15 focus:border-brand'
    }`;

  const describedBy = (name) => (showError(name) ? `${name}-error` : undefined);

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-white">Delivery details</h2>
        <button
          type="button"
          onClick={fillFictional}
          className="inline-flex items-center gap-2 rounded-lg border border-acid/40 bg-acid/10 px-3 py-1.5 text-xs font-semibold text-acid transition hover:bg-acid/20"
        >
          <Wand2 className="h-3.5 w-3.5" aria-hidden="true" />
          Pre-fill a fictional human
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="fullName"
            className="mb-1.5 block text-sm font-medium text-white/80"
          >
            Full name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            value={values.fullName}
            onChange={(e) => setField('fullName', e.target.value)}
            onBlur={() => blurField('fullName')}
            aria-invalid={Boolean(showError('fullName'))}
            aria-describedby={describedBy('fullName')}
            className={fieldClass('fullName')}
            placeholder="e.g. Ada Placeholder"
          />
          {showError('fullName') && (
            <p id="fullName-error" className="mt-1.5 text-xs text-red-300">
              {errors.fullName}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-white/80"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => setField('email', e.target.value)}
            onBlur={() => blurField('email')}
            aria-invalid={Boolean(showError('email'))}
            aria-describedby={describedBy('email')}
            className={fieldClass('email')}
            placeholder="you@example.com"
          />
          {showError('email') && (
            <p id="email-error" className="mt-1.5 text-xs text-red-300">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="phone"
            className="mb-1.5 block text-sm font-medium text-white/80"
          >
            Phone (10 digits)
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            value={values.phone}
            onChange={(e) => setField('phone', e.target.value)}
            onBlur={() => blurField('phone')}
            aria-invalid={Boolean(showError('phone'))}
            aria-describedby={describedBy('phone')}
            className={fieldClass('phone')}
            placeholder="9876543210"
          />
          {showError('phone') && (
            <p id="phone-error" className="mt-1.5 text-xs text-red-300">
              {errors.phone}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="city"
            className="mb-1.5 block text-sm font-medium text-white/80"
          >
            City
          </label>
          <input
            id="city"
            name="city"
            type="text"
            autoComplete="address-level2"
            value={values.city}
            onChange={(e) => setField('city', e.target.value)}
            onBlur={() => blurField('city')}
            aria-invalid={Boolean(showError('city'))}
            aria-describedby={describedBy('city')}
            className={fieldClass('city')}
            placeholder="Bengaluru"
          />
          {showError('city') && (
            <p id="city-error" className="mt-1.5 text-xs text-red-300">
              {errors.city}
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="address"
            className="mb-1.5 block text-sm font-medium text-white/80"
          >
            Address
          </label>
          <textarea
            id="address"
            name="address"
            rows={2}
            autoComplete="street-address"
            value={values.address}
            onChange={(e) => setField('address', e.target.value)}
            onBlur={() => blurField('address')}
            aria-invalid={Boolean(showError('address'))}
            aria-describedby={describedBy('address')}
            className={fieldClass('address')}
            placeholder="House, street, landmark the pigeon might ignore"
          />
          {showError('address') && (
            <p id="address-error" className="mt-1.5 text-xs text-red-300">
              {errors.address}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="pincode"
            className="mb-1.5 block text-sm font-medium text-white/80"
          >
            PIN code
          </label>
          <input
            id="pincode"
            name="pincode"
            type="text"
            inputMode="numeric"
            autoComplete="postal-code"
            value={values.pincode}
            onChange={(e) => setField('pincode', e.target.value.replace(/[^\d]/g, ''))}
            onBlur={() => blurField('pincode')}
            aria-invalid={Boolean(showError('pincode'))}
            aria-describedby={describedBy('pincode')}
            className={fieldClass('pincode')}
            placeholder="560001"
            maxLength={6}
          />
          {showError('pincode') && (
            <p id="pincode-error" className="mt-1.5 text-xs text-red-300">
              {errors.pincode}
            </p>
          )}
        </div>
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-white/80">
          Fictional payment method
        </legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {PAYMENT_OPTIONS.map((option) => (
            <label
              key={option.id}
              className={`flex cursor-pointer flex-col gap-1 rounded-xl border p-3 transition ${
                values.payment === option.id
                  ? 'border-brand bg-brand/10'
                  : 'border-white/15 bg-navy-900/50 hover:border-white/30'
              }`}
            >
              <span className="flex items-center gap-2">
                <input
                  type="radio"
                  name="payment"
                  value={option.id}
                  checked={values.payment === option.id}
                  onChange={(e) => setField('payment', e.target.value)}
                  className="accent-brand"
                />
                <span className="text-sm font-semibold text-white">
                  {option.label}
                </span>
              </span>
              <span className="pl-6 text-xs text-white/55">{option.detail}</span>
            </label>
          ))}
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-xs text-amber-200/80">
          <ShieldAlert className="h-3.5 w-3.5" aria-hidden="true" />
          We never ask for card numbers, CVV, UPI or any real payment details.
        </p>
      </fieldset>

      <button
        type="submit"
        disabled={submitting}
        className="chaos-btn inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-base font-bold text-navy transition hover:bg-brand-soft disabled:cursor-wait disabled:opacity-70"
      >
        {submitting ? (
          <>
            <BadgeCheck className="h-5 w-5 animate-pulse" aria-hidden="true" />
            Placing your demo order…
          </>
        ) : (
          <>
            <BadgeCheck className="h-5 w-5" aria-hidden="true" />
            Place Demo Order
          </>
        )}
      </button>
    </form>
  );
}
