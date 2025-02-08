import React from 'react';
import PropTypes from 'prop-types';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

const DashboardTable = ({
    columns,
    rows,
    onRowClick = () => { },
    paginationModel = { page: 0, pageSize: 5 },
    pageSizeOptions = [5, 10, 25],
    checkboxSelection = false,
    loading = false,
    height = 400,
    sx = {},
    ...rest
}) => {
    return (
        <Paper sx={{ height: height, width: '100%', ...sx?.paper }}>
            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                    pagination: { paginationModel }
                }}
                pageSizeOptions={pageSizeOptions}
                checkboxSelection={checkboxSelection}
                onRowClick={onRowClick}
                loading={loading}
                sx={{ border: 0, ...sx?.grid }}
                {...rest}
            />
        </Paper>
    );
};

DashboardTable.propTypes = {
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            field: PropTypes.string.isRequired,
            headerName: PropTypes.string.isRequired,
            width: PropTypes.number,
            type: PropTypes.string,
            sortable: PropTypes.bool,
            valueGetter: PropTypes.func
        })
    ).isRequired,
    rows: PropTypes.arrayOf(PropTypes.object).isRequired,
    paginationModel: PropTypes.shape({
        page: PropTypes.number,
        pageSize: PropTypes.number
    }),
    pageSizeOptions: PropTypes.arrayOf(PropTypes.number),
    checkboxSelection: PropTypes.bool,
    onRowClick: PropTypes.func,
    loading: PropTypes.bool,
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    sx: PropTypes.shape({
        paper: PropTypes.object,
        grid: PropTypes.object
    })
};


export default DashboardTable;