import { useState } from "react";

// Formulario reutilizable para dar de alta (HU02) y editar (HU03)
export default function ProductForm({ initialValues, onSubmit, submitLabel = "Guardar", submitting = false }) {
  const [form, setForm] = useState({
    name: initialValues?.name ?? "",
    price: initialValues?.price ?? "",
    image: initialValues?.image ?? "",
  });

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // El precio viaja como número; la validación real la hace la API con Zod
    onSubmit({ name: form.name, price: Number(form.price), image: form.image });
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <label className="form-control w-full">
        <span className="label-text mb-1 font-medium">Nombre</span>
        <input className="input input-bordered w-full" name="name" value={form.name} onChange={handleChange} placeholder="Ej. Lámpara de escritorio" required />
      </label>
      <label className="form-control w-full">
        <span className="label-text mb-1 font-medium">Precio (MXN)</span>
        <input className="input input-bordered w-full" name="price" type="number" step="0.01" value={form.price} onChange={handleChange} placeholder="Ej. 459.90" required />
      </label>
      <label className="form-control w-full">
        <span className="label-text mb-1 font-medium">URL de la imagen</span>
        <input className="input input-bordered w-full" name="image" type="url" value={form.image} onChange={handleChange} placeholder="https://..." required />
      </label>
      {form.image && (
        <img src={form.image} alt="Vista previa" className="h-32 w-full rounded-lg bg-base-300 object-cover" />
      )}
      <button className="btn btn-primary" type="submit" disabled={submitting}>
        {submitting && <span className="loading loading-spinner loading-sm" />}
        {submitLabel}
      </button>
    </form>
  );
}
