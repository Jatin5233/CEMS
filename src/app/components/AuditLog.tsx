import { useState } from "react";
import { Activity, Filter, Download, Calendar, User, FileText, AlertCircle } from "lucide-react";
import { useAuditLog, type AuditLogFilters } from "../../hooks";

export function AuditLog() {
  const [filterAction, setFilterAction] = useState("all");
  const [filterModule, setFilterModule] = useState("all");

  const filters: AuditLogFilters | undefined =
    filterAction === "all" && filterModule === "all"
      ? undefined
      : {
          ...(filterAction !== "all" && { action: filterAction }),
          ...(filterModule !== "all" && { module: filterModule }),
        };

  const { logs, total, loading, error } = useAuditLog(filters);

  const getActionBadge = (action: string) => {
    switch (action.toLowerCase()) {
      case "migration approved":
      case "approved":
        return "bg-green-100 text-green-700";
      case "form-6 rejected":
      case "rejected":
        return "bg-red-100 text-red-700";
      case "new elector added":
      case "create":
        return "bg-blue-100 text-blue-700";
      case "bulk update processed":
      case "elector details updated":
      case "update":
        return "bg-purple-100 text-purple-700";
      case "duplicate flagged":
      case "alert":
        return "bg-orange-100 text-orange-700";
      case "verification completed":
      case "verification":
        return "bg-teal-100 text-teal-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Audit & Activity Log</h2>
          <p className="text-sm text-gray-600 mt-1">System activity and administrative actions tracking</p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 bg-[#003d82] text-white rounded-lg hover:bg-[#002d62] transition-colors">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-[#003d82]" />
          <h3 className="font-semibold text-gray-900">Filters</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="date"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003d82] focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Action Type
            </label>
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003d82] focus:border-transparent"
            >
              <option value="all">All Actions</option>
              <option value="approval">Approvals</option>
              <option value="rejection">Rejections</option>
              <option value="create">New Records</option>
              <option value="update">Updates</option>
              <option value="alert">Alerts</option>
            </select>
          </div>

          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-[#003d82] text-white rounded-lg hover:bg-[#002d62] transition-colors">
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Activity Timeline */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#003d82]" />
            <h3 className="font-semibold text-gray-900">Activity Timeline</h3>
            <span className="text-sm text-gray-500 ml-auto">Total: {total} entries</span>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-[#003d82] border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-500">Loading audit logs...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="p-12 text-center">
              <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No audit logs found for the selected filters</p>
            </div>
          ) : (
            logs.map((log) => (
            <div key={log.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-4">
                {/* Timeline Indicator */}
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getActionBadge(log.action)}`}>
                    <Activity className="w-5 h-5" />
                  </div>
                  <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                </div>

                {/* Activity Details */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">{log.action}</h4>
                      <p className="text-sm text-gray-600 mt-1">{log.details}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs ${getActionBadge(log.action)}`}>
                      {log.status === "success" ? "Success" : "Failure"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-gray-500">Timestamp</p>
                      <p className="text-sm text-gray-900 mt-1">{log.timestamp}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">User</p>
                      <p className="text-sm text-gray-900 mt-1">{log.user}</p>
                      <p className="text-xs text-gray-500">{log.userRole}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Module</p>
                      <p className="text-sm text-gray-900 mt-1">{log.module}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">IP Address</p>
                      <p className="text-sm text-gray-900 mt-1">{log.ipAddress}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500">Audit ID: {log.id}</p>
                    {log.recordId && <p className="text-xs text-gray-500">Record ID: {log.recordId}</p>}
                  </div>
                </div>
              </div>
            </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <p className="text-sm text-gray-600">Showing {logs.length} of {total} activities</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-white transition-colors">
              Previous
            </button>
            <button className="px-4 py-2 bg-[#003d82] text-white rounded-lg text-sm hover:bg-[#002d62] transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
