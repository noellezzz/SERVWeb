import DashboardTable from '@/components/tables';

const ReportsTable = () => {
    const columns = [
        { field: 'id', headerName: 'ID', width: "70" },
        { field: 'user_id', headerName: 'User', width: "150" },
        { field: 'positive_score', headerName: 'Positive', width: "150" },
        { field: 'negative_score', headerName: 'Negative', width: "150" },
        { field: 'score', headerName: 'Score', width: "150" },
        { field: 'sentiment', headerName: 'Sentiment', width: "150" },
        { field: 'actions', headerName: '', width: "150" },

    ];

    const rows = [
    ];

    return (
        <DashboardTable
            columns={columns}
            rows={rows}
            checkboxSelection
            onRowClick={(params) => console.log(params.row)}
            sx={{
                paper: { boxShadow: 3 },
                grid: { '& .MuiDataGrid-cell': { fontSize: 14 } }
            }}
        />
    );
};

export default ReportsTable;