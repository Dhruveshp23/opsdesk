const STAGES = [
  { code: '01', label: 'Intake', detail: 'Client submits details' },
  { code: '02', label: 'Verify', detail: 'Record confirmed' },
  { code: '03', label: 'Provision', detail: 'Welcome + document stored' },
  { code: '04', label: 'Live', detail: 'Client active in system' },
];

export default function ManifestStrip({ activeIndex = -1 }) {
  return (
    <div className="manifest-strip" role="list" aria-label="Onboarding pipeline stages">
      {STAGES.map((stage, i) => (
        <div
          className={`manifest-tab${i <= activeIndex ? ' is-active' : ''}`}
          role="listitem"
          key={stage.code}
        >
          <span className="manifest-code">{stage.code}</span>
          <span className="manifest-label">{stage.label}</span>
          <span className="manifest-detail">{stage.detail}</span>
        </div>
      ))}
    </div>
  );
}
