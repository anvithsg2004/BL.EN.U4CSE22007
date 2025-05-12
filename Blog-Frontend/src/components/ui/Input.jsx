import React from 'react';

/**
 * @param {Object} props
 * @param {string} props.label
 * @param {string} props.id
 * @param {string} [props.type='text']
 * @param {string} [props.error]
 */
const Input = ({
    label,
    id,
    type = 'text',
    error,
    className = '',
    ...props
}) => {
    return (
        <div className={`mb-4 ${className}`}>
            {label && (
                <label
                    htmlFor={id}
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    {label}
                </label>
            )}
            <input
                type={type}
                id={id}
                className={`input-field ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-error-600">{error}</p>
            )}
        </div>
    );
};

export default Input;