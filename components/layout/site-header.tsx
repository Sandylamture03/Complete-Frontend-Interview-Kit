import Link from "next/link";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/interview-bank", label: "Interview Bank" },
  { href: "/tracks", label: "Tracks" },
  { href: "/resources", label: "Resources" },
  { href: "/drills", label: "Drills" },
  { href: "/coding", label: "Coding" },
  { href: "/mock", label: "Mock" },
  { href: "/resume", label: "Resume" },
  { href: "/revision", label: "Revision" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link href="/" className="brand">
        <span className="brand-kicker">Frontend Interview Prep OS</span>
        <span className="brand-title">One place to learn, revise, practice, and answer well.</span>
      </Link>

      <nav className="site-nav" aria-label="Primary">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="nav-link">
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
