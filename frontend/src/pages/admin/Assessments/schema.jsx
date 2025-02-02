import ActionButtons from "@/components/actions";
import Switch from '@mui/material/Switch';
export const questionColumns = [
    {
        field: 'question',
        headerName: 'Questions',
        width: 150,
    },
    {
        field: 'category',
        headerName: 'Category',
        flex: 1,
        width: 150,
    },
    {
        field: 'is_active',
        headerName: 'Active',
        flex: 1,
        width: 150,
        renderCell: (params) => {
            return (<Switch defaultChecked={params.value} />);

        },
    },
    {
        field: 'actions',
        headerName: '',
        width: 150,

        renderCell: (params) => {
            return (<ActionButtons />);

        },
    }
]
export const resultColumns = [
    {
        field: 'id',
        headerName: 'ID',
        width: 150,
    },
    {
        field: 'score',
        headerName: 'score',
        width: 150,
    },
    {
        field: 'positivity',
        headerName: 'positivity',
        width: 150,
    },
    {
        field: 'negativity',
        headerName: 'negativity',
        width: 150,
    },
    {
        field: 'sentiment',
        headerName: 'sentiment',
        width: 150,
    },

    {
        field: 'actions',
        headerName: '',
        width: 150,
        sortable: false,
        renderCell: (params) => {
            return (<>
                <ActionButtons />
            </>);

        },
    }
]
