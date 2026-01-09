import { useState } from "react";
import { FileText, CheckCircle, Clock, XCircle, ArrowRight, Eye, AlertCircle } from "lucide-react";
import { useMigrationWorkflow, type MigrationFilters } from "../../hooks";

export function MigrationWorkflow() {
  const [selectedStatus, setSelectedStatus] = useState<"all" | "pending" | "partial" | "completed" | "rejected">("all");

  const filters: MigrationFilters | undefined = selectedStatus === "all"
    ? undefined
    : { status: selectedStatus };

  const { migrations, loading, error, approveMigration, rejectMigration } = useMigrationWorkflow(filters);

  // Filter migrations based on selected status
  const filteredMigrations = selectedStatus === "all"
    ? migrations
    : migrations.filter(migration => migration.status === selectedStatus);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      case "partial":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
            <Clock className="w-3 h-3" />
            Partially Approved
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">
            <CheckCircle className="w-3 h-3" />
            Completed
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  const handleApprove = async (migrationId: string) => {
    const success = await approveMigration(migrationId);
    if (!success) {
      // Error handling is done in the hook
    }
  };

  const handleReject = async (migrationId: string) => {
    const success = await rejectMigration(migrationId);
    if (!success) {
      // Error handling is done in the hook
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Migration (Form-6) Workflow</h2>
          <p className="text-sm text-gray-600 mt-1">Review and process migration requests</p>
        </div>

        {/* Status Filter */}
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedStatus("all")}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              selectedStatus === "all"
                ? "bg-[#003d82] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All ({migrations.length})
          </button>
          <button
            onClick={() => setSelectedStatus("pending")}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              selectedStatus === "pending"
                ? "bg-[#003d82] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Pending ({migrations.filter(m => m.status === "pending").length})
          </button>
          <button
            onClick={() => setSelectedStatus("partial")}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              selectedStatus === "partial"
                ? "bg-[#003d82] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            In Progress ({migrations.filter(m => m.status === "partial").length})
          </button>
          <button
            onClick={() => setSelectedStatus("completed")}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              selectedStatus === "completed"
                ? "bg-[#003d82] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Completed ({migrations.filter(m => m.status === "completed").length})
          </button>
          <button
            onClick={() => setSelectedStatus("rejected")}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              selectedStatus === "rejected"
                ? "bg-[#003d82] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Rejected ({migrations.filter(m => m.status === "rejected").length})
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Migration Requests List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-[#003d82] border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500">Loading migration requests...</p>
          </div>
        ) : filteredMigrations.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No migration requests found for the selected filter</p>
          </div>
        ) : (
          filteredMigrations.map((migration) => (
            <div key={migration.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-[#003d82]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-gray-900">{migration.applicantName}</h3>
                        {getStatusBadge(migration.status)}
                      </div>
                      <p className="text-sm text-gray-600">Application ID: {migration.id}</p>
                      <p className="text-xs text-gray-500 mt-1">EPIC: {migration.epicNumber} • Applied: {migration.appliedDate}</p>
                    </div>
                  </div>
                </div>

                {/* Migration Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                  {/* From */}
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-xs text-red-600 font-medium mb-2">FROM (Old Constituency)</p>
                    <p className="text-sm font-semibold text-gray-900">{migration.oldConstituency}</p>
                    <p className="text-xs text-gray-600 mt-1">{migration.oldState}</p>
                  </div>

                  {/* Arrow */}
                  <div className="flex items-center justify-center">
                    <ArrowRight className="w-8 h-8 text-gray-400" />
                  </div>

                  {/* To */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-xs text-green-600 font-medium mb-2">TO (New Constituency)</p>
                    <p className="text-sm font-semibold text-gray-900">{migration.newConstituency}</p>
                    <p className="text-xs text-gray-600 mt-1">{migration.newState}</p>
                  </div>
                </div>

                {/* Current Stage */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-xs text-gray-500 mb-1">Current Stage</p>
                  <p className="text-sm font-medium text-gray-900">{migration.currentStage}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-[#003d82] text-white rounded-lg hover:bg-[#002d62] transition-colors text-sm">
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                  {migration.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleApprove(migration.id)}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(migration.id)}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
