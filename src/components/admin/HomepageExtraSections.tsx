import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { arrayToLines, linesToArray } from "@/lib/homepageCms";
import type { HomepageCmsPayload } from "@/types/homepageCms";

type Props = {
  draft: HomepageCmsPayload;
  setDraft: React.Dispatch<React.SetStateAction<HomepageCmsPayload>>;
};

export function HomepageExtraSections({ draft, setDraft }: Props) {
  return (
    <div className="space-y-8">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Stats bar</CardTitle>
          <CardDescription>Four numbers below the hero.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {draft.stats.map((stat, index) => (
            <div key={`stat-${index}`} className="grid grid-cols-2 gap-2 sm:col-span-2">
              <div className="space-y-2">
                <Label>Value {index + 1}</Label>
                <Input
                  value={stat.value}
                  onChange={(e) =>
                    setDraft((c) => {
                      const stats = [...c.stats];
                      stats[index] = { ...stats[index], value: e.target.value };
                      return { ...c, stats };
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Label {index + 1}</Label>
                <Input
                  value={stat.label}
                  onChange={(e) =>
                    setDraft((c) => {
                      const stats = [...c.stats];
                      stats[index] = { ...stats[index], label: e.target.value };
                      return { ...c, stats };
                    })
                  }
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Who it&apos;s for</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label>Eyebrow</Label>
              <Input value={draft.who.eyebrow} onChange={(e) => setDraft((c) => ({ ...c, who: { ...c.who, eyebrow: e.target.value } }))} />
            </div>
            <div className="space-y-2">
              <Label>Headline</Label>
              <Input value={draft.who.headline} onChange={(e) => setDraft((c) => ({ ...c, who: { ...c.who, headline: e.target.value } }))} />
            </div>
            <div className="space-y-2">
              <Label>Highlighted text</Label>
              <Input
                value={draft.who.headlineHighlight}
                onChange={(e) => setDraft((c) => ({ ...c, who: { ...c.who, headlineHighlight: e.target.value } }))}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Headline suffix</Label>
              <Input
                value={draft.who.headlineSuffix}
                onChange={(e) => setDraft((c) => ({ ...c, who: { ...c.who, headlineSuffix: e.target.value } }))}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Body</Label>
              <Textarea rows={3} value={draft.who.body} onChange={(e) => setDraft((c) => ({ ...c, who: { ...c.who, body: e.target.value } }))} />
            </div>
          </div>
          {(["fathers", "founders", "professionals"] as const).map((key) => (
            <div key={key} className="rounded-lg border border-border/50 p-4 space-y-3">
              <p className="text-sm font-semibold capitalize">{key}</p>
              <Input
                placeholder="Card title"
                value={draft.who.cards[key].title}
                onChange={(e) =>
                  setDraft((c) => ({
                    ...c,
                    who: { ...c.who, cards: { ...c.who.cards, [key]: { ...c.who.cards[key], title: e.target.value } } },
                  }))
                }
              />
              <Textarea
                rows={3}
                value={draft.who.cards[key].text}
                onChange={(e) =>
                  setDraft((c) => ({
                    ...c,
                    who: { ...c.who, cards: { ...c.who.cards, [key]: { ...c.who.cards[key], text: e.target.value } } },
                  }))
                }
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Pricing tiers (home)</CardTitle>
          <CardDescription>Prices still come from pricing config — edit copy and benefits only.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Textarea
            rows={2}
            value={draft.tiers.subhead}
            onChange={(e) => setDraft((c) => ({ ...c, tiers: { ...c.tiers, subhead: e.target.value } }))}
          />
          {(["selfGuided", "coached", "elite"] as const).map((tierKey) => (
            <div key={tierKey} className="rounded-lg border border-border/50 p-4 space-y-3">
              <p className="text-sm font-semibold">{tierKey}</p>
              <Input
                value={draft.tiers[tierKey].name}
                onChange={(e) =>
                  setDraft((c) => ({
                    ...c,
                    tiers: { ...c.tiers, [tierKey]: { ...c.tiers[tierKey], name: e.target.value } },
                  }))
                }
              />
              <Textarea
                rows={5}
                value={arrayToLines(draft.tiers[tierKey].benefits)}
                onChange={(e) =>
                  setDraft((c) => ({
                    ...c,
                    tiers: { ...c.tiers, [tierKey]: { ...c.tiers[tierKey], benefits: linesToArray(e.target.value) } },
                  }))
                }
              />
              <Input
                placeholder="CTA button"
                value={draft.tiers[tierKey].cta}
                onChange={(e) =>
                  setDraft((c) => ({
                    ...c,
                    tiers: { ...c.tiers, [tierKey]: { ...c.tiers[tierKey], cta: e.target.value } },
                  }))
                }
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Three pillars</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {draft.pillars.items.map((pillar, index) => (
            <div key={pillar.num} className="grid gap-2 rounded-lg border border-border/50 p-4">
              <Input
                value={pillar.title}
                onChange={(e) =>
                  setDraft((c) => {
                    const items = [...c.pillars.items];
                    items[index] = { ...items[index], title: e.target.value };
                    return { ...c, pillars: { ...c.pillars, items } };
                  })
                }
              />
              <Textarea
                rows={3}
                value={pillar.text}
                onChange={(e) =>
                  setDraft((c) => {
                    const items = [...c.pillars.items];
                    items[index] = { ...items[index], text: e.target.value };
                    return { ...c, pillars: { ...c.pillars, items } };
                  })
                }
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Testimonials & FAQ headers</CardTitle>
          <CardDescription>FAQ answers are edited under Site pages → FAQ.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          {(["testimonials", "faq"] as const).map((key) => (
            <div key={key} className="space-y-3">
              <p className="text-sm font-semibold capitalize">{key}</p>
              <Input
                value={draft[key].eyebrow}
                onChange={(e) => setDraft((c) => ({ ...c, [key]: { ...c[key], eyebrow: e.target.value } }))}
              />
              <Input
                value={draft[key].headline}
                onChange={(e) => setDraft((c) => ({ ...c, [key]: { ...c[key], headline: e.target.value } }))}
              />
              <Input
                value={draft[key].headlineHighlight}
                onChange={(e) => setDraft((c) => ({ ...c, [key]: { ...c[key], headlineHighlight: e.target.value } }))}
              />
              <Textarea
                rows={2}
                value={draft[key].subhead}
                onChange={(e) => setDraft((c) => ({ ...c, [key]: { ...c[key], subhead: e.target.value } }))}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Final CTA</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            value={draft.finalCta.headline}
            onChange={(e) => setDraft((c) => ({ ...c, finalCta: { ...c.finalCta, headline: e.target.value } }))}
          />
          <Input
            value={draft.finalCta.headlineHighlight}
            onChange={(e) => setDraft((c) => ({ ...c, finalCta: { ...c.finalCta, headlineHighlight: e.target.value } }))}
          />
          <Textarea
            rows={2}
            value={draft.finalCta.body}
            onChange={(e) => setDraft((c) => ({ ...c, finalCta: { ...c.finalCta, body: e.target.value } }))}
          />
        </CardContent>
      </Card>
    </div>
  );
}
