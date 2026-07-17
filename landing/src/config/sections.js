// =============================================================================
// ALL editable site content lives in THIS file. Components only read from here.
// To add a new scroll section: copy a block in `sections` below, change the
// text, and drop a new background file into /public/backgrounds/.
// =============================================================================

// ===== EDIT HERE [1]: GLOBAL SETTINGS =====
export const globalConfig = {
  navLinks: ["Home", "Studio", "Experiences", "Technologies", "Journal", "Contact"], // <-- nav bar links
  logo: "/logo/star-icon.svg", // <-- center logo/icon
  cardStyle: {
    borderRadius: 24,
    blur: 20, // glass blur strength (px)
    shadow: "0 8px 30px rgba(0,0,0,0.25)",
  },
};

// ===== EDIT HERE [2]: SECTIONS (one object per scroll section) =====
export const sections = [
  {
    id: "section-1",
    background: {
      type: "image", // <-- "image" or "video"
      src: "/backgrounds/garden-portal.svg", // <-- swap background media here
      // poster: "/backgrounds/garden-portal.svg", // <-- only needed for type "video": static image used on mobile / before playback
    },
    headline: "STEP › INTO WONDER", // <-- big headline text
    tagline:
      "Designing immersive digital experiences that blur the line between imagination and reality.",
    scrollPrompt: "Enter Experience", // <-- text on the bottom scroll-down button
    cards: [
      // <-- cards for THIS section only
      { type: "video-thumb", label: "Watch Demo", image: "/cards/demo-1.svg" },
      { type: "stat", label: "Global Partners", value: "32", image: "/cards/demo-2.svg" },
      { type: "video-thumb", label: "Watch Demo", image: "/cards/demo-3.svg" },
    ],
  },
  {
    id: "section-2",
    background: {
      type: "image",
      src: "/backgrounds/pastel-clouds.svg",
    },
    headline: "CREATE BEYOND REALITY",
    tagline:
      "Exclusive journeys to breathtaking destinations curated for travelers seeking rare, unforgettable moments.",
    scrollPrompt: "Explore More",
    cards: [
      { type: "note", color: "#c9e6ff", label: "Private Retreats", body: "Discover secluded destinations reserved for a handful of guests each season." },
      { type: "note", color: "#f6e6b4", label: "Curated Adventures", body: "Experiences tailored around your pace, your passions, and your sense of wonder." },
      { type: "note", color: "#d9c9f2", label: "Luxury Concierge", body: "Dedicated support from the first inquiry to the journey home." },
      { type: "note", color: "#bfe6c8", label: "Nature Escapes", body: "Reconnect with untouched landscapes far from the crowds." },
      { type: "note", color: "#f2c9d6", label: "Exclusive Access", body: "Locations closed to the public, opened just for you." },
    ],
  },
  {
    id: "section-3",
    background: {
      type: "image",
      src: "/backgrounds/aurora-tech.svg",
    },
    headline: "ENGINEERED FOR EMOTION",
    tagline:
      "Realtime engines, spatial audio, and generative visuals — the invisible craft behind every moment of awe.",
    scrollPrompt: "Back to Top",
    cards: [
      { type: "stat", label: "Immersive Installations", value: "120+", image: "/cards/demo-2.svg" },
      { type: "video-thumb", label: "Behind the Scenes", image: "/cards/demo-1.svg" },
      { type: "stat", label: "Countries Reached", value: "18", image: "/cards/demo-3.svg" },
    ],
  },
  // ===== EDIT HERE [3]: ADD MORE SECTIONS BY COPYING A BLOCK ABOVE =====
];
