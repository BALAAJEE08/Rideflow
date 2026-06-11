import { Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { EmptyState } from "../components/EmptyState.jsx";
import { PageHeader } from "../components/PageHeader.jsx";
import { StatCard } from "../components/StatCard.jsx";
import { api } from "../services/api.js";
import { currency, shortDate } from "../utils/formatters.js";

export const Earnings = () => {
  const [data, setData] = useState({ totalEarnings: 0, completedTrips: 0, rides: [] });
  useEffect(() => { api.get("/drivers/earnings").then(({ data }) => setData(data)).catch(() => {}); }, []);
  return (
    <>
      <PageHeader eyebrow="Driver Earnings" title="Earnings" description="Completed ride earnings and trip history." />
      <div className="grid gap-4 md:grid-cols-2"><StatCard label="Total Earnings" value={currency(data.totalEarnings)} icon={Wallet} /><StatCard label="Completed Trips" value={data.completedTrips} icon={Wallet} tone="bg-signal/15 text-signal" /></div>
      <div className="mt-6">{data.rides.length ? data.rides.map((ride) => <div className="glass-panel mb-3 rounded-lg p-4" key={ride._id}><p className="font-black text-slate-950 dark:text-white">{ride.pickup.address} to {ride.drop.address}</p><p className="text-sm text-slate-500 dark:text-slate-400">{shortDate(ride.updatedAt)} | {currency(ride.finalFare)}</p></div>) : <EmptyState title="No earnings yet" description="Completed rides will appear here." />}</div>
    </>
  );
};
