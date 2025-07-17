import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useJenjangStore } from "../../store/useJenjangStore";
import Label from "../../components/form/Label";
import { Button } from "primereact/button";

export default function FormCreateJenjang() {
  const navigate = useNavigate();
   const { loading, error, addJenjang } = useJenjangStore()
  

  const [formData, setFormData] = useState({
    nama_jenjang: "",
    deskripsi: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addJenjang(formData)
    .then(()=>{
      alert("Jenjang berhasil ditambahkan")
      navigate(-1);
    })
    .catch((err)=>{
      console.error("Gagal menyimpan: ", err);
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Tambah Jenjang</h2>
      {error && <div className="text-red-600 mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
         <div className="w-full">
            <Label>Nama Jenjang</Label>
            <input
               type="text"
               name="nama_jenjang"
               placeholder="Nama Jenjang"
               value={formData.nama_jenjang}
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
               className="border p-2 rounded w-full"
            />
         </div>
        </div>

         <Button
            type="submit"
            loading={loading}
         >
         Tambah Jenjang
         </Button>
      </form>
    </div>
  );
}
