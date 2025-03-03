import { useEffect, useState } from 'react';
import { getResultColumns as headers } from './table-data';
import DashboardTable from '@/components/tables';
import { usePdfViewer } from '@/components/pdf';
import { useExamplePdfQuery } from '@/states/api/pdf.api';
import useResource from '@/hooks/useResource';
import { Tabs, Tab, Box } from '@mui/material';

const ENDPOINTS = [
    'feedbacks',
    'employee-info',
    'services'
]

const ReportsTable = () => {
    const [tabIndex, setTabIndex] = useState(0);
    const [rows, setRows] = useState([]);
    const { handleView, isLoading } = usePdfViewer();

    const currentResource = ENDPOINTS[tabIndex];
    
    const {
        actions: {
            fetchDatas,
        },
        states: {
            data,
            loading
        }
    } = useResource(currentResource);


    const onView = (item) => {
        const types = ['sentiment-results', 'employee-results', 'services-results'];
        handleView({ 
            id: item.id, 
            type: types[tabIndex]
        });
    }

    useEffect(() => {
        fetchDatas();
    }, [tabIndex, fetchDatas]);

    useEffect(() => {
        if (data) {
            setRows(data);
        }
    }, [data]);

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    return (
        <div>
            <h4 className="text-xl text-gray-600 font-semibold">
                Results
            </h4>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs value={tabIndex} onChange={handleTabChange} aria-label="report tabs">
                    <Tab label="Users Feedbacks" />
                    <Tab label="Employee Reports" />
                    <Tab label="Services Reports" />
                </Tabs>
            </Box>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <DashboardTable
                    columns={headers({ onView, tabIndex })}
                    rows={rows}
                    checkboxSelection
                    onRowClick={(params) => console.log(params.row)}
                    sx={{
                        paper: { boxShadow: 3 },
                        grid: { '& .MuiDataGrid-cell': { fontSize: 14 } }
                    }}
                />
            )}
        </div>
    );
};

export default ReportsTable;