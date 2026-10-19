"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import type { RecordPhoto } from "@/data/records";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(Flip);

interface PhotoCollageProps {
  images: RecordPhoto[];
  featuredIndex?: number;
  label: string;
}

const compactPlacements = [
  "1 / 3 / 2 / 4",
  "2 / 3 / 3 / 4",
];

const archivePlacements = [
  "1 / 3 / 2 / 5",
  "2 / 3 / 3 / 4",
  "2 / 4 / 3 / 5",
  "3 / 1 / 4 / 2",
  "3 / 2 / 4 / 3",
  "3 / 3 / 4 / 5",
  "4 / 1 / 5 / 3",
  "4 / 3 / 5 / 4",
  "4 / 4 / 5 / 5",
];

function getPlacement(count: number, isFeatured: boolean, thumbnailIndex: number) {
  if (isFeatured) return count > 3 ? "1 / 1 / 3 / 3" : "1 / 1 / 3 / 3";
  if (count === 2) return "1 / 3 / 3 / 4";
  if (count === 3) return compactPlacements[thumbnailIndex];
  return archivePlacements[thumbnailIndex];
}

export function PhotoCollage({ images, featuredIndex = 0, label }: PhotoCollageProps) {
  const [activeIndex, setActiveIndex] = useState(featuredIndex);
  const gridRef = useRef<HTMLDivElement>(null);
  const flipStateRef = useRef<ReturnType<typeof Flip.getState> | null>(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const state = flipStateRef.current;
    if (!state || !gridRef.current) return;
    flipStateRef.current = null;

    if (reducedMotion) {
      gsap.fromTo(
        gridRef.current.querySelectorAll(".photo-collage__item"),
        { opacity: 0.72 },
        { opacity: 1, duration: 0.18, ease: "power1.out" },
      );
      return;
    }

    Flip.from(state, {
      targets: gridRef.current.querySelectorAll(".photo-collage__item"),
      duration: 0.48,
      ease: "power3.inOut",
      absolute: true,
      scale: true,
      stagger: 0.018,
    });
  }, [activeIndex, reducedMotion]);

  const promote = (index: number) => {
    if (index === activeIndex || !gridRef.current) return;
    if (!reducedMotion) {
      flipStateRef.current = Flip.getState(
        gridRef.current.querySelectorAll(".photo-collage__item"),
      );
    } else {
      flipStateRef.current = Flip.getState([]);
    }
    setActiveIndex(index);
  };

  let thumbnailIndex = 0;

  return (
    <div
      ref={gridRef}
      className={`photo-collage photo-collage--${images.length > 3 ? "archive" : images.length}`}
      aria-label={`${label} photo collage`}
    >
      {images.map((photo, index) => {
        const isFeatured = index === activeIndex;
        const placement = getPlacement(images.length, isFeatured, isFeatured ? 0 : thumbnailIndex++);

        return (
          <button
            type="button"
            className={`photo-collage__item ${isFeatured ? "is-featured" : "is-thumbnail"}`}
            style={{ gridArea: placement }}
            onClick={() => promote(index)}
            aria-pressed={isFeatured}
            aria-label={isFeatured ? `${photo.alt}, featured photo` : `Feature photo: ${photo.alt}`}
            key={photo.src}
          >
            <img
              src={photo.src}
              alt={photo.alt}
              style={{ objectPosition: photo.objectPosition ?? "center" }}
              loading={isFeatured ? "eager" : "lazy"}
              draggable={false}
            />
            <span className="photo-collage__index" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
          </button>
        );
      })}
      <span className="media-caption">SELECT A PHOTO TO FEATURE</span>
    </div>
  );
}
