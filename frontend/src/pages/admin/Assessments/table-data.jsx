import ActionButtons from "@/components/actions";
import Switch from '@mui/material/Switch';

export const getQuestionColumns = (onEdit, onDelete) => [
    {
        field: 'question_text_en',
        headerName: 'Questions',
        flex: 1,

    },
    {
        field: 'category',
        headerName: 'Category',
    },
    {
        field: 'is_active',
        headerName: 'Active',
        renderCell: (params) => (
            <Switch checked={params.value || false} />
        ),
    },
    {
        field: 'actions',
        headerName: '',
        sortable: false,
        width: 150,
        renderCell: (params) => (
            <ActionButtons 
                onEdit={() => onEdit(params.row)}
                onDelete={() => onDelete(params.row)}
            />
        ),
    }
];

export const getResultColumns = (onView, onDelete) => [
    // {
    //     field: 'id',
    //     headerName: 'ID',
    //     flex: 1,
    // },
    {
        field: 'mode',
        headerName: 'Mode',
        flex: 1,
    },
    {
        field: 'score',
        headerName: 'Score',
        flex: 1,
        valueGetter : (value) => {
            return value?.toFixed(2) * 100 + '%'
        }
    },
    {
        field: 'sentiment',
        headerName: 'Sentiment',
        flex: 1,
    },
    {
        field: 'actions',
        headerName: '',
        sortable: false,
        width: 150,
        renderCell: (params) => (
            <ActionButtons 
                onView={() => onView(params.row)}
                onDelete={() => onDelete(params.row)}
            />
        ),
    }
];