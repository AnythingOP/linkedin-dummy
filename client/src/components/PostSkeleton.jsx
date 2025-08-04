import React from 'react';

const PostSkeleton = () => {
    return (
        <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-4 mb-4 animate-pulse">
            <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                <div className="ml-4 flex-1">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mt-2"></div>
                </div>
            </div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
        </div>
    );
};

export default PostSkeleton;