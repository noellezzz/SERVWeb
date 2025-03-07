import React, { useState, useEffect } from 'react';
import { Box, Typography, Chip, Rating, Tooltip, CircularProgress } from '@mui/material';
import DashboardTable from '@/components/tables';
import useResource from '@/hooks/useResource';
import resourceEndpoints from '@/states/api/resources';

// Function to highlight search term in text
const highlightSearchTerm = (text, searchTerm) => {
  if (!searchTerm || !text) return <span>{text}</span>;
  
  const searchTermLower = searchTerm.toLowerCase();
  const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
  
  return (
    <>
      {parts.map((part, i) => 
        part.toLowerCase() === searchTermLower ? 
          <span key={i} className="bg-yellow-200 font-bold">{part}</span> : 
          <span key={i}>{part}</span>
      )}
    </>
  );
};

// Custom table columns for sentiment analysis visualization
const getColumns = (searchTerm) => [
  {
    field: 'id',
    headerName: 'ID',
    width: 70,
  },
  {
    field: 'user',
    headerName: 'User',
    width: 150,
    renderCell: (params) => {
      return (
        <Tooltip title={`${params.value?.user?.email || 'N/A'}`}>
          <div className="flex items-center">
            <span className="font-medium">{params.value?.user?.first_name} {params.value?.user?.last_name}</span>
          </div>
        </Tooltip>
      );
    }
  },
  {
    field: 'content',
    headerName: 'Feedback Content',
    flex: 1,
    minWidth: 200,
    renderCell: (params) => {
      return (
        <Tooltip title={params.value}>
          <div className="flex-1 flex items-center">
            {highlightSearchTerm(params.value, searchTerm)}
          </div>
        </Tooltip>
      );
    }
  },
  {
    field: 'sentiment_results',
    headerName: 'Sentiment',
    width: 170,
    renderCell: (params) => {
      if (!params.value || params.value.length === 0) return <span>No data</span>;
      
      const sentiment = params.value[0].sentiment;
      const score = params.value[0].score;
      const normalized = (score + 1) / 2; // Convert -1:1 to 0:1
      
      let color = 'default';
      if (sentiment === 'very positive' || sentiment === 'positive') color = 'success';
      else if (sentiment === 'negative' || sentiment === 'very negative') color = 'error';
      else color = 'warning';
      
      return (
        <div className="flex flex-col items-start">
          <Chip 
            label={sentiment.toUpperCase()} 
            size="small" 
            color={color} 
            className="mb-1"
          />
          <Tooltip title={`Score: ${(score * 100).toFixed(2)}%`}>
            <div className="w-full bg-gray-200 h-1 rounded overflow-hidden">
              <div 
                className={`h-full ${color === 'error' ? 'bg-red-500' : color === 'success' ? 'bg-green-500' : 'bg-yellow-500'}`}
                style={{ width: `${normalized * 100}%` }}
              ></div>
            </div>
          </Tooltip>
        </div>
      );
    }
  },
  {
    field: 'vad',
    headerName: 'V-A-D',
    width: 120,
    renderCell: (params) => {
      if (!params.row.sentiment_results || params.row.sentiment_results.length === 0) return <span>No data</span>;
      
      const details = params.row.sentiment_results[0].details;
      if (!details) return <span>No details</span>;
      
      const valence = details.valence?.toFixed(2) || 'N/A';
      const arousal = details.arousal?.toFixed(2) || 'N/A';
      const dominance = details.dominance?.toFixed(2) || 'N/A';
      
      return (
        <Tooltip title={`Valence: ${valence}, Arousal: ${arousal}, Dominance: ${dominance}`}>
          <div className="text-xs text-center">
            <span className="font-medium text-blue-600">{valence}</span>
            <span className="mx-1">|</span>
            <span className="font-medium text-orange-600">{arousal}</span>
            <span className="mx-1">|</span>
            <span className="font-medium text-green-600">{dominance}</span>
          </div>
        </Tooltip>
      );
    }
  },
  {
    field: 'rating',
    headerName: 'Rating',
    width: 120,
    renderCell: (params) => {
      return (
        <div className="flex items-center">
          <Rating value={params.value || 0} readOnly size="small" />
          <span className="ml-1 text-sm">({params.value || 0})</span>
        </div>
      );
    }
  },
  {
    field: 'services',
    headerName: 'Services',
    width: 180,
    renderCell: (params) => {
      if (!params.value || params.value.length === 0) return <span className="text-gray-400">No services</span>;
      
      return (
        <Tooltip title={params.value.map(service => service.name).join(', ')}>
          <div className="flex flex-wrap gap-1">
            {params.value.slice(0, 2).map(service => (
              <Chip 
                key={service.id} 
                label={highlightSearchTerm(service.name, searchTerm)}
                size="small" 
                className="truncate max-w-[80px]"
              />
            ))}
            {params.value.length > 2 && (
              <Chip 
                label={`+${params.value.length - 2}`} 
                size="small" 
                variant="outlined"
              />
            )}
          </div>
        </Tooltip>
      );
    }
  },
  {
    field: 'employees',
    headerName: 'Employees',
    width: 180,
    renderCell: (params) => {
      if (!params.value || params.value.length === 0) return <span className="text-gray-400">No employees</span>;
      
      // Check if the search term matches any employee names
      const highlightEmployee = (employee) => {
        const fullName = `${employee.user.first_name} ${employee.user.last_name}`;
        return highlightSearchTerm(fullName, searchTerm);
      };
      
      return (
        <Tooltip title={params.value.map(emp => `${emp.user.first_name} ${emp.user.last_name}`).join(', ')}>
          <div className="flex flex-wrap gap-1">
            {params.value.slice(0, 2).map(emp => (
              <Chip 
                key={emp.id}
                label={highlightEmployee(emp)}
                size="small"
                className="truncate max-w-[80px]"
              />
            ))}
            {params.value.length > 2 && (
              <Chip 
                label={`+${params.value.length - 2}`} 
                size="small" 
                variant="outlined"
              />
            )}
          </div>
        </Tooltip>
      );
    }
  },
  {
    field: 'created',
    headerName: 'Date',
    width: 120,
    renderCell: (params) => {
      const formattedDate = new Date(params.value).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      });
      return (
        <div className="flex items-center">
          <span>{formattedDate}</span>
        </div>
      );
    }
  },
];

export default function VisualizeTable({ search = '' }) {
  const { states = { resourceEndpoints } } = useResource('feedbacks');
  const [searchFeedbacks] = resourceEndpoints.useSearchFeedbacksMutation();
  
  const [feedbackData, setFeedbackData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const columns = getColumns(search); // Pass search term to columns for highlighting
  
  // Fetch data when component mounts or search term changes
  useEffect(() => {
    setIsLoading(true);
    
    const fetchData = async () => {
      try {
        let data;
        if (search && search !== '') {
          const result = await searchFeedbacks(search);
          data = result.data;
        } else {
          const result = await searchFeedbacks();
          data = result.data;
        }
        
        setFeedbackData(data);
      } catch (error) {
        console.error('Error fetching feedback data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [search, searchFeedbacks]);

  // Enhanced row click handler with detailed information
  const handleRowClick = (params) => {
    const feedback = params.row;
    const sentimentInfo = feedback.sentiment_results && feedback.sentiment_results.length > 0 
      ? feedback.sentiment_results[0] 
      : null;
    
    console.log('Feedback Details:', {
      id: feedback.id,
      content: feedback.content,
      user: `${feedback.user?.user?.first_name} ${feedback.user?.user?.last_name}`,
      rating: feedback.rating,
      sentiment: sentimentInfo ? sentimentInfo.sentiment : 'N/A',
      score: sentimentInfo ? sentimentInfo.score : 'N/A',
      created: new Date(feedback.created).toLocaleString(),
      services: feedback.services?.map(s => s.name).join(', '),
      employees: feedback.employees?.map(e => `${e.user.first_name} ${e.user.last_name}`).join(', '),
      detailedAnalysis: sentimentInfo ? {
        mode: sentimentInfo.mode,
        valence: sentimentInfo.details?.valence,
        arousal: sentimentInfo.details?.arousal,
        dominance: sentimentInfo.details?.dominance,
        words: sentimentInfo.words?.length || 0,
      } : 'No analysis available'
    });
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-xl">
      {isLoading ? (
        <Box className="h-96 flex items-center justify-center">
          <CircularProgress />
          <Typography variant="body1" color="textSecondary" className="ml-3">
            Loading feedback data...
          </Typography>
        </Box>
      ) : feedbackData.length === 0 ? (
        <Box className="h-96 flex items-center justify-center">
          <Typography variant="body1" color="textSecondary">
            No feedback data available. Please search for feedback to visualize.
          </Typography>
        </Box>
      ) : (
        <>
          <div className="mb-4 flex justify-between items-center">
            <Typography variant="h6" className="text-gray-700">
              Feedback Analysis Table 
              <span className="text-sm font-normal ml-2 text-gray-500">
                ({feedbackData.length} results)
                {search && (
                  <span className="ml-1">
                    for "<span className="font-medium text-blue-600">{search}</span>"
                  </span>
                )}
              </span>
            </Typography>
          </div>
          
          <Box sx={{ height: '100%', width: '100%' }}>
            <DashboardTable
              columns={columns}
              rows={feedbackData}
              checkboxSelection
              onRowClick={handleRowClick}
              disableRowSelectionOnClick={false}
              getRowClassName={(params) => {
                const sentiment = params.row.sentiment_results?.[0]?.sentiment;
                if (!sentiment) return '';
                if (sentiment.includes('positive')) return 'bg-green-50';
                if (sentiment.includes('negative')) return 'bg-red-50';
                return '';
              }}
              sx={{
                paper: { boxShadow: 3 },
                grid: { 
                  '& .MuiDataGrid-cell': { fontSize: 14 },
                  '& .bg-green-50': {
                    backgroundColor: '#f0fdf4',
                    '&:hover': {
                      backgroundColor: '#dcfce7',
                    },
                  },
                  '& .bg-red-50': {
                    backgroundColor: '#fef2f2',
                    '&:hover': {
                      backgroundColor: '#fee2e2',
                    },
                  },
                }
              }}
            />
          </Box>
          
          <div className="mt-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
            <p>
              <strong>About this table:</strong> This table shows detailed feedback data with sentiment analysis results. 
              Click on any row to view more detailed information in the console.
              {search && (
                <span className="ml-1">
                  Search terms are <span className="bg-yellow-200 font-bold px-1">highlighted</span> in the content.
                </span>
              )}
            </p>
            <p className="mt-2">
              <strong>V-A-D values</strong> represent Valence (positivity/negativity), Arousal (intensity), and 
              Dominance (control) measurements from emotional analysis.
            </p>
          </div>
        </>
      )}
    </div>
  );
}