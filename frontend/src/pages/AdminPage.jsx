import { useEffect, useState } from 'react';
import { Megaphone } from 'lucide-react';
import { api } from '../services/api.js';

export const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [announcement, setAnnouncement] = useState({ title: '', message: '', category: 'drive' });

  useEffect(() => {
    api.get('/admin/users').then(({ data }) => setUsers(data.users));
  }, []);

  const publish = async (event) => {
    event.preventDefault();
    await api.post('/admin/announcements', announcement);
    setAnnouncement({ title: '', message: '', category: 'drive' });
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <section className="rounded-md border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-ink">User Management</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500">
              <tr><th className="py-2">Name</th><th>Email</th><th>Role</th><th>Status</th></tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b border-slate-100">
                  <td className="py-3 font-medium text-ink">{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.isActive ? 'Active' : 'Disabled'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <form onSubmit={publish} className="rounded-md border border-slate-200 bg-white p-5">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-ink"><Megaphone size={19} /> Announcement</h2>
        <input className="focus-ring mt-4 w-full rounded-md border border-slate-300 px-3 py-2" placeholder="Title" value={announcement.title} onChange={(e) => setAnnouncement({ ...announcement, title: e.target.value })} />
        <textarea className="focus-ring mt-3 h-32 w-full rounded-md border border-slate-300 px-3 py-2" placeholder="Message" value={announcement.message} onChange={(e) => setAnnouncement({ ...announcement, message: e.target.value })} />
        <button className="focus-ring mt-3 rounded-md bg-brand px-4 py-2 font-medium text-white">Publish</button>
      </form>
    </div>
  );
};
