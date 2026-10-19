import type { CSSProperties } from "react";

interface VinylRecordProps {
  src: string;
  alt: string;
  className?: string;
  isPlaying: boolean;
  style?: CSSProperties;
}

export function VinylRecord({ src, alt, className = "", isPlaying, style }: VinylRecordProps) {
  return (
    <div className={`vinyl-shell ${className}`} style={style}>
      <img
        className={`vinyl-image ${isPlaying ? "is-spinning" : "is-paused"}`}
        src={src}
        alt={alt}
        draggable={false}
      />
    </div>
  );
}
