import { motion } from "framer-motion";

export const StatCard = ({ label, value, icon: Icon, tone = "bg-taxi/20 text-taxi" }) => (
  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-lg p-5">
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        <p className="mt-2 text-2xl font-black text-slate-950 dark:text-white">{value}</p>
      </div>
      {Icon && <div className={`rounded-lg p-3 ${tone}`}><Icon className="h-5 w-5" /></div>}
    </div>
  </motion.div>
);
