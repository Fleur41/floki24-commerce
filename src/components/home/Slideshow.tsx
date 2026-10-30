"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { format } from "@/i18n/config";
import { useDictionary } from "@/i18n/client";
import type { Slide } from "@/content/home";
import styles from "./Slideshow.module.css";

const AUTOPLAY_INTERVAL_MS = 5000;

type SlideshowProps = {
  slides: Slide[];
};

export function Slideshow({ slides }: SlideshowProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const { home } = useDictionary();
  const [isPaused, setPaused] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isPaused || prefersReducedMotion || slides.length < 2) return;

    const timer = setInterval(
      () => setActiveIndex((index) => (index + 1) % slides.length),
      AUTOPLAY_INTERVAL_MS,
    );
    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  return (
    <section
      className={styles.slideshow}
      aria-roledescription="carousel"
      aria-label={home.slideshow}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className={styles.track} style={{ translate: `${-activeIndex * 100}% 0` }}>
        {slides.map((slide, index) => (
          <div
            key={slide.href}
            className={styles.slide}
            role="group"
            aria-roledescription="slide"
            aria-label={format(home.slideOf, { index: index + 1, total: slides.length })}
            inert={index !== activeIndex}
          >
            <Link href={slide.href} className={styles.media} tabIndex={-1} aria-hidden>
              <Image
                src={slide.image}
                alt=""
                fill
                sizes="100vw"
                className={styles.image}
                preload={index === 0}
              />
            </Link>
            <div className={styles.content}>
              <h2 className={styles.heading}>{slide.title}</h2>
              <p className={styles.subheading}>{slide.subheading}</p>
              <Link href={slide.href} className={styles.button}>
                {slide.buttonLabel}
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.dots}>
        {slides.map((slide, index) => (
          <button
            key={slide.href}
            type="button"
            className={styles.dot}
            aria-label={format(home.slide, { index: index + 1 })}
            aria-current={index === activeIndex}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </section>
  );
}
