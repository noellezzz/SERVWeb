import React from 'react';
import { FaUser, FaEdit, FaTrashAlt, FaEnvelope } from 'react-icons/fa';
import { motion } from 'framer-motion';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination
} from '@mui/material';

export default function CustomTable({
    title,
    data = [],
    columns = [
        { key: 'user', label: 'User', icon: FaUser },
        { key: 'email', label: 'Email', icon: FaEnvelope },
    ],
    onEdit = () => { },
    onDelete = () => { },
    containerClassName = "bg-gradient-to-r from-[#ff92ad] to-[#faf2cb]",
    rowClassName = "",
    // rowClassName = "bg-gradient-to-r from-[#f9ebc4] to-[#f1d792]",
    showActions = true
}) {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <div className="flex-1 overflow-auto relative z-10  shadow-lg my-4">
            <main className="max-w-full">
                {
                    title && (
                        <h1 className="text-4xl text-gray-600 font-bold">
                            {title}
                        </h1>
                    )
                }
                <TableContainer component={Paper} className={`${containerClassName} bg-opacity-30 backdrop-blur-md shadow-lg rounded-xl no-scrollbar `}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {columns.map(col => (
                                    <TableCell key={col.key} className="font-semibold">
                                        {col.label}
                                    </TableCell>
                                ))}
                                {showActions && <TableCell className="font-semibold "><p className='text-right'></p></TableCell>}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((item) => (
                                    <motion.tr
                                        component={motion.tr}
                                        key={item.id}
                                        className={`${rowClassName}`}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.05 }}
                                        whileHover={{
                                            scale: 1.02,
                                            boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
                                        }}
                                    >
                                        {columns.map(col => (
                                            <TableCell key={col.key} className="text-md text-black">
                                                <div className="flex items-center">
                                                    {col.icon && <col.icon size={24} className="mr-3" />}
                                                    {item[col.key]}
                                                </div>
                                            </TableCell>
                                        ))}
                                        {showActions && (
                                            <TableCell>
                                                <div className="flex justify-end space-x-3">
                                                    <button
                                                        onClick={() => onEdit(item)}
                                                        className="flex items-center px-4 py-2 bg-blue-600 text-black rounded-lg hover:bg-blue-700 transition-all"
                                                    >
                                                        <FaEdit className="mr-2" /> Edit
                                                    </button>
                                                    <button
                                                        onClick={() => onDelete(item)}
                                                        className="flex items-center px-4 py-2 bg-red-600 text-black rounded-lg hover:bg-red-700 transition-all"
                                                    >
                                                        <FaTrashAlt className="mr-2" /> Delete
                                                    </button>
                                                </div>
                                            </TableCell>
                                        )}
                                    </motion.tr>
                                ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={data.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </TableContainer>
            </main>
        </div>
    );
}