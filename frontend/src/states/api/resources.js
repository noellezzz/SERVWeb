import * as changeCase from "change-case";
import resourceBuilder from '../base/viewsets';
import { apiSlice } from './index';

const resources = [
    'feedbacks',
    'results',
    'tests',
    'users',
];

const resourceEndpoints = resources.reduce((acc, resource) => {
    let name = changeCase.camelCase(resource);
    const endpoints = resourceBuilder(resource);
    return {
        ...acc,
        [name]: apiSlice.injectEndpoints({
            endpoints,
        }),
    };
}, {});

export default resourceEndpoints;