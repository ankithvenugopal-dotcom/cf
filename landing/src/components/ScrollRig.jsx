import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Shared GSAP ScrollTrigger wiring for the whole page:
 *  - tracks which section is active (drives background crossfade + video pause)
 *  - snaps the scroll position to section boundaries
 *
 * Sections themselves stay dumb: they get `isActive` as a prop.
 */
export default function ScrollRig({ sectionIds, onActiveChange, children }) {
  useEffect(() => {
    const triggers = sectionIds.map((id, index) =>
      ScrollTrigger.create({
        trigger: `#${id}`,
        start: "top 50%",
        end: "bottom 50%",
        onToggle: (self) => {
          if (self.isActive) onActiveChange(index);
        },
      })
    );

    // Snap to whichever section top is nearest when scrolling stops.
    // Positions are computed live so variable-height sections (mobile) work.
    const snap = ScrollTrigger.create({
      trigger: "#scroll-rig",
      start: "top top",
      end: "bottom bottom",
      snap: {
        snapTo: (progress) => {
          const max = ScrollTrigger.maxScroll(window);
          if (!max) return progress;
          const points = sectionIds.map((id) => {
            const el = document.getElementById(id);
            return el ? el.offsetTop / max : 0;
          });
          return gsap.utils.snap(points, progress);
        },
        duration: { min: 0.25, max: 0.6 },
        delay: 0.1,
        ease: "power1.inOut",
      },
    });

    ScrollTrigger.refresh();

    return () => {
      triggers.forEach((t) => t.kill());
      snap.kill();
    };
  }, [sectionIds.join("|"), onActiveChange]);

  return <div id="scroll-rig">{children}</div>;
}

/**
 * Reveal animation shared by all sections: every element inside the returned
 * scope ref marked with [data-reveal] fades/slides up as the section enters
 * the viewport, and reverses when it leaves.
 */
export function useSectionReveal(sectionId) {
  const scopeRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-reveal]", {
        opacity: 0,
        y: 48,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: `#${sectionId}`,
          start: "top 55%",
          end: "bottom 45%",
          toggleActions: "play reverse restart reverse",
        },
      });
    }, scopeRef);

    return () => ctx.revert();
  }, [sectionId]);

  return scopeRef;
}

/** Smooth-scroll helper used by the scroll prompt button. */
export function scrollToSection(sectionId) {
  const el = sectionId ? document.getElementById(sectionId) : null;
  const top = el ? el.offsetTop : 0;
  window.scrollTo({ top, behavior: "smooth" });
}
