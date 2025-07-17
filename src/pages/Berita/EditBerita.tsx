import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBeritaStore } from "../../store/useBeritaStore";
import Label from "../../components/form/Label";
import { Button } from "primereact/button";

export default function FormEditBerita() {
  const navigate = useNavigate();
  const { beritaId } = useParams();
   const { loading, error, fetchBeritaById, updateBerita } = useBeritaStore()
  

  const [formData, setFormData] = useState({
    judul: "",
    sumber: "",
    konten_berita: "",
  });

  useEffect(()=>{
   fetchBeritaById(beritaId)
   .then((res) => {
      if (res as any) setFormData(res.data)
   });
  },[])

  console.log(formData)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBerita(beritaId as string, formData)
    .then(()=>{
      alert("Berita berhasil diubah")
      navigate(-1);
    })
    .catch((err)=>{
      console.error("Gagal menyimpan: ", err);
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Update Berita</h2>
      {error && <div className="text-red-600 mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
         <div className="w-full relative">
            <Label>Judul Berita</Label>
            <input
               type="text"
               name="judul"
               placeholder="Judul Berita"
               value={formData.judul}
               onChange={handleChange}
               disabled={loading}
               required
               className="border p-2 rounded w-full"
            />
            {/* {loading && (<LoadingSpinner size={18} />)} */}
         </div>

         <div>
            <Label>Sumber</Label>
            <input
               type="text"
               name="sumber"
               placeholder="Sumber"
               value={formData.sumber}
               onChange={handleChange}
               disabled={loading}
               required
               className="border p-2 rounded w-full"
            />
         </div>

         <div>
            <Label>Konten Berita</Label>
            <input
               type="text"
               name="konten_berita"
               placeholder="Konten Berita"
               value={formData.konten_berita}
               onChange={handleChange}
               disabled={loading}
               required
               className="border p-2 rounded w-full h-20"
            />
         </div>
        </div>

         <Button
            type="submit"
            loading={loading}
         >
         Update Berita
         </Button>
      </form>
    </div>
  );
}
