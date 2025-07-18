import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTemaStore } from "../../store/useTemaStore";
import Label from "../../components/form/Label";
import { Button } from "primereact/button";

export default function FormEditTema() {
  const navigate = useNavigate();
  const { temaId } = useParams();
   const { loading, error, fetchTemaById, updateTema } = useTemaStore()
  

   const [formData, setFormData] = useState({
      nama: ""
   });

  useEffect(()=>{
   fetchTemaById(temaId)
   .then((res) => {
      if (res as any) setFormData(res.data)
   });
  },[])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateTema(temaId as string, formData)
    .then(()=>{
      alert("Tema berhasil diubah")
      navigate(-1);
    })
    .catch((err)=>{
      console.error("Gagal menyimpan: ", err);
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Update Tema</h2>
      {error && <div className="text-red-600 mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
         <div className="w-full relative">
            <Label>Judul Tema</Label>
            <input
               type="text"
               name="nama"
               placeholder="Nama Tema"
               value={formData.nama}
               onChange={handleChange}
               disabled={loading}
               required
               className="border p-2 rounded w-full"
            />
            {/* {loading && (<LoadingSpinner size={18} />)} */}
         </div>
        </div>

         <Button
            type="submit"
            loading={loading}
         >
         Update Tema
         </Button>
      </form>
    </div>
  );
}
