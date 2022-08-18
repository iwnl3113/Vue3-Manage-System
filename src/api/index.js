import request from '../utils/request';

export const fetchData = query => {
    return request({
        url: './table.json',
        method: 'get',
        params: query
    });
};

export const postTableData = query => {
    return request({
        url: './table.json',
        method: 'post',
        params: query
    });
};

