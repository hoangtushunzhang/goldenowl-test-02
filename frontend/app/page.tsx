'use client';

import { useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

interface ScoreData {
  sbd: string;
  toan: number | null;
  ngu_van: number | null;
  ngoai_ngu: number | null;
  vat_li: number | null;
  hoa_hoc: number | null;
  sinh_hoc: number | null;
  lich_su: number | null;
  dia_li: number | null;
  gdcd: number | null;
  ma_ngoai_ngu: string | null;
  [key: string]: unknown; // For dynamic muc_diem fields
}

type Menu = 'search' | 'reports';

interface ScoreReport {
  [key: string]: {
    excellent: number;
    good: number;
    average: number;
    poor: number;
  };
}

interface TopStudent {
  sbd: string;
  toan: number;
  vat_li: number;
  hoa_hoc: number;
}

export default function SearchPage() {
  const [sbd, setSbd] = useState('');
  const [result, setResult] = useState<ScoreData | null>(null);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<Menu>('search');
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState('');
  // For report and top 10
  const [scoreReport, setScoreReport] = useState<ScoreReport | null>(null);
  const [topStudents, setTopStudents] = useState<TopStudent[]>([]);
  const [loadingReport, setLoadingReport] = useState(false);
  const [loadingTop, setLoadingTop] = useState(false);

  // Validate SBD format
  const validateSBD = (value: string) => {
    if (!value) {
      return "Please enter registration number";
    }
    if (!/^\d{8}$/.test(value)) {
      return "Registration number must be 8 digits";
    }
    return "";
  };

  const handleSBDChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;
    setSbd(value);
    setValidationError(validateSBD(value));
  };

  // Use new API
  const fetchScores = async () => {
    const validationMessage = validateSBD(sbd);
    if (validationMessage) {
      setValidationError(validationMessage);
      return;
    }
    setLoading(true);
    setValidationError("");
    try {
      const res = await fetch(
        `http://localhost:8000/api/check-score?registration_number=${sbd}`
      );
      if (!res.ok) throw new Error("Registration number not found");
      const data = await res.json();
      setResult(data);
      setError("");
    } catch (err: unknown) {
      setError(
        typeof err === "object" && err !== null && "message" in err
          ? (err.message as string)
          : "Registration number not found"
      );
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch score report
  const fetchScoreReport = async () => {
    setLoadingReport(true);
    try {
      const response = await fetch("http://localhost:8000/api/score-report");
      const data = await response.json();
      setScoreReport(data);
    } catch {
      setScoreReport(null);
    }
    setLoadingReport(false);
  };

  // Fetch top 10 group A
  const fetchTopStudents = async () => {
    setLoadingTop(true);
    try {
      const response = await fetch("http://localhost:8000/api/top-students");
      const data = await response.json();
      setTopStudents(data);
    } catch  {
      setTopStudents([]);
    }
    setLoadingTop(false);
  };

  const getScoreLevelClass = (level: string) => {
    switch (level) {
      case ">=8":
        return "bg-green-100 text-green-800";
      case "6-8":
        return "bg-blue-100 text-blue-800";
      case "4-6":
        return "bg-yellow-100 text-yellow-800";
      case "<4":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Chart data for each subject
  const getChartData = (subject: string) => {
    if (!scoreReport || !scoreReport[subject]) return null;
    return {
      labels: [">= 8 points", "6-8 points", "4-6 points", "< 4 points"],
      datasets: [
        {
          data: [
            scoreReport[subject].excellent,
            scoreReport[subject].good,
            scoreReport[subject].average,
            scoreReport[subject].poor,
          ],
          backgroundColor: [
            "#22c55e",
            "#3b82f6",
            "#f59e0b",
            "#ef4444",
          ],
        },
      ],
    };
  };

  return (
    <div className="flex flex-col sm:flex-row min-h-screen">
      <Sidebar isOpen={sidebarOpen} onMenuSelect={setActiveMenu} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 pt-20 bg-gray-100">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 sm:p-8 space-y-8">
          {activeMenu === 'search' && (
            <>
              <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-gray-700">User Registration</h2>
                <label className="block mb-2 text-gray-700 font-semibold">Registration Number:</label>
                <div className="flex flex-row items-center gap-2">
                  <input
                    type="text"
                    value={sbd}
                    onChange={handleSBDChange}
                    placeholder="Enter registration number"
                    className={`border ${validationError ? "border-red-500" : "border-gray-300"} p-2 rounded-md w-80 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400`}
                    maxLength={8}
                  />
                  <button
                    onClick={fetchScores}
                    disabled={loading || !!validationError}
                    className="bg-black text-white font-bold p-2 rounded-md shadow hover:bg-gray-800 transition-colors disabled:bg-gray-400"
                  >
                    {loading ? "Searching..." : "Submit"}
                  </button>
                </div>
              </div>
              <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold mb-2 text-gray-700">Detailed Scores</h2>
                {error && <p className="text-red-500 font-semibold">{error}</p>}
                {result ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 text-gray-700">
                    {Object.entries(result).map(([key, value]) => {
                      if (key === "sbd" || key === "created_at" || key === "updated_at") return null;
                      const isScore = !key.startsWith("muc_diem_");
                      const subjectName = isScore
                        ? key.replace("_", " ").toUpperCase()
                        : key.replace("muc_diem_", "").replace("_", " ").toUpperCase();
                      return (
                        <div key={key} className="flex items-center gap-2">
                          <span className="font-medium">{subjectName}:</span>
                          {isScore ? (
                            <span>{value?.toString() ?? "-"}</span>
                          ) : (
                            <span
                              className={`inline-block px-2 py-1 rounded-full text-xs text-gray-700 font-semibold ${getScoreLevelClass(
                                value as string
                              )}`}
                            >
                              {value?.toString()}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-700 font-semibold">Detailed view of search scores here!</p>
                )}
              </div>
            </>
          )}
          {activeMenu === 'reports' && (
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md">
              <h2 className="text-2xl font-bold mb-4 text-gray-700">Reports</h2>
              {/* Score statistics */}
              <button
                onClick={fetchScoreReport}
                disabled={loadingReport}
                className="bg-green-500 text-white px-4 py-2 rounded m-4 hover:bg-green-600 disabled:opacity-50 mb-4"
              >
                {loadingReport ? "Loading report..." : "View Score Report"}
              </button>
              {scoreReport && (
                <div className="grid grid-cols-1 md:grid-cols-2 text-gray-700 lg:grid-cols-3 gap-6 mb-8">
                  {Object.entries(scoreReport).map(([subject]) => (
                    <div key={subject} className="bg-gray-50 p-4 rounded">
                      <h3 className="text-lg font-semibold mb-2 capitalize">{subject.replace("_", " ")}</h3>
                      <div className="h-64">
                        <Pie data={getChartData(subject)!} options={{ maintainAspectRatio: false }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {/* Top 10 students group A */}
              <button
                onClick={fetchTopStudents}
                disabled={loadingTop}
                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50 mb-4"
              >
                {loadingTop ? "Loading top 10..." : "View Top 10 Group A"}
              </button>
              {topStudents.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-gray-700 font-semibold">Registration Number</th>
                        <th className="px-4 py-2 text-gray-700 font-semibold">Math</th>
                        <th className="px-4 py-2 text-gray-700 font-semibold">Physics</th>
                        <th className="px-4 py-2 text-gray-700 font-semibold">Chemistry</th>
                        <th className="px-4 py-2 text-gray-700 font-semibold">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topStudents.map((student) => (
                        <tr key={student.sbd} className="border-t">
                          <td className="px-4 py-2 text-center text-gray-700">{student.sbd}</td>
                          <td className="px-4 py-2 text-center text-gray-700">{student.toan}</td>
                          <td className="px-4 py-2 text-center text-gray-700">{student.vat_li}</td>
                          <td className="px-4 py-2 text-center text-gray-700">{student.hoa_hoc}</td>
                          <td className="px-4 py-2 text-center text-gray-700 font-semibold">
                            {(
                              Number(student.toan ?? 0) +
                              Number(student.vat_li ?? 0) +
                              Number(student.hoa_hoc ?? 0)
                            ).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
