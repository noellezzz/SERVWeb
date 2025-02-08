import DashboardTable from './index';

const ExampleTable = () => {
    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Name', width: 130 }
    ];

    const rows = [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Doe' }
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

export default ExampleTable;