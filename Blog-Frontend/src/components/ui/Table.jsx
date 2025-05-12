import React, { useState } from 'react';
import { format } from 'date-fns';

/**
 * @param {Object} props
 * @param {Array} props.data
 * @param {Array} props.columns
 * @param {string} [props.emptyMessage='No data available']
 */
const Table = ({
    data = [],
    columns = [],
    emptyMessage = 'No data available',
    className = '',
}) => {
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: 'asc',
    });

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const formatCellValue = (value, column) => {
        if (value === null || value === undefined) return '-';

        if (column.type === 'date' && value) {
            try {
                return format(new Date(value), column.format || 'MMM d, yyyy h:mm a');
            } catch (error) {
                return value;
            }
        }

        if (column.type === 'number' && value !== null) {
            return typeof value === 'number'
                ? value.toFixed(column.decimals || 2)
                : value;
        }

        return value;
    };

    const sortedData = React.useMemo(() => {
        if (!sortConfig.key) return data;

        const column = columns.find(col => col.accessor === sortConfig.key);

        return [...data].sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (aValue === null || aValue === undefined) return sortConfig.direction === 'asc' ? -1 : 1;
            if (bValue === null || bValue === undefined) return sortConfig.direction === 'asc' ? 1 : -1;

            if (column?.type === 'number') {
                return sortConfig.direction === 'asc'
                    ? aValue - bValue
                    : bValue - aValue;
            }

            if (column?.type === 'date') {
                const dateA = new Date(aValue);
                const dateB = new Date(bValue);
                return sortConfig.direction === 'asc'
                    ? dateA - dateB
                    : dateB - dateA;
            }

            return sortConfig.direction === 'asc'
                ? String(aValue).localeCompare(String(bValue))
                : String(bValue).localeCompare(String(aValue));
        });
    }, [data, sortConfig, columns]);

    const renderSortIndicator = (column) => {
        if (sortConfig.key !== column.accessor) {
            return <span className="text-gray-300 ml-1">↕</span>;
        }

        return sortConfig.direction === 'asc'
            ? <span className="text-gray-700 ml-1">↑</span>
            : <span className="text-gray-700 ml-1">↓</span>;
    };

    if (!data.length) {
        return (
            <div className={`bg-white rounded-lg shadow p-6 text-center text-gray-500 ${className}`}>
                {emptyMessage}
            </div>
        );
    }

    return (
        <div className={`table-container ${className}`}>
            <table className="data-table">
                <thead className="bg-gray-50">
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.accessor}
                                className={`${column.sortable ? 'cursor-pointer select-none' : ''}`}
                                onClick={column.sortable ? () => handleSort(column.accessor) : undefined}
                            >
                                {column.header}
                                {column.sortable && renderSortIndicator(column)}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {sortedData.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {columns.map((column) => (
                                <td
                                    key={`${rowIndex}-${column.accessor}`}
                                    className={column.className || ''}
                                >
                                    {formatCellValue(row[column.accessor], column)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;