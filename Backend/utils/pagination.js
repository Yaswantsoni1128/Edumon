/**
 * Utility to standardize paginated responses
 * @param {Array} data - The array of documents
 * @param {Number} total - Total count of documents
 * @param {Number} page - Current page
 * @param {Number} limit - Items per page
 */
export const getPaginatedResponse = (data, total, page, limit) => {
    return {
        data,
        pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            pages: Math.ceil(total / limit)
        }
    };
};
