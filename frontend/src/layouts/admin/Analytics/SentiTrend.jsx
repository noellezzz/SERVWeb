import { motion } from "framer-motion";
import {
	ResponsiveContainer,
	LineChart,
	Line,
	CartesianGrid,
	XAxis,
	YAxis,
	Tooltip,
	Legend,
} from "recharts";

const sentimentTrendData = [
	{ month: "Jan", positive: 70, neutral: 20, negative: 10 },
	{ month: "Feb", positive: 65, neutral: 25, negative: 10 },
	{ month: "Mar", positive: 80, neutral: 15, negative: 5 },
	{ month: "Apr", positive: 75, neutral: 20, negative: 5 },
	{ month: "May", positive: 85, neutral: 10, negative: 5 },
	{ month: "Jun", positive: 78, neutral: 15, negative: 7 },
	{ month: "Jul", positive: 90, neutral: 8, negative: 2 },
];

const SentimentTrendChart = () => {
	return (
		<motion.div
			className='bg-white shadow-lg rounded-xl p-6 border border-black flex flex-col items-center justify-center w-full max-w-3xl mx-auto'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.6 }}
		>
			<h2 className='text-xl font-semibold text-gray-900 mb-4 text-center'>Sentiment Trend Analysis</h2>
			<div className='w-full h-80'>
				<ResponsiveContainer width="100%" height="100%">
					<LineChart data={sentimentTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
						<CartesianGrid strokeDasharray='3 3' stroke='#E5E7EB' />
						<XAxis dataKey='month' stroke='#374151' />
						<YAxis stroke='#374151' />
						<Tooltip contentStyle={{ backgroundColor: "#ffffff", borderColor: "#ef4444" }} itemStyle={{ color: "#374151" }} />
						<Legend />
						<Line type='monotone' dataKey='positive' stroke='#10B981' strokeWidth={2} dot={{ r: 5 }} />
						<Line type='monotone' dataKey='neutral' stroke='#F59E0B' strokeWidth={2} dot={{ r: 5 }} />
						<Line type='monotone' dataKey='negative' stroke='#EF4444' strokeWidth={2} dot={{ r: 5 }} />
					</LineChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};

export default SentimentTrendChart;