import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, ExternalLink, Code2, FileText, Grid3X3, List } from 'lucide-react';
import { documentTypes, categories } from '../data/documents';

export default function DocumentsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredDocs = documentTypes.filter((doc) => {
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryCount = (category: string) => {
    if (category === 'All') return documentTypes.length;
    return documentTypes.filter((d) => d.category === category).length;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Document Types</h2>
          <p className="text-slate-500">Browse all {documentTypes.length} supported document types</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-slate-400 hover:bg-slate-100'}`}
          >
            <Grid3X3 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-slate-400 hover:bg-slate-100'}`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search documents..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm"
        />
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              selectedCategory === cat
                ? 'bg-primary-600 text-white shadow-md shadow-primary-200'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {cat}
            <span className={`ml-1.5 text-xs ${selectedCategory === cat ? 'text-primary-200' : 'text-slate-400'}`}>
              ({getCategoryCount(cat)})
            </span>
          </button>
        ))}
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((doc) => (
            <div key={doc.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-primary-200 transition-all duration-300 group">
              <div className={`bg-gradient-to-r ${doc.color} p-4 flex items-center justify-between`}>
                <span className="text-3xl">{doc.icon}</span>
                <span className="text-xs font-medium text-white/80 bg-white/20 px-2 py-1 rounded-md backdrop-blur-sm">
                  {doc.category}
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-base font-bold text-slate-900 mb-1">{doc.name}</h3>
                <p className="text-sm text-slate-500 mb-4 line-clamp-2">{doc.description}</p>

                <div className="flex items-center gap-2 mb-4">
                  <Code2 className="w-4 h-4 text-slate-400" />
                  <code className="text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded font-mono">
                    {doc.endpoint}
                  </code>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                  <FileText className="w-3.5 h-3.5" />
                  {doc.fields.length} fields • {doc.fields.filter((f) => f.required).length} required
                </div>

                <div className="flex gap-2">
                  <Link
                    to="/verify"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
                  >
                    Verify <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/api-docs"
                    className="inline-flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-600 p-2.5 rounded-xl transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Document</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3 hidden sm:table-cell">Category</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3 hidden md:table-cell">Endpoint</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3 hidden lg:table-cell">Fields</th>
                  <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{doc.icon}</span>
                        <div>
                          <span className="text-sm font-semibold text-slate-800">{doc.name}</span>
                          <p className="text-xs text-slate-400 mt-0.5 hidden sm:block">{doc.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">{doc.category}</span>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <code className="text-xs text-primary-600 bg-primary-50 px-2 py-1 rounded font-mono">{doc.endpoint}</code>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span className="text-sm text-slate-500">{doc.fields.length}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to="/verify"
                        className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        Verify <ArrowRight className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredDocs.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 mb-1">No documents found</h3>
          <p className="text-sm text-slate-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
}
