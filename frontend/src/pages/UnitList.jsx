import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const UnitList = () => {
  const navigate = useNavigate();
  const { branchId, semester, subjectId } = useParams();
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/resources/${branchId}/${semester}/${subjectId}`, {
          withCredentials: true,
        });
        setResources(response.data);
      } catch (error) {
        console.error('Error fetching resources:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [branchId, semester, subjectId]);

  const handleDelete = async (resourceId) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;

    try {
      await axios.delete(`http://localhost:5000/resources/${resourceId}`, {
        withCredentials: true,
      });
      setResources(resources.filter(r => r._id !== resourceId));
    } catch (error) {
      console.error('Error deleting resource:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0F14] flex items-center justify-center">
        <div className="text-white">Loading resources...</div>
      </div>
    );
  }

  const units = [1, 2, 3, 4];

  return (
    <div className="min-h-screen bg-[#0A0F14] p-8">
      <div className="max-w-6xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent"
        >
          Unit Resources
        </motion.h1>

        {units.map((unit) => {
          const unitResources = resources.filter(r => r.unitNumber === unit);

          return (
            <motion.div
              key={unit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-semibold mb-4 text-white">Unit {unit}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {unitResources.length > 0 ? (
                  unitResources.map((resource) => (
                    <div
                      key={resource._id}
                      className="bg-glass backdrop-blur-glass border border-glass rounded-lg p-4"
                    >
                      <h3 className="text-lg font-medium mb-2 text-white">{resource.fileName}</h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/pdf/${resource._id}`)}
                          className="flex-1 bg-indigo-500 text-white py-1 px-3 rounded text-sm hover:bg-indigo-600 transition-colors"
                        >
                          View
                        </button>
                        <a
                          href={`http://localhost:5000${resource.filePath}`}
                          download
                          className="flex-1 bg-green-500 text-white py-1 px-3 rounded text-sm hover:bg-green-600 transition-colors text-center"
                        >
                          Download
                        </a>
                        {user?.role === 'admin' && (
                          <button
                            onClick={() => handleDelete(resource._id)}
                            className="bg-red-500 text-white py-1 px-3 rounded text-sm hover:bg-red-600 transition-colors"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center text-gray-400 py-8">
                    No resources available for Unit {unit}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default UnitList;