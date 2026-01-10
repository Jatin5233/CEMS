import { MapPin, Users, Search } from "lucide-react";
import { useState } from "react";
import { usePollingStations } from "../../hooks/usePollingStations";

export function PollingStations() {
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  const { stations, loading, error } = usePollingStations();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading polling stations...</div>
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

  // Calculate summary statistics
  const totalStations = stations.length;
  const totalElectors = stations.reduce((sum, station) => sum + station.electors, 0);
  const avgPerStation = totalStations > 0 ? Math.round(totalElectors / totalStations) : 0;
  const accessibleStations = stations.filter(station => station.accessibility !== "none").length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "inactive":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Polling Station Management</h2>
          <p className="text-sm text-gray-600 mt-1">View and manage polling station details</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode("list")}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                viewMode === "list"
                  ? "bg-white text-[#003d82] shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                viewMode === "map"
                  ? "bg-white text-[#003d82] shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Map View
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by polling station ID, name, or address..."
            className="w-full pl-11 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003d82] focus:border-transparent"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Stations</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">{totalStations.toLocaleString()}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-[#003d82]" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Electors</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">{(totalElectors / 100000).toFixed(1)}L</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. per Station</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">{avgPerStation.toLocaleString()}</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Accessible</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">{accessibleStations.toLocaleString()}</p>
            </div>
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {viewMode === "list" ? (
        /* List View */
        <div className="space-y-4">
          {stations.map((station) => (
            <div key={station.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-[#003d82]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-gray-900">{station.name}</h3>
                        <span className={`px-2 py-1 rounded text-xs capitalize ${getStatusBadge(station.status)}`}>
                          {station.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{station.nameLocal}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {station.id} • {station.constituency}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Total Electors</p>
                    <p className="text-lg font-semibold text-gray-900">{station.electors}</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Male</p>
                    <p className="text-lg font-semibold text-blue-900">{station.male}</p>
                  </div>
                  <div className="bg-pink-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Female</p>
                    <p className="text-lg font-semibold text-pink-900">{station.female}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Accessibility</p>
                    <p className="text-sm font-semibold text-green-900 capitalize">{station.accessibility}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{station.address}</span>
                  </div>
                  <button className="px-4 py-2 bg-[#003d82] text-white rounded-lg hover:bg-[#002d62] transition-colors text-sm">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Map View */
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="relative w-full h-[600px] bg-gray-100">
            {/* Mock Map View */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Interactive GIS Map View</p>
                <p className="text-sm text-gray-500 mt-1">
                  Polling stations displayed with geographic locations
                </p>
              </div>
            </div>
            
            {/* Mock Map Pins */}
            <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-[#003d82] rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div className="absolute top-1/3 left-1/2 w-8 h-8 bg-[#003d82] rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div className="absolute top-2/3 left-1/3 w-8 h-8 bg-[#003d82] rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div className="absolute top-1/2 left-3/4 w-8 h-8 bg-[#003d82] rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform">
              <MapPin className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
