import { motion } from "framer-motion";

// Cards are "dealt" in: rise from below with extra tilt, settling into their
// resting rotation. `custom` carries the per-card resting angle.
const cardVariants = {
  hidden: (rotate) => ({
    opacity: 0,
    y: 90,
    rotate: rotate * 2.5,
    scale: 0.88,
  }),
  visible: (rotate) => ({
    opacity: 1,
    y: 0,
    rotate,
    scale: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  }),
};

/**
 * Renders one glass card. The `card.type` field from sections.js picks the
 * variant — no component changes needed for new config content:
 *   "video-thumb" -> image thumbnail + play button + label
 *   "stat"        -> big number + label
 *   "note"        -> colored glass card with label + body text
 */
export default function Card({ card, rotate }) {
  return (
    <motion.div
      className={`card card--${card.type}`}
      style={card.color ? { "--note-color": card.color } : undefined}
      custom={rotate}
      variants={cardVariants}
    >
      {card.type === "video-thumb" && (
        <>
          <div className="card-thumb">
            <img src={card.image} alt={card.label} />
            <button className="play-btn" aria-label={`Play: ${card.label}`}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
          <span className="card-label">{card.label}</span>
        </>
      )}

      {card.type === "stat" && (
        <>
          <span className="card-value">{card.value}</span>
          <span className="card-label">{card.label}</span>
        </>
      )}

      {card.type === "note" && (
        <>
          <span className="card-label">{card.label}</span>
          <p className="card-body">{card.body}</p>
        </>
      )}
    </motion.div>
  );
}
