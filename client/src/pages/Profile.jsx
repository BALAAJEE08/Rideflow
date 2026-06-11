import { useState } from "react";
import { FormField } from "../components/FormField.jsx";
import { PageHeader } from "../components/PageHeader.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({ name: user?.name || "", phone: user?.phone || "", profilePhoto: user?.profilePhoto || "" });
  const submit = async (event) => { event.preventDefault(); await updateProfile(form); };
  return (
    <>
      <PageHeader eyebrow="Profile" title="Account Profile" description="Update name, phone, and profile photo URL. Driver document uploads are available through the driver profile API." />
      <section className="glass-panel rounded-lg p-5">
        <form className="grid gap-4 md:grid-cols-2" onSubmit={submit}>
          <FormField label="Name"><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></FormField>
          <FormField label="Phone"><input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></FormField>
          <FormField label="Profile Photo"><input className="input" value={form.profilePhoto} onChange={(e) => setForm({ ...form, profilePhoto: e.target.value })} /></FormField>
          <button className="btn-primary md:col-span-2" type="submit">Update Profile</button>
        </form>
      </section>
    </>
  );
};
