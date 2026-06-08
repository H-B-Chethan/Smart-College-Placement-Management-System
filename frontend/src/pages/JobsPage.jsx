import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search } from 'lucide-react';
import { fetchJobs } from '../store/appSlice.js';
import { JobCard } from '../components/JobCard.jsx';
import { api } from '../services/api.js';

export const JobsPage = () => {
  const dispatch = useDispatch();
  const jobs = useSelector((state) => state.app.jobs);
  const [filters, setFilters] = useState({ q: '', location: '', workMode: '', skill: '' });

  useEffect(() => {
    dispatch(fetchJobs(filters));
  }, [dispatch]);

  const search = (event) => {
    event.preventDefault();
    dispatch(fetchJobs(filters));
  };

  const apply = async (job) => {
    await api.post(`/applications/jobs/${job._id}/apply`);
    dispatch(fetchJobs(filters));
  };

  const save = async (job) => {
    await api.post(`/jobs/${job._id}/save`);
  };

  return (
    <div className="space-y-5">
      <form onSubmit={search} className="grid gap-3 rounded-md border border-slate-200 bg-white p-4 md:grid-cols-[1fr_180px_160px_160px_auto]">
        <input className="focus-ring rounded-md border border-slate-300 px-3 py-2" placeholder="Company, role, skills" value={filters.q} onChange={(e) => setFilters({ ...filters, q: e.target.value })} />
        <input className="focus-ring rounded-md border border-slate-300 px-3 py-2" placeholder="Location" value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })} />
        <select className="focus-ring rounded-md border border-slate-300 px-3 py-2" value={filters.workMode} onChange={(e) => setFilters({ ...filters, workMode: e.target.value })}>
          <option value="">Any mode</option>
          <option value="remote">Remote</option>
          <option value="hybrid">Hybrid</option>
          <option value="onsite">Onsite</option>
        </select>
        <input className="focus-ring rounded-md border border-slate-300 px-3 py-2" placeholder="Skill" value={filters.skill} onChange={(e) => setFilters({ ...filters, skill: e.target.value })} />
        <button className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-brand px-4 py-2 text-white">
          <Search size={18} /> Search
        </button>
      </form>
      <div className="grid gap-4 lg:grid-cols-2">
        {jobs.map((job) => <JobCard key={job._id} job={job} onApply={apply} onSave={save} />)}
      </div>
    </div>
  );
};
