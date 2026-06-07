import { useTranslation } from "react-i18next";

type Props = {
  percent: number;
  currentDay: number;
  daysRemaining: number;
  weekNumber: number;
  isComplete: boolean;
};

export function ProgramProgressRing({ percent, currentDay, daysRemaining, weekNumber, isComplete }: Props) {
  const { t } = useTranslation("dashboard");
  const r = 52;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div className="relative h-44 w-44 md:h-52 md:w-52">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120" aria-hidden>
          <circle cx="60" cy="60" r={r} fill="none" className="stroke-border/80" strokeWidth="10" />
          <circle
            cx="60"
            cy="60"
            r={r}
            fill="none"
            className="stroke-primary transition-[stroke-dashoffset] duration-700 ease-out"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          {isComplete ? (
            <>
              <span className="text-3xl md:text-4xl font-black text-gradient">90</span>
              <span className="text-[10px] uppercase tracking-widest text-primary font-bold mt-1">{t("progressRing.daysDone")}</span>
            </>
          ) : (
            <>
              <span className="text-3xl md:text-4xl font-black tabular-nums">{currentDay}</span>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mt-0.5">{t("progressRing.of90Days")}</span>
              <span className="text-xs text-primary font-bold mt-2">{t("progressRing.week", { n: weekNumber })}</span>
            </>
          )}
        </div>
      </div>
      {!isComplete && (
        <p className="text-sm text-muted-foreground mt-2">
          <span className="text-foreground font-semibold">{daysRemaining}</span> {t("progressRing.daysLeftInBlock")}
        </p>
      )}
      {isComplete && <p className="text-sm text-primary font-medium mt-2">{t("progressRing.blockComplete")}</p>}
    </div>
  );
}
