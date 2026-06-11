import { CheckCircle2, Play, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import { EmptyState } from "../components/EmptyState.jsx";
import { LoadingSkeleton } from "../components/LoadingSkeleton.jsx";
import { PageHeader } from "../components/PageHeader.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useApiResource } from "../hooks/useApiResource.js";
import { api, getErrorMessage } from "../services/api.js";
import { currency, shortDate, titleCase } from "../utils/formatters.js";

export const RideHistory = () => {
  const { user } = useAuth();
  const { items, loading, load } = useApiResource("/rides");
  const action = async (path, body = {}) => {
    try { await api.put(path, body); toast.success("Ride updated"); load(); } catch (error) { toast.error(getErrorMessage(error)); }
  };
  return (
    <>
      <PageHeader eyebrow="Ride History" title="Rides" description="Track ride requests, accepted rides, live status, cancellations, and completed trips." />
      {loading ? <LoadingSkeleton /> : items.length ? <div className="grid gap-4 xl:grid-cols-2">
        {items.map((ride) => (
          <article className="glass-panel rounded-lg p-5" key={ride._id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div><p className="text-xs font-black uppercase text-taxi">{titleCase(ride.status)}</p><h3 className="mt-1 text-lg font-black text-slate-950 dark:text-white">{ride.pickup.address} to {ride.drop.address}</h3><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{shortDate(ride.createdAt)} | {titleCase(ride.vehicleType)} | {ride.distanceKm} km</p></div>
              <p className="rounded-lg bg-taxi/20 px-3 py-2 text-sm font-black text-taxi">{currency(ride.finalFare || ride.estimatedFare)}</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {user.role === "driver" && ride.status === "requested" && <button className="btn-primary" onClick={() => action(`/rides/${ride._id}/accept`)}><CheckCircle2 className="h-4 w-4" /> Accept</button>}
              {user.role === "driver" && ["driver-assigned", "driver-arriving"].includes(ride.status) && <button className="btn-primary" onClick={() => action(`/rides/${ride._id}/status`, { status: "started" })}><Play className="h-4 w-4" /> Start</button>}
              {user.role === "driver" && ride.status === "started" && <button className="btn-primary" onClick={() => action(`/rides/${ride._id}/status`, { status: "completed", paymentMethod: "cash" })}><CheckCircle2 className="h-4 w-4" /> Complete</button>}
              {!["completed", "cancelled"].includes(ride.status) && <button className="btn-secondary" onClick={() => action(`/rides/${ride._id}/cancel`)}><XCircle className="h-4 w-4" /> Cancel</button>}
            </div>
          </article>
        ))}
      </div> : <EmptyState title="No rides yet" description="Book or accept rides to see history here." />}
    </>
  );
};
