import { CarTaxiFront } from "lucide-react";

export const EmptyState = ({ title = "No data yet", description = "Records will appear here." }) => (
  <div className="glass-panel rounded-lg p-8 text-center">
    <CarTaxiFront className="mx-auto h-10 w-10 text-taxi" />
    <h3 className="mt-3 text-base font-bold text-slate-950 dark:text-white">{title}</h3>
    <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">{description}</p>
  </div>
);
