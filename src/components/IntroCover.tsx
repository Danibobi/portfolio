"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { INTRO_SESSION_KEY } from "@/lib/intro";

const ZOOM_START = 3.4;

function readIntroSeen() {
  try {
    return window.sessionStorage.getItem(INTRO_SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

function rememberIntro() {
  try {
    window.sessionStorage.setItem(INTRO_SESSION_KEY, "1");
  } catch {
    // The intro still works when storage is unavailable.
  }
}

export function IntroCover() {
  const [introDone, setIntroDone] = useState(false);
  const coverRef = useRef<HTMLElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const skipRequestedRef = useRef(false);
  const completedRef = useRef(false);
  const unlockRef = useRef<() => void>(() => undefined);

  const requestSkip = useCallback(() => {
    if (completedRef.current) return;

    skipRequestedRef.current = true;
    rememberIntro();

    const timeline = timelineRef.current;
    if (!timeline) return;

    const zoomStart = timeline.labels.zoom ?? 0;
    if (timeline.time() < zoomStart) timeline.seek(zoomStart);
    timeline.play();
  }, []);

  useLayoutEffect(() => {
    const root = document.documentElement;
    if (root.dataset.introState === "seen" || readIntroSeen()) {
      root.dataset.introState = "seen";
      completedRef.current = true;
      setIntroDone(true);
      return;
    }

    root.dataset.introState = "active";
    const experience = document.querySelector<HTMLElement>(".experience");
    const arrows = Array.from(document.querySelectorAll<HTMLButtonElement>(".player-navigation button"));
    const arrowStates = arrows.map((button) => button.disabled);
    const previousHtmlOverflow = root.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    const previousInert = experience?.inert ?? false;
    const previousAriaHidden = experience?.getAttribute("aria-hidden") ?? null;
    let unlocked = false;

    root.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    if (experience) {
      experience.inert = true;
      experience.setAttribute("aria-hidden", "true");
    }
    arrows.forEach((button) => {
      button.disabled = true;
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === "Escape") {
        event.preventDefault();
        event.stopImmediatePropagation();
        requestSkip();
        return;
      }

      if (event.key === "ArrowLeft" || event.key === "ArrowRight" || event.code === "Space") {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };

    window.addEventListener("keydown", onKeyDown, true);

    const unlock = () => {
      if (unlocked) return;
      unlocked = true;
      window.removeEventListener("keydown", onKeyDown, true);
      root.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;

      if (experience) {
        experience.inert = previousInert;
        if (previousAriaHidden === null) experience.removeAttribute("aria-hidden");
        else experience.setAttribute("aria-hidden", previousAriaHidden);
      }

      arrows.forEach((button, index) => {
        button.disabled = arrowStates[index];
      });
    };

    unlockRef.current = unlock;
    return unlock;
  }, [requestSkip]);

  useEffect(() => {
    if (introDone) return;

    let cancelled = false;

    const startIntro = async () => {
      const cover = coverRef.current;
      const plane = planeRef.current;
      const stage = stageRef.current;
      const experience = document.querySelector<HTMLElement>(".experience");
      const currentVinyl = experience?.querySelector<HTMLElement>(".carousel-current");
      const visibleVinyls = experience
        ? Array.from(experience.querySelectorAll<HTMLImageElement>(".carousel .vinyl-image")).slice(0, 3)
        : [];

      if (!cover || !plane || !stage || !experience || !currentVinyl) return;

      await Promise.all([
        document.fonts.ready,
        ...visibleVinyls.map((image) => image.decode()),
      ]).catch(() => undefined);

      if (cancelled) return;

      const title = cover.querySelector<HTMLElement>("[data-intro-title]");
      const experienceRect = experience.getBoundingClientRect();
      const vinylRect = currentVinyl.getBoundingClientRect();
      const originX = ((vinylRect.left + vinylRect.width / 2 - experienceRect.left) / experienceRect.width) * 100;
      const originY = ((vinylRect.top + vinylRect.height / 2 - experienceRect.top) / experienceRect.height) * 100;
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const finishIntro = () => {
        if (completedRef.current) return;
        completedRef.current = true;
        rememberIntro();
        document.documentElement.dataset.introState = "seen";
        unlockRef.current();
        gsap.set(experience, { clearProps: "transform,transformOrigin,willChange" });
        gsap.set([plane, stage], { clearProps: "transform,willChange" });
        timelineRef.current = null;
        setIntroDone(true);
      };

      gsap.set([plane, stage, experience], { willChange: "transform" });
      gsap.set(experience, { transformOrigin: `${originX}% ${originY}%` });

      const timeline = gsap.timeline({ paused: true, onComplete: finishIntro });
      timelineRef.current = timeline;

      if (!title) return;

      if (reducedMotion) {
        gsap.set(title, { opacity: 1, y: 0 });
        gsap.set(experience, { scale: 1 });
        timeline
          .addLabel("zoom", 0)
          .to(plane, { opacity: 0, duration: 0.4, ease: "power1.out" }, 0);
      } else {
        gsap.set(experience, { scale: 1.5 });
        timeline
          .to(title, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, 0.05)
          .to(stage, { scale: 1.03, duration: 2, ease: "none" }, 1.4)
          .addLabel("zoom", ZOOM_START)
          .to(plane, { scale: 2.5, opacity: 0, duration: 1.2, ease: "power3.in" }, ZOOM_START)
          .to(experience, { scale: 1, duration: 1.2, ease: "expo.out" }, ZOOM_START);
      }

      if (skipRequestedRef.current) {
        const zoomStart = timeline.labels.zoom ?? 0;
        timeline.seek(zoomStart);
      }
      timeline.play();
    };

    void startIntro();
    return () => {
      cancelled = true;
      timelineRef.current?.kill();
      timelineRef.current = null;
    };
  }, [introDone]);

  if (introDone) return null;

  return (
    <section
      ref={coverRef}
      className="intro-cover"
      aria-labelledby="intro-title"
      onPointerDown={requestSkip}
    >
      <div ref={planeRef} className="intro-plane">
        <div ref={stageRef} className="intro-stage">
          <h1 id="intro-title" className="intro-title" data-intro-title>
            By Artist to Artist
          </h1>
        </div>
      </div>
    </section>
  );
}
