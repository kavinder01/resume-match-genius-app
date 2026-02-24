import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  FileText, Plus, Briefcase, LogOut, Settings, X, Upload,
  TrendingUp, Clock, CheckCircle2, Trash2, Star
} from "lucide-react";

const ApplicantDashboard = () => {
  const { user, role, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [availableJobs, setAvailableJobs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [showExpForm, setShowExpForm] = useState(false);
  const [profileForm, setProfileForm] = useState({ full_name: "", headline: "", location: "", education: "", bio: "", phone: "" });
  const [skillForm, setSkillForm] = useState({ name: "", level: "intermediate" });
  const [expForm, setExpForm] = useState({ company_name: "", job_title: "", start_date: "", end_date: "", description: "" });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
    if (!loading && !role) navigate("/onboarding");
    if (!loading && role === "recruiter") navigate("/recruiter");
  }, [loading, user, role]);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const fetchData = async () => {
    const [profileRes, skillsRes, expRes, appsRes, jobsRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user!.id).single(),
      supabase.from("skills").select("*").eq("user_id", user!.id),
      supabase.from("experiences").select("*").eq("user_id", user!.id).order("start_date", { ascending: false }),
      supabase.from("applications").select("*, jobs(title, required_skills, location, profiles(company_name))").eq("applicant_id", user!.id),
      supabase.from("jobs").select("*, profiles(company_name)").eq("status", "open"),
    ]);
    if (profileRes.data) {
      setProfile(profileRes.data);
      setProfileForm({
        full_name: profileRes.data.full_name || "",
        headline: profileRes.data.headline || "",
        location: profileRes.data.location || "",
        education: profileRes.data.education || "",
        bio: profileRes.data.bio || "",
        phone: profileRes.data.phone || "",
      });
    }
    setSkills(skillsRes.data || []);
    setExperiences(expRes.data || []);
    setApplications(appsRes.data || []);
    setAvailableJobs(jobsRes.data || []);
  };

  const handleUploadResume = async () => {
    if (!resumeFile || !user) return;
    setUploading(true);
    const filePath = `${user.id}/${Date.now()}_${resumeFile.name}`;
    const { error } = await supabase.storage.from("resumes").upload(filePath, resumeFile);
    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Resume uploaded!" });
      setResumeFile(null);
    }
    setUploading(false);
  };

  const handleApplyJob = async (jobId: string) => {
    const { error } = await supabase.from("applications").insert({
      job_id: jobId,
      applicant_id: user!.id,
      match_score: Math.floor(Math.random() * 40 + 60), // Placeholder until AI scoring
    });
    if (error) {
      if (error.code === "23505") toast({ title: "Already applied", variant: "destructive" });
      else toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Application submitted!" });
      fetchData();
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from("profiles").update(profileForm).eq("id", user!.id);
    toast({ title: "Profile updated!" });
    setShowProfileEdit(false);
    fetchData();
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from("skills").insert({ user_id: user!.id, ...skillForm });
    toast({ title: "Skill added!" });
    setShowSkillForm(false);
    setSkillForm({ name: "", level: "intermediate" });
    fetchData();
  };

  const handleDeleteSkill = async (id: string) => {
    await supabase.from("skills").delete().eq("id", id);
    fetchData();
  };

  const handleAddExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from("experiences").insert({
      user_id: user!.id,
      ...expForm,
      start_date: expForm.start_date || null,
      end_date: expForm.end_date || null,
    });
    toast({ title: "Experience added!" });
    setShowExpForm(false);
    setExpForm({ company_name: "", job_title: "", start_date: "", end_date: "", description: "" });
    fetchData();
  };

  const handleDeleteExperience = async (id: string) => {
    await supabase.from("experiences").delete().eq("id", id);
    fetchData();
  };

  if (loading) return null;

  const tabs = [
    { id: "overview", label: "Overview", icon: TrendingUp },
    { id: "profile", label: "My Profile", icon: Settings },
    { id: "jobs", label: "Browse Jobs", icon: Briefcase },
    { id: "applications", label: "Applications", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-16 px-6">
          <a href="/" className="font-display text-xl font-bold text-foreground">
            SmartRecruit<span className="text-primary">AI</span>
          </a>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">{profile?.full_name || user?.email}</span>
            <button onClick={() => { signOut(); navigate("/"); }} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <LogOut size={16} /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-1 mb-8 bg-card rounded-xl p-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id ? "bg-foreground text-primary-foreground" : "text-muted-foreground hover:text-foreground"
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
                { label: "Applications", value: applications.length, icon: FileText, color: "text-primary" },
                { label: "Skills", value: skills.length, icon: Star, color: "text-glow" },
                { label: "Shortlisted", value: applications.filter(a => a.status === "shortlisted").length, icon: CheckCircle2, color: "text-primary" },
                { label: "Pending", value: applications.filter(a => a.status === "submitted").length, icon: Clock, color: "text-glow" },
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

            {/* Resume upload */}
            <div className="bg-card rounded-2xl p-6 border border-border mb-6">
              <h3 className="font-display text-lg font-bold text-foreground mb-4">Upload Resume</h3>
              <div className="flex items-center gap-4 flex-wrap">
                <label className="flex items-center gap-3 px-5 py-3 rounded-xl border-2 border-dashed border-border hover:border-primary cursor-pointer transition-colors">
                  <Upload size={20} className="text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{resumeFile ? resumeFile.name : "Choose PDF or DOC"}</span>
                  <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => setResumeFile(e.target.files?.[0] || null)} />
                </label>
                {resumeFile && (
                  <button
                    onClick={handleUploadResume}
                    disabled={uploading}
                    className="rounded-full bg-foreground text-primary-foreground px-5 py-2.5 text-sm font-medium hover:bg-foreground/90 transition-colors disabled:opacity-50"
                  >
                    {uploading ? "Uploading…" : "Upload"}
                  </button>
                )}
              </div>
            </div>

            {/* Recent applications */}
            <div className="bg-card rounded-2xl p-6 border border-border">
              <h3 className="font-display text-lg font-bold text-foreground mb-4">Recent Applications</h3>
              {applications.length === 0 ? (
                <p className="text-muted-foreground text-sm">No applications yet. Browse jobs to apply!</p>
              ) : (
                <div className="space-y-3">
                  {applications.slice(0, 5).map((app: any) => (
                    <div key={app.id} className="flex items-center justify-between p-4 rounded-xl bg-background border border-border">
                      <div>
                        <p className="font-medium text-foreground">{app.jobs?.title || "Unknown Job"}</p>
                        <p className="text-sm text-muted-foreground">{(app.jobs?.profiles as any)?.company_name || "Unknown Company"}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-display text-sm font-bold text-primary">{app.match_score}%</span>
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

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="bg-card rounded-2xl p-8 border border-border max-w-2xl">
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">Personal Information</h2>
              {!showProfileEdit ? (
                <div className="space-y-4">
                  {[
                    { label: "Full Name", value: profile?.full_name },
                    { label: "Headline", value: profile?.headline },
                    { label: "Location", value: profile?.location },
                    { label: "Education", value: profile?.education },
                    { label: "Phone", value: profile?.phone },
                    { label: "Bio", value: profile?.bio },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="text-sm text-muted-foreground">{item.label}</p>
                      <p className="text-foreground font-medium">{item.value || "Not set"}</p>
                    </div>
                  ))}
                  <button onClick={() => setShowProfileEdit(true)} className="mt-2 inline-flex items-center gap-2 rounded-full bg-foreground text-primary-foreground px-5 py-2.5 text-sm font-medium hover:bg-foreground/90 transition-colors">
                    <Settings size={16} /> Edit Profile
                  </button>
                </div>
              ) : (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  {Object.entries(profileForm).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-foreground mb-1.5 capitalize">{key.replace("_", " ")}</label>
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, [key]: e.target.value }))}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
                    </div>
                  ))}
                  <div className="flex gap-3">
                    <button type="submit" className="rounded-full bg-foreground text-primary-foreground px-6 py-2.5 text-sm font-medium">Save</button>
                    <button type="button" onClick={() => setShowProfileEdit(false)} className="rounded-full border border-border px-6 py-2.5 text-sm font-medium text-foreground">Cancel</button>
                  </div>
                </form>
              )}
            </div>

            {/* Skills */}
            <div className="bg-card rounded-2xl p-8 border border-border max-w-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-xl font-bold text-foreground">Skills</h3>
                <button onClick={() => setShowSkillForm(true)} className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80"><Plus size={16} /> Add</button>
              </div>
              {skills.length === 0 ? (
                <p className="text-muted-foreground text-sm">No skills added yet.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill: any) => (
                    <span key={skill.id} className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                      {skill.name} · {skill.level}
                      <button onClick={() => handleDeleteSkill(skill.id)} className="opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12} /></button>
                    </span>
                  ))}
                </div>
              )}
              {showSkillForm && (
                <form onSubmit={handleAddSkill} className="mt-4 flex gap-3 flex-wrap">
                  <input type="text" required value={skillForm.name} onChange={(e) => setSkillForm(prev => ({ ...prev, name: e.target.value }))} placeholder="Skill name" className="flex-1 min-w-[150px] px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" />
                  <select value={skillForm.level} onChange={(e) => setSkillForm(prev => ({ ...prev, level: e.target.value }))} className="px-4 py-2.5 rounded-lg border border-border bg-background text-foreground">
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="expert">Expert</option>
                  </select>
                  <button type="submit" className="rounded-full bg-foreground text-primary-foreground px-5 py-2.5 text-sm font-medium">Add</button>
                  <button type="button" onClick={() => setShowSkillForm(false)} className="text-sm text-muted-foreground">Cancel</button>
                </form>
              )}
            </div>

            {/* Experiences */}
            <div className="bg-card rounded-2xl p-8 border border-border max-w-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-xl font-bold text-foreground">Work Experience</h3>
                <button onClick={() => setShowExpForm(true)} className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80"><Plus size={16} /> Add</button>
              </div>
              {experiences.length === 0 ? (
                <p className="text-muted-foreground text-sm">No experience added yet.</p>
              ) : (
                <div className="space-y-4">
                  {experiences.map((exp: any) => (
                    <div key={exp.id} className="p-4 rounded-xl bg-background border border-border group">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium text-foreground">{exp.job_title}</p>
                          <p className="text-sm text-muted-foreground">{exp.company_name}</p>
                          <p className="text-xs text-muted-foreground mt-1">{exp.start_date} — {exp.end_date || "Present"}</p>
                        </div>
                        <button onClick={() => handleDeleteExperience(exp.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"><Trash2 size={16} /></button>
                      </div>
                      {exp.description && <p className="text-sm text-muted-foreground mt-2">{exp.description}</p>}
                    </div>
                  ))}
                </div>
              )}
              {showExpForm && (
                <form onSubmit={handleAddExperience} className="mt-4 space-y-3">
                  {[
                    { key: "job_title", label: "Job Title", required: true },
                    { key: "company_name", label: "Company", required: true },
                  ].map((f) => (
                    <input key={f.key} type="text" required={f.required} placeholder={f.label} value={(expForm as any)[f.key]} onChange={(e) => setExpForm(prev => ({ ...prev, [f.key]: e.target.value }))} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" />
                  ))}
                  <div className="flex gap-3">
                    <input type="date" value={expForm.start_date} onChange={(e) => setExpForm(prev => ({ ...prev, start_date: e.target.value }))} className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-background text-foreground" />
                    <input type="date" value={expForm.end_date} onChange={(e) => setExpForm(prev => ({ ...prev, end_date: e.target.value }))} className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-background text-foreground" placeholder="Present" />
                  </div>
                  <textarea value={expForm.description} onChange={(e) => setExpForm(prev => ({ ...prev, description: e.target.value }))} placeholder="Description" rows={2} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" />
                  <div className="flex gap-3">
                    <button type="submit" className="rounded-full bg-foreground text-primary-foreground px-5 py-2.5 text-sm font-medium">Add</button>
                    <button type="button" onClick={() => setShowExpForm(false)} className="text-sm text-muted-foreground">Cancel</button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        )}

        {/* Browse Jobs */}
        {activeTab === "jobs" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">Open Positions</h2>
            {availableJobs.length === 0 ? (
              <div className="text-center py-16 bg-card rounded-2xl border border-border">
                <Briefcase size={48} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="font-display text-xl font-bold text-foreground mb-2">No jobs available</h3>
                <p className="text-muted-foreground">Check back later for new opportunities.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {availableJobs.map((job: any) => {
                  const alreadyApplied = applications.some(a => a.job_id === job.id);
                  return (
                    <div key={job.id} className="bg-card rounded-2xl p-6 border border-border">
                      <div className="flex items-start justify-between flex-wrap gap-4">
                        <div>
                          <h3 className="font-display text-lg font-bold text-foreground">{job.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{(job.profiles as any)?.company_name || "Company"} · {job.location || "Remote"} · {job.job_type}</p>
                          {job.description && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{job.description}</p>}
                          {job.required_skills?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {job.required_skills.map((s: string) => (
                                <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">{s}</span>
                              ))}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => handleApplyJob(job.id)}
                          disabled={alreadyApplied}
                          className={`rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
                            alreadyApplied
                              ? "bg-muted text-muted-foreground cursor-not-allowed"
                              : "bg-foreground text-primary-foreground hover:bg-foreground/90"
                          }`}
                        >
                          {alreadyApplied ? "Applied" : "Apply Now"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* Applications */}
        {activeTab === "applications" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">My Applications</h2>
            {applications.length === 0 ? (
              <div className="text-center py-16 bg-card rounded-2xl border border-border">
                <FileText size={48} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="font-display text-xl font-bold text-foreground mb-2">No applications</h3>
                <p className="text-muted-foreground">Browse jobs and start applying!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app: any) => (
                  <div key={app.id} className="bg-card rounded-2xl p-6 border border-border">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div>
                        <h3 className="font-display text-lg font-bold text-foreground">{app.jobs?.title || "Unknown"}</h3>
                        <p className="text-sm text-muted-foreground">{(app.jobs?.profiles as any)?.company_name || "Company"} · Applied {new Date(app.applied_at).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="font-display text-2xl font-bold text-primary">{app.match_score}%</p>
                          <p className="text-xs text-muted-foreground">Match</p>
                        </div>
                        <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                          app.status === "shortlisted" ? "bg-primary/10 text-primary" :
                          app.status === "rejected" ? "bg-destructive/10 text-destructive" :
                          "bg-muted text-muted-foreground"
                        }`}>
                          {app.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ApplicantDashboard;
