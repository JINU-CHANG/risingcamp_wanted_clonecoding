const dummyDao = require("./dummyDao");

const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");

exports.postDummyData = async function (req,res) {
    try {

        console.log("Dummy Data 삽입!!!!!!!!!!!!!똬돤!");
        const connection = await pool.getConnection(async (conn) => conn);
        const hiredAt="2020-12-01"; 
        let salary;
        let population=Math.random() * (20 - 5) + 5;;
        //const population =1000;
        for (let index = 0; index < population; index++) {
            salary=Math.random() * (60000000 - 20000000) + 20000000;
            const dummy = await dummyDao.insertDummy(connection,hiredAt,salary);
        }
        
        console.log("여기까지 왔나욘?")
        connection.release();

        return res.send(response(baseResponse.SUCCESS));

    } catch (err) {
        logger.error(`App - editUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}
