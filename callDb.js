import oracledb from 'oracledb';
import { execute, getLobData, assertOutBindsExists, handleLargePayloadConnection } from './dbUtils.js'

const { BIND_OUT } = oracledb;

export const callDatabase = async (context, connection) => {

    const sql = `BEGIN
                GW_TESTPKG.SEGFAULT_TEST(     
                    p_lang_code                 => :langCodeParam        --          IN   VARCHAR2
                    , p_number                  => :numberParam          --          OUT  NUMBER
                    , p_varchar                 => :varcharParam         --          OUT  VARCHAR2
                    , p_date                    => :dateParam            --          OUT  DATE
                    , p_output_clob             => :outputParam          --          OUT  genapi_nclob_wrapper_obj
                    , p_error_detail_out_obj    => :errorObject);        --          OUT  error_detail_out_obj
                END;`;

    const bindParams = {
        langCodeParam: 'EN',
        numberParam: { dir: BIND_OUT },
        varcharParam: { dir: BIND_OUT },
        dateParam: { dir: BIND_OUT },
        outputParam: { dir: BIND_OUT, type: 'GENAPI_NCLOB_WRAPPER_OBJ' },
        errorObject: { dir: BIND_OUT, type: 'ERROR_DETAIL_OUT_OBJ' },
    };

    console.log('Executing');

    const outBinds = assertOutBindsExists(await execute(context, connection, sql, bindParams)).outBinds;

    console.log('Executed');

    const outputParam = await getLobData(context, outBinds.outputParam.JSON_STRING);

    console.log('extracted lob data');

    handleLargePayloadConnection(context, outBinds.outputParam.JSON_STRING, connection);

    console.log('handled connection');

    console.log(outputParam);

    return outputParam;

}

export default callDatabase;
