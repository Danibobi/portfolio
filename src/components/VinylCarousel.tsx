import { RecordItem } from "@/data/records";
import { VinylRecord } from "./VinylRecord";

interface VinylCarouselProps {
  records: RecordItem[];
  activeIndex: number;
  isPlaying: boolean;
  onOpen: () => void;
}

export function VinylCarousel({ records, activeIndex, isPlaying, onOpen }: VinylCarouselProps) {
  const previous = records[(activeIndex - 1 + records.length) % records.length];
  const current = records[activeIndex];
  const next = records[(activeIndex + 1) % records.length];

  return (
    <section className="carousel" aria-label="Vinyl record carousel">
      <div className="background-type" aria-hidden="true">
        {current.backgroundText.split("\n").map((line) => <span key={line}>{line}</span>)}
      </div>
      <VinylRecord
        className="carousel-neighbor carousel-neighbor--left"
        src={previous.vinylImage}
        alt=""
        isPlaying={isPlaying}
      />
      <button className="carousel-current" onClick={onOpen} aria-label={`Open ${current.title} by ${current.artist}`}>
        <VinylRecord
          src={current.vinylImage}
          alt={`${current.title} record by ${current.artist}`}
          isPlaying={isPlaying}
        />
        <span className="record-hint" aria-hidden="true">OPEN RECORD</span>
      </button>
      <VinylRecord
        className="carousel-neighbor carousel-neighbor--right"
        src={next.vinylImage}
        alt=""
        isPlaying={isPlaying}
      />
    </section>
  );
}
