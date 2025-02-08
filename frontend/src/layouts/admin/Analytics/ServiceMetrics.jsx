import { motion } from "framer-motion";
import {
	ResponsiveContainer,
	Radar,
	RadarChart,
	PolarGrid,
	PolarAngleAxis,
	PolarRadiusAxis,
	Legend,
	Tooltip,
} from "recharts";

const serviceMetricsData = [
	{ category: "Efficiency", current: 120, target: 110, fullMark: 150 },
	{ category: "Customer Satisfaction", current: 98, target: 130, fullMark: 150 },
	{ category: "Response Time", current: 86, target: 130, fullMark: 150 },
	{ category: "Service Quality", current: 99, target: 100, fullMark: 150 },
	{ category: "Complaint Resolution", current: 85, target: 90, fullMark: 150 },
	{ category: "Wait Time", current: 65, target: 85, fullMark: 150 },
];

const ServiceMetrics = () => {
	return (
		<motion.div
			className='bg-white shadow-lg rounded-xl p-6 border border-black flex flex-col items-center justify-center w-full max-w-3xl mx-auto'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.6 }}
		>
			<h2 className='text-xl font-semibold text-gray-900 mb-4 text-center'>Service Metrics Overview</h2>
			<div className='w-full h-full'>
				<ResponsiveContainer width="100%" height="100%">
					<RadarChart cx='50%' cy='50%' outerRadius='80%' data={serviceMetricsData}>
						<PolarGrid stroke='#E5E7EB' />
						<PolarAngleAxis dataKey='category' stroke='#374151' />
						<PolarRadiusAxis angle={30} domain={[0, 150]} stroke='#374151' />
						<Radar name='Current Performance' dataKey='current' stroke='#10B981' fill='#10B981' fillOpacity={0.6} />
						<Radar name='Target Performance' dataKey='target' stroke='#EF4444' fill='#EF4444' fillOpacity={0.6} />
						<Legend />
						<Tooltip contentStyle={{ backgroundColor: "#ffffff", borderColor: "#ef4444" }} itemStyle={{ color: "#374151" }} />
					</RadarChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};

export default ServiceMetrics;