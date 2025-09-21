"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import NewMeetingDialog from "@/components/NewMeetingDialog";
import AppShell from "@/components/AppShell";

interface Meeting {
  _id: string;
  name: string;
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") fetchMeetings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const fetchMeetings = async () => {
    try {
      const res = await fetch("/api/meetings");
      const data = await res.json();
      setMeetings(data.meetings || []);
    } catch (e) {
      console.error("Failed to fetch meetings", e);
    }
  };

  const handleRowClick = (id: string) => router.push(`/meetings/${id}`);

  if (status === "loading") return <div className="p-8 text-gray-500">Loading…</div>;
  if (status === "unauthenticated") return null;

  const action = (
    <button
      onClick={() => setDialogOpen(true)}
      className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded"
    >
      <span>＋</span>
      <span>New Meeting</span>
    </button>
  );

  return (
    <AppShell title={`Welcome${session?.user?.email ? ", " + session.user.email.split("@")[0] + "!" : "!"}`} action={action}>
      <section className="bg-white shadow-sm border border-gray-200 rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Recent Meetings</h2>
          <p className="text-sm text-gray-500">Here are the latest meeting transcripts you've analyzed.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Open</th>
              </tr>
            </thead>
            <tbody>
              {meetings.map((m) => (
                <tr
                  key={m._id}
                  className="border-t border-gray-100 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleRowClick(m._id)}
                >
                  <td className="px-6 py-3">{m.name}</td>
                  <td className="px-6 py-3">{new Date(m.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-3">
                    <button
                      className="text-indigo-600 hover:underline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRowClick(m._id);
                      }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {meetings.length === 0 && (
                <tr>
                  <td className="px-6 py-8 text-center text-gray-500" colSpan={3}>
                    No meetings yet. Click "New Meeting" to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <NewMeetingDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreated={({ meetingId }) => router.push(`/meetings/${meetingId}`)}
      />
    </AppShell>
  );
}
