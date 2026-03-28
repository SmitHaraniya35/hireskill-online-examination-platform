import express from "express";
import * as StudentAssignedProblemController from "../controllers/studentAssignedProblem.controller.ts";
import { validateRequest } from "../validators/request.validator.ts";
import { StudentAssignedProblemDraftSchema } from "../validators/studentAssignedProblem.schema.ts";
import { IdSchema } from "../validators/index.validator.ts";

const router  = express();

router.put("/attempted/:id", validateRequest(IdSchema), StudentAssignedProblemController.attemptedStudentAssignedProblem);
router.put("/save-draft/:id", validateRequest(StudentAssignedProblemDraftSchema), StudentAssignedProblemController.saveStudentAssignedProblemDraft);
router.put("/submitted/:id", validateRequest(IdSchema), StudentAssignedProblemController.submittedStudentAssignedProblem);

export default router;