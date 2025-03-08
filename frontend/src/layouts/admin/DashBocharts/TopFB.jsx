import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { useGetTopFeedbacksQuery } from '../../../states/api/charts.api';

function TopFB() {
  const { data, error, isLoading, isFetching } = useGetTopFeedbacksQuery();
  const [processedData, setProcessedData] = useState({ positive: [], negative: [] });

  useEffect(() => {
    if (data) {
      console.log('Raw data from API:', data);

      // Extract correct fields from API response
      const positiveArray = data.top_positive_feedbacks || [];
      const negativeArray = data.top_negative_feedbacks || [];

      console.log('Positive feedbacks:', positiveArray.length);
      console.log('Negative feedbacks:', negativeArray.length);

      setProcessedData({
        positive: positiveArray.slice(0, 3).map((item) => ({
          message: item.content?.length > 40 ? `${item.content.substring(0, 40)}...` : item.content || 'No text',
          count: item.rating || 1, // Using rating as count if count is missing
        })),

        negative: negativeArray.slice(0, 3).map((item) => ({
          message: item.content?.length > 40 ? `${item.content.substring(0, 40)}...` : item.content || 'No text',
          count: item.rating || 1,
        })),
      });
    }
  }, [data]);

  if (isLoading || isFetching) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500'></div>
      </div>
    );
  }

  if (error) {
    console.error('Error fetching feedback data:', error);
    return (
      <div className='text-center p-4 text-red-500'>
        <p>Error loading feedback data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className='flex-1 overflow-auto relative z-10'>
      <main className='max-w-6xl mx-auto py-6 px-4 lg:px-8'>
        <h2 className='text-2xl font-semibold text-black mb-6 text-center'>Top 3 Feedbacks (Positive & Negative)</h2>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          {/* Top 3 Positive Feedbacks */}
          <div className='bg-gradient-to-r from-[#eafbea] to-[#c8e6c9] shadow-md rounded-xl p-6 border border-gray-300'>
            <h3 className='text-xl font-semibold text-green-700 mb-4 text-center'>Top 3 Positive Feedbacks</h3>
            {processedData.positive.length > 0 ? (
              <ResponsiveContainer width='100%' height={300}>
                <BarChart data={processedData.positive} layout='vertical'>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis type='number' tick={{ fontSize: 12, fill: '#333' }} />
                  <YAxis type='category' dataKey='message' width={150} tick={{ fontSize: 12, fill: '#333' }} tickFormatter={(value) => value || 'No text'} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey='count' fill='#4CAF50' name='Positive Feedback' />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className='text-center p-8'>
                <p className='mb-2'>No positive feedback data available</p>
              </div>
            )}
          </div>

          {/* Top 3 Negative Feedbacks */}
          <div className='bg-gradient-to-r from-[#fbeaea] to-[#ffcdd2] shadow-md rounded-xl p-6 border border-gray-300'>
            <h3 className='text-xl font-semibold text-red-700 mb-4 text-center'>Top 3 Negative Feedbacks</h3>
            {processedData.negative.length > 0 ? (
              <ResponsiveContainer width='100%' height={300}>
                <BarChart data={processedData.negative} layout='vertical'>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis type='number' tick={{ fontSize: 12, fill: '#333' }} />
                  <YAxis type='category' dataKey='message' width={150} tick={{ fontSize: 12, fill: '#333' }} tickFormatter={(value) => value || 'No text'} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey='count' fill='#F44336' name='Negative Feedback' />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className='text-center p-8'>
                <p className='mb-2'>No negative feedback data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Debug Panel */}
        {/* {data && process.env.NODE_ENV === 'development' && (
          <div className='mt-8 p-4 bg-gray-100 rounded-lg'>
            <details>
              <summary className='cursor-pointer font-medium'>Debug Data</summary>
              <pre className='mt-2 text-xs overflow-auto max-h-40'>{JSON.stringify(processedData, null, 2)}</pre>
            </details>
          </div>
        )} */}
      </main>
    </div>
  );
}

export default TopFB;
