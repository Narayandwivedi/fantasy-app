import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';

const ManageDeposits = () => {
  const {BACKEND_URL} = useContext(AppContext);
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [processingId, setProcessingId] = useState(null);

  // Mock admin ID - in real app, get from context/auth
  const adminId = "66c123456789abcdef123456"; // Replace with actual admin ID

  const fetchDeposits = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 20
      };
      
      if (filter !== 'all') {
        params.status = filter;
      }

      const response = await axios.get(`${BACKEND_URL}/api/deposits`, { params });
      const data = response.data;

      if (data.success) {
        setDeposits(data.data.deposits);
        setTotalPages(data.data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching deposits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (depositId) => {
    try {
      setProcessingId(depositId);
      
      const response = await axios.patch(`${BACKEND_URL}/api/deposits/${depositId}/approve`, {
        adminId
      });

      const data = response.data;
      
      if (data.success) {
        // Update the local state
        setDeposits(prev => prev.map(deposit => 
          deposit._id === depositId 
            ? { ...deposit, status: 'approved', processedBy: adminId }
            : deposit
        ));
        alert('Deposit approved successfully!');
      } else {
        alert(data.message || 'Failed to approve deposit');
      }
    } catch (error) {
      console.error('Error approving deposit:', error);
      alert('Error approving deposit');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (depositId) => {
    const rejectionReason = prompt('Enter rejection reason:');
    if (!rejectionReason) return;

    try {
      setProcessingId(depositId);
      
      const response = await axios.patch(`${backendURL}/api/deposits/${depositId}/reject`, {
        adminId,
        rejectionReason
      });

      const data = response.data;
      
      if (data.success) {
        // Update the local state
        setDeposits(prev => prev.map(deposit => 
          deposit._id === depositId 
            ? { ...deposit, status: 'rejected', processedBy: adminId, rejectionReason }
            : deposit
        ));
        alert('Deposit rejected successfully!');
      } else {
        alert(data.message || 'Failed to reject deposit');
      }
    } catch (error) {
      console.error('Error rejecting deposit:', error);
      alert('Error rejecting deposit');
    } finally {
      setProcessingId(null);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, [currentPage, filter]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#FFA500';
      case 'auto-approved': return '#007BFF';
      case 'approved': return '#28A745';
      case 'rejected': return '#DC3545';
      default: return '#6C757D';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'auto-approved': return 'Auto-Approved';
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading deposits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 lg:p-6 space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 lg:p-6 rounded-lg shadow-lg">
        <h1 className="text-xl lg:text-3xl font-bold mb-2">Manage Deposits</h1>
        <p className="text-blue-100 text-sm lg:text-base">Review and approve deposit requests</p>
      </div>

      {/* Filter Buttons */}
      <div className="bg-white p-3 lg:p-4 rounded-lg shadow">
        <div className="grid grid-cols-2 lg:flex lg:flex-wrap gap-2">
          <button
            onClick={() => {
              setFilter('all');
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Deposits
          </button>
          <button
            onClick={() => {
              setFilter('pending');
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'pending'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => {
              setFilter('auto-approved');
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'auto-approved'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Auto-Approved
          </button>
          <button
            onClick={() => {
              setFilter('approved');
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'approved'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => {
              setFilter('rejected');
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'rejected'
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Rejected
          </button>
        </div>
      </div>

      {/* Mobile Cards View */}
      <div className="lg:hidden space-y-3">
        {deposits.map((deposit) => (
          <div key={deposit._id} className="bg-white rounded-lg shadow p-4 border">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {deposit.userId?.firstName} {deposit.userId?.lastName}
                </div>
                <div className="text-xs text-gray-500">{deposit.userId?.email}</div>
              </div>
              <span 
                className="inline-flex px-2 py-1 text-xs font-semibold rounded-full text-white"
                style={{ backgroundColor: getStatusColor(deposit.status) }}
              >
                {getStatusText(deposit.status)}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm mb-3">
              <div>
                <span className="text-gray-500">Amount:</span>
                <div className="font-medium text-green-600">₹{deposit.amount}</div>
              </div>
              <div>
                <span className="text-gray-500">Date:</span>
                <div className="font-medium">
                  {(() => {
                    const date = new Date(deposit.createdAt);
                    const day = date.getDate().toString().padStart(2, '0');
                    const month = (date.getMonth() + 1).toString().padStart(2, '0');
                    const year = date.getFullYear();
                    return `${day}/${month}/${year}`;
                  })()}
                </div>
              </div>
            </div>
            
            <div className="mb-3">
              <span className="text-gray-500 text-sm">UTR:</span>
              <div className="font-mono text-sm bg-gray-50 p-2 rounded mt-1">{deposit.UTR}</div>
            </div>
            
            {(deposit.status === 'pending' || deposit.status === 'auto-approved') ? (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleApprove(deposit._id)}
                  disabled={processingId === deposit._id}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded text-sm font-medium disabled:opacity-50"
                >
                  {processingId === deposit._id ? 'Processing...' : 
                   deposit.status === 'auto-approved' ? 'Final Approve' : 'Approve'}
                </button>
                <button
                  onClick={() => handleReject(deposit._id)}
                  disabled={processingId === deposit._id}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded text-sm font-medium disabled:opacity-50"
                >
                  Reject
                </button>
              </div>
            ) : deposit.status === 'approved' ? (
              <div className="text-center text-green-600 font-medium py-2">✓ Approved</div>
            ) : (
              <div>
                <div className="text-center text-red-600 font-medium py-2">✗ Rejected</div>
                {deposit.rejectionReason && (
                  <div className="text-xs text-gray-500 mt-1 p-2 bg-red-50 rounded">
                    <strong>Reason:</strong> {deposit.rejectionReason}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UTR</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {deposits.map((deposit) => (
                <tr key={deposit._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {(() => {
                      const date = new Date(deposit.createdAt);
                      const day = date.getDate().toString().padStart(2, '0');
                      const month = (date.getMonth() + 1).toString().padStart(2, '0');
                      const year = date.getFullYear();
                      return `${day}/${month}/${year}`;
                    })()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {deposit.userId?.firstName} {deposit.userId?.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{deposit.userId?.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    ₹{deposit.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                    {deposit.UTR}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span 
                      className="inline-flex px-2 py-1 text-xs font-semibold rounded-full text-white"
                      style={{ backgroundColor: getStatusColor(deposit.status) }}
                    >
                      {getStatusText(deposit.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {(deposit.status === 'pending' || deposit.status === 'auto-approved') ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApprove(deposit._id)}
                          disabled={processingId === deposit._id}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-medium disabled:opacity-50"
                        >
                          {processingId === deposit._id ? 'Processing...' : 
                           deposit.status === 'auto-approved' ? 'Final Approve' : 'Approve'}
                        </button>
                        <button
                          onClick={() => handleReject(deposit._id)}
                          disabled={processingId === deposit._id}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-medium disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    ) : deposit.status === 'approved' ? (
                      <span className="text-green-600 font-medium">✓ Approved</span>
                    ) : (
                      <div>
                        <span className="text-red-600 font-medium">✗ Rejected</span>
                        {deposit.rejectionReason && (
                          <div className="text-xs text-gray-500 mt-1">
                            Reason: {deposit.rejectionReason}
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageDeposits;