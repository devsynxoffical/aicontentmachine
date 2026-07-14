import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Pencil,
  Trash2,
} from "lucide-react";

import DeleteModal from "./DeleteModal";

const statusStyles = {
  Published: "bg-green-100 text-green-700",
  Scheduled: "bg-yellow-100 text-yellow-700",
  Draft: "bg-gray-100 text-gray-700",
};

export default function TableCard({ recentContent = [] }) {
  const navigate = useNavigate();

  const [content, setContent] = useState(recentContent);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Edit Content
  const handleEdit = (item) => {
    navigate(item.editRoute, {
      state: {
        mode: "edit",
        item,
      },
    });
  };

  // Open Delete Modal
  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  // Confirm Delete
  const handleDelete = () => {
    setContent((prev) =>
      prev.filter((item) => item.id !== selectedItem.id)
    );

    setShowDeleteModal(false);
    setSelectedItem(null);
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">

          <div>

            <h2 className="text-xl font-semibold text-[#1A1A2E]">
              Recent Content
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Your latest AI generated content.
            </p>

          </div>

        </div>

        <div className="overflow-x-auto">

          <table className="min-w-full">

            <thead>

              <tr className="border-b text-left text-sm text-gray-500">

                <th className="pb-3 font-medium">
                  Type
                </th>

                <th className="pb-3 font-medium">
                  Title
                </th>

                <th className="pb-3 font-medium">
                  Platform
                </th>

                <th className="pb-3 font-medium">
                  Status
                </th>

                <th className="pb-3 font-medium">
                  Date
                </th>

                <th className="pb-3 text-right font-medium">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {content.map((item) => (

                <tr
                  key={item.id}
                  className="border-b last:border-none hover:bg-gray-50 transition"
                >

                  <td className="py-5 whitespace-nowrap">
                    {item.type}
                  </td>

                  <td className="font-medium text-[#1A1A2E] min-w-[220px]">
                    {item.title}
                  </td>

                  <td>
                    {item.platform}
                  </td>

                  <td>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[item.status]}`}
                    >
                      {item.status}
                    </span>

                  </td>

                  <td className="text-gray-500 whitespace-nowrap">
                    {item.date}
                  </td>

                  <td>

                    <div className="flex justify-end gap-3">

                      <button
                        onClick={() => handleEdit(item)}
                        className="text-[#02A3B1] hover:text-[#017A85] transition"
                        title="Edit"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() => handleDeleteClick(item)}
                        className="text-red-500 hover:text-red-700 transition"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

              {content.length === 0 && (

                <tr>

                  <td
                    colSpan={6}
                    className="py-10 text-center text-gray-500"
                  >
                    No recent content available.
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        open={showDeleteModal}
        title="Delete Content"
        message={
          selectedItem
            ? `Are you sure you want to delete "${selectedItem.title}"?`
            : ""
        }
        onCancel={() => {
          setShowDeleteModal(false);
          setSelectedItem(null);
        }}
        onDelete={handleDelete}
      />
    </>
  );
}