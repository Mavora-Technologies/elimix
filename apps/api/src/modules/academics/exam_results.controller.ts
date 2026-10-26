// apps/api/src/modules/academics/exam_results.controller.ts
import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.middleware.js';
import { ExamResultsRepository } from './exam_results.repository.js';
import {
  createExamResultSchema,
  bulkExamResultsSchema,
  computeKnecAndCbcGrade,
} from '../../validators/exam_results.validator.js';

const repository = new ExamResultsRepository();

export class ExamResultsController {
  async getResults(req: AuthenticatedRequest, res: Response) {
    try {
      const records = await repository.getResults(req.tenantId!);
      const data = records.map((r) => {
        const obtained = Number(r.marksObtained);
        const total = Number(r.totalMarks) || 100;
        const evaluation = computeKnecAndCbcGrade(obtained, total);

        return {
          id: r.id,
          dbStudentId: r.dbStudentId,
          studentId: r.studentId,
          studentName: `${r.studentFirstName} ${r.studentLastName}`.trim(),
          examId: r.examId,
          examTitle: r.examTitle,
          examTerm: r.examTerm,
          subjectId: r.subjectId,
          subject: r.subject,
          subjectCode: r.subjectCode,
          streamId: r.streamId,
          gradeStream: r.gradeStream,
          marksObtained: obtained,
          totalMarks: total,
          percentage: evaluation.percentage,
          grade: r.grade || evaluation.knecGrade,
          knecGrade: evaluation.knecGrade,
          knecPoints: evaluation.knecPoints,
          cbcRubric: evaluation.cbcRubric,
          cbcLabel: evaluation.cbcLabel,
          remarks: evaluation.remarks,
          status: r.status || evaluation.status,
        };
      });
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async createResult(req: AuthenticatedRequest, res: Response) {
    try {
      const parsed = createExamResultSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: parsed.error.issues[0]?.message || 'Validation failed',
          errors: parsed.error.issues,
        });
      }

      const payload = parsed.data;
      const evaluation = computeKnecAndCbcGrade(payload.marksObtained, payload.totalMarks);
      const computedGrade =
        payload.gradingSystem === 'CBC' ? evaluation.cbcRubric : evaluation.knecGrade;

      const data = await repository.createOrUpsertResult(req.tenantId!, {
        studentId: payload.studentId,
        examId: payload.examId,
        subjectId: payload.subjectId,
        streamId: payload.streamId,
        marksObtained: payload.marksObtained,
        totalMarks: payload.totalMarks,
        grade: computedGrade,
        status: payload.status === 'Pending Review' ? 'Pending Review' : evaluation.status,
      });

      return res.status(201).json({ success: true, data });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async bulkRecordResults(req: AuthenticatedRequest, res: Response) {
    try {
      const parsed = bulkExamResultsSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: parsed.error.issues[0]?.message || 'Invalid bulk marks payload',
        });
      }

      const { examId, subjectId, streamId, totalMarks, gradingSystem, entries } = parsed.data;
      const saved = [];

      for (const item of entries) {
        if (item.marksObtained > totalMarks) continue;
        const evaluation = computeKnecAndCbcGrade(item.marksObtained, totalMarks);
        const grade = gradingSystem === 'CBC' ? evaluation.cbcRubric : evaluation.knecGrade;

        const record = await repository.createOrUpsertResult(req.tenantId!, {
          studentId: item.studentId,
          examId,
          subjectId,
          streamId,
          marksObtained: item.marksObtained,
          totalMarks,
          grade,
          status: evaluation.status,
        });
        saved.push(record);
      }

      return res.status(201).json({
        success: true,
        message: `Auto-graded and saved ${saved.length} student results.`,
        data: saved,
      });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async updateResult(req: AuthenticatedRequest, res: Response) {
    try {
      const parsed = createExamResultSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: parsed.error.issues[0]?.message || 'Validation failed',
        });
      }

      const payload = parsed.data;
      const evaluation = computeKnecAndCbcGrade(payload.marksObtained, payload.totalMarks);
      const computedGrade =
        payload.gradingSystem === 'CBC' ? evaluation.cbcRubric : evaluation.knecGrade;

      const data = await repository.updateResult(req.tenantId!, req.params.id as string, {
        studentId: payload.studentId,
        examId: payload.examId,
        subjectId: payload.subjectId,
        streamId: payload.streamId,
        marksObtained: payload.marksObtained,
        totalMarks: payload.totalMarks,
        grade: computedGrade,
        status: payload.status === 'Pending Review' ? 'Pending Review' : evaluation.status,
      });

      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async deleteResult(req: AuthenticatedRequest, res: Response) {
    try {
      await repository.deleteResult(req.tenantId!, req.params.id as string);
      return res.status(200).json({ success: true, message: 'Deleted' });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}