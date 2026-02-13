import express from "express";
import * as StudentController from "../controllers/student.controller.ts";
import { validateRequest } from "../validators/request.validator.ts";
import { StudentSchema } from "../validators/student.schema.ts";
import { authMiddleware } from "../middlewares/auth.middleware.ts";

const router = express();

router.post("/create-student", validateRequest(StudentSchema), StudentController.createStudent);
router.get("/get-student/:id", validateRequest(), StudentController.getStudentById);
router.get("/get-all-student", authMiddleware, validateRequest(), StudentController.getAllStudent);
router.put("/update-student/:id", authMiddleware, validateRequest(), StudentController.updateStudent);
router.delete("/delete-student/:id", authMiddleware, validateRequest(), StudentController.deleteStudent);

export default router;