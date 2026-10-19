"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { getRecordLeadImage, recordImageSources, records } from "@/data/records";
import { useRecordPlayer } from "@/hooks/useRecordPlayer";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { AudioPlayer } from "./AudioPlayer";
import { RecordDetail } from "./RecordDetail";
import { TransitionShape } from "./TransitionShape";
import { VinylCarousel } from "./VinylCarousel";

type ViewMode = "carousel" | "detail";
type Direction = -1 | 1;

interface CarouselHandoff {
  direction: Direction;
}

export function RecordExperience() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>("carousel");
  const [transitioning, setTransitioning] = useState(false);
  const [direction, setDirection] = useState<Direction>(1);
  const [ribbonColor, setRibbonColor] = useState(records[0].backgroundColor);
  const rootRef = useRef<HTMLElement>(null);
  const shapeRef = useRef<HTMLDivElement>(null);
  const carouselTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const carouselHandoffRef = useRef<CarouselHandoff | null>(null);
  const carouselNeedsEntranceRef = useRef(true);
  const carouselTransitionActiveRef = useRef(false);
  const pendingCarouselDirectionRef = useRef<Direction | null>(null);
  const navigateRef = useRef<(nextDirection: Direction) => void>(() => undefined);
  const preloadedImagesRef = useRef<HTMLImageElement[]>([]);
  const reducedMotion = useReducedMotion();
  const current = records[activeIndex];
  const { isPlaying, progressElementRef, toggle } = useRecordPlayer(activeIndex, current.audioSrc);

  useEffect(() => {
    const images = recordImageSources.map((src) => {
      const image = new Image();
      image.decoding = "async";
      image.src = src;
      void image.decode().catch(() => undefined);
      return image;
    });

    preloadedImagesRef.current = images;
    return () => {
      preloadedImagesRef.current = [];
    };
  }, []);

  useEffect(() => {
    const image = new Image();
    image.decoding = "async";
    image.src = getRecordLeadImage(current);
    void image.decode().catch(() => undefined);
    preloadedImagesRef.current.push(image);
  }, [current]);

  useLayoutEffect(() => {
    if (viewMode !== "carousel" || !rootRef.current) return;

    const currentElement = rootRef.current.querySelector<HTMLElement>(".carousel-current");
    const backgroundLines = gsap.utils.toArray<HTMLElement>(".background-type span", rootRef.current);
    if (!currentElement) return;

    const handoff = carouselHandoffRef.current;
    const runningTimeline = carouselTimelineRef.current;

    if (handoff && runningTimeline) {
      const insertionTime = runningTimeline.time();
      const entranceDuration = reducedMotion ? 0.16 : 0.38;

      runningTimeline.set(
        currentElement,
        {
          x: reducedMotion ? 0 : handoff.direction * 260,
          rotation: reducedMotion ? 0 : handoff.direction * 540,
          opacity: 0,
          scale: 0.88,
        },
        insertionTime,
      );
      runningTimeline.to(
        currentElement,
        {
          x: 0,
          rotation: 0,
          opacity: 1,
          scale: 1,
          duration: reducedMotion ? entranceDuration : 0.55,
          ease: "power3.out",
          clearProps: "transform",
        },
        insertionTime,
      );
      runningTimeline.fromTo(
        backgroundLines,
        { yPercent: reducedMotion ? 0 : handoff.direction * 20, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: reducedMotion ? 0.14 : 0.3,
          stagger: reducedMotion ? 0 : 0.035,
          ease: "power2.out",
        },
        insertionTime,
      );

      carouselHandoffRef.current = null;
      runningTimeline.play();
      return;
    }

    if (!carouselNeedsEntranceRef.current) return;
    carouselNeedsEntranceRef.current = false;

    gsap.fromTo(
      currentElement,
      { x: reducedMotion ? 0 : direction * 260, rotation: reducedMotion ? 0 : direction * 540, opacity: 0, scale: 0.88 },
      { x: 0, rotation: 0, opacity: 1, scale: 1, duration: reducedMotion ? 0.22 : 0.72, ease: "power3.out", clearProps: "transform" },
    );
    gsap.fromTo(
      backgroundLines,
      { yPercent: reducedMotion ? 0 : direction * 20, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: reducedMotion ? 0.2 : 0.65, stagger: 0.06, ease: "power2.out" },
    );
  }, [activeIndex, direction, reducedMotion, viewMode]);

  useEffect(() => () => {
    carouselTimelineRef.current?.kill();
    carouselTransitionActiveRef.current = false;
    pendingCarouselDirectionRef.current = null;
  }, []);

  useLayoutEffect(() => {
    if (viewMode !== "detail") return;
    const duration = reducedMotion ? 0.2 : 0.75;
    const ctx = gsap.context(() => {
      gsap.set(".detail-copy", { opacity: 1, y: 0 });
      gsap.fromTo([".detail-cover", ".detail-rich-media", ".photo-collage"], { x: reducedMotion ? 0 : -55, opacity: 0 }, { x: 0, opacity: 1, duration, ease: "power3.out" });
      gsap.fromTo(".detail-vinyl", { x: reducedMotion ? 0 : 50, scale: 0.86, opacity: 0 }, { x: 0, scale: 1, opacity: 1, duration: duration + 0.15, ease: "power3.out" });
      gsap.fromTo(
        [".detail-kicker", ".detail-copy h1", ".detail-description", ".detail-highlights", ".purchase-button"],
        { y: reducedMotion ? 0 : 28, opacity: 0 },
        { y: 0, opacity: 1, duration: duration * 0.86, stagger: reducedMotion ? 0 : 0.075, ease: "power2.out", delay: reducedMotion ? 0 : 0.1 },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [activeIndex, reducedMotion, viewMode]);

  const navigate = useCallback((nextDirection: Direction) => {
    if (viewMode === "carousel") {
      if (carouselTransitionActiveRef.current) {
        pendingCarouselDirectionRef.current = nextDirection;
        return;
      }
      carouselTransitionActiveRef.current = true;
    } else if (transitioning) {
      return;
    }

    setTransitioning(true);
    setDirection(nextDirection);

    const nextIndex = (activeIndex + nextDirection + records.length) % records.length;
    if (viewMode === "detail") {
      const duration = reducedMotion ? 0.18 : 0.42;
      gsap.to([".detail-cover", ".detail-rich-media", ".photo-collage", ".detail-vinyl"], {
        x: reducedMotion ? 0 : nextDirection * -100,
        opacity: 0,
        duration,
        ease: "power3.in",
      });
      gsap.to(".detail-copy", {
        y: reducedMotion ? 0 : 20,
        opacity: 0,
        duration: duration * 0.85,
        ease: "power2.in",
        onComplete: () => {
          setActiveIndex(nextIndex);
          setTransitioning(false);
        },
      });
      return;
    }

    setRibbonColor(current.backgroundColor);
    const currentElement = rootRef.current?.querySelector<HTMLElement>(".carousel-current");
    if (!currentElement) {
      carouselTransitionActiveRef.current = false;
      setTransitioning(false);
      return;
    }

    const backgroundLines = rootRef.current
      ? gsap.utils.toArray<HTMLElement>(".background-type span", rootRef.current)
      : [];
    const staleTargets = [currentElement, ...backgroundLines, shapeRef.current].filter(Boolean);

    carouselTimelineRef.current?.kill();
    gsap.killTweensOf(staleTargets);

    const outgoingDuration = reducedMotion ? 0.12 : 0.3;
    const timeline = gsap.timeline({
      onComplete: () => {
        if (carouselTimelineRef.current === timeline) {
          carouselTimelineRef.current = null;
          carouselTransitionActiveRef.current = false;

          const pendingDirection = pendingCarouselDirectionRef.current;
          pendingCarouselDirectionRef.current = null;
          if (pendingDirection) {
            requestAnimationFrame(() => navigateRef.current(pendingDirection));
          } else {
            setTransitioning(false);
          }
        }
      },
    });
    carouselTimelineRef.current = timeline;

    timeline.to(currentElement, {
      x: reducedMotion ? 0 : nextDirection * -310,
      rotation: reducedMotion ? 0 : nextDirection * -270,
      opacity: 0,
      scale: 0.84,
      duration: outgoingDuration,
      ease: "power3.in",
    }, 0);
    if (!reducedMotion && shapeRef.current) {
      timeline.fromTo(
        shapeRef.current,
        { x: nextDirection > 0 ? "-125vw" : "125vw", scaleX: nextDirection },
        { x: nextDirection > 0 ? "125vw" : "-125vw", duration: 0.6, ease: "power3.inOut" },
        0,
      );
    }
    timeline.addPause(outgoingDuration, () => {
      carouselHandoffRef.current = { direction: nextDirection };
      setActiveIndex(nextIndex);
    });
  }, [activeIndex, current.backgroundColor, reducedMotion, transitioning, viewMode]);

  useLayoutEffect(() => {
    navigateRef.current = navigate;
  }, [navigate]);

  const openDetail = useCallback(() => {
    if (transitioning) return;
    setTransitioning(true);
    gsap.to(".carousel-current", {
      scale: reducedMotion ? 1 : 1.08,
      opacity: 0,
      duration: reducedMotion ? 0.16 : 0.4,
      ease: "power3.in",
      onComplete: () => {
        setViewMode("detail");
        setTransitioning(false);
      },
    });
  }, [reducedMotion, transitioning]);

  const closeDetail = useCallback(() => {
    if (transitioning) return;
    setTransitioning(true);
    gsap.to(".detail-content", {
      opacity: 0,
      scale: reducedMotion ? 1 : 0.97,
      duration: reducedMotion ? 0.16 : 0.46,
      ease: "power3.in",
      onComplete: () => {
        carouselNeedsEntranceRef.current = true;
        setViewMode("carousel");
        setTransitioning(false);
      },
    });
  }, [reducedMotion, transitioning]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") navigate(-1);
      if (event.key === "ArrowRight") navigate(1);
      if (event.key === "Escape" && viewMode === "detail") closeDetail();
      if (event.key === "Enter" && viewMode === "carousel") openDetail();
      if (event.code === "Space" && !(event.target instanceof HTMLAnchorElement)) {
        event.preventDefault();
        toggle();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeDetail, navigate, openDetail, toggle, viewMode]);

  return (
    <main
      ref={rootRef}
      className={`experience experience--${viewMode}`}
      style={{ backgroundColor: viewMode === "detail" ? "#101a17" : current.backgroundColor }}
    >
      <div className="archive-mark" aria-hidden="true">LIFE–07</div>
      <a className="contact-link" href="mailto:gal.danibobi@icloud.com">
        <span>CONTACT</span>
        <span className="contact-email">gal.danibobi@icloud.com</span>
      </a>
      {viewMode === "carousel" ? (
        <VinylCarousel records={records} activeIndex={activeIndex} isPlaying={isPlaying} onOpen={openDetail} />
      ) : (
        <RecordDetail
          record={current}
          isPlaying={isPlaying}
          disabled={transitioning}
          onClose={closeDetail}
          onPrevious={() => navigate(-1)}
          onNext={() => navigate(1)}
        />
      )}
      <TransitionShape ref={shapeRef} color={ribbonColor} />
      <AudioPlayer
        activeIndex={activeIndex}
        total={records.length}
        isPlaying={isPlaying}
        progressElementRef={progressElementRef}
        accent="#df1971"
        onToggle={toggle}
        onPrevious={() => navigate(-1)}
        onNext={() => navigate(1)}
        disabled={viewMode === "detail" && transitioning}
        detailMode={viewMode === "detail"}
      />
      <div className="grain" aria-hidden="true" />
    </main>
  );
}
