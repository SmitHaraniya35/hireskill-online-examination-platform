import express from "express";
import * as StudentController from "../controllers/student.controller.ts";
import { validateRequest } from "../validators/request.validator.ts";
import { StudentSchema, ImportStudentsSchema, StudentProfileSchema, DeleteManyStudentsSchema } from "../validators/student.schema.ts";
import { authMiddleware } from "../middlewares/auth.middleware.ts";
import { IdSchema } from "../validators/index.validator.ts";

const router = express();

router.post("/create-student", validateRequest(), StudentController.createStudent);
router.post("/import", validateRequest(ImportStudentsSchema), StudentController.importStudents);
router.get("/get-student/:id", validateRequest(IdSchema), StudentController.getStudentById);
router.get("/get-all-student", authMiddleware, validateRequest(), StudentController.getAllStudent);
router.put("/update-student/:id", authMiddleware, validateRequest(StudentProfileSchema), StudentController.updateStudent);
router.delete("/delete-student/:id", authMiddleware, validateRequest(IdSchema), StudentController.deleteStudent);
router.delete("/delete-many-student", authMiddleware, validateRequest(DeleteManyStudentsSchema), StudentController.deleteManyStudent);
router.put("/complete-student-profile/:id", validateRequest(StudentProfileSchema), StudentController.completeStudentProfile);

export default router;