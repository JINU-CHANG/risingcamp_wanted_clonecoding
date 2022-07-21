
module.exports = function(app) {
    const company = require('./companyController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    //회사 검색 API
    app.get('/app/companies', company.getCompanies);
}