import { User } from '../models/User.js';
import { Student } from '../models/Student.js';
import { Job } from '../models/Job.js';
import { Company } from '../models/Company.js';
import { Announcement } from '../models/Announcement.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { approveRecruiter } from '../services/jobService.js';
import { createNotification } from '../services/notificationService.js';

export const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find(req.query.role ? { role: req.query.role } : {}).select('-password').sort({ createdAt: -1 });
  res.json({ success: true, users });
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).select('-password');
  if (!user) throw new AppError('User not found', 404);
  res.json({ success: true, user });
});

export const approveRecruiterAccount = asyncHandler(async (req, res) => {
  const user = await approveRecruiter(req.params.id);
  if (!user) throw new AppError('Recruiter not found', 404);
  res.json({ success: true, user });
});

export const approveCompany = asyncHandler(async (req, res) => {
  const company = await Company.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
  if (!company) throw new AppError('Company not found', 404);
  res.json({ success: true, company });
});

export const publishAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await Announcement.create({ ...req.body, publishedBy: req.user._id });
  const students = await User.find({ role: 'student' }).select('_id');
  await Promise.all(
    students.map((student) =>
      createNotification({
        recipient: student._id,
        title: announcement.title,
        message: announcement.message,
        type: 'announcement',
        metadata: { announcement: announcement._id }
      })
    )
  );
  res.status(201).json({ success: true, announcement });
});

export const studentAnalysis = asyncHandler(async (_req, res) => {
  const [students, activeJobs] = await Promise.all([
    Student.find().populate('user', 'name email isActive createdAt').sort({ createdAt: -1 }),
    Job.find({ status: 'active' }).select('title allowedBranches minimumCgpa maximumBacklogs graduationYear requiredSkills')
  ]);

  const analyzedStudents = students.map((student) => {
    const eligibleJobs = activeJobs.filter((job) => {
      const branchOk = !job.allowedBranches?.length || job.allowedBranches.includes(student.branch);
      const cgpaOk = (student.cgpa || 0) >= (job.minimumCgpa || 0);
      const backlogOk = (student.backlogs || 0) <= (job.maximumBacklogs || 0);
      const yearOk = !job.graduationYear || student.graduationYear === job.graduationYear;
      return branchOk && cgpaOk && backlogOk && yearOk;
    });

    return {
      id: student._id,
      userId: student.user?._id,
      name: student.user?.name || 'Unnamed student',
      email: student.user?.email,
      branch: student.branch || 'Not set',
      cgpa: student.cgpa || 0,
      backlogs: student.backlogs || 0,
      graduationYear: student.graduationYear || 'Not set',
      skillsCount: student.skills?.length || 0,
      placementProbability: student.placementProbability || 0,
      eligibleJobsCount: eligibleJobs.length,
      eligibleJobs: eligibleJobs.slice(0, 5).map((job) => job.title)
    };
  });

  const eligibleStudents = analyzedStudents.filter((student) => student.eligibleJobsCount > 0);
  const branchSummary = analyzedStudents.reduce((summary, student) => {
    summary[student.branch] = (summary[student.branch] || 0) + 1;
    return summary;
  }, {});

  res.json({
    success: true,
    summary: {
      registeredStudents: analyzedStudents.length,
      eligibleStudents: eligibleStudents.length,
      activeJobs: activeJobs.length,
      averageCgpa: analyzedStudents.length
        ? Number((analyzedStudents.reduce((sum, student) => sum + student.cgpa, 0) / analyzedStudents.length).toFixed(2))
        : 0,
      branchSummary
    },
    students: analyzedStudents
  });
});
