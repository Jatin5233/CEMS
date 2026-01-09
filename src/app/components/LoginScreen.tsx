import { useState } from "react";
import { User, Lock, ChevronDown } from "lucide-react";
import { post } from "../../services/apiClients";

interface LoginScreenProps {
  onLogin: (username: string, role: string, additionalInfo?: { state?: string; district?: string }) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CEO");
  const [state, setState] = useState("Maharashtra");
  const [district, setDistrict] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const roles = [
    { value: "CEC", label: "Chief Election Commissioner" },
    { value: "EC", label: "Election Commissioner" },
    { value: "CEO", label: "Chief Electoral Officer (State)" },
    { value: "DEO", label: "District Election Officer" },
    { value: "RO", label: "Returning Officer" },
    { value: "BLO", label: "Booth Level Officer" },
    { value: "Citizen", label: "Citizen / Elector" },
  ];

  const states = ["Maharashtra", "Karnataka", "Tamil Nadu", "Uttar Pradesh", "West Bengal"];
  const districts = ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    (async () => {
      const additionalInfo: { state?: string; district?: string } = {};
      try {
        setLoading(true);
        setErrorMsg("");

        if (role === "CEO" || role === "DEO" || role === "RO" || role === "BLO") {
          additionalInfo.state = state;
          if (role === "DEO" || role === "RO" || role === "BLO") {
            additionalInfo.district = district || districts[0];
          }
        }

        // Call backend login API. Expecting { success, data: { token, user } }
        const payload = { username, password, role, state: additionalInfo.state, district: additionalInfo.district };
        const res: any = await post("/auth/login", payload);

        const token = res?.data?.token;
        const user = res?.data?.user;

        if (!token) {
          throw new Error(res?.message || "Login failed: no token received");
        }

        // Persist token so apiClient will include it
        localStorage.setItem("authToken", token);

        // Pass back user info to App. Use returned user when available, otherwise local values.
        onLogin(user?.name || username || "User", user?.role || role, { state: user?.state || additionalInfo.state, district: user?.district || additionalInfo.district });
      } catch (err: any) {
        setErrorMsg(err?.message || "Login failed");
      } finally {
        setLoading(false);
      }
    })();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden md:flex flex-col items-center justify-center bg-[#003d82] rounded-2xl p-12 text-white shadow-2xl">
          <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-6 shadow-lg">
            <div className="w-28 h-28 border-4 border-orange-500 rounded-full flex items-center justify-center">
              <div className="w-20 h-20 border-4 border-green-500 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-[#003d82] rounded-full"></div>
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2 text-center">CEMS</h1>
          <p className="text-lg mb-4 text-center">Central Electoral Management System</p>
          <p className="text-sm text-blue-200 text-center max-w-sm">
            केंद्रीय निर्वाचक प्रबंधन प्रणाली
          </p>
          <div className="mt-8 pt-8 border-t border-blue-400 w-full">
            <p className="text-center text-sm">Election Commission of India</p>
            <p className="text-center text-xs text-blue-200 mt-1">भारत निर्वाचन आयोग</p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Secure Login</h2>
            <p className="text-sm text-gray-600">Access the Electoral Roll Management System</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMsg && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-100 p-3 rounded">{errorMsg}</div>
            )}
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User Role <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003d82] focus:border-transparent appearance-none bg-white"
                >
                  {roles.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* State/District Selection for Regional Roles */}
            {(role === "CEO" || role === "DEO" || role === "RO" || role === "BLO") && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003d82] focus:border-transparent"
                  >
                    {states.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                {(role === "DEO" || role === "RO" || role === "BLO") && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      District
                    </label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003d82] focus:border-transparent"
                    >
                      {districts.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003d82] focus:border-transparent"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003d82] focus:border-transparent"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#003d82] text-white py-3 rounded-lg hover:bg-[#002d62] transition-colors shadow-lg ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Logging in...' : 'Login to CEMS'}
            </button>

            {/* Footer */}
            <div className="pt-6 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-500">
                Protected System - Authorized Access Only
              </p>
              <p className="text-xs text-gray-400 mt-1">
                © 2026 Election Commission of India
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}