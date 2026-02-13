import express from "express";
import * as StudentController from "../controllers/student.controller.ts";
import { validateRequest } from "../validators/request.validator.ts";
import { StudentSchema } from "../validators/student.schema.ts";
import { authMiddleware } from "../middlewares/auth.middleware.ts";
import { IdSchema } from "../validators/index.validator.ts";

const router = express();

router.post("/create-student", validateRequest(StudentSchema), StudentController.createStudent);
router.get("/get-student/:id", validateRequest(IdSchema), StudentController.getStudentById);
router.get("/get-all-student", authMiddleware, validateRequest(), StudentController.getAllStudent);
router.put("/update-student/:id", authMiddleware, validateRequest(StudentSchema), StudentController.updateStudent);
router.delete("/delete-student/:id", authMiddleware, validateRequest(IdSchema), StudentController.deleteStudent);

export default router;