import { RecordItem } from "@/data/records";
import { RecordMedia } from "./RecordMedia";

interface RecordDetailProps {
  record: RecordItem;
  isPlaying: boolean;
  disabled: boolean;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

export function RecordDetail({
  record,
  isPlaying,
  disabled,
  onClose,
  onPrevious,
  onNext,
}: RecordDetailProps) {
  return (
    <section className="detail" aria-label={`${record.title}: ${record.artist}`}>
      <button className="detail-close" onClick={onClose} disabled={disabled} aria-label="Close album details">
        <span>×</span>
      </button>
      <button className="detail-arrow detail-arrow--left" onClick={onPrevious} disabled={disabled} aria-label="Previous record">←</button>
      <button className="detail-arrow detail-arrow--right" onClick={onNext} disabled={disabled} aria-label="Next record">→</button>
      <div className="detail-content">
        <RecordMedia record={record} isPlaying={isPlaying} />
        <div className="detail-copy">
          <p className="detail-kicker">SIDE {record.archiveNumber} · {record.period}</p>
          <h1>{record.displayTitle}<br /><span>{record.artist}</span></h1>
          <p className="detail-description">{record.description}</p>
          <ul className="detail-highlights">
            {record.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
          </ul>
          {record.linkUrl && record.linkLabel ? (
            <a className="purchase-button" href={record.linkUrl} target="_blank" rel="noreferrer">
              <span>{record.linkLabel}</span><i>→</i>
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
