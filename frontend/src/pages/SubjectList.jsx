import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const SubjectList = () => {
  const navigate = useNavigate();
  const { branchId, semester } = useParams();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/subjects/${branchId}/${semester}`, {
          withCredentials: true,
        });
        setSubjects(response.data);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [branchId, semester]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0F14] flex items-center justify-center">
        <div className="text-white">Loading subjects...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0F14] p-8">
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent"
        >
          Subjects - Semester {semester}
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subjects.length > 0 ? (
            subjects.map((subject, index) => (
              <motion.div
                key={subject._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-glass backdrop-blur-glass border border-glass rounded-xl p-6"
              >
                <h3 className="text-xl font-semibold mb-4 text-white">{subject.subjectName}</h3>
                <button
                  onClick={() => navigate(`/branch/${branchId}/semester/${semester}/subject/${subject._id}`)}
                  className="w-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white py-2 px-4 rounded-lg hover:from-indigo-600 hover:to-pink-600 transition-all duration-300"
                >
                  Open
                </button>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center text-white">
              No subjects available for this semester.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubjectList;