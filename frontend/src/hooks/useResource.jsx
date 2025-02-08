import { useState } from 'react';

export const createResourceHook = (api, resourceName) => {
    return function useResource() {
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState(null);

        const [list] = api.useListMutation();
        const [retrieve] = api.useRetrieveMutation();
        const [create] = api.useCreateMutation();
        const [update] = api.useUpdateMutation();
        const [destroy] = api.useDestroyMutation();

        const handleRequest = async (operation) => {
            setLoading(true);
            setError(null);
            try {
                const result = await operation();
                return result;
            } catch (err) {
                setError(err);
                throw err;
            } finally {
                setLoading(false);
            }
        };

        const listItems = () => handleRequest(() => list().unwrap());

        const retrieveItem = (id) => handleRequest(() => retrieve(id).unwrap());

        const createItem = (data) => handleRequest(() => create(data).unwrap());

        const updateItem = (id, data) => handleRequest(() => update({ id, data }).unwrap());

        const destroyItem = (id) => handleRequest(() => destroy(id).unwrap());

        return {
            loading,
            error,
            [`list${resourceName}`]: listItems,
            [`retrieve${resourceName}`]: retrieveItem,
            [`create${resourceName}`]: createItem,
            [`update${resourceName}`]: updateItem,
            [`destroy${resourceName}`]: destroyItem,
        };
    };
};