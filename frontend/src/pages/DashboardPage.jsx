import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CalendarDays, Gauge, Trophy } from 'lucide-react';
import { fetchDashboard, fetchFeed, fetchNotifications } from '../store/appSlice.js';
import { StatCard } from '../components/StatCard.jsx';
import { JobCard } from '../components/JobCard.jsx';

const dashboardLabels = {
  student: ['Profile Completion %', 'Jobs Applied', 'Interviews Scheduled', 'Offers Received', 'Saved Jobs', 'Placement Probability Score'],
  recruiter: ['Total Jobs Posted', 'Active Jobs', 'Total Applications', 'Shortlisted Candidates', 'Scheduled Interviews', 'Offers Released'],
  placement_officer: ['Total Students', 'Total Recruiters', 'Total Jobs', 'Placement Percentage', 'Highest Package', 'Average Package'],
  admin: ['Total Users', 'Active Sessions', 'Audit Logs', 'Job Statistics', 'Platform Health', 'System Analytics']
};

export const DashboardPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { stats, feed, notifications } = useSelector((state) => state.app);

  useEffect(() => {
    dispatch(fetchDashboard());
    dispatch(fetchFeed());
    dispatch(fetchNotifications());
  }, [dispatch]);

  const labels = dashboardLabels[user?.role] || dashboardLabels.student;
  const values = [
    stats.profileCompletion || 78,
    stats.applications || stats.totalJobsPosted || stats.totalStudents || stats.totalUsers,
    stats.activeJobs || 3,
    stats.offers || stats.placementPercentage || stats.totalApplications,
    stats.highestPackage || stats.offersReleased || 0,
    stats.averagePackage || stats.placementProbability || 0
  ];

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {labels.map((label, index) => (
          <StatCard key={label} label={label} value={values[index]} tone={index % 2 ? 'accent' : 'brand'} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Gauge size={20} className="text-brand" />
            <h2 className="text-lg font-semibold text-ink">Active Hiring Feed</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {(feed.recentJobs || []).slice(0, 4).map((job) => <JobCard key={job._id} job={job} />)}
          </div>
        </div>
        <aside className="space-y-4">
          <div className="rounded-md border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2">
              <CalendarDays size={18} className="text-brand" />
              <h2 className="font-semibold text-ink">Recent Notifications</h2>
            </div>
            <div className="mt-3 space-y-3">
              {notifications.slice(0, 5).map((item) => (
                <div key={item._id} className="border-b border-slate-100 pb-3 last:border-0">
                  <p className="text-sm font-medium text-ink">{item.title}</p>
                  <p className="text-sm text-slate-500">{item.message}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-md border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2">
              <Trophy size={18} className="text-accent" />
              <h2 className="font-semibold text-ink">Placement Probability</h2>
            </div>
            <div className="mt-4 h-3 rounded-full bg-slate-100">
              <div className="h-3 rounded-full bg-brand" style={{ width: `${Math.min(stats.placementProbability || 72, 100)}%` }} />
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
};
