import { ERROR_MESSAGES, HttpStatusCode } from "../constants/index.ts";
import type { 
    Judge0BatchSubmission, 
    Judge0Result, 
    Judge0Submission 
} from "../types/controller/submissionData.types.ts";
import { HttpError } from "../utils/httpError.utils.ts";

export const executeCode = async (input: Judge0Submission) => {
    try {
        const response: Response = await fetch(`${process.env.JUDGE0_API}/?base64_encoded=false&wait=true`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }, 
            body: JSON.stringify(input)
        });

        if(!response.ok){
            throw new HttpError(
                ERROR_MESSAGES.CODE_EXECUTION_FAILED,
                HttpStatusCode.BAD_GATEWAY
            );
        }

        const data: Judge0Result = await response.json();
        return data;
    } catch (err: any){
        throw new HttpError(
            err.message,
            HttpStatusCode.BAD_GATEWAY
        );
    }
}

export const executeAllHiddentTestCases = async (input: Judge0BatchSubmission, testCasesIdList: Array<string>) => {
    try {
        const response: Response = await fetch(`${process.env.JUDGE0_API}/batch/?base64_encoded=false&wait=true`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }, 
            body: JSON.stringify(input)
        });

        if(!response.ok){
            throw new HttpError(
                ERROR_MESSAGES.CODE_EXECUTION_FAILED,
                HttpStatusCode.BAD_GATEWAY
            );
        }

        const jsonTokenList: Array<{token: string}> = await response.json();

        // const tokens = jsonTokenList.map(item => item.token);

        const executionList = jsonTokenList.map((item, index) => ({
            submissionId:  item.token,
            testCaseId: testCasesIdList[index]
        }));

        return { executionMappingList: executionList };

        // const startTime = Date.now();
        // while(1){
        //     const response = await fetch(`${process.env.JUDGE0_API}/batch/?tokens=${tokens.join(',')}&base64_encoded=false`, {
        //         method: "GET"
        //     });
        //     const data: Judge0BatchResult = await response.json();

        //     let flag = 1;
        //     let totalTesCases = tokens.length;
        //     let passedTestCases = 0;

        //     data.submissions.map((item: Judge0Result)=>{
        //         if(item.status.description === "In Queue" || item.status.description === "Processing"){
        //             flag = 0;
        //         }
        //         if(item.status.description === "Accepted"){
        //             passedTestCases++;
        //         }
        //     });

        //     // if(flag){
        //     //     console.log(Date.now() - startTime);
        //     //     return { submissions: data.submissions, totalTesCases, passedTestCases };
        //     // }

        //     if(flag){
        //         const res = data.submissions.map((item: Judge0Result) => ({
        //             ...item,
        //             testCaseId: executionList.find(it => it.token === item.token)?.testCaseId
        //         }));

        //         return { submissions: res }
        //     }
        // }

    } catch (err: any){
        throw new HttpError(
            err.message,
            HttpStatusCode.BAD_GATEWAY
        );
    }
}

export const getJudge0SubmissionById = async (submissionId: string) => {
    try {
        const response: Response = await fetch(
            `${process.env.JUDGE0_API}/${submissionId}`, 
            { method: "GET" }
        );

        if(!response.ok){
            throw new HttpError(
                ERROR_MESSAGES.JUDGE0_FETCH_FAILED,
                HttpStatusCode.BAD_GATEWAY
            );
        }

        const data: Judge0Result = await response.json();
        return { data };
    } catch (err: any){
        throw new HttpError(
            err.message,
            HttpStatusCode.BAD_GATEWAY
        );
    }
};