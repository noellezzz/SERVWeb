import { motion } from "framer-motion";
import { Clock, Smile, AlertTriangle, UserCheck } from "lucide-react";

const INSIGHTS = [
	{
		icon: Clock,
		color: "text-red-500",
		insight: "Senior citizens experience an average waiting time of 25 minutes, exceeding the optimal threshold.",
	},
	{
		icon: Smile,
		color: "text-green-500",
		insight: "Sentiment analysis indicates a 72% satisfaction rate among elderly customers in service queues.",
	},
	{
		icon: AlertTriangle,
		color: "text-yellow-500",
		insight: "Frequent complaints highlight discomfort in long waiting times, suggesting the need for seating improvements.",
	},
	{
		icon: UserCheck,
		color: "text-blue-500",
		insight: "Smart applications improve engagement, with 60% of senior citizens adapting well to digital queue management.",
	},
];

const SeniorInsights = () => {
	return (
		<motion.div
			className='bg-white shadow-lg rounded-xl p-6 border border-black'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 1.0 }}
		>
			<h2 className='text-xl font-semibold text-gray-900 mb-4'>AI-Powered Insights on Senior Citizens' Service Experience</h2>
			<div className='space-y-4'>
				{INSIGHTS.map((item, index) => (
					<div key={index} className='flex items-center space-x-3'>
						<div className={`p-2 rounded-full ${item.color} bg-opacity-20`}>
							<item.icon className={`size-6 ${item.color}`} />
						</div>
						<p className='text-gray-700'>{item.insight}</p>
					</div>
				))}
			</div>
		</motion.div>
	);
};

export default SeniorInsights;
