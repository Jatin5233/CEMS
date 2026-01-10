import { useState } from "react";
import { Search, User, MapPin, Phone, Mail, Calendar, FileText, Clock, CheckCircle } from "lucide-react";
import { useElectorSearch } from "../../hooks/useElectorSearch";

export function ElectorSearch() {
  const [searchType, setSearchType] = useState("epic");
  const [searchQuery, setSearchQuery] = useState("");
  const { result, auditTrail, loading, error, searchByEpic, searchByName, searchByMobile } = useElectorSearch();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    if (searchType === "epic") {
      await searchByEpic(searchQuery);
    } else if (searchType === "name") {
      await searchByName(searchQuery);
    } else if (searchType === "mobile") {
      await searchByMobile(searchQuery);
    }
  };

  const showResult = result !== null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Elector Search & Profile</h2>
        <p className="text-sm text-gray-600 mt-1">Search and view detailed elector information</p>
      </div>

      {/* Search Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="space-y-4">
          {/* Search Type Selection */}
          <div className="flex gap-4">
            <button
              onClick={() => setSearchType("epic")}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                searchType === "epic"
                  ? "bg-[#003d82] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              EPIC Number
            </button>
            <button
              onClick={() => setSearchType("name")}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                searchType === "name"
                  ? "bg-[#003d82] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Name
            </button>
            <button
              onClick={() => setSearchType("mobile")}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                searchType === "mobile"
                  ? "bg-[#003d82] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Mobile Number
            </button>
          </div>

          {/* Search Input */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  searchType === "epic"
                    ? "Enter EPIC number (e.g., ABC1234567)"
                    : searchType === "name"
                    ? "Enter elector name"
                    : "Enter mobile number"
                }
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003d82] focus:border-transparent"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-[#003d82] text-white rounded-lg hover:bg-[#002d62] transition-colors"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Search Result */}
      {loading && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <div className="text-lg text-gray-600">Searching...</div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="text-red-600">Error: {error}</div>
        </div>
      )}

      {showResult && result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Profile Card */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-[#003d82] to-[#004999] text-white">
              <div className="flex items-start gap-6">
                {/* Photo */}
                <div className="w-32 h-32 bg-white rounded-lg overflow-hidden border-4 border-white shadow-lg flex-shrink-0">
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <User className="w-16 h-16 text-gray-400" />
                  </div>
                </div>

                {/* Basic Info */}
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold">{result.name}</h3>
                  <p className="text-blue-200 mt-1">{result.nameLocal}</p>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-blue-200">EPIC Number</p>
                      <p className="text-sm font-medium">{result.epicNumber}</p>
                    </div>
                    <div>
                      <p className="text-xs text-blue-200">Age / Gender</p>
                      <p className="text-sm font-medium">{result.age} Years / {result.gender}</p>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex-shrink-0">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs ${
                    result.status === "verified" ? "bg-green-500 text-white" :
                    result.status === "pending" ? "bg-yellow-500 text-white" :
                    "bg-red-500 text-white"
                  }`}>
                    <CheckCircle className="w-3 h-3" />
                    {result.status === "verified" ? "Verified" : result.status === "pending" ? "Pending" : "Rejected"}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Personal Details */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Personal Details
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Father's Name</p>
                    <p className="text-sm text-gray-900 mt-1">{result.fatherName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Date of Birth</p>
                    <p className="text-sm text-gray-900 mt-1">{result.dob}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Mobile Number</p>
                    <p className="text-sm text-gray-900 mt-1">{result.phone || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm text-gray-900 mt-1">{result.email || "Not provided"}</p>
                  </div>
                </div>
              </div>

              {/* Address Details */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Address Information
                </h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-500">Current Address</p>
                    <p className="text-sm text-gray-900 mt-1">
                      {result.address}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {result.addressLocal}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Permanent Address</p>
                    <p className="text-sm text-gray-900 mt-1">
                      Same as Current Address
                    </p>
                  </div>
                </div>
              </div>

              {/* Electoral Details */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Electoral Details
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">State</p>
                    <p className="text-sm text-gray-900 mt-1">{result.state}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">District</p>
                    <p className="text-sm text-gray-900 mt-1">{result.district}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Assembly Constituency</p>
                    <p className="text-sm text-gray-900 mt-1">{result.constituency}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Part Number</p>
                    <p className="text-sm text-gray-900 mt-1">Part-{result.partNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Serial Number</p>
                    <p className="text-sm text-gray-900 mt-1">{result.serialNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Polling Station</p>
                    <p className="text-sm text-gray-900 mt-1">{result.pollingStation}</p>
                  </div>
                </div>
              </div>

              {/* Special Flags */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-semibold text-gray-900 mb-3">Special Categories</h4>
                <div className="flex flex-wrap gap-2">
                  {result.specialCategories.length > 0 ? (
                    result.specialCategories.map((category, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                        {category}
                      </span>
                    ))
                  ) : (
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                      General Elector
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Audit Trail & Actions */}
          <div className="space-y-4">
            {/* Quick Actions */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-3">Quick Actions</h4>
              <div className="space-y-2">
                <button className="w-full px-4 py-2 bg-[#003d82] text-white rounded-lg hover:bg-[#002d62] transition-colors text-sm">
                  Edit Details
                </button>
                <button className="w-full px-4 py-2 bg-white text-[#003d82] border border-[#003d82] rounded-lg hover:bg-blue-50 transition-colors text-sm">
                  View Documents
                </button>
                <button className="w-full px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  Print Details
                </button>
              </div>
            </div>

            {/* Audit Trail */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Recent Activity
              </h4>
              <div className="space-y-3">
                {auditTrail.length > 0 ? (
                  auditTrail.map((item, idx) => (
                    <div key={idx} className="pb-3 border-b border-gray-100 last:border-0">
                      <p className="text-sm text-gray-900">{item.action}</p>
                      <p className="text-xs text-gray-500 mt-1">{item.date} • {item.user}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500">No activity history available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {!showResult && !loading && !error && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Enter search criteria and click Search to find elector details</p>
        </div>
      )}

      {showResult && !result && !loading && !error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-12 text-center">
          <Search className="w-16 h-16 text-yellow-300 mx-auto mb-4" />
          <p className="text-yellow-700">No elector found matching the search criteria</p>
        </div>
      )}
    </div>
  );
}
