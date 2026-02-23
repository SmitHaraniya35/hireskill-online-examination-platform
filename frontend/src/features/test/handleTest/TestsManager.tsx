import React, { useEffect, useState } from "react";
import testLinkService from "../../../services/test.services";
import studentAttemptService from "../../../services/studentAttempt.services";
import GenerateNewTest from "./GenerateNewTest";

import View from "../../../assets/viewIcon.svg";
import Edit from "../../../assets/Edit.svg";
import Delete from "../../../assets/Delete.svg";

import type { Test, TestList } from "../../../types/test.types";
import type { axiosResponse } from "../../../types/index.types";

const TestLinkManager: React.FC = () => {
  const [testList, setTestList] = useState<Test[] | undefined>([]);

  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [mode, setMode] = useState<"create" | "edit">("create");
  const [openModal, setOpenModal] = useState(false);

  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  const [studentAttempts, setStudentAttempts] = useState<any[]>([]);
  const [attemptLoading, setAttemptLoading] = useState(false);

  const loadLinks = async () => {
    try {
      const res: axiosResponse<TestList> = await testLinkService.getAllTest();
      setTestList(res.payload?.testList);
    } catch (err: any) {
      console.error(err);
      setIsError(true);
      setErrorMsg(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLinks();
  }, []);

  const handleCreate = () => {
    setMode("create");
    setOpenModal(true);
  };

  const handleEdit = async (id: string) => {
    try {
      const res = await testLinkService.getTestDetails(id);
        const testData = res.payload!.test;
        setSelectedTest(testData);
        setMode("edit");
        setOpenModal(true);
    }catch (err: any) {
      setIsError(true);
      setErrorMsg(err.response.data.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this test link?")) return;
    try {
      await testLinkService.deleteTest(id);
      setTestList((prevLinks) => prevLinks!.filter(link => link.id !== id))
    } catch (err: any) {
      setIsError(true);
      setErrorMsg(err.response.data.message);
    }
  };

  const handleView = async (testId: string) => {
    setSelectedTestId(testId);
    setAttemptLoading(true);

    try{
      const res = await studentAttemptService.getStudentAttemptsDetails(testId);
      setStudentAttempts(res.payload!.students);
    }catch(err: any){
      setIsError(true);
      setErrorMsg(err.response.data.message);
    }
    
    setAttemptLoading(false);
  };

  const handleBack = () => {
    setSelectedTestId(null);
    setStudentAttempts([]);
  };

  return (
    <>
      {isError ? (
        <div>{errorMsg}</div>
      ) : (
        <div className="min-h-screen bg-gray-50 p-6 font-mono">
          {selectedTestId ? (
            <div className="max-w-6xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Student Attempts</h1>

                <button
                  onClick={handleBack}
                  className="px-4 py-2 bg-[#1DA077] text-white rounded-xl hover:bg-[#148562]"
                >
                  ← Back
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow overflow-hidden">
                {attemptLoading ? (
                  <div className="p-6 text-center text-gray-500">
                    Loading attempts...
                  </div>
                ) : (
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-3 text-left">Name</th>
                        <th className="p-3 text-left">Email</th>
                        <th className="p-3 text-left">Phone</th>
                        <th className="p-3 text-left">Problem</th>
                        <th className="p-3 text-left">Difficulty</th>
                        <th className="p-3 text-left">Started</th>
                        <th className="p-3 text-left">Expires</th>
                        <th className="p-3 text-left">Status</th>
                        <th className="p-3 text-left">Submitted</th>
                      </tr>
                    </thead>

                    <tbody>
                      {studentAttempts.map((a) => (
                        <tr key={a.id} className="border-t hover:bg-gray-50">
                          <td className="p-3">{a.student?.name}</td>
                          <td className="p-3">{a.student?.email}</td>
                          <td className="p-3">{a.student?.phone}</td>
                          <td className="p-3">{a.problem.title}</td>
                          <td className="p-3">{a.problem.difficulty}</td>
                          <td className="p-3">
                            {new Date(a.started_at).toLocaleString()}
                          </td>
                          <td className="p-3">
                            {new Date(a.expires_at).toLocaleString()}
                          </td>
                          <td className="p-3">
                            {a.is_active ? "Active" : "Inactive"}
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                a.is_submitted
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {a.is_submitted ? "Submitted" : "Pending"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
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
                  className="bg-emerald-600 text-white px-5 py-2 rounded-xl hover:bg-emerald-700"
                >
                  + Generate test
                </button>
              </div>

              {loading ? (
                <div className="flex justify-center py-20 font-mono">
                  <div className="w-10 h-10 border-4 border-gray-300 border-t-[#1DA077] rounded-full animate-spin" />
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
                          Date:{" "}
                          {new Date(link.expiration_at).toLocaleDateString()}
                          <br />
                          Duration: {link.duration_minutes} mins
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <img
                          src={View}
                          className="w-5 h-5 cursor-pointer "
                          onClick={() => handleView(link!.id!)}
                        />
                        <img
                          src={Edit}
                          className="w-5 h-5 cursor-pointer"
                          onClick={() => handleEdit(link!.id!)}
                        />
                        <img
                          src={Delete}
                          className="w-5 h-5 cursor-pointer"
                          onClick={() => handleDelete(link!.id!)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {openModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                  <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg relative m-4">
                    <button
                      onClick={() => setOpenModal(false)}
                      className="hover:text-red-500 absolute top-3 right-3 text-xl text-gray-400"
                    >
                      ×
                    </button>

                    <div className="p-6 max-h-150">
                      <GenerateNewTest
                        key={selectedTest?.id || "new"}
                        closeModal={() => setOpenModal(false)}
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
      )}
    </>
  );
};

export default TestLinkManager;
