import { Link } from "react-router-dom";

export default function TerimaKasih() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">Terima Kasih!</h1>
        <p className="text-gray-700 text-lg mb-6">
          Jawaban Anda telah berhasil dikirim. Terima kasih atas partisipasinya dalam pengisian assessment.
        </p>
        <Link
          to="/"
          className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
