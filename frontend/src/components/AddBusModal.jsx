export default function AddBusModal({ open, setOpen }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50">

      <div className="bg-white w-[520px] rounded-[30px] shadow-2xl border border-slate-200 p-8">

        <h2 className="text-3xl font-bold mb-6">
          Add New Bus
        </h2>

        <div className="space-y-4">

          <input
            placeholder="Bus Number"
            className="w-full border p-3 rounded-xl"
          />

          <input
            placeholder="Driver Name"
            className="w-full border p-3 rounded-xl"
          />

          <input
            placeholder="Route"
            className="w-full border p-3 rounded-xl"
          />

        </div>

        <div className="flex justify-end gap-4 mt-8">

          <button
            onClick={() => setOpen(false)}
            className="px-5 py-3 rounded-xl bg-gray-200"
          >
            Cancel
          </button>

          <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:scale-105 transition">
            Save
          </button>

        </div>

      </div>

    </div>
  );
}