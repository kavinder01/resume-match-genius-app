import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  Briefcase, Plus, Users, BarChart3, LogOut, Settings, X,
  Building2, TrendingUp, Clock, CheckCircle2
} from "lucide-react";

const RecruiterDashboard = () => {
  const { user, role, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [showJobForm, setShowJobForm] = useState(false);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [jobForm, setJobForm] = useState({ title: "", description: "", required_skills: "", experience_level: "", qualification: "", location: "", job_type: "full-time" });
  const [profileForm, setProfileForm] = useState({ full_name: "", company_name: "", company_industry: "", company_size: "", bio: "", phone: "" });

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
    if (!loading && !role) navigate("/onboarding");
    if (!loading && role === "applicant") navigate("/applicant");
  }, [loading, user, role]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    const [profileRes, jobsRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user!.id).single(),
      supabase.from("jobs").select("*").eq("recruiter_id", user!.id).order("created_at", { ascending: false }),
    ]);
    if (profileRes.data) {
      setProfile(profileRes.data);
      setProfileForm({
        full_name: profileRes.data.full_name || "",
        company_name: profileRes.data.company_name || "",
        company_industry: profileRes.data.company_industry || "",
        company_size: profileRes.data.company_size || "",
        bio: profileRes.data.bio || "",
        phone: profileRes.data.phone || "",
      });
    }
    if (jobsRes.data) {
      setJobs(jobsRes.data);
      // Fetch applications for all jobs
      const jobIds = jobsRes.data.map((j: any) => j.id);
      if (jobIds.length > 0) {
        const { data: apps } = await supabase.from("applications").select("*, profiles(full_name, headline)").in("job_id", jobIds);
        setApplications(apps || []);
      }
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("jobs").insert({
      recruiter_id: user!.id,
      title: jobForm.title,
      description: jobForm.description,
      required_skills: jobForm.required_skills.split(",").map(s => s.trim()).filter(Boolean),
      experience_level: jobForm.experience_level,
      qualification: jobForm.qualification,
      location: jobForm.location,
      job_type: jobForm.job_type,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Job posted!" });
      setShowJobForm(false);
      setJobForm({ title: "", description: "", required_skills: "", experience_level: "", qualification: "", location: "", job_type: "full-time" });
      fetchData();
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("profiles").update(profileForm).eq("id", user!.id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile updated!" });
      setShowProfileEdit(false);
      fetchData();
    }
  };

  const handleUpdateApplicationStatus = async (appId: string, status: string) => {
    await supabase.from("applications").update({ status }).eq("id", appId);
    toast({ title: `Application ${status}` });
    fetchData();
  };

  const stats = {
    totalJobs: jobs.length,
    openJobs: jobs.filter(j => j.status === "open").length,
    totalApplicants: applications.length,
    shortlisted: applications.filter(a => a.status === "shortlisted").length,
  };

  if (loading) return null;

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "jobs", label: "Job Postings", icon: Briefcase },
    { id: "candidates", label: "Candidates", icon: Users },
    { id: "settings", label: "Company Profile", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-16 px-6">
          <a href="/" className="font-display text-xl font-bold text-foreground">
            SmartRecruit<span className="text-primary">AI</span>
          </a>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {profile?.company_name || profile?.full_name || user?.email}
            </span>
            <button
              onClick={() => { signOut(); navigate("/"); }}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogOut size={16} /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-card rounded-xl p-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-foreground text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === "overview" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              {[
                { label: "Total Jobs", value: stats.totalJobs, icon: Briefcase, color: "text-primary" },
                { label: "Open Positions", value: stats.openJobs, icon: Clock, color: "text-glow" },
                { label: "Total Applicants", value: stats.totalApplicants, icon: Users, color: "text-primary" },
                { label: "Shortlisted", value: stats.shortlisted, icon: CheckCircle2, color: "text-glow" },
              ].map((stat) => (
                <div key={stat.label} className="bg-card rounded-2xl p-6 border border-border">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-muted-foreground">{stat.label}</span>
                    <stat.icon size={20} className={stat.color} />
                  </div>
                  <p className="font-display text-3xl font-bold text-foreground">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="bg-card rounded-2xl p-6 border border-border">
              <h3 className="font-display text-lg font-bold text-foreground mb-4">Recent Applications</h3>
              {applications.length === 0 ? (
                <p className="text-muted-foreground text-sm">No applications yet. Post a job to get started!</p>
              ) : (
                <div className="space-y-3">
                  {applications.slice(0, 5).map((app: any) => (
                    <div key={app.id} className="flex items-center justify-between p-4 rounded-xl bg-background border border-border">
                      <div>
                        <p className="font-medium text-foreground">{app.profiles?.full_name || "Unnamed"}</p>
                        <p className="text-sm text-muted-foreground">{app.profiles?.headline || "No headline"}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-primary">{app.match_score}% match</span>
                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                          app.status === "shortlisted" ? "bg-primary/10 text-primary" :
                          app.status === "rejected" ? "bg-destructive/10 text-destructive" :
                          "bg-muted text-muted-foreground"
                        }`}>
                          {app.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Jobs Tab */}
        {activeTab === "jobs" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-bold text-foreground">Your Job Postings</h2>
              <button
                onClick={() => setShowJobForm(true)}
                className="inline-flex items-center gap-2 rounded-full bg-foreground text-primary-foreground px-5 py-2.5 text-sm font-medium hover:bg-foreground/90 transition-colors"
              >
                <Plus size={16} /> Post New Job
              </button>
            </div>

            {jobs.length === 0 ? (
              <div className="text-center py-16 bg-card rounded-2xl border border-border">
                <Briefcase size={48} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="font-display text-xl font-bold text-foreground mb-2">No jobs yet</h3>
                <p className="text-muted-foreground mb-6">Create your first job posting to start receiving applications.</p>
                <button
                  onClick={() => setShowJobForm(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-foreground text-primary-foreground px-6 py-3 text-sm font-medium"
                >
                  <Plus size={16} /> Post Your First Job
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job: any) => {
                  const jobApps = applications.filter(a => a.job_id === job.id);
                  return (
                    <div key={job.id} className="bg-card rounded-2xl p-6 border border-border">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-display text-lg font-bold text-foreground">{job.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {job.location || "Remote"} · {job.job_type} · {job.experience_level || "Any level"}
                          </p>
                          {job.required_skills?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {job.required_skills.map((s: string) => (
                                <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">{s}</span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <span className={`text-xs px-3 py-1 rounded-full font-medium ${job.status === "open" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                            {job.status}
                          </span>
                          <p className="text-sm text-muted-foreground mt-2">{jobApps.length} applicants</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Job Form Modal */}
            {showJobForm && (
              <div className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-background rounded-2xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto border border-border"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-display text-xl font-bold text-foreground">Post a New Job</h3>
                    <button onClick={() => setShowJobForm(false)} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
                  </div>
                  <form onSubmit={handleCreateJob} className="space-y-4">
                    {[
                      { label: "Job Title", key: "title", placeholder: "e.g. Senior React Developer", required: true },
                      { label: "Description", key: "description", placeholder: "Describe the role...", textarea: true },
                      { label: "Required Skills (comma-separated)", key: "required_skills", placeholder: "React, TypeScript, Node.js" },
                      { label: "Experience Level", key: "experience_level", placeholder: "e.g. 3-5 years" },
                      { label: "Qualification", key: "qualification", placeholder: "e.g. Bachelor's in CS" },
                      { label: "Location", key: "location", placeholder: "e.g. Remote, New York" },
                    ].map((field) => (
                      <div key={field.key}>
                        <label className="block text-sm font-medium text-foreground mb-1.5">{field.label}</label>
                        {field.textarea ? (
                          <textarea
                            value={(jobForm as any)[field.key]}
                            onChange={(e) => setJobForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                            placeholder={field.placeholder}
                            rows={3}
                            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                          />
                        ) : (
                          <input
                            type="text"
                            required={field.required}
                            value={(jobForm as any)[field.key]}
                            onChange={(e) => setJobForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                            placeholder={field.placeholder}
                            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                          />
                        )}
                      </div>
                    ))}
                    <button type="submit" className="w-full rounded-full bg-foreground text-primary-foreground px-6 py-3 text-sm font-semibold hover:bg-foreground/90 transition-colors">
                      Publish Job
                    </button>
                  </form>
                </motion.div>
              </div>
            )}
          </motion.div>
        )}

        {/* Candidates Tab */}
        {activeTab === "candidates" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">Candidate Pipeline</h2>
            {applications.length === 0 ? (
              <div className="text-center py-16 bg-card rounded-2xl border border-border">
                <Users size={48} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="font-display text-xl font-bold text-foreground mb-2">No candidates yet</h3>
                <p className="text-muted-foreground">Applications will appear here once candidates apply to your jobs.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app: any) => {
                  const job = jobs.find(j => j.id === app.job_id);
                  return (
                    <div key={app.id} className="bg-card rounded-2xl p-6 border border-border">
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                          <p className="font-display font-bold text-foreground text-lg">{app.profiles?.full_name || "Unnamed"}</p>
                          <p className="text-sm text-muted-foreground">{app.profiles?.headline || "No headline"} · Applied to: {job?.title || "Unknown"}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-display text-lg font-bold text-primary">{app.match_score}%</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleUpdateApplicationStatus(app.id, "shortlisted")}
                              className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors"
                            >
                              Shortlist
                            </button>
                            <button
                              onClick={() => handleUpdateApplicationStatus(app.id, "rejected")}
                              className="text-xs px-3 py-1.5 rounded-full bg-destructive/10 text-destructive font-medium hover:bg-destructive/20 transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* Company Profile Tab */}
        {activeTab === "settings" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">Company Profile</h2>
            <div className="bg-card rounded-2xl p-8 border border-border max-w-2xl">
              {!showProfileEdit ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Building2 className="text-primary" size={28} />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-bold text-foreground">{profile?.company_name || "Your Company"}</h3>
                      <p className="text-muted-foreground text-sm">{profile?.company_industry || "Set your industry"}</p>
                    </div>
                  </div>
                  {[
                    { label: "Full Name", value: profile?.full_name },
                    { label: "Company Size", value: profile?.company_size },
                    { label: "Phone", value: profile?.phone },
                    { label: "Bio", value: profile?.bio },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="text-sm text-muted-foreground">{item.label}</p>
                      <p className="text-foreground font-medium">{item.value || "Not set"}</p>
                    </div>
                  ))}
                  <button
                    onClick={() => setShowProfileEdit(true)}
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-foreground text-primary-foreground px-5 py-2.5 text-sm font-medium hover:bg-foreground/90 transition-colors"
                  >
                    <Settings size={16} /> Edit Profile
                  </button>
                </div>
              ) : (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  {[
                    { label: "Full Name", key: "full_name" },
                    { label: "Company Name", key: "company_name" },
                    { label: "Industry", key: "company_industry" },
                    { label: "Company Size", key: "company_size" },
                    { label: "Phone", key: "phone" },
                    { label: "Bio", key: "bio" },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-sm font-medium text-foreground mb-1.5">{field.label}</label>
                      <input
                        type="text"
                        value={(profileForm as any)[field.key]}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
                    </div>
                  ))}
                  <div className="flex gap-3">
                    <button type="submit" className="rounded-full bg-foreground text-primary-foreground px-6 py-2.5 text-sm font-medium hover:bg-foreground/90 transition-colors">
                      Save Changes
                    </button>
                    <button type="button" onClick={() => setShowProfileEdit(false)} className="rounded-full border border-border px-6 py-2.5 text-sm font-medium text-foreground hover:bg-card transition-colors">
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default RecruiterDashboard;
