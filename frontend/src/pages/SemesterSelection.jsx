import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';

const SemesterSelection = () => {
  const navigate = useNavigate();
  const { branchId } = useParams();

  const semesters = Array.from({ length: 8 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-[#0A0F14] p-8">
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent"
        >
          Select Semester
        </motion.h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {semesters.map((semester, index) => (
            <motion.button
              key={semester}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/branch/${branchId}/semester/${semester}`)}
              className="bg-glass backdrop-blur-glass border border-glass rounded-xl p-8 hover:shadow-neon transition-all duration-300"
            >
              <div className="text-4xl mb-2">📚</div>
              <div className="text-xl font-semibold text-white">Semester {semester}</div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SemesterSelection;