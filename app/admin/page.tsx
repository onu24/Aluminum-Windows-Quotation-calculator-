'use client';

import { useState, useEffect } from 'react';
import { FaUpload, FaFileAlt, FaSync, FaCheckCircle, FaExclamationCircle, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';

interface QuotationData {
  profiles: Array<{ name: string; materials: any[] }>;
  materials: any[];
  version: number;
  lastUpdated: string;
}

export default function AdminPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [quotationData, setQuotationData] = useState<QuotationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(false);

  useEffect(() => {
    fetchQuotationData();
  }, []);

  const fetchQuotationData = async () => {
    try {
      const response = await fetch('/api/quotation/data');
      if (response.ok) {
        const data = await response.json();
        setQuotationData(data);
      }
    } catch (error) {
      console.error('Error fetching quotation data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        setMessage(null);
      } else {
        setMessage({ type: 'error', text: 'Please select a PDF file' });
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage({ type: 'error', text: 'Please select a file to upload' });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: 'success',
          text: `Upload successful! Version ${data.version} with ${data.profiles} profiles and ${data.materials} materials.`,
        });
        setFile(null);
        fetchQuotationData();
      } else {
        setMessage({ type: 'error', text: data.error || 'Upload failed' });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Upload failed' });
    } finally {
      setUploading(false);
    }
  };

  const handleInitialize = async () => {
    setInitializing(true);
    setMessage(null);

    try {
      const response = await fetch('/api/admin/init', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: 'success',
          text: `Database initialized! Version ${data.version} with ${data.profiles} profiles and ${data.materials} materials.`,
        });
        fetchQuotationData();
      } else {
        setMessage({ type: 'error', text: data.error || 'Initialization failed' });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Initialization failed' });
    } finally {
      setInitializing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
                <p className="text-sm text-gray-500">Manage quotation data and materials</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Upload Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-100 p-2 rounded-lg">
                <FaUpload className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Upload Quotation PDF</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select PDF File
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                      {file ? (
                        <div className="flex items-center justify-center gap-2 text-blue-600">
                          <FaFileAlt className="w-5 h-5" />
                          <span className="font-medium">{file.name}</span>
                        </div>
                      ) : (
                        <div className="text-gray-500">
                          <FaUpload className="w-8 h-8 mx-auto mb-2" />
                          <p>Click to select PDF file</p>
                          <p className="text-xs mt-1">or drag and drop</p>
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              {message && (
                <div
                  className={`flex items-center gap-2 p-4 rounded-lg ${
                    message.type === 'success'
                      ? 'bg-green-50 border border-green-200 text-green-700'
                      : 'bg-red-50 border border-red-200 text-red-700'
                  }`}
                >
                  {message.type === 'success' ? (
                    <FaCheckCircle className="w-5 h-5" />
                  ) : (
                    <FaExclamationCircle className="w-5 h-5" />
                  )}
                  <p>{message.text}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleUpload}
                  disabled={!file || uploading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <FaUpload className="w-5 h-5" />
                      Upload PDF
                    </>
                  )}
                </button>

                <button
                  onClick={handleInitialize}
                  disabled={initializing}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {initializing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                      Initializing...
                    </>
                  ) : (
                    <>
                      <FaSync className="w-5 h-5" />
                      Initialize DB
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Current Data Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-green-100 p-2 rounded-lg">
                <FaFileAlt className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Current Quotation Data</h2>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="mt-2 text-gray-500">Loading...</p>
              </div>
            ) : quotationData ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Version</p>
                    <p className="text-2xl font-bold text-gray-900">{quotationData.version}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Last Updated</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Date(quotationData.lastUpdated).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-600 font-medium">Profiles</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {quotationData.profiles.length}
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-600 font-medium">Materials</p>
                    <p className="text-2xl font-bold text-green-900">
                      {quotationData.materials.length}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3">Profiles</h3>
                  <div className="space-y-2">
                    {quotationData.profiles.map((profile, index) => (
                      <div
                        key={index}
                        className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <p className="font-medium text-gray-900">{profile.name}</p>
                        <p className="text-sm text-gray-500">
                          {profile.materials?.length || 0} materials
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <FaFileAlt className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No quotation data found. Please upload a PDF or initialize the database.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
