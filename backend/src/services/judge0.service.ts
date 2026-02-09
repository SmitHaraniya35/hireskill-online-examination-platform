import type { 
    Judge0BatchResult,
    Judge0BatchSubmission, 
    Judge0Result, 
    Judge0Submission 
} from "../types/controller/submissionData.types.ts";

export const executeCode = async (input: Judge0Submission) => {
    try {
        console.log(process.env.JUDGE0_API)
        const data = await fetch(`${process.env.JUDGE0_API}/?base64_encoded=false&wait=true`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }, 
            body: JSON.stringify(input)
        });

        const jsonData: Judge0Result = await data.json();

        return jsonData;
    } catch (err: any){
        throw new Error(`Error while executing the code: ${err}`);
    }
}

export const executeAllHiddentTestCases = async (input: Judge0BatchSubmission) => {
    try {
        const tokenList = await fetch(`${process.env.JUDGE0_API}/batch/?base64_encoded=false&wait=true`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }, 
            body: JSON.stringify(input)
        });

        const jsonList: Array<{token: string}> = await tokenList.json();

        const tokens = jsonList.map(item => item.token);
        
        while(1){
            const response = await fetch(`${process.env.JUDGE0_API}/batch/?tokens=${tokens.join(',')}&base64_encoded=false`, {
                method: "GET"
            });
            const data: Judge0BatchResult = await response.json();

            let flag = 1;

            data.submissions.map((item: any)=>{
                if(item.status.description !== "Accepted"){
                    flag = 0;
                }
            })

            if(flag)
            return data;
        }

    } catch (err: any){
        throw new Error("Error while executing the code: ", err);
    }
}