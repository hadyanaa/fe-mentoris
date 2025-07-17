import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBeritaStore } from "../../store/useBeritaStore";
import Label from "../../components/form/Label";
import { Button } from "primereact/button";

export default function FormCreateBerita() {
  const navigate = useNavigate();
   const { loading, error, addBerita } = useBeritaStore()
  

  const [formData, setFormData] = useState({
    judul: "",
    sumber: "",
    konten_berita: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addBerita(formData)
    .then(()=>{
      alert("Berita berhasil ditambahkan")
      navigate(-1);
    })
    .catch((err)=>{
      console.error("Gagal menyimpan: ", err);
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Tambah Berita</h2>
      {error && <div className="text-red-600 mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
         <div className="w-full">
            <Label>Judul Berita</Label>
            <input
               type="text"
               name="judul"
               placeholder="Judul Berita"
               value={formData.judul}
               onChange={handleChange}
               required
               className="border p-2 rounded w-full"
            />
         </div>

         <div>
            <Label>Sumber</Label>
            <input
               type="text"
               name="sumber"
               placeholder="Sumber"
               value={formData.sumber}
               onChange={handleChange}
               required
               className="border p-2 rounded w-full"
            />
         </div>
         <div>
            <Label>Konten Berita</Label>
            <input
               type="text"
               name="konten_berita"
               // placeholder="Konten"
               value={formData.konten_berita}
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
         Tambah Berita
         </Button>
      </form>
    </div>
  );
}
