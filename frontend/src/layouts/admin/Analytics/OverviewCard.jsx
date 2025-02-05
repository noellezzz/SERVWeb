import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, FileText, BarChart, ClipboardList, Lightbulb } from "lucide-react";

const researchOverviewData = [
  { name: "Research Engagement", value: "12,345", change: 5.2, icon: FileText },
  { name: "Sentiment Analysis", value: "Positive: 68%", change: 3.1, icon: BarChart },
  { name: "Service Efficiency", value: "87%", change: -1.5, icon: ClipboardList },
  { name: "Innovation Index", value: "92", change: 8.4, icon: Lightbulb },
];

const OverviewCard = () => {
  return (
    <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'>
      {researchOverviewData.map((item, index) => (
        <motion.div
          key={item.name}
          className='bg-white bg-opacity-95 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className='flex items-center justify-between'>
            <div>
              <h3 className='text-sm font-medium text-black'>{item.name}</h3>
              <p className='mt-1 text-xl font-semibold text-black'>{item.value}</p>
            </div>
            <div className={`p-3 rounded-full bg-opacity-20 ${item.change >= 0 ? "bg-green-500" : "bg-red-500"}`}>
              <item.icon className={`size-6 ${item.change >= 0 ? "text-green-500" : "text-red-500"}`} />
            </div>
          </div>
          <div className={`mt-4 flex items-center ${item.change >= 0 ? "text-green-500" : "text-red-500"}`}>
            {item.change >= 0 ? <ArrowUpRight size='20' /> : <ArrowDownRight size='20' />}
            <span className='ml-1 text-sm font-medium'>{Math.abs(item.change)}%</span>
            <span className='ml-2 text-sm text-gray-400'>vs last period</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default OverviewCard;
