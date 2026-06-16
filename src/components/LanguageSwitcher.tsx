import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AppLanguage } from "@/i18n/constants";

const LANGUAGES: { code: AppLanguage; labelKey: "en" | "ar" | "sr" }[] = [
  { code: "en", labelKey: "en" },
  { code: "ar", labelKey: "ar" },
  { code: "sr", labelKey: "sr" },
];

type Props = {
  className?: string;
  variant?: "ghost" | "outline";
  size?: "sm" | "icon";
};

export function LanguageSwitcher({ className, variant = "ghost", size = "sm" }: Props) {
  const { i18n, t } = useTranslation();
  const current = (i18n.language?.split("-")[0] ?? "en") as AppLanguage;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant={variant}
          size={size === "icon" ? "icon" : size}
          className={className}
          aria-label={t("language.label")}
        >
          <Globe className="h-4 w-4 shrink-0" aria-hidden />
          {size !== "icon" && <span className="ms-1.5 text-xs font-semibold uppercase">{current}</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LANGUAGES.map(({ code, labelKey }) => (
          <DropdownMenuItem
            key={code}
            onClick={() => void i18n.changeLanguage(code)}
            className={current === code ? "font-semibold text-primary" : undefined}
          >
            {t(`language.${labelKey}`)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
