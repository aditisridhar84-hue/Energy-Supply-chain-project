import './Provenance.css';

export default function Provenance({ source }) {
  if (!source) {
    return (
      <div className="provenance provenance--pending">
        Not independently verified yet — connect a live data feed to populate this.
      </div>
    );
  }
  return (
    <div className="provenance">
      <dl>
        <div><dt>Source</dt><dd>{source.name}</dd></div>
        <div><dt>Dataset</dt><dd>{source.dataset}</dd></div>
        <div><dt>Period</dt><dd>{source.period}</dd></div>
        <div><dt>Unit</dt><dd>{source.unit}</dd></div>
        <div><dt>Type</dt><dd>{source.type}</dd></div>
      </dl>
      {source.url && (
        <a href={source.url} target="_blank" rel="noreferrer noopener">View source →</a>
      )}
    </div>
  );
}
