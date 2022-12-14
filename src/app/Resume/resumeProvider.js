const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const resumeDao = require("./resumeDao");
const {response, errResponse} = require("../../../config/response");
const baseResponse = require("../../../config/baseResponseStatus");
const userDao = require("../User/userDao");


//이력서 전체 조회
exports.getResumes = async function(userId) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const getResumesResult = await resumeDao.getResumes(connection, userId);
        connection.release();

        return response(baseResponse.SUCCESS, getResumesResult);
    }
    catch(err) {
        if(err=="getResumes Query err") return errResponse({"isSuccess":false, "code":4108, "message":"getResumes Query err"});
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

//이력서 조회

exports.getResume = async function(getResumeParams) {
    const connection = await pool.getConnection(async (conn) => conn);
    try{

        //이력서 validation

        const resumeIdCheck = await resumeDao.resumeIdCheck(connection,getResumeParams[1]);

        if(resumeIdCheck.length==0){
            return errResponse(baseResponse.RESUMEID_NOT_EXIST);
        }

        const params= [getResumeParams[1], getResumeParams[0]]
        const userResumeCheck = await resumeDao.resumeUserCheck(connection,params );
        if(userResumeCheck.length==0){
            return errResponse(baseResponse.NOT_USER_RESUME);
        }

        let getResumeResult = await resumeDao.getResumeInfo(connection,getResumeParams);

        if(getResumeResult.length==0){
            getResumeResult = null
        }
        let getResumeCareerResult = await resumeDao.getResumeCareer(connection,getResumeParams);

        if(getResumeCareerResult.length==0){
            getResumeCareerResult = null
        }

        let getResumeEducationResult = await resumeDao.getResumeEducation(connection,getResumeParams);

        if(getResumeEducationResult.length==0){
            getResumeEducationResult = null
        }

        let getResumeSkillsResult = await resumeDao.getResumeSkills(connection,getResumeParams);

        if(getResumeSkillsResult.length==0){
            getResumeSkillsResult = null
        }

        let getResumeAwardsResult = await resumeDao.getResumeAwards(connection,getResumeParams);

        if(getResumeAwardsResult.length==0){
            getResumeAwardsResult = null
        }

        let getResumeForeignResult = await resumeDao.getResumeForeign(connection,getResumeParams);

        if(getResumeForeignResult.length==0){
            getResumeForeignResult = null
        }
        let getResumeLink = await resumeDao.getResumeLink(connection,getResumeParams);

        if(getResumeLink.length==0){
            getResumeLink = null
        }
        const resultResponse = {}
        const resumeInfo = getResumeResult;
        resultResponse.resumInfo = resumeInfo;
        resultResponse.careerResult= getResumeCareerResult;
        resultResponse.educationResult = getResumeEducationResult;
        resultResponse.skillsResult = getResumeSkillsResult;
        resultResponse.awardsResult = getResumeAwardsResult;
        resultResponse.foreignResult = getResumeForeignResult;
        resultResponse.linkResult = getResumeLink;

        connection.release();

        return response(baseResponse.SUCCESS,resultResponse);
    }
    catch (err) {
        if(err=="resumeIdCheck Query err") return errResponse({"isSuccess":false, "code":4110, "message":"resumeIdCheck Query err"});
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}
//이력서 제목 조회
exports.getResumeTitle = async function (getResumeParams) {
    const connection = await pool.getConnection(async (conn) => conn);
    try{
        //이력서 validation

        const resumeIdCheck = await resumeDao.resumeIdCheck(connection,getResumeParams[1]);

        if(resumeIdCheck.length==0){
            return errResponse(baseResponse.RESUMEID_NOT_EXIST);
        }

        const getResumeTitleResult = await resumeDao.getResumeTitle(connection,getResumeParams);
        connection.release();

        return response(baseResponse.SUCCESS,getResumeTitleResult);

    }
    catch(err) {
        if(err=="resumeIdCheck Query err") return errResponse({"isSuccess":false, "code":4110, "message":"resumeIdCheck Query err"});
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }

}



//이력서 학교 검색
exports.getEducationSchool = async function (schoolName) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const getEducationSchoolResult = await resumeDao.getEducationSchool(connection,schoolName);
        connection.release();

        return response(baseResponse.SUCCESS,getEducationSchoolResult);

    }
    catch(err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}


//인기있는 스킬
exports.getPopularSkills = async function ( ) {
    try{
        const connection = await pool.getConnection(async (conn) => conn);
        const getPopularSkillsResult = await resumeDao.getPopularSkills(connection);
        connection.release();

        return response(baseResponse.SUCCESS,getPopularSkillsResult);

    }
    catch(err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }

}

// 유저 스킬 가져오기

exports.getResumeUserSkills = async function (userId) {
    try{
        const connection = await pool.getConnection(async (conn) => conn);
        const getResumeUserSkillsResult = await resumeDao.getResumeUserSkills(connection,userId);

        connection.release();

        return response(baseResponse.SUCCESS,getResumeUserSkillsResult);

    }
    catch(err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }

}


//간단 소개글 가져오기
exports.selfIntroductionCheck = async function(resumeId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const selfIntroductionCheck = await resumeDao.selfIntroductionCheck(connection,resumeId);
    connection.release();
    return selfIntroductionCheck;
}

//경력 있는지 체크

exports.careerCheck = async function(resumeId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const careerCheck = await resumeDao.careerCheck(connection,resumeId);
    connection.release();
    return careerCheck;
}

//전공 있는지 체크

exports.majorCheck = async function(resumeId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const majorCheck = await resumeDao.majorCheck(connection,resumeId);
    connection.release();
    return majorCheck;
}

//수상 잇는지 체크

exports.awardsCheck = async function(resumeId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const awardsCheck = await resumeDao.awardsCheck(connection,resumeId);
    connection.release();
    return awardsCheck;
}


//이력서 외국어 get

exports.getResumeforeignLanguage = async function() {
    try {
        const foreignLanguageList = {}
        const connection = await pool.getConnection(async (conn) => conn);
        let value = 'True'
        let getResumeforeignLanguage = await resumeDao.getResumeforeignLanguage(connection,value);
        console.log(getResumeforeignLanguage)
        foreignLanguageList.major = getResumeforeignLanguage

        value = 'False'
        getResumeforeignLanguage = await resumeDao.getResumeforeignLanguage(connection,value);
        console.log(getResumeforeignLanguage)
        foreignLanguageList.etc = getResumeforeignLanguage
        connection.release();

        return response(baseResponse.SUCCESS, foreignLanguageList);
    }
    catch(err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }

}