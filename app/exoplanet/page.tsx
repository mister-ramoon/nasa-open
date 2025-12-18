import Link from 'next/link';

export default function ExoplanetPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
            ← Volver al inicio
          </Link>
          <h1 className="text-4xl font-bold mb-2">
            Exoplanet Archive
          </h1>
          <p className="text-gray-600">
            Base de datos de exoplanetas confirmados
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-700">
            Página en construcción. Aquí podrás explorar el archivo de exoplanetas
            descubiertos por la NASA.
          </p>
        </div>
      </div>
    </div>
  );
}
