export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h1 className="text-xl font-bold tracking-tight text-gray-900">Trinethra</h1>
            </div>
            <p className="text-xs text-gray-400 mt-1 ml-4.5">
              Supervisor Feedback Analyzer — DeepThought Assignment
            </p>
          </div>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
            AI-Assisted Review
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-8">
        {children}
      </main>

      <footer className="bg-white border-t border-gray-100 py-4 text-center text-xs text-gray-400">
        Trinethra · AI-Assisted Operational Review · phi3:mini via Ollama
      </footer>
    </div>
  );
}
