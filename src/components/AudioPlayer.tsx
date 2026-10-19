import type { RefObject } from "react";

interface AudioPlayerProps {
  activeIndex: number;
  total: number;
  isPlaying: boolean;
  progressElementRef: RefObject<HTMLDivElement | null>;
  accent: string;
  onToggle: () => void;
  onPrevious: () => void;
  onNext: () => void;
  disabled: boolean;
  detailMode: boolean;
}

export function AudioPlayer({
  activeIndex,
  total,
  isPlaying,
  progressElementRef,
  accent,
  onToggle,
  onPrevious,
  onNext,
  disabled,
  detailMode,
}: AudioPlayerProps) {
  return (
    <div className={`player ${detailMode ? "player--detail" : ""}`}>
      <button
        className="player-toggle"
        onClick={onToggle}
        aria-label={isPlaying ? "Pause record" : "Play record"}
      >
        {isPlaying ? (
          <span className="pause-icon" aria-hidden="true"><i /><i /></span>
        ) : (
          <span className="play-icon" aria-hidden="true" />
        )}
      </button>
      <span className="player-count" aria-label={`Record ${activeIndex + 1} of ${total}`}>
        {String(activeIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </span>
      <div className="player-track" aria-hidden="true">
        <div
          ref={progressElementRef}
          className="player-progress"
          style={{ transform: "scaleX(0.06)", backgroundColor: accent }}
        />
      </div>
      {!detailMode && (
        <div className="player-navigation">
          <button onClick={onPrevious} disabled={disabled} aria-label="Previous record">←</button>
          <button onClick={onNext} disabled={disabled} aria-label="Next record">→</button>
        </div>
      )}
    </div>
  );
}
