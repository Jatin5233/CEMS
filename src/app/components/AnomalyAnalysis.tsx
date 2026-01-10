import { useState } from "react";
import { 
  Shield, 
  AlertCircle, 
  Filter, 
  Download, 
  ChevronDown,
  ChevronUp,
  Copy,
  Users,
  MapPin,
  Calendar,
  FileText,
  Database,
  Eye,
  Info
} from "lucide-react";
import { useAnomalyAnalysis } from "../../hooks";

export function AnomalyAnalysis() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const itemsPerPage = 10;

  const { data, loading, error } = useAnomalyAnalysis(selectedCategory);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading anomaly analysis data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">Error: {error}</div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">No data available</div>
        </div>
      </div>
    );
  }

  const summaryMetrics = {
    totalFlagged: data.totalFlagged,
    highSeverity: data.highSeverity,
    mediumSeverity: data.mediumSeverity,
    anomalyCategories: data.anomalyCategories
  };

  const anomalyCategories = data.categories || [];
  const allRecords = data.records || [];

  // Filter records by selected category
  const filteredRecords = selectedCategory === "all" 
    ? allRecords 
    : allRecords.filter(record => 
        record.anomalyTypes.some(type => {
          const category = anomalyCategories.find(cat => cat.id === selectedCategory);
          return category && type === category.label.replace(/s$/, '').replace('Concerns', 'Concern');
        })
      );

  // Sort records
  const sortedRecords = [...filteredRecords].sort((a, b) => {
    if (!sortColumn) return 0;
    
    let aVal: any = a[sortColumn as keyof typeof a];
    let bVal: any = b[sortColumn as keyof typeof b];
    
    if (sortColumn === "severity") {
      const severityOrder = { "High": 3, "Medium": 2, "Low": 1 };
      aVal = severityOrder[a.severity as keyof typeof severityOrder];
      bVal = severityOrder[b.severity as keyof typeof severityOrder];
    }
    
    if (sortDirection === "asc") {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  // Paginate records
  const totalPages = Math.ceil(sortedRecords.length / itemsPerPage);
  const paginatedRecords = sortedRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const getSeverityBadgeClass = (severity: string) => {
    switch (severity) {
      case "High":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "Medium":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Low":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getSourceBadgeClass = (source: string) => {
    if (source.includes("Eligibility")) {
      return "bg-purple-50 text-purple-700 border-purple-200";
    } else if (source.includes("Roll")) {
      return "bg-blue-50 text-blue-700 border-blue-200";
    } else {
      return "bg-indigo-50 text-indigo-700 border-indigo-200";
    }
  };

  const toggleRowExpansion = (recordId: string) => {
    setExpandedRow(expandedRow === recordId ? null : recordId);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-6 h-6 text-[#003d82]" />
          <h2 className="text-2xl font-semibold text-gray-900">
            Suspicious Voters & Anomaly Analysis
          </h2>
        </div>
        <p className="text-sm text-gray-600">
          Records flagged for review based on rule-based and statistical indicators
        </p>
      </div>

      {/* Summary Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Flagged Records</p>
              <p className="text-3xl font-semibold text-gray-900 mt-2">
                {summaryMetrics.totalFlagged.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">Requires review</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <Database className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">High-Severity Cases</p>
              <p className="text-3xl font-semibold text-gray-900 mt-2">
                {summaryMetrics.highSeverity.toLocaleString()}
              </p>
              <p className="text-xs text-orange-600 mt-1">Priority attention needed</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">Medium-Severity Cases</p>
              <p className="text-3xl font-semibold text-gray-900 mt-2">
                {summaryMetrics.mediumSeverity.toLocaleString()}
              </p>
              <p className="text-xs text-blue-600 mt-1">Under review</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">Anomaly Categories</p>
              <p className="text-3xl font-semibold text-gray-900 mt-2">
                {summaryMetrics.anomalyCategories}
              </p>
              <p className="text-xs text-gray-500 mt-1">Detection types</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Filter className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Anomaly Categories Filter Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Filter by Anomaly Category</h3>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {anomalyCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setSelectedCategory(category.id);
                setCurrentPage(1);
              }}
              className={`
                px-4 py-2 rounded-lg border text-sm font-medium transition-all
                ${selectedCategory === category.id
                  ? 'bg-[#003d82] text-white border-[#003d82] shadow-md'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }
              `}
            >
              <span>{category.label}</span>
              <span className={`
                ml-2 px-2 py-0.5 rounded-full text-xs
                ${selectedCategory === category.id
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-100 text-gray-600'
                }
              `}>
                {category.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Suspicious Voter Records Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">Flagged Voter Records</h3>
            <p className="text-sm text-gray-600 mt-1">
              Showing {paginatedRecords.length} of {sortedRecords.length} records
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            Export Data
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Record ID
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("voterId")}
                >
                  <div className="flex items-center gap-1">
                    Voter ID / EPIC
                    {sortColumn === "voterId" && (
                      sortDirection === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("voterName")}
                >
                  <div className="flex items-center gap-1">
                    Voter Name
                    {sortColumn === "voterName" && (
                      sortDirection === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Constituency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Detected Anomaly Type(s)
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("severity")}
                >
                  <div className="flex items-center gap-1">
                    Severity
                    {sortColumn === "severity" && (
                      sortDirection === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Source Classification
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Last Reviewed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle className="w-12 h-12 text-gray-300" />
                      <p className="text-gray-500">No records found for this category</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((record) => (
                  <>
                    <tr 
                      key={record.id} 
                      className={`hover:bg-gray-50 transition-colors ${expandedRow === record.id ? 'bg-blue-50/50' : ''}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                        {record.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          <Copy className="w-3 h-3 text-gray-400" />
                          <span className="font-mono text-gray-900">{record.voterId}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.voterName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <div className="flex flex-col">
                          <span className="font-medium">{record.constituency}</span>
                          <span className="text-xs text-gray-500">{record.district}, {record.state}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex flex-col gap-1">
                          {record.anomalyTypes.map((type, idx) => (
                            <span key={idx} className="text-xs text-gray-700 bg-gray-100 px-2 py-1 rounded inline-block">
                              {type}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityBadgeClass(record.severity)}`}>
                          {record.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-md text-xs border ${getSourceBadgeClass(record.sourceClassification)}`}>
                          {record.sourceClassification}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {record.lastReviewed}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleRowExpansion(record.id)}
                          className="text-[#003d82] hover:text-[#002a5c] text-sm font-medium flex items-center gap-1"
                        >
                          {expandedRow === record.id ? (
                            <>
                              <ChevronUp className="w-4 h-4" />
                              Hide
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-4 h-4" />
                              View
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                    
                    {/* Expanded Detail View */}
                    {expandedRow === record.id && (
                      <tr>
                        <td colSpan={9} className="px-6 py-6 bg-blue-50/30">
                          <div className="space-y-6">
                            {/* Notice Banner */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-sm font-medium text-blue-900">
                                  Information Notice
                                </p>
                                <p className="text-sm text-blue-700 mt-1">
                                  These findings are preliminary analytical indicators that require human verification. 
                                  They do not constitute conclusions or allegations.
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              {/* Basic Voter Information */}
                              <div className="bg-white border border-gray-200 rounded-lg p-5">
                                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                  <Users className="w-4 h-4" />
                                  Basic Voter Information
                                </h4>
                                <div className="space-y-3">
                                  <div className="grid grid-cols-2 gap-2">
                                    <span className="text-sm text-gray-600">EPIC Number:</span>
                                    <span className="text-sm text-gray-900 font-mono">{record.voterId}</span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2">
                                    <span className="text-sm text-gray-600">Name:</span>
                                    <span className="text-sm text-gray-900">{record.voterName}</span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2">
                                    <span className="text-sm text-gray-600">Relative Info:</span>
                                    <span className="text-sm text-gray-900">{record.relativeInfo}</span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2">
                                    <span className="text-sm text-gray-600">Date of Birth:</span>
                                    <span className="text-sm text-gray-900">{record.dateOfBirth}</span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2">
                                    <span className="text-sm text-gray-600">Age:</span>
                                    <span className="text-sm text-gray-900">{record.age} years</span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2">
                                    <span className="text-sm text-gray-600">Address:</span>
                                    <span className="text-sm text-gray-900">{record.address}</span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2">
                                    <span className="text-sm text-gray-600">Constituency:</span>
                                    <span className="text-sm text-gray-900">{record.constituency}</span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2">
                                    <span className="text-sm text-gray-600">District:</span>
                                    <span className="text-sm text-gray-900">{record.district}</span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2">
                                    <span className="text-sm text-gray-600">State:</span>
                                    <span className="text-sm text-gray-900">{record.state}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Review Status */}
                              <div className="bg-white border border-gray-200 rounded-lg p-5">
                                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                  <FileText className="w-4 h-4" />
                                  Review Status
                                </h4>
                                <div className="space-y-3">
                                  <div className="grid grid-cols-2 gap-2">
                                    <span className="text-sm text-gray-600">Record ID:</span>
                                    <span className="text-sm text-gray-900 font-mono">{record.id}</span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2">
                                    <span className="text-sm text-gray-600">Overall Severity:</span>
                                    <span className={`text-sm font-medium px-2 py-1 rounded inline-block ${getSeverityBadgeClass(record.severity)}`}>
                                      {record.severity}
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2">
                                    <span className="text-sm text-gray-600">Source Classification:</span>
                                    <span className="text-sm text-gray-900">{record.sourceClassification}</span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2">
                                    <span className="text-sm text-gray-600">Last Reviewed:</span>
                                    <span className="text-sm text-gray-900">{record.lastReviewed}</span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2">
                                    <span className="text-sm text-gray-600">Anomalies Detected:</span>
                                    <span className="text-sm text-gray-900">{record.anomalyTypes.length} type(s)</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Detected Anomalies Details */}
                            <div className="bg-white border border-gray-200 rounded-lg p-5">
                              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                Detected Anomaly Details
                              </h4>
                              <div className="space-y-4">
                                {record.anomalyDetails.map((anomaly, idx) => (
                                  <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                    <div className="flex items-start justify-between mb-3">
                                      <div>
                                        <h5 className="font-medium text-gray-900">{anomaly.type}</h5>
                                        <p className="text-xs text-gray-500 mt-1">
                                          Detection Date: {anomaly.detectionDate}
                                        </p>
                                      </div>
                                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityBadgeClass(anomaly.severity)}`}>
                                        {anomaly.severity}
                                      </span>
                                    </div>
                                    <div className="space-y-2">
                                      <div>
                                        <p className="text-xs font-medium text-gray-600 mb-1">Description:</p>
                                        <p className="text-sm text-gray-700">{anomaly.description}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs font-medium text-gray-600 mb-1">Additional Information:</p>
                                        <p className="text-sm text-gray-700">{anomaly.additionalInfo}</p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => {
                  // Show first page, last page, current page, and pages around current
                  return page === 1 || 
                         page === totalPages || 
                         (page >= currentPage - 1 && page <= currentPage + 1);
                })
                .map((page, idx, arr) => {
                  // Add ellipsis if there's a gap
                  const showEllipsisBefore = idx > 0 && page - arr[idx - 1] > 1;
                  return (
                    <div key={page} className="flex items-center gap-2">
                      {showEllipsisBefore && (
                        <span className="px-2 text-gray-500">...</span>
                      )}
                      <button
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 border rounded-md text-sm transition-colors ${
                          currentPage === page
                            ? 'bg-[#003d82] text-white border-[#003d82]'
                            : 'border-gray-300 text-gray-700 hover:bg-white'
                        }`}
                      >
                        {page}
                      </button>
                    </div>
                  );
                })}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}