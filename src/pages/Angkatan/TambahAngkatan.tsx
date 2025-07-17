import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAngkatanStore } from "../../store/useAngkatanStore";
import Label from "../../components/form/Label";
import { Button } from "primereact/button";

export default function FormCreateAngkatan() {
  const navigate = useNavigate();
   const { loading, error, addAngkatan } = useAngkatanStore()
  

  const [formData, setFormData] = useState({
      nama: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAngkatan(formData)
    .then(()=>{
      alert("Angkatan berhasil ditambahkan")
      navigate(-1);
    })
    .catch((err)=>{
      console.error("Gagal menyimpan: ", err);
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Tambah Angkatan</h2>
      {error && <div className="text-red-600 mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
         <div className="w-full">
            <Label>Nama Angkatan</Label>
            <input
               type="text"
               name="nama"
               placeholder="Nama Angkatan"
               value={formData.nama}
               onChange={handleChange}
               required
               className="border p-2 rounded w-full"
            />
         </div>
        </div>

         <Button
            type="submit"
            loading={loading}
         >
         Tambah Angkatan
         </Button>
      </form>
    </div>
  );
}
