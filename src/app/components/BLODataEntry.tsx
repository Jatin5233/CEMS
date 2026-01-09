import { useState } from "react";
import { Save, Send, Upload, User, MapPin, Phone, Calendar, CheckCircle, AlertCircle } from "lucide-react";
import { useBLODataEntry, type BLOElectorData } from "../../hooks";

export function BLODataEntry() {
  const { submitElectorData, uploadDocument, loading, error } = useBLODataEntry();

  const [formData, setFormData] = useState<BLOElectorData>({
    firstName: "",
    middleName: "",
    lastName: "",
    firstNameLocal: "",
    fatherName: "",
    gender: "male",
    dob: "",
    mobile: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    pincode: "",
    state: "Maharashtra",
    district: "Pune",
    constituency: "",
  });

  const [uploadedFiles, setUploadedFiles] = useState({
    photograph: null as File | null,
    identityProof: null as File | null,
    addressProof: null as File | null,
    ageProof: null as File | null,
  });

  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleFileUpload = (documentType: keyof typeof uploadedFiles, file: File | null) => {
    setUploadedFiles(prev => ({
      ...prev,
      [documentType]: file,
    }));
  };

  const handleFileChange = (documentType: keyof typeof uploadedFiles, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      // Basic validation
      const maxSize = documentType === 'photograph' ? 2 * 1024 * 1024 : 5 * 1024 * 1024; // 2MB for photo, 5MB for others
      if (file.size > maxSize) {
        setSubmitStatus({
          type: "error",
          message: `${documentType} file size must be less than ${maxSize / (1024 * 1024)}MB`
        });
        return;
      }
      handleFileUpload(documentType, file);
    }
  };

  const handleSubmit = async (action: "draft" | "submit") => {
    try {
      setSubmitStatus({ type: null, message: "" });

      // Basic validation
      if (!formData.firstName || !formData.lastName || !formData.fatherName || !formData.dob || !formData.addressLine1 || !formData.city || !formData.pincode) {
        setSubmitStatus({ type: "error", message: "Please fill in all required fields." });
        return;
      }

      const result = await submitElectorData(formData, action);

      if (result?.success) {
        // Upload files if elector was created successfully
        const electorId = result.data?.id;
        if (electorId) {
          const uploadPromises = Object.entries(uploadedFiles)
            .filter(([_, file]) => file !== null)
            .map(async ([documentType, file]) => {
              if (file) {
                return uploadDocument(electorId, documentType, file);
              }
              return true;
            });

          const uploadResults = await Promise.all(uploadPromises);
          const allUploadsSuccessful = uploadResults.every(success => success);

          if (!allUploadsSuccessful) {
            setSubmitStatus({
              type: "error",
              message: "Elector data saved but some document uploads failed. Please try uploading documents again."
            });
            return;
          }
        }

        setSubmitStatus({
          type: "success",
          message: `Elector data ${action === "draft" ? "saved as draft" : "submitted for approval"} successfully!`
        });

        // Reset form on successful submission
        if (action === "submit") {
          setFormData({
            firstName: "",
            middleName: "",
            lastName: "",
            firstNameLocal: "",
            fatherName: "",
            gender: "male",
            dob: "",
            mobile: "",
            email: "",
            addressLine1: "",
            addressLine2: "",
            city: "",
            pincode: "",
            state: "Maharashtra",
            district: "Pune",
            constituency: "",
          });
          setUploadedFiles({
            photograph: null,
            identityProof: null,
            addressProof: null,
            ageProof: null,
          });
        }
      } else {
        setSubmitStatus({
          type: "error",
          message: result?.message || "Failed to submit elector data."
        });
      }
    } catch (err) {
      setSubmitStatus({
        type: "error",
        message: "An unexpected error occurred. Please try again."
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">BLO Data Entry</h2>
        <p className="text-sm text-gray-600 mt-1">Add or update elector details</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6 space-y-8">
          {/* Status Message */}
          {submitStatus.type && (
            <div className={`p-4 rounded-lg flex items-center gap-3 ${
              submitStatus.type === "success"
                ? "bg-green-50 border border-green-200 text-green-800"
                : "bg-red-50 border border-red-200 text-red-800"
            }`}>
              {submitStatus.type === "success" ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <p className="text-sm">{submitStatus.message}</p>
            </div>
          )}

          {/* Personal Information */}
          <div>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
              <User className="w-5 h-5 text-[#003d82]" />
              <h3 className="font-semibold text-gray-900">Personal Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name (English) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="Enter first name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003d82] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Middle Name (English)
                </label>
                <input
                  type="text"
                  value={formData.middleName}
                  onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                  placeholder="Enter middle name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003d82] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name (English) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Enter last name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003d82] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name (Local Language)
                </label>
                <input
                  type="text"
                  value={formData.firstNameLocal}
                  onChange={(e) => setFormData({ ...formData, firstNameLocal: e.target.value })}
                  placeholder="स्थानीय भाषा में नाम"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003d82] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Father's Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.fatherName}
                  onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                  placeholder="Enter father's name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003d82] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as "male" | "female" | "other" })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003d82] focus:border-transparent"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003d82] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    placeholder="+91 XXXXX-XXXXX"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003d82] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003d82] focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
              <MapPin className="w-5 h-5 text-[#003d82]" />
              <h3 className="font-semibold text-gray-900">Address Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Line 1 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.addressLine1}
                  onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                  placeholder="House/Flat No., Building Name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003d82] focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Line 2
                </label>
                <input
                  type="text"
                  value={formData.addressLine2}
                  onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                  placeholder="Street, Area, Locality"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003d82] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City / Town <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Enter city"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003d82] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PIN Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  placeholder="6-digit PIN code"
                  maxLength={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003d82] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003d82] focus:border-transparent"
                >
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  District <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003d82] focus:border-transparent"
                >
                  <option value="Pune">Pune</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Nagpur">Nagpur</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assembly Constituency <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.constituency}
                  onChange={(e) => setFormData({ ...formData, constituency: e.target.value })}
                  placeholder="Select constituency"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003d82] focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Document Upload */}
          <div>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
              <Upload className="w-5 h-5 text-[#003d82]" />
              <h3 className="font-semibold text-gray-900">Document Upload</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photograph
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#003d82] transition-colors">
                  <input
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={(e) => handleFileChange('photograph', e)}
                    className="hidden"
                    id="photograph-upload"
                  />
                  <label htmlFor="photograph-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      {uploadedFiles.photograph ? uploadedFiles.photograph.name : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">JPG, PNG (max 2MB)</p>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Identity Proof
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#003d82] transition-colors">
                  <input
                    type="file"
                    accept="application/pdf,image/jpeg,image/png"
                    onChange={(e) => handleFileChange('identityProof', e)}
                    className="hidden"
                    id="identity-proof-upload"
                  />
                  <label htmlFor="identity-proof-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      {uploadedFiles.identityProof ? uploadedFiles.identityProof.name : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (max 5MB)</p>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Proof
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#003d82] transition-colors">
                  <input
                    type="file"
                    accept="application/pdf,image/jpeg,image/png"
                    onChange={(e) => handleFileChange('addressProof', e)}
                    className="hidden"
                    id="address-proof-upload"
                  />
                  <label htmlFor="address-proof-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      {uploadedFiles.addressProof ? uploadedFiles.addressProof.name : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (max 5MB)</p>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age Proof
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#003d82] transition-colors">
                  <input
                    type="file"
                    accept="application/pdf,image/jpeg,image/png"
                    onChange={(e) => handleFileChange('ageProof', e)}
                    className="hidden"
                    id="age-proof-upload"
                  />
                  <label htmlFor="age-proof-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      {uploadedFiles.ageProof ? uploadedFiles.ageProof.name : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (max 5MB)</p>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              onClick={() => handleSubmit("submit")}
              disabled={loading}
              className={`flex items-center gap-2 px-6 py-3 bg-[#003d82] text-white rounded-lg hover:bg-[#002d62] transition-colors ${
                loading ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              <Send className="w-4 h-4" />
              {loading ? "Submitting..." : "Submit for Approval"}
            </button>
            <button
              onClick={() => handleSubmit("draft")}
              disabled={loading}
              className={`flex items-center gap-2 px-6 py-3 bg-white text-[#003d82] border border-[#003d82] rounded-lg hover:bg-blue-50 transition-colors ${
                loading ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              <Save className="w-4 h-4" />
              {loading ? "Saving..." : "Save as Draft"}
            </button>
            <button
              disabled={loading}
              className={`px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors ${
                loading ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
