import type { Wine, WineType } from "./types";

export const WINE_TYPE_LABELS: Record<WineType, string> = {
  rod: "Rødvin",
  hvit: "Hvitvin",
  rose: "Rosé",
  musserende: "Musserende",
  sot: "Søtvin",
  sterk: "Sterkvin",
};

const NBSP = " ";

export const formatNumber = (value: number) =>
  Math.round(value).toLocaleString("nb-NO");

export const formatPrice = (value: number) => `${formatNumber(value)}${NBSP}kr`;

export const formatAbv = (value: number) =>
  `${value.toFixed(1).replace(".", ",")}${NBSP}%`;

export const formatDate = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString("nb-NO", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Oslo",
  });

export const formatGrapes = (grapes: Wine["grapes"]) =>
  grapes
    .map((g) => (g.percent ? `${g.name} ${g.percent}${NBSP}%` : g.name))
    .join(", ");

export const formatOrigin = ({ region, country }: Pick<Wine, "region" | "country">) =>
  region ? `${region}, ${country}` : country;

export const joinParts = (parts: (string | number | undefined)[]) =>
  parts.filter(Boolean).join(" · ");
