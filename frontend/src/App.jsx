import ManifestStrip from './components/ManifestStrip';
import OnboardingForm from './components/OnboardingForm';
import './App.css';

export default function App() {
  return (
    <div className="page">
      <header className="site-header">
        <div className="wrap site-header__inner">
          <span className="wordmark">OpsDesk</span>
          <a href="#intake" className="btn btn--small">Start intake</a>
        </div>
      </header>

      <section className="hero">
        <div className="wrap hero__grid">
          <div className="hero__copy">
            <span className="eyebrow">Intake desk</span>
            <h1>
              Every new client.<br />One clean record.
            </h1>
            <p className="hero__lede">
              Stop chasing onboarding across email threads and shared drives.
              Submit once — OpsDesk files the record, sends the welcome, and
              stores the paperwork automatically.
            </p>
            <div className="hero__actions">
              <a href="#intake" className="btn btn--brass">File a new client</a>
              <a href="#how" className="btn btn--ghost">See how it works</a>
            </div>
          </div>

          <div className="hero__visual" aria-hidden="true">
            <div className="ticket">
              <div className="ticket__row">
                <span className="ticket__label">Client</span>
                <span className="ticket__value">Acme Woodworking</span>
              </div>
              <div className="ticket__row">
                <span className="ticket__label">Status</span>
                <span className="ticket__value ticket__value--live">Live</span>
              </div>
              <div className="ticket__row">
                <span className="ticket__label">Filed</span>
                <span className="ticket__value">0.4s ago</span>
              </div>
              <div className="ticket__stamp">FILED</div>
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="how">
        <div className="wrap">
          <span className="eyebrow">The pipeline</span>
          <h2>What happens when you file a record</h2>
          <ManifestStrip activeIndex={3} />
        </div>
      </section>

      <section id="intake" className="intake">
        <div className="wrap intake__grid">
          <div className="intake__copy">
            <span className="eyebrow">Ready when you are</span>
            <h2>No account. No setup. Just the intake.</h2>
            <p>
              Fill in the client's details below. If you have a contract or
              brief on hand, attach it — it's stored securely alongside the
              record.
            </p>
          </div>
          <OnboardingForm />
        </div>
      </section>

      <footer className="site-footer">
        <div className="wrap">
          <span className="wordmark wordmark--small">OpsDesk</span>
          <span className="site-footer__note">Built for small teams who'd rather work than file paperwork.</span>
        </div>
      </footer>
    </div>
  );
}
