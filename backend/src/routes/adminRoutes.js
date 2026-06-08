import express from 'express';
import {
  approveCompany,
  approveRecruiterAccount,
  listUsers,
  publishAnnouncement,
  studentAnalysis,
  updateUser
} from '../controllers/adminController.js';
import { authorize, protect } from '../middlewares/auth.js';
import { ROLES } from '../utils/constants.js';

export const adminRoutes = express.Router();

adminRoutes.use(protect, authorize(ROLES.PLACEMENT_OFFICER, ROLES.ADMIN));
adminRoutes.get('/users', listUsers);
adminRoutes.get('/students/analysis', studentAnalysis);
adminRoutes.patch('/users/:id', updateUser);
adminRoutes.patch('/recruiters/:id/approve', approveRecruiterAccount);
adminRoutes.patch('/companies/:id/approve', approveCompany);
adminRoutes.post('/announcements', publishAnnouncement);
