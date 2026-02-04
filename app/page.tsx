export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-900 text-white">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold text-blue-500">
          CloudRetail 🛒
        </h1>
        <p className="text-lg">
          Global Architecture Prototype
        </p>
      </div>

      <div className="mt-10 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-3 lg:text-left gap-4">
        <div className="group rounded-lg border border-gray-700 px-5 py-4 transition-colors hover:border-blue-500 hover:bg-gray-800">
          <h2 className="mb-3 text-2xl font-semibold">Shop Now 📦</h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Browse our global inventory.
          </p>
        </div>
      </div>
    </main>
  );
}