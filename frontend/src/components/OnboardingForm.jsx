import { useState, useRef } from 'react';
import ManifestStrip from './ManifestStrip';

const initialState = { company_name: '', contact_name: '', contact_email: '' };

export default function OnboardingForm() {
  const [fields, setFields] = useState(initialState);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);

  function handleChange(e) {
    setFields((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleFileChange(e) {
    setFile(e.target.files?.[0] ?? null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    const formData = new FormData();
    formData.append('company_name', fields.company_name);
    formData.append('contact_name', fields.contact_name);
    formData.append('contact_email', fields.contact_email);
    if (file) formData.append('document', file);

    try {
      const res = await fetch('/clients/onboard', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Something went wrong. Try again.');
      }

      setStatus('success');
      setFields(initialState);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      setStatus('error');
      setErrorMessage(err.message);
    }
  }

  if (status === 'success') {
    return (
      <div className="intake-card intake-card--done">
        <span className="eyebrow">Record filed</span>
        <h3>You're in the system.</h3>
        <p>
          A confirmation is on its way to your inbox, and your record has moved to{' '}
          <strong>Provision</strong>. No further action needed.
        </p>
        <ManifestStrip activeIndex={2} />
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => setStatus('idle')}
        >
          File another record
        </button>
      </div>
    );
  }

  return (
    <form className="intake-card" onSubmit={handleSubmit} noValidate>
      <span className="eyebrow">New record</span>
      <h3>Start the intake</h3>
      <p className="intake-lede">
        Three fields and, if you have one, a document. That's the whole form.
      </p>

      <label className="field">
        <span>Company name</span>
        <input
          type="text"
          name="company_name"
          value={fields.company_name}
          onChange={handleChange}
          placeholder="Acme Woodworking"
          required
        />
      </label>

      <label className="field">
        <span>Your name</span>
        <input
          type="text"
          name="contact_name"
          value={fields.contact_name}
          onChange={handleChange}
          placeholder="Jordan Lee"
          required
        />
      </label>

      <label className="field">
        <span>Email</span>
        <input
          type="email"
          name="contact_email"
          value={fields.contact_email}
          onChange={handleChange}
          placeholder="jordan@acmewoodworking.com"
          required
        />
      </label>

      <label className="field">
        <span>Document <em>(contract, brief, or spec — optional)</em></span>
        <input
          type="file"
          name="document"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </label>

      {status === 'error' && (
        <p className="field-error" role="alert">
          Filing failed: {errorMessage}
        </p>
      )}

      <button type="submit" className="btn btn--brass" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Filing record…' : 'File intake record'}
      </button>
    </form>
  );
}
