export default function KpiTags({ kpis }) {
  if (!kpis || kpis.length === 0) return null;

  const relevanceStyle = (rel) => {
    switch (rel) {
      case "direct":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "indirect":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "inferred":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
        KPI Mapping
      </h2>
      <div className="flex flex-wrap gap-2">
        {kpis.map((kpi, idx) => (
          <span
            key={idx}
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${relevanceStyle(
              kpi.relevance
            )}`}
            title={`Relevance: ${kpi.relevance}`}
          >
            {kpi.kpi_name}
          </span>
        ))}
      </div>
    </div>
  );
}
