import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTemaStore } from "../../store/useTemaStore";
import Label from "../../components/form/Label";
import { Button } from "primereact/button";

export default function FormCreateTema() {
  const navigate = useNavigate();
   const { loading, error, addTema } = useTemaStore()
  

  const [formData, setFormData] = useState({
    nama:""
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTema(formData)
    .then(()=>{
      alert("Tema berhasil ditambahkan")
      navigate(-1);
    })
    .catch((err)=>{
      console.error("Gagal menyimpan: ", err);
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Tambah Tema</h2>
      {error && <div className="text-red-600 mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
         <div className="w-full">
            <Label>Nama Tema</Label>
            <input
               type="text"
               name="nama"
               placeholder="Nama Tema"
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
         Tambah Tema
         </Button>
      </form>
    </div>
  );
}
