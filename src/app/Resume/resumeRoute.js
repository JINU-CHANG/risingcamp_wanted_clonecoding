const resume = require("./resumeController");
const jwtMiddleware = require("../../../config/jwtMiddleware");

module.exports = function(app) {
    const resume = require('./resumeController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');


    //이력서 외국어 get
    app.get('/app/resumes/foreignLanguage', resume.getResumeforeignLanguage);

    //이력서 외국어 생성
    app.post('/app/resumes/:resumeId/foreignLanguage',jwtMiddleware, resume.postResumeForeignLanguage);

    //이력서 외국어 삭제
    app.patch('/app/resumes/:resumeId/foreignLanguage/deleted',jwtMiddleware, resume.deleteResumeForeignLanguage);

    //이력서 유저 스킬 추가
    app.post('/app/resumes/:resumeId/userSkills', jwtMiddleware, resume.postResumeUserSkills);

    //유저 스킬 가져오기
    app.get('/app/resumes/userSkills', jwtMiddleware, resume.getResumeUserSkills);

    //이력서 인기 스킬 가져오기
    app.get('/app/resumes/popularSkills', resume.getPopularSkills);

    //이력서 스킬 추가
    app.post('/app/resumes/:resumeId/Skills', jwtMiddleware, resume.postResumeSkills);

    //이력서 스킬 삭제
    app.patch('/app/resumes/:resumeId/Skills/:skillId/deleted',jwtMiddleware, resume.deleteResumeSkills);
    //이력서 전체 조회
    app.get('/app/userResumes/:userId', jwtMiddleware, resume.getResumes);

    //이력서 삭제
    app.patch('/app/resumes/:resumeId/deleted',jwtMiddleware, resume.deleteResumes);

    //이력서 생성
    app.post('/app/resumes/:userId',  jwtMiddleware, resume.postResumes);

    //이력서 조회
    app.get('/app/resumes/:resumeId', jwtMiddleware, resume.getResume);

    //이력서 이름 가져오기
    app.get('/app/resumes/:resumeId/title',jwtMiddleware, resume.getResumeTitle );


    //이력서 제목 수정하기
    app.patch('/app/resumes/:resumeId/title', jwtMiddleware, resume.patchResumeTitle );

    //이력서 경력 추가하기
    app.post('/app/resumes/:resumeId/career', jwtMiddleware, resume.postResumeCareer);
    //이력서 경력 수정하기
    app.patch('/app/resumes/career/:careerId', jwtMiddleware, resume.patchResumeCareer);

    //이력서 경력 삭제
    app.patch('/app/resumes/career/:careerId/deleted',jwtMiddleware, resume.deleteResumeCareer);

    //이력서 학교 조회
    app.get('/app/resumes/education/school', resume.getEducationSchool);

    //이력서 학교 추가
    app.post('/app/resumes/:resumeId/education/school',jwtMiddleware, resume.postEducationSchool );

    //이력서 학교 수정
    app.patch('/app/resumes/education/:educationId',jwtMiddleware, resume.patchResumeEducation);

    //이력서 학교 삭제
    app.patch('/app/resumes/education/:educationId/deleted',jwtMiddleware, resume.deleteResumeEducation);

    //이력서 수상 추가
    app.post('/app/resumes/:resumeId/awards',jwtMiddleware, resume.postResumeAwards);
    //이력서 수상 수정
    app.patch('/app/resumes/awards/:awardsId',jwtMiddleware, resume.patchResumeAwards);
    //이력서 수상 삭제
    app.patch('/app/resumes/awards/:awardsId',jwtMiddleware, resume.deleteResumeAwards);

    //이력서 작성 완료
    app.patch('/app/resumes/:resumeId/status', jwtMiddleware, resume.patchResumeStatus);

    //이력서 Info 수정
    app.patch('/app/resumes/:resumeId/userInfo', jwtMiddleware, resume.patchResumeUserInfo);



};

