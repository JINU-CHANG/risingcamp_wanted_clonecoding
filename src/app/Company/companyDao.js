async function getFollowCount(connection,companyId){
    let getFollowCountResult;
    const getFollowCountQuery = `

        SELECT followCount
            FROM Companies
            WHERE companyId=${companyId}
    `;

    console.log(getFollowCountQuery);
    try{
        getFollowCountResult = await connection.query(getFollowCountQuery);
    }catch(err){
        throw "getFollowCountFail";
    }
    const FollowCount=getFollowCountResult[0][0].followCount;
    return FollowCount;
  
}

async function updateFollowCount(connection,companyId,followCount) {
    let updateFollowCountResult;
    const updateFollowCountQuery = `
            UPDATE WANTED.Companies
            SET Companies.followCount=${followCount}
            WHERE Companies.companyId=${companyId};
         `;
    try{
        updateFollowCountResult = await connection.query(updateFollowCountQuery);
    }catch(err){
        throw "updateFollowCountFail";
    }
    
    return updateFollowCountResult[0];
}
//회사 검색
async function getCompanies (connection) {
    let getCareerCompaniesRows;
    const  getCompaniesQuery = `
        select companyName, companyId
        from Companies;
    `;
    try{
        getCareerCompaniesRows = await connection.query(getCompaniesQuery);
    }catch(err){
        throw "getCompaniesFail";
    }

    return  getCareerCompaniesRows[0];
}

async function getCompaniesUsingTag (connection,tagId,userId) {
    let companyRows;
    const  getCompaniesUsingTagQuery = `
        SELECT 
            Companies.companyId,
            companyName,
            Logo,
            IF(IsFollow.userId,true,false) as IsFollow
        FROM Companies
        LEFT JOIN (
        select * from Follow
        WHERE status='ACTIVE' AND userId=${userId}
        )IsFollow on IsFollow.companyId=Companies.CompanyId
        LEFT JOIN CompanyTagsMapping CTM on Companies.CompanyId = CTM.companyId
        LEFT JOIN CompanyTags CT on CTM.tagId = CT.tagId
        WHERE CT.tagId=${tagId};
    `;
    try{
        companyRows = await connection.query(getCompaniesUsingTagQuery); 
    }catch(err){
        throw "getCompaniesUsingTagFail";
    }

    return  companyRows[0];
}


async function getCompaniesTag (connection,companyId) {
    let companyTagsRows;

    const  getCompaniesTagQuery = `
        SELECT CompanyTags.tagId,name FROM Companies
        LEFT JOIN CompanyTagsMapping ON Companies.CompanyId=CompanyTagsMapping.companyId
        LEFT JOIN CompanyTags ON CompanyTagsMapping.tagId=CompanyTags.tagId
        WHERE Companies.CompanyId=${companyId};
    `;

    try{
        companyTagsRows = await connection.query(getCompaniesTagQuery);
    }catch(err){
        throw "getCompaniesTagFail";
    }

    return  companyTagsRows[0];
}


async function getTagInfo (connection,tagId) {
    let tagInfo;
    const  getTagInfoQuery = `
        select tagId,name from CompanyTags
        where tagId=${tagId};
    `;

    try{
        tagInfo = await connection.query(getTagInfoQuery);

    }catch(err){
        throw "getTagInfoFail";
    }

    return  tagInfo[0][0];
}


async function getRandomTags (connection,tagId) {
    let randomTags;

    const  getRandomTagsQuery = `
        select tagId,name from CompanyTags
        WHERE tagId!=${tagId}
        ORDER BY RAND()
        LIMIT 4;
    `;

    try{
        randomTags = await connection.query(getRandomTagsQuery);
    }catch(err){
        throw "getRandomTagsFail";
    }

   console.log("RandomTags: ");
   console.log(randomTags[0]);
   
    return  randomTags[0];
}
async function getCompanyDetails(connection,userId,companyId){
    let companyDetails;
    const  getCompanyDetailsQuery = `
        SELECT 
            companyName,
            Logo,
            description,
            IF(IsFollow.userId,true,false) as IsFollow
        FROM Companies
        LEFT JOIN (
        select * from Follow
        WHERE status='ACTIVE' AND userId=${userId}
        )IsFollow on IsFollow.companyId=Companies.CompanyId
        WHERE Companies.CompanyId=${companyId};  
    `;

    try{
        companyDetails = await connection.query(getCompanyDetailsQuery);
    }catch(err){
        throw "getCompanyDetailsFail";
    }

    console.log("companyDetails: ");

    return  companyDetails[0];
}


async function getCompanyImgs(connection,companyId){
    let companyImgs;
    const  getCompanyImgsQuery = `
        SELECT
            imgUrl
        FROM CompanyImgs
        WHERE companyId=${companyId}; 
    `;

    try{
        companyImgs = await connection.query(getCompanyImgsQuery);
    }catch(err){
        throw "getCompanyImgsFail";
    }

    console.log("companyImgs: ");

    return  companyImgs[0];
}


async function getEmploymentsOfCompany(connection,userId,companyId){
    let employmentsOfCompany;
    const  getEmploymentsOfCompanyQuery = `
            SELECT
                Employments.employmentId,
                jobName,
                dueDate, # dueDate 상시채용 생각하기.
                (recommenderSigningBonus+Employments.recommendedSigningBonus) as 'SigningBonus',
                IF(IsBookMark.userId,true,false) as isBookMark
            FROM Employments
            LEFT JOIN Companies C on Employments.companyId = C.CompanyId
            LEFT JOIN (
                select * from WANTED.BookMark
                where status='ACTIVE' and userId=${userId}
            )IsBookMark on IsBookMark.employmentId=Employments.employmentId
            WHERE C.CompanyId=${companyId}
            ORDER BY Employments.createdAt
            LIMIT 4;
    `;

    try{
        employmentsOfCompany = await connection.query(getEmploymentsOfCompanyQuery);
    }catch(err){
        throw "getEmploymentsOfCompanyFail";
    }

    console.log("employmentsOfCompany: ");
    console.log(employmentsOfCompany[0]);

    return  employmentsOfCompany[0];
}


async function getCompanyNews(connection,companyId){
    let companyNews;

    const  getCompanyNewsQuery = `
        select newsName,newsFullUrl,newsUrl,uploadDate from CompanyNews
        LEFT JOIN Companies C on CompanyNews.companyId = C.CompanyId
        WHERE C.CompanyId=${companyId}
        LIMIT 4;
    `;

    try{
        companyNews = await connection.query(getCompanyNewsQuery);
    }catch(err){
        throw "getCompanyNewsFail";
    }


    return  companyNews[0];
}


module.exports = {
    getFollowCount,
    updateFollowCount,
    getCompanies,
    getCompaniesUsingTag,
    getCompaniesTag,
    getTagInfo,
    getRandomTags,
    getCompanyDetails,
    getCompanyImgs,
    getEmploymentsOfCompany,
    getCompanyNews,
}