import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import type { BlogBlock } from "@/data/blog";
import { renderInlineText } from "./renderInlineText";

type BlogArticleBodyProps = {
  blocks: BlogBlock[];
};

export function BlogArticleBody({ blocks }: BlogArticleBodyProps) {
  return (
    <article className="prose prose-invert prose-lg max-w-none prose-headings:font-display prose-headings:font-normal prose-headings:tracking-tight prose-h2:mt-12 prose-h2:text-foreground prose-h3:mt-8 prose-h3:text-foreground prose-p:text-[#ccc] prose-p:leading-relaxed prose-li:text-[#ccc] prose-strong:text-foreground prose-a:text-primary prose-blockquote:border-primary prose-blockquote:text-muted-foreground prose-th:text-foreground prose-td:text-[#ccc]">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "p":
            return (
              <p key={i}>{renderInlineText(block.text)}</p>
            );
          case "h2":
            return <h2 key={i}>{block.text}</h2>;
          case "h3":
            return <h3 key={i}>{block.text}</h3>;
          case "ul":
            return (
              <ul key={i}>
                {block.items.map((item, j) => (
                  <li key={j}>{renderInlineText(item)}</li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i}>
                {block.items.map((item, j) => (
                  <li key={j}>{renderInlineText(item)}</li>
                ))}
              </ol>
            );
          case "table":
            return (
              <div key={i} className="not-prose my-8 overflow-x-auto rounded-lg border border-border">
                <table className="w-full min-w-[320px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-secondary/50">
                      {block.headers.map((h) => (
                        <th key={h} className="px-4 py-3 font-semibold text-foreground">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, ri) => (
                      <tr key={ri} className="border-b border-border/60 last:border-0">
                        {row.map((cell, ci) => (
                          <td key={ci} className="px-4 py-3 text-[#ccc]">
                            {renderInlineText(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "blockquote":
            return <blockquote key={i}>{renderInlineText(block.text)}</blockquote>;
          case "cta":
            return (
              <div
                key={i}
                className="not-prose my-10 rounded-xl border border-primary/30 bg-primary/5 p-6 md:p-8"
              >
                {block.title && (
                  <h3 className="font-display text-2xl text-foreground">{block.title}</h3>
                )}
                {block.bullets && block.bullets.length > 0 && (
                  <ul className="mt-4 space-y-2 text-sm text-[#ccc]">
                    {block.bullets.map((b) => (
                      <li key={b} className="flex gap-2">
                        <span className="text-primary" aria-hidden>
                          •
                        </span>
                        {renderInlineText(b)}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Button asChild className="h-12 rounded-lg bg-primary px-8 text-base font-bold text-primary-foreground">
                    <Link to={block.primaryHref}>
                      {block.primaryLabel}
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                  {block.secondaryHref && block.secondaryLabel && (
                    <Button asChild variant="outline" className="h-12 rounded-lg border-border px-8 text-base font-semibold">
                      <Link to={block.secondaryHref}>{block.secondaryLabel}</Link>
                    </Button>
                  )}
                </div>
              </div>
            );
          default:
            return null;
        }
      })}
    </article>
  );
}
