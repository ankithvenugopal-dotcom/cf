import { globalConfig } from "../config/sections.js";

/**
 * Fixed nav bar rendered ONCE for the whole page (never remounts per section).
 * Links and logo come entirely from globalConfig.
 */
export default function Nav() {
  const { navLinks, logo } = globalConfig;
  const mid = Math.ceil(navLinks.length / 2);
  const leftLinks = navLinks.slice(0, mid);
  const rightLinks = navLinks.slice(mid);

  return (
    <nav className="nav">
      <ul className="nav-links">
        {leftLinks.map((link) => (
          <li key={link}>
            <a href="#" onClick={(e) => e.preventDefault()}>{link}</a>
          </li>
        ))}
      </ul>
      <img className="nav-logo" src={logo} alt="logo" />
      <ul className="nav-links">
        {rightLinks.map((link) => (
          <li key={link}>
            <a href="#" onClick={(e) => e.preventDefault()}>{link}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
