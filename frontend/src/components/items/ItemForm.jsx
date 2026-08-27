import { useEffect, useState } from "react";
import { ITEM_TYPES, CATEGORIES } from "../../config";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Textarea from "../ui/Textarea";
import ImageUploader from "./ImageUploader";
import Button from "../ui/Button";
import Alert from "../ui/Alert";

export default function ItemForm({ initialValues, onSubmit, loading, submitLabel = "Publish item" }) {
  const [form, setForm] = useState({
    itemName: "",
    category: "phone",
    type: "lost",
    description: "",
    location: "",
    date: "",
    contact: "",
  });
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialValues) {
      setForm({
        itemName: initialValues.itemName || "",
        category: initialValues.category || "phone",
        type: initialValues.type || "lost",
        description: initialValues.description || "",
        location: initialValues.location || "",
        date: initialValues.date ? new Date(initialValues.date).toISOString().slice(0, 10) : "",
        contact: initialValues.contact || "",
      });
    }
  }, [initialValues]);

  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (!initialValues && files.length === 0) {
      setError("Please add at least one image.");
      return;
    }
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => data.append(key, value));
      files.forEach((file) => data.append("images", file));
      await onSubmit(data);
    } catch (err) {
      setError(err?.response?.data?.message || "Could not save the item.");
    }
  };

  return (
    <form className="form-stack" onSubmit={submit}>
      {error && <Alert>{error}</Alert>}
      <div className="form-grid">
        <Input label="Item name" value={form.itemName} onChange={update("itemName")} placeholder="e.g. Black iPhone 15" required />
        <Select label="Category" value={form.category} onChange={update("category")} options={CATEGORIES} />
        <Select label="Report type" value={form.type} onChange={update("type")} options={ITEM_TYPES} />
        <Input label="Date" type="date" value={form.date} onChange={update("date")} required />
        <Input label="Location" value={form.location} onChange={update("location")} placeholder="e.g. Dhanmondi Lake" required />
        <Input label="Contact number" value={form.contact} onChange={update("contact")} placeholder="01XXXXXXXXX" required />
      </div>
      <Textarea
        label="Description"
        value={form.description}
        onChange={update("description")}
        placeholder="Describe identifying details, color, model, marks, or anything useful..."
        rows={6}
        required
      />
      <ImageUploader files={files} setFiles={setFiles} />
      <div className="form-actions">
        <Button type="submit" loading={loading}>{submitLabel}</Button>
      </div>
    </form>
  );
}