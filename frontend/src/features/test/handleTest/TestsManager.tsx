import React, { useEffect, useState } from "react";
import testLinkService from "../../../services/test.services";
import GenerateNewTest from "./GenerateNewTest";
import StudentAttempts from "./StudentAttemptListsView";

import View from "../../../assets/viewIcon.svg";
import Edit from "../../../assets/Edit.svg";
import Delete from "../../../assets/Delete.svg";

import type { Test, TestList } from "../../../types/test.types";
import type { axiosResponse } from "../../../types/index.types";
import { toast } from "react-toastify";
import TestCardSkeleton from "../../../skeleton/TestCardSkeleton";

const TestLinkManager: React.FC = () => {
  const [testList, setTestList] = useState<Test[] | undefined>([]);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [mode, setMode] = useState<"create" | "edit">("create");
  const [openModal, setOpenModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);

  const loadLinks = async () => {
    try {
      const res: axiosResponse<TestList> = await testLinkService.getAllTest();
      setTestList(res.payload?.testList || []);
    } catch (err: any) {
      console.error(err);
      setIsError(true);
      setErrorMsg(err.response?.data?.message || "Failed to load tests");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadLinks();
  }, []);

  const handleToggleActivation = async (id: string) => {
    try {
      const res = await testLinkService.toggleActivation(id);

      const updatedTest = res.payload?.test;

      setTestList((prev) =>
        prev?.map((test) =>
          test.id === id ? { ...test, ...updatedTest } : test,
        ),
      );

      toast.success(
        updatedTest?.is_active ? "Test Activated" : "Test Deactivated",
      );
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Toggle failed");
    }
  };

  const handleCreate = () => {
    setMode("create");
    setSelectedTest(null);
    setOpenModal(true);
  };

  const handleEdit = async (id: string) => {
    try {
      const res = await testLinkService.getTestDetails(id);
      const testData = res.payload!.test;
      setSelectedTest(testData);
      setMode("edit");
      setOpenModal(true);
    } catch (err: any) {
      setIsError(true);
      setErrorMsg(err.response?.data?.message || "Failed to load test details");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this test link?")) return;
    try {
      await testLinkService.deleteTest(id);
      toast.success("Test Deleted Successfully!");
      setTestList((prevLinks) => prevLinks!.filter((link) => link.id !== id));
    } catch (err: any) {
      setIsError(true);
      setErrorMsg(err.response?.data?.message || "Failed to delete test");
    }
  };

  const handleView = (testId: string) => {
    setSelectedTestId(testId);
  };

  const handleBack = () => {
    setSelectedTestId(null);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedTest(null);
  };

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 font-mono flex items-center justify-center">
        <div className="bg-white p-6 rounded-2xl shadow text-red-500">
          ⚠️ {errorMsg}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f6f8] p-6 font-mono">
      {selectedTestId ? (
        <StudentAttempts testId={selectedTestId} onBack={handleBack} />
      ) : (
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Test Management</h1>
              <p className="text-gray-500">
                Manage access links for assessments
              </p>
            </div>

            <button
              onClick={handleCreate}
              className="bg-[#1DA077] text-white px-6 py-3 rounded-xl font-bold text-base transition-all duration-300 mt-4 shadow-[0_4px_12px_rgba(29,160,119,0.2)] hover:bg-[#148562] hover:-translate-y-0.5 hover:shadow-[0_6px_15px_rgba(29,160,119,0.3)] disabled:opacity-50"
            >
              + Generate test
            </button>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <TestCardSkeleton key={index} />
              ))}
            </div>
          ) : testList?.length === 0 ? (
            <div className="bg-white rounded-2xl shadow p-10 text-center text-gray-500">
              No tests found. Click "Generate test" to create one.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {testList!.map((link) => (
                <div
                  key={link.id}
                  className="bg-white rounded-2xl shadow p-5 flex justify-between items-center"
                >
                  <div>
                    <h3 className="text-lg font-semibold">
                      {link.title || "Untitled"}
                    </h3>
                    <div className="text-sm text-gray-600 mt-1">
                      Date: {new Date(link.expiration_at).toLocaleDateString()}
                      <br />
                      Duration: {link.duration_minutes} mins
                    </div>
                  </div>
                  

                  <div className="flex item-center gap-4">
                    <button
                      type="button"
                      onClick={() => handleToggleActivation(link.id!)}
                      className={`w-11 h-6 flex items-center rounded-full p-1 transition ${
                        link.is_active ? "bg-green-500" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                          link.is_active ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                    <img
                      src={View}
                      alt="View"
                      className="w-5 h-5 cursor-pointer hover:opacity-70"
                      onClick={() => handleView(link.id!)}
                      title="View student attempts"
                    />
                    <img
                      src={Edit}
                      alt="Edit"
                      className="w-5 h-5 cursor-pointer hover:opacity-70"
                      onClick={() => handleEdit(link.id!)}
                      title="Edit test"
                    />
                    <img
                      src={Delete}
                      alt="Delete"
                      className="w-5 h-5 cursor-pointer hover:opacity-70"
                      onClick={() => handleDelete(link.id!)}
                      title="Delete test"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Modal for Create/Edit */}
          {openModal && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg relative m-4">
                <button
                  onClick={handleCloseModal}
                  className="hover:text-red-500 absolute top-3 right-3 text-xl text-gray-400"
                >
                  ×
                </button>

                <div className="p-6 max-h-150">
                  <GenerateNewTest
                    key={selectedTest?.id || "new"}
                    closeModal={handleCloseModal}
                    refreshLinks={loadLinks}
                    editData={selectedTest}
                    mode={mode}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TestLinkManager;
