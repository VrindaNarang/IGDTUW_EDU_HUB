import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const branches = [
  { id: 'cse', name: 'CSE', icon: '💻' },
  { id: 'cse-ai', name: 'CSE AI', icon: '🤖' },
  { id: 'math-comp', name: 'Mathematics & Computing', icon: '📐' },
  { id: 'ece', name: 'ECE', icon: '⚡' },
  { id: 'ece-ai', name: 'ECE AI', icon: '🧠' },
  { id: 'mech-auto', name: 'Mechanical Automation', icon: '⚙️' },
  { id: 'ai-ml', name: 'AI/ML', icon: '🎯' },
  { id: 'it', name: 'IT', icon: '🌐' },
];

const BranchGrid = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0A0F14] p-8">
      <div className="max-w-6xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent"
        >
          Select Your Branch
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {branches.map((branch, index) => (
            <motion.div
              key={branch.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/branch/${branch.id}`)}
              className="bg-glass backdrop-blur-glass border border-glass rounded-xl p-6 cursor-pointer hover:shadow-neon transition-all duration-300"
            >
              <div className="text-6xl mb-4 text-center">{branch.icon}</div>
              <h3 className="text-xl font-semibold text-center text-white">{branch.name}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BranchGrid;