
// Django REST Framework ViewSet Routes
// list: GET /api/v1/{resource}/
// create: POST /api/v1/{resource}/
// retrieve: GET /api/v1/{resource}/{id}/
// update: PATCH /api/v1/{resource}/{id}/
// destroy: PATCH /api/v1/{resource}/{id}/
// force_destroy: DELETE /api/v1/{resource}/{id}/


export default (resourceName, fn = () => { }) => (build) => ({
    list: build.mutation({
        query: () => ({
            url: `/${resourceName}`,
            method: 'GET',
        }),
    }),
    create: build.mutation({
        query: (data) => ({
            url: `/${resourceName}/`,
            method: 'POST',
            body: data,
        }),
    }),
    retrieve: build.mutation({
        query: (id) => ({
            url: `/${resourceName}/${id}`,
            method: 'GET',
        }),
    }),
    update: build.mutation({
        query: ({ id, data }) => ({
            url: `/${resourceName}/${id}/`,
            method: 'PATCH',
            body: data,
        }),
    }),
    destroy: build.mutation({
        query: (id) => ({
            url: `/${resourceName}/${id}/delete/`,
            method: 'PATCH',
        }),
    }),
    restore: build.mutation({
        query: (id) => ({
            url: `/${resourceName}/${id}/restore/`,
            method: 'PATCH',
        }),
    }),
    force_destroy: build.mutation({
        query: (id) => ({
            url: `/${resourceName}/${id}/`,
            method: 'DELETE',
        }),
    }),
    ...fn(build),
});

