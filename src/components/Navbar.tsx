import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Dumbbell, Instagram, LayoutDashboard, Link2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { programPublicPath } from "@/lib/programNav";
import { MEMBER_APP_LINK_LABEL } from "@/lib/memberAppLabels";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/program", label: "Program" },
  { href: "/training", label: "Training" },
  { href: "/nutrition", label: "Nutrition" },
  { href: "/results", label: "Results" },
  { href: "/faq", label: "FAQ" },
  { href: "/pricing", label: "Pricing" },
] as const;

const INSTAGRAM_URL = "https://www.instagram.com/_coachmilos/";
const LINKTREE_URL =
  "https://linktr.ee/_coachmilos?utm_source=linktree_profile_share&ltsid=fe5925df-65e8-4bb1-a976-f26dd53ef32d";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin, signOut, configured, hasProgramAccess, loading } = useAuth();

  const navOpts = { configured, hasProgramAccess, loading, user };

  const linkTo = (href: string) => {
    if (href === "/training") return programPublicPath("/training", navOpts);
    if (href === "/nutrition") return programPublicPath("/nutrition", navOpts);
    return href;
  };

  const linkActive = (href: string, to: string) => {
    if (href === "/training") return location.pathname === "/training";
    if (href === "/nutrition") return location.pathname === "/nutrition";
    return location.pathname === to;
  };

  const scrollHomeTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" onClick={scrollHomeTop} className="flex items-center gap-2 font-display text-xl font-bold tracking-tight">
          <Dumbbell className="h-6 w-6 text-primary" aria-hidden />
          <span>
            BUSY<span className="text-primary">STRONG</span>90
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const to = linkTo(link.href);
            return (
              <Link
                key={link.href}
                to={to}
                onClick={link.href === "/" ? scrollHomeTop : undefined}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  linkActive(link.href, to) ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Button asChild variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Coach Milos on Instagram">
                <Instagram className="h-4 w-4" aria-hidden />
              </a>
            </Button>
            <Button asChild variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
              <a href={LINKTREE_URL} target="_blank" rel="noopener noreferrer" aria-label="Coach Milos on Linktree">
                <Link2 className="h-4 w-4" aria-hidden />
              </a>
            </Button>
          </div>
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Button asChild variant="ghost" size="sm" className="gap-1.5">
                  <Link to="/dashboard">
                    <LayoutDashboard className="h-4 w-4" aria-hidden />
                    {MEMBER_APP_LINK_LABEL}
                  </Link>
                </Button>
                {isAdmin && (
                  <Button asChild variant="ghost" size="sm" className="gap-1.5 text-amber-500">
                    <Link to="/admin">
                      <Shield className="h-4 w-4" aria-hidden />
                      Admin
                    </Link>
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={() => signOut()}>
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/login">Log In</Link>
                </Button>
                <Button asChild size="sm" variant="outline" className="font-semibold border-border">
                  <Link to="/coaching-apply">Apply for Coaching</Link>
                </Button>
                <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold">
                  <Link to="/pricing">€39 Program</Link>
                </Button>
              </>
            )}
          </div>
        </div>

        <button
          type="button"
          className="lg:hidden text-foreground"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobile-nav-menu"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-6 w-6" aria-hidden /> : <Menu className="h-6 w-6" aria-hidden />}
        </button>
      </div>

      {open && (
        <div id="mobile-nav-menu" className="lg:hidden bg-background/95 backdrop-blur-xl border-b border-border">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
            {navLinks.map((link) => {
              const to = linkTo(link.href);
              return (
                <Link
                  key={link.href}
                  to={to}
                  onClick={() => {
                    if (link.href === "/") scrollHomeTop();
                    setOpen(false);
                  }}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    linkActive(link.href, to) ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="flex items-center justify-center gap-2 py-3 border-t border-border">
              <Button asChild variant="outline" size="icon" className="h-10 w-10">
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Coach Milos on Instagram">
                  <Instagram className="h-4 w-4" aria-hidden />
                </a>
              </Button>
              <Button asChild variant="outline" size="icon" className="h-10 w-10">
                <a href={LINKTREE_URL} target="_blank" rel="noopener noreferrer" aria-label="Coach Milos on Linktree">
                  <Link2 className="h-4 w-4" aria-hidden />
                </a>
              </Button>
            </div>
            <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border">
              {user ? (
                <>
                  <Button asChild variant="ghost" className="w-full justify-start gap-2">
                    <Link to="/dashboard" onClick={() => setOpen(false)}>
                      <LayoutDashboard className="h-4 w-4" aria-hidden />
                      {MEMBER_APP_LINK_LABEL}
                    </Link>
                  </Button>
                  {isAdmin && (
                    <Button asChild variant="ghost" className="w-full justify-start gap-2 text-amber-500">
                      <Link to="/admin" onClick={() => setOpen(false)}>
                        <Shield className="h-4 w-4" aria-hidden />
                        Admin
                      </Link>
                    </Button>
                  )}
                  <Button variant="outline" className="w-full" onClick={() => { setOpen(false); signOut(); }}>
                    Sign out
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild variant="ghost" className="w-full">
                    <Link to="/login" onClick={() => setOpen(false)}>Log In</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full font-semibold border-border">
                    <Link to="/coaching-apply" onClick={() => setOpen(false)}>Apply for Coaching</Link>
                  </Button>
                  <Button asChild className="w-full bg-primary text-primary-foreground font-bold">
                    <Link to="/pricing" onClick={() => setOpen(false)}>€39 Program</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
