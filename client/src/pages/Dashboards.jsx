import { useEffect, useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Car, CircleDollarSign, Radio, Route, Users, Wallet } from "lucide-react";
import { PageHeader } from "../components/PageHeader.jsx";
import { StatCard } from "../components/StatCard.jsx";
import { useSocket } from "../context/SocketContext.jsx";
import { api } from "../services/api.js";
import { currency } from "../utils/formatters.js";

const fallback = {
  stats: { totalUsers: 0, activeDrivers: 0, totalRides: 0, revenue: 0, completedTrips: 0 },
  dailyRides: [{ day: "Mon", rides: 18 }, { day: "Tue", rides: 24 }, { day: "Wed", rides: 31 }],
  revenueTrends: [{ day: "Mon", revenue: 14000 }, { day: "Tue", revenue: 22000 }, { day: "Wed", revenue: 31000 }],
  driverEarnings: [{ driver: "TN-01", earnings: 3600 }, { driver: "TN-09", earnings: 4200 }],
  statusDistribution: [{ name: "requested", value: 5 }, { name: "completed", value: 23 }, { name: "cancelled", value: 2 }],
  vehicleUsage: [{ name: "mini", value: 12 }, { name: "sedan", value: 8 }, { name: "auto", value: 7 }]
};
const colors = ["#f5c84b", "#23c4d9", "#f05252", "#8b5cf6"];

export const RiderDashboard = () => {
  const { notifications } = useSocket();
  return (
    <>
      <PageHeader eyebrow="Rider Console" title="Rider Dashboard" description="Book cabs, watch driver availability, and track ride updates live." />
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Live Alerts" value={notifications.length} icon={Radio} />
        <StatCard label="Nearby Drivers" value="20+" icon={Car} tone="bg-signal/15 text-signal" />
        <StatCard label="Saved Places" value="Favorites" icon={Route} tone="bg-brake/15 text-brake" />
      </div>
    </>
  );
};

export const DriverDashboard = () => {
  const [online, setOnline] = useState(false);
  const toggle = async () => {
    const next = !online;
    setOnline(next);
    await api.put("/drivers/status", { isOnline: next, currentLocation: { address: "Current city", updatedAt: new Date() } }).catch(() => {});
  };
  return (
    <>
      <PageHeader eyebrow="Driver Console" title="Driver Dashboard" description="Go online, receive ride requests, accept trips, and monitor ride status in real time." actions={<button className="btn-primary" onClick={toggle}>{online ? "Go Offline" : "Go Online"}</button>} />
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Availability" value={online ? "Online" : "Offline"} icon={Radio} />
        <StatCard label="Requests" value="Live" icon={Car} tone="bg-signal/15 text-signal" />
        <StatCard label="Rating" value="4.8" icon={Wallet} tone="bg-brake/15 text-brake" />
      </div>
    </>
  );
};

export const AdminDashboard = () => {
  const [data, setData] = useState(fallback);
  useEffect(() => { api.get("/analytics/admin").then(({ data }) => setData({ ...fallback, ...data })).catch(() => setData(fallback)); }, []);
  return (
    <>
      <PageHeader eyebrow="Admin Console" title="Admin Dashboard" description="Manage riders, drivers, vehicles, rides, payments, and platform analytics." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Users" value={data.stats.totalUsers} icon={Users} />
        <StatCard label="Active Drivers" value={data.stats.activeDrivers} icon={Radio} tone="bg-signal/15 text-signal" />
        <StatCard label="Rides" value={data.stats.totalRides} icon={Car} />
        <StatCard label="Revenue" value={currency(data.stats.revenue)} icon={CircleDollarSign} />
        <StatCard label="Completed" value={data.stats.completedTrips} icon={Route} tone="bg-brake/15 text-brake" />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Chart title="Daily Rides"><ResponsiveContainer width="100%" height={270}><BarChart data={data.dailyRides}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" /><YAxis /><Tooltip /><Bar dataKey="rides" fill="#f5c84b" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></Chart>
        <Chart title="Revenue Trends"><ResponsiveContainer width="100%" height={270}><AreaChart data={data.revenueTrends}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" /><YAxis /><Tooltip /><Area dataKey="revenue" fill="#23c4d9" stroke="#23c4d9" fillOpacity={0.25} /></AreaChart></ResponsiveContainer></Chart>
        <Chart title="Driver Earnings"><ResponsiveContainer width="100%" height={270}><BarChart data={data.driverEarnings}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="driver" /><YAxis /><Tooltip /><Bar dataKey="earnings" fill="#f05252" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></Chart>
        <Chart title="Vehicle Usage"><ResponsiveContainer width="100%" height={270}><PieChart><Pie data={data.vehicleUsage} dataKey="value" nameKey="name" outerRadius={95} label>{data.vehicleUsage.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></Chart>
      </div>
    </>
  );
};

const Chart = ({ title, children }) => <section className="glass-panel rounded-lg p-5"><h2 className="mb-4 text-lg font-black text-slate-950 dark:text-white">{title}</h2>{children}</section>;
