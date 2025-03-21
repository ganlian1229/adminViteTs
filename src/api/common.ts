import { post } from './request';

export function login(prams) {
    return post('/login', prams);
}
