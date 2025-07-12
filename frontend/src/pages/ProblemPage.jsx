import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Editor from '@monaco-editor/react';
import { useParams } from 'react-router';
import axiosClient from "../utils/axiosClient";
import SubmissionHistory from "../components/SubmissionHistory";
import ChatAi from '../components/ChatAi';
import Editorial from '../components/Editorial';

const langMap = {
  cpp: 'C++',
  java: 'Java',
  javascript: 'JavaScript'
};

const ProblemPage = () => {
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [activeLeftTab, setActiveLeftTab] = useState('description');
  const [activeRightTab, setActiveRightTab] = useState('code');
  const editorRef = useRef(null);
  let { problemId } = useParams();

  const { handleSubmit } = useForm();

  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get(`/problem/problemById/${problemId}`);
        const initialCode = response.data.startCode.find(sc => sc.language === langMap[selectedLanguage]).initialCode;
        setProblem(response.data);
        setCode(initialCode);
      } catch (error) {
        console.error('Error fetching problem:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [problemId]);

  useEffect(() => {
    if (problem) {
      const initialCode = problem.startCode.find(sc => sc.language === langMap[selectedLanguage])?.initialCode || '';
      setCode(initialCode);
    }
  }, [selectedLanguage, problem]);

  const handleEditorChange = (value) => {
    setCode(value || '');
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  const handleRun = async () => {
    setLoading(true);
    setRunResult(null);
    try {
      const response = await axiosClient.post(`/submission/run/${problemId}`, {
        code,
        language: selectedLanguage
      });
      setRunResult(response.data);
      setActiveRightTab('testcase');
    } catch (error) {
      console.error('Error running code:', error);
      setRunResult({
        success: false,
        error: 'Internal server error'
      });
      setActiveRightTab('testcase');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCode = async () => {
    setLoading(true);
    setSubmitResult(null);
    try {
      const response = await axiosClient.post(`/submission/submit/${problemId}`, {
        code,
        language: selectedLanguage
      });
      setSubmitResult(response.data);
      setActiveRightTab('result');
    } catch (error) {
      console.error('Error submitting code:', error);
      const serverResponse = error?.response?.data;
      setSubmitResult({
        accepted: false,
        passedTestCases: 0,
        totalTestCases: 0,
        error: serverResponse || "Internal Server Error"
      });
      setActiveRightTab('result');
    } finally {
      setLoading(false);
    }
  };

  const getLanguageForMonaco = (lang) => {
    switch (lang) {
      case 'javascript': return 'javascript';
      case 'java': return 'java';
      case 'cpp': return 'cpp';
      default: return 'javascript';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'hard': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  if (loading && !problem) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-base-100">
      {/* Left Panel */}
      <div className="w-1/2 flex flex-col border-r border-base-300">
        <div className="tabs tabs-bordered bg-base-200 px-4">
          {['description', 'editorial', 'solutions', 'submissions', 'chatAI'].map(tab => (
            <button
              key={tab}
              className={`tab ${activeLeftTab === tab ? 'tab-active' : ''}`}
              onClick={() => setActiveLeftTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {problem && (
            <>
              {activeLeftTab === 'description' && (
  <div className="max-w-4xl mx-auto">
    {/* Enhanced Header */}
    <div className="flex flex-wrap items-center gap-3 mb-8 pb-4 border-b border-base-300">
      <div className="flex items-center gap-3">
        <div className="bg-primary text-primary-content p-2 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-primary">{problem.title}</h1>
      </div>
      
      <div className={`badge badge-lg ${getDifficultyColor(problem.difficulty)}`}>
        {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {problem.tags.split(',').map((tag, index) => (
          <div key={index} className="badge badge-outline badge-primary">
            {tag.trim()}
          </div>
        ))}
      </div>
    </div>
    
    {/* Problem Description */}
    <div className="prose prose-lg max-w-none bg-base-100 p-6 rounded-xl shadow-sm mb-8">
      <div className="whitespace-pre-wrap text-base leading-relaxed">
        {problem.description}
      </div>
    </div>
    
    {/* Examples Section */}
    <div className="mt-10">
      <div className="flex items-center gap-2 mb-6">
        <h3 className="text-xl font-bold">Examples</h3>
        <div className="badge badge-ghost">{problem.visibleTestCases.length} examples</div>
      </div>
      
      <div className="space-y-6">
        {problem.visibleTestCases.map((example, index) => (
          <div key={index} className="bg-base-200 p-5 rounded-xl border-l-4 border-primary shadow-sm">
            <div className="font-mono text-sm">
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="font-semibold text-info">Input:</span>
                </div>
                <pre className="bg-base-300 p-3 rounded-lg overflow-x-auto text-base">{example.input}</pre>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-semibold text-success">Output:</span>
                </div>
                <pre className="bg-base-300 p-3 rounded-lg overflow-x-auto text-base">{example.output}</pre>
              </div>
              
              {example.explanation && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-semibold text-warning">Explanation:</span>
                  </div>
                  <div className="bg-base-300 p-3 rounded-lg text-base">{example.explanation}</div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
    
    {/* Constraints Section */}
    {problem.constraints && (
      <div className="mt-10 bg-warning bg-opacity-10 p-5 rounded-xl border border-warning border-opacity-30">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Constraints
        </h3>
        <ul className="list-disc pl-5 space-y-2">
          {problem.constraints.split('\n').map((constraint, i) => (
            <li key={i} className="text-sm">{constraint}</li>
          ))}
        </ul>
      </div>
    )}
  </div>
)}

              {activeLeftTab === 'editorial' && (
                <Editorial secureUrl={problem.secureUrl} thumbnailUrl={problem.thumbnailUrl} duration={problem.duration} />
              )}

              {activeLeftTab === 'solutions' && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Solutions</h2>
                  {problem.referenceSolution?.map((solution, index) => (
                    <div key={index} className="border border-base-300 rounded-lg mb-4">
                      <div className="bg-base-200 px-4 py-2 rounded-t-lg font-semibold">{solution.language}</div>
                      <pre className="bg-base-100 p-4 rounded text-sm overflow-x-auto">
                        <code>{solution.completeCode}</code>
                      </pre>
                    </div>
                  )) || <p>Solutions will be available after you solve the problem.</p>}
                </div>
              )}

              {activeLeftTab === 'submissions' && (
                <SubmissionHistory problemId={problemId} />
              )}

              {activeLeftTab === 'chatAI' && (
                <ChatAi problem={problem} />
              )}
            </>
          )}
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-1/2 flex flex-col">
        <div className="tabs tabs-bordered bg-base-200 px-4">
          {['code', 'testcase', 'result'].map(tab => (
            <button
              key={tab}
              className={`tab ${activeRightTab === tab ? 'tab-active' : ''}`}
              onClick={() => setActiveRightTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex-1 flex flex-col">
          {activeRightTab === 'code' && (
            <>
              <div className="flex justify-between items-center p-4 border-b border-base-300">
                <div className="flex gap-2">
                  {['javascript', 'java', 'cpp'].map(lang => (
                    <button
                      key={lang}
                      className={`btn btn-sm ${selectedLanguage === lang ? 'btn-primary' : 'btn-ghost'}`}
                      onClick={() => handleLanguageChange(lang)}
                    >
                      {langMap[lang]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1">
                <Editor
                  height="100%"
                  language={getLanguageForMonaco(selectedLanguage)}
                  value={code}
                  onChange={handleEditorChange}
                  onMount={handleEditorDidMount}
                  theme="vs-dark"
                />
              </div>

              <div className="p-4 border-t border-base-300 flex justify-between">
                <button className="btn btn-ghost btn-sm" onClick={() => setActiveRightTab('testcase')}>Console</button>
                <div className="flex gap-2">
                  <button className={`btn btn-outline btn-sm ${loading ? 'loading' : ''}`} onClick={handleRun} disabled={loading}>Run</button>
                  <button className={`btn btn-primary btn-sm ${loading ? 'loading' : ''}`} onClick={handleSubmitCode} disabled={loading}>Submit</button>
                </div>
              </div>
            </>
          )}

          {activeRightTab === 'testcase' && (
            <div className="flex-1 p-4 overflow-y-auto">
              <h3 className="font-semibold mb-4">Test Results</h3>
              {runResult ? (
                <div className={`alert ${runResult.success ? 'alert-success' : 'alert-error'}`}>
                  <div>
                    {runResult.success ? (
                      <div>
                        <h4 className="font-bold">✅ All test cases passed!</h4>
                        <p className="text-sm mt-2">Runtime: {runResult.runtime} sec</p>
                        <p className="text-sm">Memory: {runResult.memory} KB</p>
                      </div>
                    ) : (
                      <div>
                        <h4 className="font-bold">❌ Error</h4>
                        <p>{runResult.error}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Click "Run" to test your code.</p>
              )}
            </div>
          )}

          {activeRightTab === 'result' && (
            <div className="flex-1 p-4 overflow-y-auto">
              <h3 className="font-semibold mb-4">Submission Result</h3>
              {submitResult ? (
                <div className={`alert ${submitResult.accepted ? 'alert-success' : 'alert-error'}`}>
                  <div>
                    {submitResult.accepted ? (
                      <>
                        <h4 className="font-bold text-lg">🎉 Accepted</h4>
                        <p>Test Cases Passed: {submitResult.passedTestCases}/{submitResult.totalTestCases}</p>
                        <p>Runtime: {submitResult.runtime} sec</p>
                        <p>Memory: {submitResult.memory} KB</p>
                      </>
                    ) : (
                      <>
                        <h4 className="font-bold text-lg">❌ Wrong Answer</h4>
                        <p>Test Cases Passed: {submitResult.passedTestCases}/{submitResult.totalTestCases}</p>
                        {submitResult.error && <p className="text-sm text-red-500">{submitResult.error}</p>}
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Click "Submit" to evaluate your solution.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;
