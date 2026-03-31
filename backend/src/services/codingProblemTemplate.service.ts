import { ERROR_MESSAGES, HttpStatusCode } from "../constants/index.ts";
import { CodingProblemTemplate } from "../models/coding_problem_template.model.ts";
import type { CodingProblemTemplateData } from "../types/controller/codingProblemTemplateData.types.ts"
import { HttpError } from "../utils/httpError.utils.ts";

export const createManyCodingProblemTemplateService = async (input: CodingProblemTemplateData[]) => {
    const codingProblemTemplates = await CodingProblemTemplate.insertMany(input);
    if (!codingProblemTemplates) {
        throw new HttpError(
            ERROR_MESSAGES.CODING_PROBLEM_TEMPLATE_CREATION_FAILED,
            HttpStatusCode.INTERNAL_SERVER_ERROR,
        );
    }

    return { codingProblemTemplates };
};

export const updateCodingProblemTemplateService = async (input: CodingProblemTemplateData) => {
    const { problem_id, language, basic_code_layout } = input;
    
    const codingProblemTemplate = await CodingProblemTemplate.findOneAndUpdate(
        { problem_id, language },
        { basic_code_layout }
    );

    if (!codingProblemTemplate) {
        throw new HttpError(
            ERROR_MESSAGES.CODING_PROBLEM_TEMPLATE_UPDATE_FAILED,
            HttpStatusCode.INTERNAL_SERVER_ERROR
        );
    }
    return { codingProblemTemplate };
};

export const getAllCodingProblemTemplateByProblemId = async (problem_id: string) => {
    const codingProblemTemplate = await CodingProblemTemplate.findOne({
        problem_id
    }, { _id: 0, basic_code_layout: 1, language: 1 });

    if (!codingProblemTemplate) {
        throw new HttpError(
            ERROR_MESSAGES.CODING_PROBLEM_TEMPLATE_NOT_FOUND,
            HttpStatusCode.NOT_FOUND
        );
    }

    return { codingProblemTemplate };
};

export const deleteCodingProblemTemplateByIdService = async (id: string) => {
    const codingProblemTemplate = await CodingProblemTemplate.softDelete({ id });

    if(!codingProblemTemplate) {
        throw new HttpError(
            ERROR_MESSAGES.CODING_PROBLEM_TEMPLATE_DELETION_FAILED,
            HttpStatusCode.INTERNAL_SERVER_ERROR
        )
    }

    return { codingProblemTemplate };
};