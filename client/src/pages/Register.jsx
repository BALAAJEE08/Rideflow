import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FormField } from "../components/FormField.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { AuthScreen } from "./Login.jsx";

export const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", role: "rider", licenseNumber: "", vehicleType: "mini", vehicleNumber: "", vehicleModel: "" });
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const submit = async (event) => {
    event.preventDefault();
    await register({ name: form.name, email: form.email, phone: form.phone, password: form.password, role: form.role, driver: form });
    navigate("/app");
  };
  return (
    <AuthScreen title="Create account" subtitle="Register as rider, driver, or admin.">
      <form className="grid gap-4 sm:grid-cols-2" onSubmit={submit}>
        <FormField label="Name"><input className="input" value={form.name} onChange={(e) => set("name", e.target.value)} required /></FormField>
        <FormField label="Phone"><input className="input" value={form.phone} onChange={(e) => set("phone", e.target.value)} required /></FormField>
        <FormField label="Email"><input className="input" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} required /></FormField>
        <FormField label="Password"><input className="input" type="password" minLength={8} value={form.password} onChange={(e) => set("password", e.target.value)} required /></FormField>
        <FormField label="Role"><select className="input" value={form.role} onChange={(e) => set("role", e.target.value)}><option value="rider">Rider</option><option value="driver">Driver</option><option value="admin">Admin</option></select></FormField>
        {form.role === "driver" && <>
          <FormField label="License"><input className="input" value={form.licenseNumber} onChange={(e) => set("licenseNumber", e.target.value)} /></FormField>
          <FormField label="Vehicle Type"><select className="input" value={form.vehicleType} onChange={(e) => set("vehicleType", e.target.value)}><option value="bike">Bike</option><option value="auto">Auto</option><option value="mini">Mini</option><option value="sedan">Sedan</option><option value="suv">SUV</option></select></FormField>
          <FormField label="Vehicle Number"><input className="input" value={form.vehicleNumber} onChange={(e) => set("vehicleNumber", e.target.value)} /></FormField>
          <FormField label="Vehicle Model"><input className="input" value={form.vehicleModel} onChange={(e) => set("vehicleModel", e.target.value)} /></FormField>
        </>}
        <button className="btn-primary sm:col-span-2" disabled={loading} type="submit">Create Account</button>
      </form>
      <p className="mt-5 text-center text-sm text-slate-300">Already have an account? <Link className="font-bold text-taxi" to="/login">Sign in</Link></p>
    </AuthScreen>
  );
};
