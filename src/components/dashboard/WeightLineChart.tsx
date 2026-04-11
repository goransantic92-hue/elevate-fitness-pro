import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export type WeightPoint = { week: number; kg: number };

type Props = {
  data: WeightPoint[];
};

export function WeightLineChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="h-[200px] flex items-center justify-center rounded-xl border border-dashed border-border/60 bg-card/30 text-sm text-muted-foreground px-4 text-center">
        Log your Monday weight on the Progress page — your trend line appears here.
      </div>
    );
  }

  return (
    <div className="h-[220px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
          <XAxis dataKey="week" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} tickLine={false} axisLine={false} label={{ value: "Week", position: "bottom", offset: 0, fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
          <YAxis
            domain={["auto", "auto"]}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={44}
            tickFormatter={(v) => `${v}`}
          />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "12px",
              fontSize: "12px",
            }}
            labelFormatter={(w) => `Week ${w}`}
            formatter={(value: number) => [`${value} kg`, "Weight"]}
          />
          <Line type="monotone" dataKey="kg" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ fill: "hsl(var(--primary))", r: 4 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
