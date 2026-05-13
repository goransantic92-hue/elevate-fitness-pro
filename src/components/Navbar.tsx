import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Dumbbell, Instagram, LayoutDashboard, Link2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { programPublicPath } from "@/lib/programNav";

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
  "https://linktr.ee/pt_dubai_milos35?utm_source=ig&utm_medium=social&utm_content=link_in_bio";

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
          <Dumbbell className="h-6 w-6 text-primary" />
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
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Coach Milos on Instagram">
              <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
                <Instagram className="h-4 w-4" />
              </Button>
            </a>
            <a href={LINKTREE_URL} target="_blank" rel="noopener noreferrer" aria-label="Coach Milos on Linktree">
              <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
                <Link2 className="h-4 w-4" />
              </Button>
            </a>
          </div>
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm" className="gap-1.5">
                    <LayoutDashboard className="h-4 w-4" />
                    Your Training
                  </Button>
                </Link>
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="ghost" size="sm" className="gap-1.5 text-amber-500">
                      <Shield className="h-4 w-4" />
                      Admin
                    </Button>
                  </Link>
                )}
                <Button variant="outline" size="sm" onClick={() => signOut()}>
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Log In
                  </Button>
                </Link>
                <Link to="/coaching-apply">
                  <Button size="sm" variant="outline" className="font-semibold border-border hover:border-primary hover:text-primary">
                    Apply for Coaching
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold">
                    €39 Program
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        <button className="lg:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-background/95 backdrop-blur-xl border-b border-border">
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
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Button variant="outline" size="icon" className="h-10 w-10">
                  <Instagram className="h-4 w-4" />
                </Button>
              </a>
              <a href={LINKTREE_URL} target="_blank" rel="noopener noreferrer" aria-label="Linktree">
                <Button variant="outline" size="icon" className="h-10 w-10">
                  <Link2 className="h-4 w-4" />
                </Button>
              </a>
            </div>
            <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border">
              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <LayoutDashboard className="h-4 w-4" />
                      Your Training
                    </Button>
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start gap-2 text-amber-500">
                        <Shield className="h-4 w-4" />
                        Admin
                      </Button>
                    </Link>
                  )}
                  <Button variant="outline" className="w-full" onClick={() => { setOpen(false); signOut(); }}>
                    Sign out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)}>
                    <Button variant="ghost" className="w-full">
                      Log In
                    </Button>
                  </Link>
                  <Link to="/coaching-apply" onClick={() => setOpen(false)}>
                    <Button variant="outline" className="w-full font-semibold border-border">
                      Apply for Coaching
                    </Button>
                  </Link>
                  <Link to="/pricing" onClick={() => setOpen(false)}>
                    <Button className="w-full bg-primary text-primary-foreground font-bold">€39 Program</Button>
                  </Link>
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
