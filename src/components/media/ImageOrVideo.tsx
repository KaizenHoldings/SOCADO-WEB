"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * A medium that can be a still or a video, decided by configuration.
 *
 * Both the /workclub hero and the promo block on the home page show a render
 * today and a video when it arrives, so neither of them should know which one
 * it is: they hand over a `MediaConfig` and swapping the medium is an edit to
 * that object.
 *
 * It always fills its container, so the caller owns the box: a positioned
 * ancestor with a size (a `relative` strip with an aspect ratio, a pinned
 * section). Nothing here sets dimensions.
 *
 * A video is muted and looped — it is decoration, not content — and it stands
 * down to its poster when the visitor asked for less motion or is saving data.
 */
export type MediaConfig =
  | {
      type: "image";
      src: string;
      /** Optional narrow-viewport crop. Falls back to `src` when absent. */
      mobileSrc?: string;
      alt: string;
    }
  | {
      type: "video";
      src: string;
      /** Optional VP9/AV1 sibling, offered before `src`. */
      webmSrc?: string;
      /** Shown while the video loads, and as the only frame under reduced motion. */
      poster: string;
      alt: string;
    };

interface ImageOrVideoProps {
  media: MediaConfig;
  /** `sizes` for the still; required, because the box is the caller's. */
  sizes: string;
  /** Only for a medium above the fold. */
  priority?: boolean;
  /**
   * `auto` starts as soon as the browser allows — for a hero, which is on
   * screen from the first paint. `inView` plays only while the medium is
   * visible, so a block further down the page does not decode video the
   * visitor never reaches.
   */
  playback?: "auto" | "inView";
  preload?: "none" | "metadata" | "auto";
}

/** Fills the container; the caller's box decides the crop. */
const FILL = "object-cover object-center";

export function ImageOrVideo({
  media,
  sizes,
  priority = false,
  playback = "auto",
  preload = "metadata",
}: ImageOrVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  /**
   * Both preferences are read after mount so the server and the first client
   * render agree. Until then the poster is what shows anyway.
   */
  const [standsDown, setStandsDown] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;

    const update = () =>
      setStandsDown(motionQuery.matches || connection?.saveData === true);

    update();
    motionQuery.addEventListener("change", update);
    return () => motionQuery.removeEventListener("change", update);
  }, []);

  /**
   * Playback tied to visibility.
   *
   * The observer is set up only for a video that asked for it, and it is
   * disconnected on cleanup, so a route change or a second mount under Strict
   * Mode cannot leave one behind.
   */
  useEffect(() => {
    if (media.type !== "video" || playback !== "inView" || standsDown) return;

    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // A rejected play() is not a problem: the poster stays.
          void video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
      video.pause();
    };
  }, [media.type, playback, standsDown]);

  if (media.type === "image") {
    return (
      <>
        <Image
          src={media.src}
          alt={media.alt}
          fill
          priority={priority}
          sizes={sizes}
          className={`${FILL} ${media.mobileSrc ? "hidden md:block" : ""}`}
        />
        {media.mobileSrc && (
          <Image
            src={media.mobileSrc}
            alt={media.alt}
            fill
            priority={priority}
            sizes={sizes}
            className={`${FILL} md:hidden`}
          />
        )}
      </>
    );
  }

  if (standsDown) {
    // Reduced motion or data saver: the poster frame stands in for the video.
    return (
      <Image
        src={media.poster}
        alt={media.alt}
        fill
        priority={priority}
        sizes={sizes}
        className={FILL}
      />
    );
  }

  return (
    <video
      ref={videoRef}
      poster={media.poster}
      autoPlay={playback === "auto"}
      muted
      loop
      playsInline
      preload={preload}
      aria-label={media.alt}
      className={`absolute inset-0 h-full w-full ${FILL}`}
    >
      {/* A .webm sibling, when it exists, is offered before the .mp4 */}
      {media.webmSrc && <source src={media.webmSrc} type="video/webm" />}
      <source src={media.src} type="video/mp4" />
    </video>
  );
}

export default ImageOrVideo;
