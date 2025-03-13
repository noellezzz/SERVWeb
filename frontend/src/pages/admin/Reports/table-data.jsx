import ActionButtons from "@/components/actions";

export const getResultColumns = ({
    onView = () => { },
    onDelete = () => { },
    onDownload = () => { },
    tabIndex = 0,
} = {}) => {
    // Feedback columns
    if (tabIndex === 0) {
        return [
            // { field: 'id', headerName: 'ID', width: 70 },
            {
                field: 'user',
                headerName: 'User',
                width: 150,
                renderCell: (params) => (
                    <div className="flex-1 flex items-center">
                        <span className="truncate">{
                        params.value?.user?.first_name + ' ' + params.value?.user?.last_name
                         || 'N/A'}</span>
                    </div>
                )
            },
            {
                field: 'content',
                headerName: 'Feedback',
                flex: 1,
                renderCell: (params) => (
                    <div className="flex-1 flex items-center">
                        <span className="truncate">{params.value}</span>
                    </div>
                )
            },
            {
                field: 'rating',
                headerName: 'Rating',
                width: 100,
            },
            {
                field: 'created',
                headerName: 'Date',
                width: 180,
                renderCell: (params) => {
                    return new Date(params.value).toLocaleString();
                }
            },
            {
                field: 'actions',
                headerName: '',
                width: 150,
                sortable: false,
                renderCell: (params) => (
                    <ActionButtons
                        onView={() => onView(params.row)}
                        onDelete={() => onDelete(params.row)}
                    />
                ),
            },
        ];
    }
    
    // Employee columns
    if (tabIndex === 1) {
        return [
            // { field: 'id', headerName: 'ID', width: 70 },
            {
                field: 'user',
                headerName: 'Name',
                width: 200,
                renderCell: (params) => (
                    <div className="flex-1 flex items-center">
                        <span className="truncate">
                            {params.value ? `${params.value.first_name} ${params.value.last_name}` : 'N/A'}
                        </span>
                    </div>
                )
            },
            {
                field: 'employee_id',
                headerName: 'Employee ID',
                width: 150,
            },
            {
                field: 'score',
                headerName: 'Score',
                width: 100,
                type: 'number',
            },
            {
                field: 'services',
                headerName: 'Services',
                width: 250,
                renderCell: (params) => (
                    <div className="flex-1 flex items-center">
                        <span className="truncate">
                            {params.value && params.value.length > 0 
                                ? params.value.map(s => s.name).join(', ') 
                                : 'None assigned'}
                        </span>
                    </div>
                )
            },
            {
                field: 'created_at',
                headerName: 'Since',
                width: 180,
                renderCell: (params) => {
                    return (new Date(params.value)).toLocaleString();
                }
            },
            {
                field: 'actions',
                headerName: '',
                width: 150,
                sortable: false,
                renderCell: (params) => (
                    <ActionButtons
                        onView={() => onView(params.row)}
                        onDelete={() => onDelete(params.row)}
                    />
                ),
            },
        ];
    }
    
    // Services columns
    if (tabIndex === 2) {
        return [
            // { field: 'id', headerName: 'ID', width: 70 },
            {
                field: 'name',
                headerName: 'Service Name',
                width: 200,
                renderCell: (params) => (
                    <div className="flex-1 flex items-center">
                        <span className="truncate">{params.value}</span>
                    </div>
                )
            },
            {
                field: 'description',
                headerName: 'Description',
                flex: 1,
                renderCell: (params) => (
                    <div className="flex-1 flex items-center">
                        <span className="truncate">{params.value}</span>
                    </div>
                )
            },
            {
                field: 'category',
                headerName: 'Category',
                width: 150,
            },
            {
                field: 'created_at',
                headerName: 'Created',
                width: 180,
                renderCell: (params) => {
                    return (new Date(params.value)).toLocaleString();
                }
            },
            {
                field: 'actions',
                headerName: '',
                width: 150,
                sortable: false,
                renderCell: (params) => (
                    <ActionButtons
                        onView={() => onView(params.row)}
                        onDelete={() => onDelete(params.row)}
                    />
                ),
            },
        ];
    }

    // Default columns if none of the above
    return [
        { field: 'id', headerName: 'ID' },
        {
            field: 'actions',
            headerName: '',
            width: 150,
            sortable: false,
            renderCell: (params) => (
                <ActionButtons
                    onView={() => onView(params.row)}
                    onDelete={() => onDelete(params.row)}
                />
            ),
        },
    ];
};