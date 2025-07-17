import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAngkatanStore } from "../../store/useAngkatanStore";
import Label from "../../components/form/Label";
import { Button } from "primereact/button";

export default function FormEditAngkatan() {
  const navigate = useNavigate();
  const { angkatanId } = useParams();
   const { loading, error, fetchAngkatanById, updateAngkatan } = useAngkatanStore()
  

  const [formData, setFormData] = useState({
    nama: "",
  });

  useEffect(()=>{
   fetchAngkatanById(angkatanId)
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
    updateAngkatan(angkatanId as string, formData)
    .then(()=>{
      alert("Angkatan berhasil diubah")
      navigate(-1);
    })
    .catch((err)=>{
      console.error("Gagal menyimpan: ", err);
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Update Angkatan</h2>
      {error && <div className="text-red-600 mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
         <div className="w-full relative">
            <Label>Nama Angkatan</Label>
            <input
               type="text"
               name="nama"
               placeholder="Nama Angkatan"
               value={formData.nama}
               onChange={handleChange}
               disabled={loading}
               required
               className="border p-2 rounded w-full"
            />
         </div>
        </div>

         <Button
            type="submit"
            loading={loading}
         >
         Update Angkatan
         </Button>
      </form>
    </div>
  );
}
