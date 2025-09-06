import React from 'react';

const InputField = ({ label, name, type = 'text', register, placeholder }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {type === 'textarea' ? (
        <textarea
          {...register(name, { required: true })}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
          placeholder={placeholder}
          rows={4}
        />
      ) : (
        <input
          type={type}
          {...register(name, { required: true })}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
          placeholder={placeholder}
        />
      )}
    </div>
  );
};

export default InputField;
