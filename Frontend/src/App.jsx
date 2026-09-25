import { useEffect, useState } from "react";
import { createJob, getJobs, getStats } from "./api";

function App() {
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({});

  const [form, setForm] = useState({
    name: "",
    message: "",
    shouldFail: false,
  });

  const loadData = async () => {
    try {
      const [jobsResponse, statsResponse] = await Promise.all([
        getJobs(),
        getStats(),
      ]);

      setJobs(jobsResponse.data.jobs);
      setStats(statsResponse.data.counts);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadData();

    const interval = setInterval(loadData, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createJob(form);

    setForm({
      name: "",
      message: "",
      shouldFail: false,
    });

    loadData();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">Redis + BullMQ Dashboard</h1>

      {/* Stats */}

      <div className="grid grid-cols-5 gap-4 mb-8">
        <Stat title="Waiting" value={stats.waiting || 0} />

        <Stat title="Active" value={stats.active || 0} />

        <Stat title="Completed" value={stats.completed || 0} />

        <Stat title="Failed" value={stats.failed || 0} />

        <Stat title="Delayed" value={stats.delayed || 0} />
      </div>

      {/* Create Job */}

      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Create Job</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="border p-3 w-full rounded"
            placeholder="Name"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
          />

          <input
            className="border p-3 w-full rounded"
            placeholder="Message"
            value={form.message}
            onChange={(e) =>
              setForm({
                ...form,
                message: e.target.value,
              })
            }
          />

          <label className="flex gap-2">
            <input
              type="checkbox"
              checked={form.shouldFail}
              onChange={(e) =>
                setForm({
                  ...form,
                  shouldFail: e.target.checked,
                })
              }
            />
            Intentionally fail this job
          </label>

          <button
            type="submit"
            className="bg-black text-white px-5 py-3 rounded"
          >
            Add Job
          </button>
        </form>
      </div>

      {/* Jobs */}

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Jobs</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-4">ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Status</th>
                <th className="p-4">Attempts</th>
                <th className="p-4">Created</th>
                <th className="p-4">Finished</th>
              </tr>
            </thead>

            <tbody>
              {jobs.map((job) => (
                <tr key={job.id} className="border-t">
                  <td className="p-4">{job.id}</td>

                  <td className="p-4">{job.name}</td>

                  <td className="p-4">
                    <Status status={job.state} />
                  </td>

                  <td className="p-4">{job.attemptsMade}</td>

                  <td className="p-4">{formatDate(job.timestamp)}</td>

                  <td className="p-4">{formatDate(job.finishedOn)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div className="bg-white p-5 rounded-lg shadow">
      <p className="text-gray-500">{title}</p>

      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}

function Status({ status }) {
  return <span className="px-3 py-1 rounded bg-gray-200">{status}</span>;
}

function formatDate(timestamp) {
  if (!timestamp) return "-";

  return new Date(timestamp).toLocaleString();
}

export default App;
