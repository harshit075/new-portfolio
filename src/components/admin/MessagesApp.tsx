import { useState, useEffect } from 'react';
import { fetchJson, del } from './api';

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

export function MessagesApp() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMessages = () => {
    fetchJson('/admin/messages')
      .then((data) => {
        setMessages(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await del(`/admin/messages?id=${id}`);
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error('Failed to delete message:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48 text-white/50 font-mono text-xs uppercase tracking-widest">
        Loading Inbox...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black uppercase tracking-tight text-white">Contact Inbox</h2>
          <p className="text-xs text-white/50 uppercase tracking-widest mt-0.5">Recruiter & Visitor Queries</p>
        </div>
        <span className="bg-cyan/10 text-cyan text-xs font-mono font-bold px-3 py-1 rounded-full border border-cyan/20">
          {messages.length} MESSAGE{messages.length !== 1 && 'S'}
        </span>
      </div>

      {messages.length === 0 ? (
        <div className="border border-dashed border-white/10 rounded-2xl p-12 text-center text-white/40 select-none">
          <span className="text-3xl block mb-2">📥</span>
          <div className="text-sm font-bold uppercase tracking-wide">Inbox is Empty</div>
          <div className="text-[11px] text-white/30 uppercase mt-1">No contact inquiries found in database</div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 hover:border-cyan/30 transition-all duration-300 relative group flex flex-col justify-between"
            >
              {/* Header Info */}
              <div className="flex justify-between items-start gap-4 border-b border-white/[0.04] pb-3 mb-3">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                    {msg.subject || 'No Subject'}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-white/50 mt-1 font-medium">
                    <span className="text-cyan font-bold">{msg.name}</span>
                    <span className="text-white/20">•</span>
                    <a
                      href={`mailto:${msg.email}`}
                      className="hover:text-cyan transition-colors underline decoration-dotted"
                    >
                      {msg.email}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[10px] text-white/40 font-mono">
                    {new Date(msg.created_at).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  
                  {/* Delete button */}
                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="p-1.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete Message"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {/* Message Content */}
              <p className="text-xs md:text-sm text-white/80 leading-relaxed whitespace-pre-wrap font-sans font-medium pl-1">
                {msg.message}
              </p>

              {/* Quick Reply Link */}
              <div className="mt-4 pt-3 border-t border-white/[0.04] flex justify-end">
                <a
                  href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || 'Portfolio Inquiry')}`}
                  className="px-4 py-1.5 rounded-lg bg-cyan/10 hover:bg-cyan/20 border border-cyan/20 text-cyan text-xs font-bold uppercase tracking-wider transition-all"
                >
                  Reply Email ✉️
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
