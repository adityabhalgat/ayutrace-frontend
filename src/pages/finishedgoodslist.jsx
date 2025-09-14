import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../api';

const LeafIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.61,3.47A8.75,8.75,0,0,0,12,2a8.75,8.75,0,0,0-5.61,1.47,8.75,8.75,0,0,0-3.32,12.46l.16.27.17.27,1.6,2.57.17.26.16.25a8.74,8.74,0,0,0,13.34,0l.16-.25.17-.26,1.6-2.57.17-.27.16-.27A8.75,8.75,0,0,0,17.61,3.47ZM12,20.42a6.76,6.76,0,0,1-5.18-2.3l-.15-.24-.15-.24L5,15.07l-.15-.24-.14-.24a6.75,6.75,0,0,1,2.56-9.58,6.75,6.75,0,0,1,9.56,0,6.75,6.75,0,0,1,2.56,9.58l-.14.24-.15.24L19,15.07l-.15.24-.15.24A6.76,6.76,0,0,1,12,20.42Z" />
    <path d="M12,4.11a6.83,6.83,0,0,0-4,1.62,6.7,6.7,0,0,0,4,11.62,6.7,6.7,0,0,0,4-11.62A6.83,6.83,0,0,0,12,4.11Z" />
  </svg>
);

export default function FinishedGoodsList() {
  const navigate = useNavigate();
  const [goods, setGoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchGoods() {
      setLoading(true);
      setError('');
      try {
        // Replace endpoint as per backend API
        const result = await apiRequest('/api/finishedgoods', { method: 'GET' });
        setGoods(result.goods || result.finishedGoods || []);
      } catch (err) {
        setError('Failed to fetch finished goods');
      } finally {
        setLoading(false);
      }
    }
    fetchGoods();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-emerald-50 to-stone-100 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <LeafIcon className="h-10 w-10 text-emerald-600" />
              <span className="text-3xl font-bold text-gray-800">AyuTrace</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-1">Finished Goods Inventory</h2>
          <p className="text-center text-gray-500 mb-8">View all your finished goods.</p>
          {loading && <div>Loading...</div>}
          {error && <div className="text-red-600 mb-4">{error}</div>}
          <div className="space-y-4">
            {goods.length === 0 && !loading ? (
              <div className="text-gray-500 text-center">No finished goods found.</div>
            ) : (
              goods.map((good) => (
                <div key={good.id || good.finishedGoodId} className="p-4 border rounded-lg shadow-sm flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="font-semibold text-lg text-gray-800">{good.name}</div>
                    <div className="text-sm text-gray-600">Batch: {good.batchNumber}</div>
                    <div className="text-sm text-gray-600">Quantity: {good.quantity}</div>
                  </div>
                  {/* Add more details/actions as needed */}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
