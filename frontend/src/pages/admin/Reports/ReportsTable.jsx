import { useEffect, useState } from 'react';
import { getResultColumns as headers } from './table-data';
import DashboardTable from '@/components/tables';
import { usePdfViewer } from '@/components/pdf';
import { useExamplePdfQuery } from '@/states/api/pdf.api';
import useResource from '@/hooks/useResource';
import { Tabs, Tab, Box } from '@mui/material';

const ReportsTable = () => {
    const {
        actions: {
            fetchDatas,
        },
        states: {
            data,
            loading
        }
    } = useResource('feedbacks');	

    const [rows, setRows] = useState([]);
    const [tabIndex, setTabIndex] = useState(0);

    const { handleView, isLoading } = usePdfViewer();

    const onView = (item) => {
        handleView({ 
            id: item.id, 
            type: 'sentiment-results'
        });
    }

    useEffect(() => {
        fetchDatas();
    }, []);

    useEffect(() => {
        if (data) {
            setRows(data);
        }
    }, [data]);

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
        // Fetch data based on the selected tab
        // Example: fetchDatasByTab(newValue);
    };

    return (
        <div>
            <h4 className="text-xl text-gray-600 font-semibold">
                Results
            </h4>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabIndex} onChange={handleTabChange} aria-label="basic tabs example">
                    <Tab label="Employee Reports" />
                    <Tab label="Services Reports" />
                    <Tab label="Users Reports" />
                </Tabs>
            </Box>
            <DashboardTable
                columns={headers({ onView })}
                rows={rows}
                checkboxSelection
                onRowClick={(params) => console.log(params.row)}
                sx={{
                    paper: { boxShadow: 3 },
                    grid: { '& .MuiDataGrid-cell': { fontSize: 14 } }
                }}
            />
        </div>
    );
};

export default ReportsTable;