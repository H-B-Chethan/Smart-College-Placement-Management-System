import { useEffect, useState } from 'react';
import { CalendarPlus, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api.js';
import { Timeline } from '../components/Timeline.jsx';

const statusDepth = {
  applied: 1,
  shortlisted: 2,
  interview_scheduled: 3,
  selected: 5,
  offer_released: 6
};

export const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    api.get('/applications').then(({ data }) => setApplications(data.applications));
  }, []);

  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <article key={application._id} className="rounded-md border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-semibold text-ink">{application.job?.title}</h2>
              <p className="text-sm text-slate-500">{application.job?.company?.name} · ATS {application.atsScore || 0}%</p>
            </div>
            <span className="rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">{application.status}</span>
          </div>
          <div className="mt-5">
            <Timeline active={statusDepth[application.status] || 1} />
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <div className="rounded-md bg-emerald-50 p-3">
              <p className="flex items-center gap-2 text-sm font-medium text-brand"><CheckCircle2 size={16} /> Matching Skills</p>
              <p className="mt-1 text-sm text-slate-600">{application.matchingSkills?.join(', ') || 'No matches yet'}</p>
            </div>
            <div className="rounded-md bg-orange-50 p-3">
              <p className="flex items-center gap-2 text-sm font-medium text-accent"><CalendarPlus size={16} /> Missing Skills</p>
              <p className="mt-1 text-sm text-slate-600">{application.missingSkills?.join(', ') || 'No gaps detected'}</p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};
