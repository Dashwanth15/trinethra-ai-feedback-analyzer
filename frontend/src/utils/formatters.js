export function sentimentColor(sentiment) {
  switch (sentiment) {
    case "positive":
      return "bg-green-100 text-green-800 border-green-200";
    case "negative":
      return "bg-red-100 text-red-800 border-red-200";
    case "neutral":
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

export function confidenceColor(label) {
  switch (label) {
    case "high":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "low":
    default:
      return "bg-orange-100 text-orange-800 border-orange-200";
  }
}

export function importanceColor(level) {
  switch (level) {
    case "critical":
      return "text-red-700 font-semibold";
    case "important":
      return "text-yellow-700 font-medium";
    case "nice_to_have":
    default:
      return "text-gray-600";
  }
}

export function truncate(text, maxLength = 120) {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}
