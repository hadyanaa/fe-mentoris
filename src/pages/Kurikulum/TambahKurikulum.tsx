import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useKurikulumStore } from "../../store/useKurikulumStore";
import Label from "../../components/form/Label";
import { Button } from "primereact/button";

export default function FormCreateKurikulum() {
  const navigate = useNavigate();
   const { loading, error, addKurikulum } = useKurikulumStore()
  

  const [formData, setFormData] = useState({
      jenjang_id: 0,
      judul: "",
      deskripsi: "",
      urutan: "",
   });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addKurikulum(formData)
    .then(()=>{
      alert("Kurikulum berhasil ditambahkan")
      navigate(-1);
    })
    .catch((err)=>{
      console.error("Gagal menyimpan: ", err);
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Tambah Kurikulum</h2>
      {error && <div className="text-red-600 mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
         <div className="w-full">
            <Label>Jenjang</Label>
            <input
               type="text"
               name="jenjang_id"
               placeholder="Jenjang"
               value={formData.jenjang_id}
               onChange={handleChange}
               required
               className="border p-2 rounded w-full"
            />
         </div>

         <div>
            <Label>Judul</Label>
            <input
               type="text"
               name="judul"
               placeholder="Judul"
               value={formData.judul}
               onChange={handleChange}
               required
               className="border p-2 rounded w-full"
            />
         </div>
         <div>
            <Label>Deskripsi</Label>
            <input
               type="text"
               name="deskripsi"
               placeholder="Deskripsi"
               value={formData.deskripsi}
               onChange={handleChange}
               required
               className="border p-2 rounded w-full h-20"
            />
         </div>
         <div>
            <Label>Urutan</Label>
            <input
               type="text"
               name="urutan"
               placeholder="Urutan"
               value={formData.urutan}
               onChange={handleChange}
               required
               className="border p-2 rounded w-full h-20"
            />
         </div>
        </div>

         <Button
            type="submit"
            loading={loading}
         >
         Tambah Kurikulum
         </Button>
      </form>
    </div>
  );
}
