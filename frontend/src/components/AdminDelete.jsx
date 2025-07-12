import { useEffect, useState } from 'react';
import axiosClient from '../utils/axiosClient';
import { Trash2, Search, X, AlertTriangle, ChevronDown, Loader, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';

const AdminDelete = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [problemToDelete, setProblemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get('/problem/getAllProblem');
      setProblems(data);
    } catch (err) {
      setError('Failed to fetch problems');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!problemToDelete) return;
    
    setIsDeleting(true);
    try {
      await axiosClient.delete(`/problem/delete/${problemToDelete._id}`);
      setProblems(problems.filter(problem => problem._id !== problemToDelete._id));
      setShowConfirmModal(false);
    } catch (err) {
      setError('Failed to delete problem');
      console.error(err);
    } finally {
      setIsDeleting(false);
      setProblemToDelete(null);
    }
  };

  const openDeleteModal = (problem) => {
    setProblemToDelete(problem);
    setShowConfirmModal(true);
  };

  const closeDeleteModal = () => {
    setShowConfirmModal(false);
    setProblemToDelete(null);
  };

  // Get difficulty badge class
  const getDifficultyClass = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'hard': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Filter problems based on search
  const filteredProblems = problems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          problem.tags.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'all' || 
                             problem.difficulty.toLowerCase() === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProblems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);

  // Sorting
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortedData = () => {
    if (!sortConfig.key) return currentItems;
    
    return [...currentItems].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  };

  const sortedProblems = getSortedData();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-600">Loading problems...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="alert alert-error shadow-lg rounded-xl">
          <div className="flex items-center">
            <AlertTriangle className="h-6 w-6 mr-2" />
            <span>{error}</span>
          </div>
          <button className="btn btn-sm btn-outline" onClick={fetchProblems}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Problem Management</h1>
            <p className="text-gray-600 mt-2">
              Manage and delete coding problems from the platform
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search problems..."
                className="input input-bordered pl-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="dropdown dropdown-bottom">
              <div tabIndex={0} className="btn btn-outline flex items-center">
                <span>Difficulty: {difficultyFilter === 'all' ? 'All' : difficultyFilter}</span>
                <ChevronDown size={16} className="ml-2" />
              </div>
              <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-10">
                <li><button onClick={() => setDifficultyFilter('all')}>All Difficulties</button></li>
                <li><button onClick={() => setDifficultyFilter('easy')}>Easy</button></li>
                <li><button onClick={() => setDifficultyFilter('medium')}>Medium</button></li>
                <li><button onClick={() => setDifficultyFilter('hard')}>Hard</button></li>
              </ul>
            </div>
          </div>
        </div>
        
        {filteredProblems.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="mx-auto bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Search size={32} className="text-gray-500" />
            </div>
            <h3 className="text-xl font-medium text-gray-800">No problems found</h3>
            <p className="text-gray-600 mt-2">
              {searchTerm || difficultyFilter !== 'all' 
                ? "Try adjusting your search or filter criteria" 
                : "There are currently no problems in the system"}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-4 px-6 text-left font-semibold text-gray-700 cursor-pointer" onClick={() => requestSort('title')}>
                      <div className="flex items-center">
                        <span>Title</span>
                        {sortConfig.key === 'title' && (
                          sortConfig.direction === 'ascending' ? 
                            <ChevronUp size={16} className="ml-1" /> : 
                            <ChevronDown size={16} className="ml-1" />
                        )}
                      </div>
                    </th>
                    <th className="py-4 px-6 text-left font-semibold text-gray-700 cursor-pointer" onClick={() => requestSort('difficulty')}>
                      <div className="flex items-center">
                        <span>Difficulty</span>
                        {sortConfig.key === 'difficulty' && (
                          sortConfig.direction === 'ascending' ? 
                            <ChevronUp size={16} className="ml-1" /> : 
                            <ChevronDown size={16} className="ml-1" />
                        )}
                      </div>
                    </th>
                    <th className="py-4 px-6 text-left font-semibold text-gray-700">Tags</th>
                    <th className="py-4 px-6 text-right font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedProblems.map((problem, index) => (
                    <tr key={problem._id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-medium text-gray-800">{problem.title}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          ID: {problem._id.substring(0, 8)}...
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`text-xs font-medium px-3 py-1 rounded-full border ${getDifficultyClass(problem.difficulty)}`}>
                          {problem.difficulty}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-1">
                          {problem.tags.split(',').map((tag, i) => (
                            <span key={i} className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button 
                          onClick={() => openDeleteModal(problem)}
                          className="btn btn-sm btn-error"
                        >
                          <Trash2 size={16} className="mr-1" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center p-4 border-t border-gray-100">
                <div className="text-sm text-gray-600">
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredProblems.length)} of {filteredProblems.length} problems
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    className={`btn btn-sm btn-ghost ${currentPage === 1 ? 'btn-disabled' : ''}`}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  
                  <div className="flex space-x-1">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        className={`btn btn-sm ${currentPage === i + 1 ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  
                  <button 
                    className={`btn btn-sm btn-ghost ${currentPage === totalPages ? 'btn-disabled' : ''}`}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Delete Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
            <div className="p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Delete Problem</h3>
                  <div className="mt-2">
                    <p className="text-gray-600">
                      Are you sure you want to delete this problem? This action cannot be undone.
                    </p>
                    {problemToDelete && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="font-medium text-gray-800">{problemToDelete.title}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${getDifficultyClass(problemToDelete.difficulty)}`}>
                            {problemToDelete.difficulty}
                          </span>
                          <span className="text-xs bg-gray-100 text-gray-800 px-2.5 py-0.5 rounded">
                            {problemToDelete.tags}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex justify-end">
              <button
                type="button"
                className="btn btn-ghost mr-3"
                onClick={closeDeleteModal}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-error"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  'Delete Problem'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDelete;