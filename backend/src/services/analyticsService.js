import { User } from '../models/User.js';
import { Student } from '../models/Student.js';
import { Job } from '../models/Job.js';
import { Application } from '../models/Application.js';
import { Offer } from '../models/Offer.js';
import { Company } from '../models/Company.js';
import { AuditLog } from '../models/AuditLog.js';
import { ROLES } from '../utils/constants.js';

export const getDashboardStats = async (role, userId) => {
  if (role === ROLES.STUDENT) {
    const [applications, offers] = await Promise.all([
      Application.countDocuments({ student: userId }),
      Offer.countDocuments({ student: userId })
    ]);
    return { applications, offers };
  }

  if (role === ROLES.RECRUITER) {
    const jobs = await Job.find({ recruiter: userId });
    const jobIds = jobs.map((job) => job._id);
    const [applications, offers] = await Promise.all([
      Application.countDocuments({ job: { $in: jobIds } }),
      Offer.countDocuments({ job: { $in: jobIds } })
    ]);
    return {
      totalJobsPosted: jobs.length,
      activeJobs: jobs.filter((job) => job.status === 'active').length,
      totalApplications: applications,
      offersReleased: offers
    };
  }

  const [students, recruiters, jobs, companies, offers, auditLogs] = await Promise.all([
    User.countDocuments({ role: ROLES.STUDENT }),
    User.countDocuments({ role: ROLES.RECRUITER }),
    Job.countDocuments(),
    Company.countDocuments(),
    Offer.find({ status: { $in: ['released', 'accepted'] } }).populate('job'),
    AuditLog.find().sort({ createdAt: -1 }).limit(20)
  ]);

  const packages = offers.map((offer) => offer.package || offer.job?.package || 0);
  const highestPackage = packages.length ? Math.max(...packages) : 0;
  const averagePackage = packages.length
    ? Math.round(packages.reduce((sum, value) => sum + value, 0) / packages.length)
    : 0;

  return {
    totalStudents: students,
    totalRecruiters: recruiters,
    totalJobs: jobs,
    totalCompanies: companies,
    placementPercentage: students ? Math.round((offers.length / students) * 100) : 0,
    highestPackage,
    averagePackage,
    auditLogs
  };
};

export const branchWisePlacements = () =>
  Student.aggregate([
    {
      $lookup: {
        from: 'offers',
        localField: 'user',
        foreignField: 'student',
        as: 'offers'
      }
    },
    { $group: { _id: '$branch', placed: { $sum: { $cond: [{ $gt: [{ $size: '$offers' }, 0] }, 1, 0] } }, total: { $sum: 1 } } }
  ]);
