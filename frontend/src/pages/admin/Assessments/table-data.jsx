import ActionButtons from "@/components/actions";
import Switch from '@mui/material/Switch';
export const questionColumns = [
    {
        field: 'question',
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

        renderCell: (params) => {
            return (<Switch defaultChecked={params.value} />);

        },
    },
    {
        field: 'actions',
        headerName: '',
        sortable: false,
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
        flex: 1,
    },
    {
        field: 'score',
        headerName: 'score',
        flex: 1,
    },
    {
        field: 'positivity',
        headerName: 'positivity',
        flex: 1,
    },
    {
        field: 'negativity',
        headerName: 'negativity',
        flex: 1,
    },
    {
        field: 'sentiment',
        headerName: 'sentiment',
        flex: 1,
    },

    {
        field: 'actions',
        headerName: '',
        sortable: false,
        width: 150,
        renderCell: (params) => {
            return (<>
                <ActionButtons />
            </>);

        },
    }
]
