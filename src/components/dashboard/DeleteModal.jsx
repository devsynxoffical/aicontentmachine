export default function DeleteModal({
  open,
  title = "Delete Item",
  message = "Are you sure you want to delete this item?",
  onCancel,
  onDelete,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">

      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-5">

          <h2 className="text-xl font-semibold text-[#1A1A2E]">
            {title}
          </h2>

        </div>

        {/* Body */}
        <div className="px-6 py-6">

          <p className="text-gray-600 leading-7">
            {message}
          </p>

          
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">

          <button
            onClick={onCancel}
            className="rounded-xl border border-gray-300 px-5 py-2.5 font-medium transition hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={onDelete}
            className="rounded-xl bg-red-500 px-5 py-2.5 font-medium text-white transition hover:bg-red-600"
          >
            Delete
          </button>

        </div>

      </div>

    </div>
  );
}