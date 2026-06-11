import { Car, IndianRupee, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FormField } from "../components/FormField.jsx";
import { PageHeader } from "../components/PageHeader.jsx";
import { StatCard } from "../components/StatCard.jsx";
import { api, getErrorMessage } from "../services/api.js";
import { currency, titleCase } from "../utils/formatters.js";

export const BookRide = () => {
  const [vehicles, setVehicles] = useState([]);
  const [estimate, setEstimate] = useState(null);
  const [form, setForm] = useState({ pickup: "Chennai Central", drop: "T Nagar", distanceKm: 8, vehicleType: "mini", paymentMethod: "upi" });
  useEffect(() => { api.get("/vehicles").then(({ data }) => setVehicles(data)).catch(() => setVehicles([])); }, []);
  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const estimateFare = async () => {
    const { data } = await api.post("/rides/estimate", { vehicleType: form.vehicleType, distanceKm: Number(form.distanceKm) });
    setEstimate(data.estimatedFare);
  };
  const submit = async (event) => {
    event.preventDefault();
    try {
      await api.post("/rides", { vehicleType: form.vehicleType, distanceKm: Number(form.distanceKm), pickup: { address: form.pickup }, drop: { address: form.drop } });
      toast.success("Ride requested. Nearby drivers have been notified.");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };
  return (
    <>
      <PageHeader eyebrow="Ride Booking" title="Book Ride" description="Select pickup, destination, vehicle type, view fare estimate, and create a live ride request." />
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="glass-panel rounded-lg p-5">
          <form className="grid gap-4 md:grid-cols-2" onSubmit={submit}>
            <FormField label="Pickup Location"><input className="input" value={form.pickup} onChange={(e) => set("pickup", e.target.value)} required /></FormField>
            <FormField label="Drop Location"><input className="input" value={form.drop} onChange={(e) => set("drop", e.target.value)} required /></FormField>
            <FormField label="Distance KM"><input className="input" type="number" value={form.distanceKm} onChange={(e) => set("distanceKm", e.target.value)} required /></FormField>
            <FormField label="Vehicle Type"><select className="input" value={form.vehicleType} onChange={(e) => set("vehicleType", e.target.value)}>{["bike", "auto", "mini", "sedan", "suv"].map((v) => <option value={v} key={v}>{titleCase(v)}</option>)}</select></FormField>
            <button className="btn-secondary" type="button" onClick={estimateFare}><IndianRupee className="h-4 w-4" /> Estimate Fare</button>
            <button className="btn-primary" type="submit"><Car className="h-4 w-4" /> Request Ride</button>
          </form>
        </section>
        <aside className="space-y-4">
          <StatCard label="Estimated Fare" value={estimate ? currency(estimate) : "Calculate"} icon={IndianRupee} />
          <div className="glass-panel rounded-lg p-5">
            <MapPin className="h-5 w-5 text-taxi" />
            <h2 className="mt-3 font-black text-slate-950 dark:text-white">Google Maps Ready</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Add `VITE_GOOGLE_MAPS_API_KEY` and replace text fields with Places Autocomplete for production maps.</p>
          </div>
          <div className="glass-panel rounded-lg p-5">
            <h2 className="font-black text-slate-950 dark:text-white">Vehicle Pricing</h2>
            <div className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">{vehicles.map((v) => <p key={v._id}>{v.label}: {currency(v.baseFare)} + {currency(v.perKmFare)}/km</p>)}</div>
          </div>
        </aside>
      </div>
    </>
  );
};
