import { Check, X } from "lucide-react";
import { comparisonTable } from "../../data/comparisonTable";

export default function PricingTable() {
  const renderCell = (value) => {
    if (value === true)
      return <Check className="mx-auto text-green-600" size={18} />;

    if (value === false)
      return <X className="mx-auto text-red-500" size={18} />;

    return (
      <span className="font-medium text-[#1A1A2E]">
        {value}
      </span>
    );
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-8">

        {/* Heading */}

        <div className="text-center mb-14">

          <h2 className="text-3xl font-bold text-[#1A1A2E]">
            Compare Plans
          </h2>

          <p className="mt-4 text-gray-600">
            Find the plan that's right for your business.
          </p>

        </div>

        <div className="overflow-x-auto rounded-xl shadow-lg border">

          <table className="min-w-full">

            <thead>

              <tr className="bg-[#017A85] text-white">

                <th className="text-left px-5 py-3 text sm font-semibold">
                  Features
                </th>

                <th className="px-5 py-3 text-sm font-semibold">
                  Free
                </th>

                <th className="px-5 py-3 text-sm font-semibold">
                  Pro
                </th>

                <th className="px-5 py-3 text-sm font-semibold">
                  Business
                </th>

              </tr>

            </thead>

            <tbody>

              {comparisonTable.map((row, index) => (

                <tr
                  key={row.feature}
                  className={
                    index % 2 === 0
                      ? "bg-white"
                      : "bg-[#E0F7FA]"
                  }
                >
                  <td className="px-5 py-4 text-sm font-medium text-[#1A1A2E]">
                    {row.feature}
                  </td>

                  <td className="py-3 text-center text-sm">
                    {renderCell(row.free)}
                  </td>

                  <td className="py-3 text-center text-sm">
                    {renderCell(row.pro)}
                  </td>

                  <td className="py-3 text-center text-sm">
                    {renderCell(row.business)}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>
    </section>
  );
}