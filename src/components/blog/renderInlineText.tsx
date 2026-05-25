import type { ReactNode } from "react";
import { Link } from "react-router-dom";

/** Renders **bold**, *italic*, and [label](/path) in blog copy. */
export function renderInlineText(text: string) {
  const parts: ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(text.slice(last, match.index));
    }
    const token = match[0];
    if (token.startsWith("**")) {
      parts.push(<strong key={match.index}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("*")) {
      parts.push(<em key={match.index}>{token.slice(1, -1)}</em>);
    } else {
      const linkMatch = /\[([^\]]+)\]\(([^)]+)\)/.exec(token);
      if (linkMatch) {
        const [, label, href] = linkMatch;
        if (href.startsWith("/")) {
          parts.push(
            <Link key={match.index} to={href} className="text-primary underline underline-offset-4 hover:text-primary/90">
              {label}
            </Link>,
          );
        } else {
          parts.push(
            <a key={match.index} href={href} className="text-primary underline underline-offset-4 hover:text-primary/90">
              {label}
            </a>,
          );
        }
      }
    }
    last = match.index + token.length;
  }

  if (last < text.length) {
    parts.push(text.slice(last));
  }

  return parts.length > 0 ? parts : text;
}
