import { useCallback, useEffect, useState } from "react";
import Nav from "./components/Nav.jsx";
import Section from "./components/Section.jsx";
import ScrollRig from "./components/ScrollRig.jsx";
import { globalConfig, sections } from "./config/sections.js";

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia(`(max-width: ${breakpoint}px)`).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const onChange = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [breakpoint]);
  return isMobile;
}

export default function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const isMobile = useIsMobile();
  const sectionIds = sections.map((s) => s.id);
  const onActiveChange = useCallback((index) => setActiveIndex(index), []);

  const { cardStyle } = globalConfig;

  return (
    <div
      className="site"
      style={{
        "--card-radius": `${cardStyle.borderRadius}px`,
        "--card-blur": `${cardStyle.blur}px`,
        "--card-shadow": cardStyle.shadow,
      }}
    >
      <Nav />
      <ScrollRig sectionIds={sectionIds} onActiveChange={onActiveChange}>
        {sections.map((section, i) => (
          <Section
            key={section.id}
            section={section}
            isActive={i === activeIndex}
            isMobile={isMobile}
            nextSectionId={sections[i + 1]?.id}
          />
        ))}
      </ScrollRig>
    </div>
  );
}
