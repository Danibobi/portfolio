import { RecordItem } from "@/data/records";
import { PhotoCollage } from "./PhotoCollage";
import { VinylRecord } from "./VinylRecord";

interface RecordMediaProps {
  record: RecordItem;
  isPlaying: boolean;
}

export function RecordMedia({ record, isPlaying }: RecordMediaProps) {
  const media = record.coverMedia;

  return (
    <div className={`detail-media-group detail-media-group--${media.type}`}>
      <VinylRecord
        className="detail-vinyl"
        src={record.vinylImage}
        alt={`${record.title} record`}
        isPlaying={isPlaying}
      />

      {media.type === "video" ? (
        <div className="detail-rich-media detail-video-frame">
          <video autoPlay muted loop controls playsInline preload="auto" aria-label={`${record.title} demo video`}>
            <source src={media.src} type="video/mp4" />
          </video>
        </div>
      ) : media.type === "collage" ? (
        <PhotoCollage
          key={record.id}
          images={media.images}
          featuredIndex={media.featuredIndex}
          label={record.title}
        />
      ) : (
        <img
          className="detail-cover"
          src={media.image.src}
          alt={media.image.alt}
          style={{ objectPosition: media.image.objectPosition ?? "center" }}
          draggable={false}
        />
      )}
    </div>
  );
}
