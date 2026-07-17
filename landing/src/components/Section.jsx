import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Card from "./Card.jsx";
import { useSectionReveal, scrollToSection } from "./ScrollRig.jsx";

const cardRowVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

// Alternating tilt so the row reads like dealt sticky notes (flat on mobile).
function cardRotation(index, isMobile) {
  if (isMobile) return 0;
  const magnitude = 3 + (index % 3) * 1.5;
  return index % 2 === 0 ? -magnitude : magnitude;
}

/**
 * One full-viewport scroll section. Everything it shows — background,
 * headline, tagline, cards, scroll prompt — comes from the `section` object
 * out of sections.js.
 *
 * The background is a fixed, full-bleed layer that crossfades (0.6s CSS
 * opacity transition) as `isActive` flips, so section changes never hard-cut.
 */
export default function Section({ section, isActive, isMobile, nextSectionId }) {
  const scopeRef = useSectionReveal(section.id);
  const videoRef = useRef(null);

  const { background } = section;
  const showVideo = background.type === "video" && !isMobile;

  // Pause off-screen videos to save performance.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isActive) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isActive, showVideo]);

  return (
    <section id={section.id} className="section" ref={scopeRef}>
      <div className={`section-bg${isActive ? " is-active" : ""}`} aria-hidden="true">
        {showVideo ? (
          <video
            ref={videoRef}
            src={background.src}
            poster={background.poster}
            muted
            loop
            playsInline
            autoPlay={isActive}
          />
        ) : (
          // type "image", or type "video" on mobile -> static poster instead
          <img
            src={background.type === "video" ? background.poster : background.src}
            alt=""
          />
        )}
      </div>

      <div className="section-content">
        <h1 className="headline" data-reveal>{section.headline}</h1>
        <p className="tagline" data-reveal>{section.tagline}</p>

        <motion.div
          className="card-row"
          variants={cardRowVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: isMobile ? 0.15 : 0.4 }}
        >
          {section.cards.map((card, i) => (
            <Card
              key={`${section.id}-card-${i}`}
              card={card}
              rotate={cardRotation(i, isMobile)}
            />
          ))}
        </motion.div>

        <button
          className="scroll-prompt"
          data-reveal
          onClick={() => scrollToSection(nextSectionId)}
        >
          <span className="scroll-prompt-circle" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 4v16m0 0l-6-6m6 6l6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="scroll-prompt-label">{section.scrollPrompt}</span>
        </button>
      </div>
    </section>
  );
}
