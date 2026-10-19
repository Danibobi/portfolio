"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useRecordPlayer(activeIndex: number, audioSrc?: string) {
  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef(0.08);
  const progressElementRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    progressRef.current = 0.06;
    if (progressElementRef.current) {
      progressElementRef.current.style.transform = "scaleX(0.06)";
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (audioSrc) {
      const audio = new Audio(audioSrc);
      audio.preload = "metadata";
      audio.loop = true;
      audioRef.current = audio;
      if (isPlaying) audio.play().catch(() => undefined);
    }
  }, [activeIndex, audioSrc]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.play().catch(() => undefined);
      else audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    lastTimeRef.current = null;
    if (!isPlaying) return;

    const tick = (time: number) => {
      const audio = audioRef.current;
      if (audio?.duration) {
        progressRef.current = audio.currentTime / audio.duration;
      } else if (lastTimeRef.current !== null) {
        progressRef.current = (progressRef.current + (time - lastTimeRef.current) / 42000) % 1;
      }
      if (progressElementRef.current) {
        progressElementRef.current.style.transform = `scaleX(${progressRef.current})`;
      }
      lastTimeRef.current = time;
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [isPlaying]);

  useEffect(() => () => {
    audioRef.current?.pause();
  }, []);

  const toggle = useCallback(() => setIsPlaying((value) => !value), []);
  return { isPlaying, progressElementRef, toggle };
}
