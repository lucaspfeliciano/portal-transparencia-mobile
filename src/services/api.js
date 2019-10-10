import axios from 'axios';

const api = axios.create( {
    baseURL: 'http://www.transparencia.gov.br/api-de-dados/'
});

export default api;