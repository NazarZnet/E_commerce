const ApiBase = '/api';

export const getFeaturedProducts = async () => {
    try {
        const response = await fetch(`${ApiBase}/products?is_featured=true`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
            return [];
        }

        const jsondata = await response.json();
        return jsondata.results;
    } catch (error) {
        console.error('Failed to fetch data', error);
        return [];
    }
};


export const getCategories = async () => {
    try {
        const response = await fetch(`${ApiBase}/categories`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
            return [];
        }

        const jsondata = await response.json();
        return jsondata.results;
    } catch (error) {
        console.error('Failed to fetch data', error);
        return [];
    }
};
