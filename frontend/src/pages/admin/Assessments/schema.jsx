import ActionButtons from "@/components/actions";

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
        field: 'actions',
        headerName: '',
        renderCell: (params) => {
            return (<ActionButtons />);

        },
    }
]
export const resultColumns = [
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
