import React, { useState, useEffect } from 'react';
import {
  Users,
  CheckCircle2,
  Clock,
  Lock,
  LogOut,
  Plus,
  Trash2,
  Edit3,
  Inbox,
  Shield,
  ArrowLeft,
  Phone,
  AlertTriangle,
  KeyRound,
  UserCheck,
  ClipboardList,
  Check,
  Search,
  Calendar,
  XCircle,
} from 'lucide-react';
import {
  CMSDatabaseState,
  TeamMember,
  TeamTask,
  TeamAttendanceRecord,
  TeamLeaveRequest,
  ContactEnquiry,
  INITIAL_CMS_STATE,
} from '../data/initialCmsData';

interface TeamManagementPortalProps {
  cms: CMSDatabaseState;
  setCms: React.Dispatch<React.SetStateAction<CMSDatabaseState>>;
  isAuthenticated: boolean;
  authenticatedMember: TeamMember | null;
  onLogin: (email: string, pin: string) => { success: boolean; error?: string };
  onLogout: () => void;
  onBackToWebsite?: () => void;
  isEmbeddedInAdmin?: boolean;
}

export const TeamManagementPortal: React.FC<TeamManagementPortalProps> = ({
  cms,
  setCms,
  isAuthenticated,
  authenticatedMember,
  onLogin,
  onLogout,
  onBackToWebsite,
  isEmbeddedInAdmin = false,
}) => {
  const teamMembers: TeamMember[] =
    cms.team_members && cms.team_members.length > 0
      ? cms.team_members
      : INITIAL_CMS_STATE.team_members || [];

  const teamTasks: TeamTask[] =
    cms.team_tasks && cms.team_tasks.length > 0
      ? cms.team_tasks
      : INITIAL_CMS_STATE.team_tasks || [];

  const attendanceLogs: TeamAttendanceRecord[] =
    cms.team_attendance_logs && cms.team_attendance_logs.length > 0
      ? cms.team_attendance_logs
      : INITIAL_CMS_STATE.team_attendance_logs || [];

  const leaveRequests: TeamLeaveRequest[] =
    cms.team_leave_requests && cms.team_leave_requests.length > 0
      ? cms.team_leave_requests
      : INITIAL_CMS_STATE.team_leave_requests || [];

  const allEnquiries: ContactEnquiry[] =
    cms.enquiries && cms.enquiries.length > 0
      ? cms.enquiries
      : INITIAL_CMS_STATE.enquiries || [];

  const [activeSubTab, setActiveSubTab] = useState<
    'attendance_leaves' | 'tasks' | 'roster' | 'leads' | 'security'
  >('attendance_leaves');

  // Login Form State
  const [loginEmail, setLoginEmail] = useState<string>('dev@shivwebsindia.com');
  const [loginPin, setLoginPin] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');

  const currentUser: TeamMember =
    teamMembers.find((m) => m.id === authenticatedMember?.id) ||
    authenticatedMember ||
    teamMembers[0];

  // STRICT ISOLATION RBAC:
  // - Super Admin (Admin Panel or CEO role === 'admin') sees and manages all team members.
  // - Any individual Team Member sees, adds, edits, and deletes ONLY their own ID's records.
  //   Other team members' data is completely hidden (not even viewable).
  const isSuperAdmin = isEmbeddedInAdmin || currentUser.role === 'admin';
  const canAccessRecordOf = (ownerMemberId?: number) =>
    isSuperAdmin || ownerMemberId === currentUser.id;

  // Scoped datasets visible to the logged-in user
  const visibleMembers = isSuperAdmin
    ? teamMembers
    : teamMembers.filter((m) => m.id === currentUser.id);

  const visibleAttendanceLogs = isSuperAdmin
    ? attendanceLogs
    : attendanceLogs.filter((l) => l.member_id === currentUser.id);

  const visibleLeaveRequests = isSuperAdmin
    ? leaveRequests
    : leaveRequests.filter((l) => l.member_id === currentUser.id);

  const visibleTasks = isSuperAdmin
    ? teamTasks
    : teamTasks.filter((t) => t.assigned_to_id === currentUser.id);

  const visibleEnquiries = isSuperAdmin
    ? allEnquiries
    : allEnquiries.filter((e) => e.assigned_to_id === currentUser.id);

  // Attendance Form State
  const [attMemberId, setAttMemberId] = useState<number>(currentUser.id);
  const [editingAttId, setEditingAttId] = useState<number | null>(null);
  const [attDate, setAttDate] = useState<string>('2026-10-11');
  const [attStatus, setAttStatus] = useState<TeamAttendanceRecord['status']>('present');
  const [attWorkMode, setAttWorkMode] =
    useState<TeamAttendanceRecord['work_mode']>('Office (Vaishali)');
  const [attCheckInTime, setAttCheckInTime] = useState<string>('09:30 AM');
  const [attCheckOutTime, setAttCheckOutTime] = useState<string>('06:30 PM');
  const [attNotes, setAttNotes] = useState<string>('');
  const [attFilterDate, setAttFilterDate] = useState<string>('all');
  const [attFilterMember, setAttFilterMember] = useState<string>('all');

  // Leave Application Form State
  const [leaveMemberId, setLeaveMemberId] = useState<number>(currentUser.id);
  const [editingLeaveId, setEditingLeaveId] = useState<number | null>(null);
  const [leaveType, setLeaveType] =
    useState<TeamLeaveRequest['leave_type']>('Casual Leave (CL)');
  const [leaveStartDate, setLeaveStartDate] = useState<string>('2026-10-15');
  const [leaveEndDate, setLeaveEndDate] = useState<string>('2026-10-16');
  const [leaveTotalDays, setLeaveTotalDays] = useState<number>(2);
  const [leaveReason, setLeaveReason] = useState<string>('');
  const [leaveHandoverTo, setLeaveHandoverTo] = useState<string>('Shiv Kumar');
  const [leaveEmergencyPhone, setLeaveEmergencyPhone] = useState<string>(
    currentUser.phone || '+91 8667666429'
  );
  const [leaveFilterStatus, setLeaveFilterStatus] = useState<string>('all');
  const [leaveFeedbackMsg, setLeaveFeedbackMsg] = useState<string>('');

  // Task Filter & Creation / Edit State
  const [taskStatusFilter, setTaskStatusFilter] = useState<string>('all');
  const [taskAssigneeFilter, setTaskAssigneeFilter] = useState<string>('all');
  const [taskSearch, setTaskSearch] = useState<string>('');

  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [newTaskClient, setNewTaskClient] = useState<string>('');
  const [newTaskProjectType, setNewTaskProjectType] = useState<string>(
    'Website Design & Development'
  );
  const [newTaskAssigneeId, setNewTaskAssigneeId] = useState<number>(currentUser.id);
  const [newTaskPriority, setNewTaskPriority] = useState<TeamTask['priority']>('high');
  const [newTaskDueDate, setNewTaskDueDate] = useState<string>('2026-10-18');
  const [newTaskNotes, setNewTaskNotes] = useState<string>('');

  // Team Member Profile Edit / Add State
  const [editingMemberId, setEditingMemberId] = useState<number | null>(null);
  const [memberName, setMemberName] = useState<string>(currentUser.full_name);
  const [memberDesignation, setMemberDesignation] = useState<string>(currentUser.designation);
  const [memberDepartment, setMemberDepartment] = useState<TeamMember['department']>(
    currentUser.department
  );
  const [memberEmail, setMemberEmail] = useState<string>(currentUser.email);
  const [memberPhone, setMemberPhone] = useState<string>(currentUser.phone);
  const [memberPin, setMemberPin] = useState<string>(currentUser.password_pin);
  const [memberRole, setMemberRole] = useState<TeamMember['role']>(currentUser.role);
  const [memberSkills, setMemberSkills] = useState<string>(currentUser.skills.join(', '));
  const [profileSavedMsg, setProfileSavedMsg] = useState<string>('');

  // Client Enquiry Add / Edit State (Scoped to currentUser)
  const [editingEnquiryId, setEditingEnquiryId] = useState<number | null>(null);
  const [enqFullName, setEnqFullName] = useState<string>('');
  const [enqCompanyName, setEnqCompanyName] = useState<string>('');
  const [enqPhone, setEnqPhone] = useState<string>('');
  const [enqEmail, setEnqEmail] = useState<string>('');
  const [enqService, setEnqService] = useState<string>('Website Design & Development');
  const [enqBudget, setEnqBudget] = useState<string>('₹25,000 – ₹60,000');
  const [enqMessage, setEnqMessage] = useState<string>('');
  const [enqNotes, setEnqNotes] = useState<string>('');
  const [enqAssigneeId, setEnqAssigneeId] = useState<number>(currentUser.id);

  // Password Change State
  const [newPersonalPin, setNewPersonalPin] = useState<string>('');
  const [pinSavedMsg, setPinSavedMsg] = useState<string>('');

  // Sync default selected IDs when logged-in user changes
  useEffect(() => {
    setAttMemberId(currentUser.id);
    setLeaveMemberId(currentUser.id);
    setNewTaskAssigneeId(currentUser.id);
    setEnqAssigneeId(currentUser.id);
    setEditingMemberId(isSuperAdmin ? null : currentUser.id);
    setMemberName(currentUser.full_name);
    setMemberDesignation(currentUser.designation);
    setMemberDepartment(currentUser.department);
    setMemberEmail(currentUser.email);
    setMemberPhone(currentUser.phone);
    setMemberPin(currentUser.password_pin);
    setMemberRole(currentUser.role);
    setMemberSkills(currentUser.skills.join(', '));
  }, [currentUser.id, isSuperAdmin]);

  const updateTeamMembers = (nextMembers: TeamMember[]) => {
    setCms((prev) => ({
      ...prev,
      team_members: nextMembers,
    }));
  };

  const updateTeamTasks = (nextTasks: TeamTask[]) => {
    setCms((prev) => ({
      ...prev,
      team_tasks: nextTasks,
    }));
  };

  const updateAttendanceLogs = (nextLogs: TeamAttendanceRecord[]) => {
    setCms((prev) => ({
      ...prev,
      team_attendance_logs: nextLogs,
    }));
  };

  const updateLeaveRequests = (nextLeaves: TeamLeaveRequest[]) => {
    setCms((prev) => ({
      ...prev,
      team_leave_requests: nextLeaves,
    }));
  };

  const updateEnquiries = (nextEnquiries: ContactEnquiry[]) => {
    setCms((prev) => ({
      ...prev,
      enquiries: nextEnquiries,
    }));
  };

  // Password-Protected Login Gate (when not embedded in Admin or when unauthenticated)
  if (!isAuthenticated && !isEmbeddedInAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#07192F] via-[#0A2540] to-[#1e1b4b] flex flex-col justify-center items-center p-4 sm:p-6 text-white">
        <div className="max-w-lg w-full bg-white text-[#0A2540] rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-[#522c2a] via-[#0A2540] to-[#0096e8] p-6 sm:p-8 text-white">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-amber-300 text-[11px] font-bold uppercase tracking-wider">
                <Lock className="w-3.5 h-3.5" /> Private Personal Team Login
              </span>
              <span className="text-xs font-mono text-white/80">SWI-PRIVATE-ID</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold mt-3">
              ShivWebsIndia Team Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 mt-1">
              Login with your Personal Team Email &amp; Password — You will ONLY see, add, edit &amp; delete your own dashboard data.
            </p>
          </div>

          <div className="p-6 sm:p-8">
            {loginError && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-900 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Quick Select Team ID for Demo Convenience (Does NOT expose other members' data inside portal) */}
            <div className="mb-5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                Choose Your Team Login ID:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {teamMembers.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      setLoginEmail(m.email);
                      setLoginPin(m.password_pin);
                      setLoginError('');
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      loginEmail.toLowerCase() === m.email.toLowerCase()
                        ? 'border-[#FF6A00] bg-orange-50/70'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/60'
                    }`}
                  >
                    <div className="font-display text-xs font-bold text-[#0A2540] truncate">
                      {m.full_name} (ID #{m.id})
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">{m.designation}</div>
                    <div className="text-[10px] font-mono text-[#FF6A00] mt-0.5">{m.email}</div>
                  </button>
                ))}
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const res = onLogin(loginEmail, loginPin);
                if (!res.success) {
                  setLoginError(res.error || 'Invalid Team Email or Password PIN.');
                } else {
                  setLoginError('');
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-[#0A2540] mb-1.5">
                  Your Team ID / Official Email
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="dev@shivwebsindia.com"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-[#FF6A00]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0A2540] mb-1.5">
                  Your Personal Password / Security PIN
                </label>
                <input
                  type="password"
                  required
                  value={loginPin}
                  onChange={(e) => setLoginPin(e.target.value)}
                  placeholder="Enter your password (e.g. Team@123)"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-[#FF6A00]"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Default Team Password:{' '}
                  <code className="font-mono font-bold text-[#0A2540]">Team@123</code> · Admin CEO:{' '}
                  <code className="font-mono font-bold text-[#0A2540]">Shiv@2026</code>
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#FF6A00] hover:bg-[#e55f00] text-white font-bold text-sm rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <KeyRound className="w-4 h-4" />
                <span>Open My Private Dashboard</span>
              </button>
            </form>

            {onBackToWebsite && (
              <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-500">100% Isolated Per-Team-ID Workspace</span>
                <button
                  type="button"
                  onClick={onBackToWebsite}
                  className="text-[#0A2540] hover:text-[#FF6A00] font-bold flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Website</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Quick Toggle Check-In / Check-Out (Strictly isolated to currentUser unless Super Admin)
  const handleToggleAttendance = (memberId: number) => {
    if (!canAccessRecordOf(memberId)) return;

    const nowTime = new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const todayDate = new Date().toISOString().slice(0, 10);
    const nowStr = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });

    const targetMember = teamMembers.find((m) => m.id === memberId);
    if (!targetMember) return;

    const nextState =
      targetMember.attendance_status === 'checked_in' ? 'checked_out' : 'checked_in';

    const nextMembers = teamMembers.map((m) =>
      m.id === memberId
        ? {
            ...m,
            attendance_status: nextState as 'checked_in' | 'checked_out',
            status: nextState === 'checked_in' ? ('active' as const) : m.status,
            last_check_in: nowStr,
          }
        : m
    );

    const existingLog = attendanceLogs.find(
      (l) => l.member_id === memberId && (l.date === todayDate || l.date === '2026-10-11')
    );

    let nextLogs = [...attendanceLogs];
    if (existingLog) {
      nextLogs = attendanceLogs.map((l) =>
        l.id === existingLog.id
          ? {
              ...l,
              status: nextState === 'checked_in' ? 'present' : l.status,
              check_in_time:
                nextState === 'checked_in' && l.check_in_time === 'On Leave'
                  ? nowTime
                  : l.check_in_time,
              check_out_time: nextState === 'checked_out' ? nowTime : '— (Active)',
            }
          : l
      );
    } else {
      nextLogs = [
        {
          id: Date.now(),
          member_id: targetMember.id,
          member_name: targetMember.full_name,
          designation: targetMember.designation,
          department: targetMember.department,
          date: '2026-10-11',
          status: 'present',
          check_in_time: nowTime,
          check_out_time: nextState === 'checked_out' ? nowTime : '— (Active)',
          work_mode: 'Office (Vaishali)',
          notes: `Marked via quick ${nextState === 'checked_in' ? 'Check-In' : 'Check-Out'}`,
        },
        ...attendanceLogs,
      ];
    }

    setCms((prev) => ({
      ...prev,
      team_members: nextMembers,
      team_attendance_logs: nextLogs,
    }));
  };

  // Add or Edit Daily Attendance Entry (Strictly locked to currentUser unless Super Admin)
  const handleMarkDailyAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    const targetMemberId = isSuperAdmin ? Number(attMemberId) : currentUser.id;
    if (!canAccessRecordOf(targetMemberId)) return;

    const member = teamMembers.find((m) => m.id === targetMemberId) || currentUser;

    let nextLogs: TeamAttendanceRecord[];
    if (editingAttId !== null) {
      const targetRecord = attendanceLogs.find((r) => r.id === editingAttId);
      if (!targetRecord || !canAccessRecordOf(targetRecord.member_id)) return;

      nextLogs = attendanceLogs.map((l) =>
        l.id === editingAttId
          ? {
              ...l,
              date: attDate,
              status: attStatus,
              work_mode: attWorkMode,
              check_in_time:
                attStatus === 'on_leave' || attStatus === 'absent' ? '—' : attCheckInTime,
              check_out_time:
                attStatus === 'on_leave' || attStatus === 'absent' ? '—' : attCheckOutTime,
              notes: attNotes.trim() || l.notes,
            }
          : l
      );
      setEditingAttId(null);
    } else {
      const existing = attendanceLogs.find(
        (l) => l.member_id === member.id && l.date === attDate
      );

      if (existing) {
        nextLogs = attendanceLogs.map((l) =>
          l.id === existing.id
            ? {
                ...l,
                status: attStatus,
                work_mode: attWorkMode,
                check_in_time:
                  attStatus === 'on_leave' || attStatus === 'absent' ? '—' : attCheckInTime,
                check_out_time:
                  attStatus === 'on_leave' || attStatus === 'absent' ? '—' : attCheckOutTime,
                notes: attNotes.trim() || l.notes,
              }
            : l
        );
      } else {
        const newEntry: TeamAttendanceRecord = {
          id: Date.now(),
          member_id: member.id,
          member_name: member.full_name,
          designation: member.designation,
          department: member.department,
          date: attDate,
          status: attStatus,
          check_in_time: attStatus === 'on_leave' || attStatus === 'absent' ? '—' : attCheckInTime,
          check_out_time:
            attStatus === 'on_leave' || attStatus === 'absent' ? '—' : attCheckOutTime,
          work_mode: attWorkMode,
          notes: attNotes.trim() || `${attStatus.replace(/_/g, ' ')} logged for ${attDate}`,
        };
        nextLogs = [newEntry, ...attendanceLogs];
      }
    }

    const nextMembers = teamMembers.map((m) =>
      m.id === member.id
        ? {
            ...m,
            status: attStatus === 'on_leave' ? ('on_leave' as const) : ('active' as const),
            attendance_status:
              attStatus === 'present' || attStatus === 'work_from_home' || attStatus === 'half_day'
                ? ('checked_in' as const)
                : ('checked_out' as const),
            last_check_in: `${attDate} ${attCheckInTime}`,
          }
        : m
    );

    setCms((prev) => ({
      ...prev,
      team_attendance_logs: nextLogs,
      team_members: nextMembers,
    }));
    setAttNotes('');
    setLeaveFeedbackMsg(`Attendance saved for ${member.full_name} (${attDate}).`);
  };

  // Add or Edit Leave Application (Strictly locked to currentUser unless Super Admin)
  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveReason.trim()) return;
    const targetMemberId = isSuperAdmin ? Number(leaveMemberId) : currentUser.id;
    if (!canAccessRecordOf(targetMemberId)) return;

    const member = teamMembers.find((m) => m.id === targetMemberId) || currentUser;

    if (editingLeaveId !== null) {
      const targetLeave = leaveRequests.find((l) => l.id === editingLeaveId);
      if (!targetLeave || !canAccessRecordOf(targetLeave.member_id)) return;

      const updated = leaveRequests.map((l) =>
        l.id === editingLeaveId
          ? {
              ...l,
              leave_type: leaveType,
              start_date: leaveStartDate,
              end_date: leaveEndDate,
              total_days: Number(leaveTotalDays) || 1,
              reason: leaveReason.trim(),
              handover_to_name: leaveHandoverTo.trim() || 'Shiv Kumar',
              emergency_contact: leaveEmergencyPhone.trim() || member.phone,
            }
          : l
      );
      updateLeaveRequests(updated);
      setEditingLeaveId(null);
      setLeaveReason('');
      setLeaveFeedbackMsg(`Your leave application (${leaveStartDate} to ${leaveEndDate}) was updated.`);
      return;
    }

    const newLeave: TeamLeaveRequest = {
      id: Date.now(),
      member_id: member.id,
      member_name: member.full_name,
      designation: member.designation,
      department: member.department,
      leave_type: leaveType,
      start_date: leaveStartDate,
      end_date: leaveEndDate,
      total_days: Number(leaveTotalDays) || 1,
      reason: leaveReason.trim(),
      handover_to_name: leaveHandoverTo.trim() || 'Shiv Kumar',
      emergency_contact: leaveEmergencyPhone.trim() || member.phone,
      status: 'pending',
      admin_remark: 'Submitted via Team Portal — Pending Admin Approval',
      applied_at: new Date().toLocaleString('en-IN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    updateLeaveRequests([newLeave, ...leaveRequests]);
    setLeaveReason('');
    setLeaveFeedbackMsg(
      `Leave request submitted for ${member.full_name} (${leaveStartDate} to ${leaveEndDate}). Admin notified!`
    );
  };

  // Admin-Only Approve or Reject Leave Request
  const handleUpdateLeaveStatus = (
    leaveId: number,
    nextStatus: TeamLeaveRequest['status'],
    remark?: string
  ) => {
    if (!isSuperAdmin) return;

    const targetLeave = leaveRequests.find((l) => l.id === leaveId);
    const updatedLeaves = leaveRequests.map((l) =>
      l.id === leaveId
        ? {
            ...l,
            status: nextStatus,
            admin_remark:
              remark !== undefined
                ? remark
                : nextStatus === 'approved'
                ? `Approved by Admin (${currentUser.full_name})`
                : nextStatus === 'rejected'
                ? `Declined by Admin (${currentUser.full_name})`
                : l.admin_remark,
          }
        : l
    );

    const updatedMembers =
      targetLeave && nextStatus === 'approved'
        ? teamMembers.map((m) =>
            m.id === targetLeave.member_id
              ? {
                  ...m,
                  status: 'on_leave' as const,
                  attendance_status: 'checked_out' as const,
                }
              : m
          )
        : teamMembers;

    setCms((prev) => ({
      ...prev,
      team_leave_requests: updatedLeaves,
      team_members: updatedMembers,
    }));
  };

  // Add or Edit Task (Strictly scoped to currentUser unless Super Admin)
  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const targetAssigneeId = isSuperAdmin ? Number(newTaskAssigneeId) : currentUser.id;
    const assignee = teamMembers.find((m) => m.id === targetAssigneeId) || currentUser;

    if (editingTaskId !== null) {
      const existingTask = teamTasks.find((t) => t.id === editingTaskId);
      if (!existingTask || !canAccessRecordOf(existingTask.assigned_to_id)) return;

      updateTeamTasks(
        teamTasks.map((t) =>
          t.id === editingTaskId
            ? {
                ...t,
                title: newTaskTitle.trim(),
                client_name: newTaskClient.trim() || 'ShivWebsIndia Client Project',
                project_type: newTaskProjectType,
                assigned_to_id: assignee.id,
                assigned_to_name: assignee.full_name,
                priority: newTaskPriority,
                due_date: newTaskDueDate || t.due_date,
                notes: newTaskNotes.trim(),
              }
            : t
        )
      );
      setEditingTaskId(null);
    } else {
      const newTask: TeamTask = {
        id: Date.now(),
        title: newTaskTitle.trim(),
        client_name: newTaskClient.trim() || 'ShivWebsIndia Client Project',
        project_type: newTaskProjectType,
        assigned_to_id: assignee.id,
        assigned_to_name: assignee.full_name,
        priority: newTaskPriority,
        status: 'pending',
        due_date: newTaskDueDate || '2026-10-20',
        notes: newTaskNotes.trim(),
        created_at: new Date().toISOString(),
      };
      updateTeamTasks([newTask, ...teamTasks]);
    }

    setNewTaskTitle('');
    setNewTaskClient('');
    setNewTaskNotes('');
  };

  // Save Team Member Profile (Non-admin can ONLY edit their own profile; Super Admin can add/edit all)
  const handleSaveTeamMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName.trim() || !memberEmail.trim()) return;
    const skillsArray = memberSkills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const targetId = isSuperAdmin ? editingMemberId : currentUser.id;

    if (targetId !== null) {
      if (!canAccessRecordOf(targetId)) return;

      const next = teamMembers.map((m) =>
        m.id === targetId
          ? {
              ...m,
              full_name: memberName.trim(),
              designation: isSuperAdmin
                ? memberDesignation.trim() || m.designation
                : m.designation,
              department: isSuperAdmin ? memberDepartment : m.department,
              email: isSuperAdmin ? memberEmail.trim() : m.email,
              phone: memberPhone.trim() || m.phone,
              password_pin: memberPin.trim() || m.password_pin,
              role: isSuperAdmin ? memberRole : m.role,
              skills: skillsArray.length > 0 ? skillsArray : m.skills,
            }
          : m
      );
      updateTeamMembers(next);
      setProfileSavedMsg(`Profile & credentials updated for ${memberName.trim()}!`);
      if (isSuperAdmin) {
        setEditingMemberId(null);
        setMemberName('');
        setMemberDesignation('');
        setMemberEmail('');
        setMemberPhone('');
        setMemberPin('Team@123');
      }
    } else {
      if (!isSuperAdmin) return;

      const newMember: TeamMember = {
        id: Date.now(),
        full_name: memberName.trim(),
        designation: memberDesignation.trim() || 'Team Specialist',
        department: memberDepartment,
        email: memberEmail.trim(),
        phone: memberPhone.trim() || '+91 8667666429',
        password_pin: memberPin.trim() || 'Team@123',
        role: memberRole,
        avatar_url: '',
        status: 'active',
        attendance_status: 'checked_in',
        last_check_in: 'Just now',
        skills: skillsArray.length > 0 ? skillsArray : ['Web Design', 'Client Support'],
        joined_at: new Date().toISOString().slice(0, 10),
      };
      updateTeamMembers([...teamMembers, newMember]);
      setProfileSavedMsg(`New team member ${newMember.full_name} added!`);
      setMemberName('');
      setMemberDesignation('');
      setMemberEmail('');
      setMemberPhone('');
      setMemberPin('Team@123');
    }
  };

  // Add or Edit Client Enquiry (Scoped strictly to currentUser unless Super Admin)
  const handleSaveEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enqFullName.trim() || !enqPhone.trim()) return;

    const targetOwnerId = isSuperAdmin ? Number(enqAssigneeId) : currentUser.id;
    const ownerMember = teamMembers.find((m) => m.id === targetOwnerId) || currentUser;

    if (editingEnquiryId !== null) {
      const targetEnq = allEnquiries.find((item) => item.id === editingEnquiryId);
      if (!targetEnq || !canAccessRecordOf(targetEnq.assigned_to_id)) return;

      updateEnquiries(
        allEnquiries.map((item) =>
          item.id === editingEnquiryId
            ? {
                ...item,
                full_name: enqFullName.trim(),
                company_name: enqCompanyName.trim() || 'Direct Client',
                phone: enqPhone.trim(),
                email: enqEmail.trim() || 'client@example.com',
                service_interested: enqService,
                budget_range: enqBudget,
                message: enqMessage.trim(),
                admin_notes: enqNotes.trim(),
                assigned_to_id: ownerMember.id,
                assigned_to_name: ownerMember.full_name,
              }
            : item
        )
      );
      setEditingEnquiryId(null);
    } else {
      const newEnq: ContactEnquiry = {
        id: Date.now(),
        full_name: enqFullName.trim(),
        company_name: enqCompanyName.trim() || 'Direct Client',
        phone: enqPhone.trim(),
        email: enqEmail.trim() || 'client@example.com',
        service_interested: enqService,
        budget_range: enqBudget,
        message: enqMessage.trim() || 'Client enquiry logged from Team Portal.',
        source_page: '/team-portal',
        status: 'new',
        admin_notes: enqNotes.trim() || `Added by ${currentUser.full_name}`,
        assigned_to_id: ownerMember.id,
        assigned_to_name: ownerMember.full_name,
        ip_address: '127.0.0.1',
        created_at: new Date().toISOString(),
      };
      updateEnquiries([newEnq, ...allEnquiries]);
    }

    setEnqFullName('');
    setEnqCompanyName('');
    setEnqPhone('');
    setEnqEmail('');
    setEnqMessage('');
    setEnqNotes('');
  };

  // Filtered lists derived from strictly visible records
  const filteredTasks = visibleTasks.filter((t) => {
    const matchStatus = taskStatusFilter === 'all' || t.status === taskStatusFilter;
    const matchAssignee =
      !isSuperAdmin ||
      taskAssigneeFilter === 'all' ||
      String(t.assigned_to_id) === taskAssigneeFilter;
    const q = taskSearch.trim().toLowerCase();
    const matchSearch =
      !q ||
      t.title.toLowerCase().includes(q) ||
      t.client_name.toLowerCase().includes(q) ||
      t.assigned_to_name.toLowerCase().includes(q);
    return matchStatus && matchAssignee && matchSearch;
  });

  const filteredAttendance = visibleAttendanceLogs.filter((log) => {
    const matchDate = attFilterDate === 'all' || log.date === attFilterDate;
    const matchMember =
      !isSuperAdmin || attFilterMember === 'all' || String(log.member_id) === attFilterMember;
    return matchDate && matchMember;
  });

  const filteredLeaves = visibleLeaveRequests.filter((lv) => {
    return leaveFilterStatus === 'all' || lv.status === leaveFilterStatus;
  });

  const presentLogsCount = visibleAttendanceLogs.filter(
    (l) => l.status === 'present' || l.status === 'work_from_home'
  ).length;
  const pendingLeavesCount = visibleLeaveRequests.filter((l) => l.status === 'pending').length;
  const approvedLeavesCount = visibleLeaveRequests.filter((l) => l.status === 'approved').length;
  const completedTasksCount = visibleTasks.filter((t) => t.status === 'completed').length;
  const inProgressTasksCount = visibleTasks.filter((t) => t.status === 'in_progress').length;

  return (
    <div className={isEmbeddedInAdmin ? 'space-y-6' : 'min-h-screen bg-[#F5F7FA] text-[#0A2540]'}>
      {/* Top Portal Banner when standalone */}
      {!isEmbeddedInAdmin && (
        <header className="bg-gradient-to-r from-[#07192F] via-[#0A2540] to-[#522c2a] text-white px-4 sm:px-8 py-4 shadow-lg sticky top-0 z-40">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FF6A00] text-white flex items-center justify-center font-display font-extrabold text-base shadow">
                SWI
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-display text-lg sm:text-xl font-extrabold">
                    {isSuperAdmin
                      ? 'ShivWebsIndia Master Team Administration'
                      : `${currentUser.full_name}'s Personal Workspace (ID #${currentUser.id})`}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold uppercase">
                    {isSuperAdmin
                      ? 'Admin Full Access'
                      : '100% Isolated Personal Dashboard'}
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Logged in as <strong className="text-white">{currentUser.full_name}</strong> (
                  {currentUser.designation} · {currentUser.email}) —{' '}
                  <span className="text-amber-300 font-semibold">
                    {isSuperAdmin
                      ? 'Master Admin: Full access to all team members.'
                      : 'Private Mode: Only your own records are visible. You can Add, Edit & Delete your own data; other team members are completely hidden.'}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => handleToggleAttendance(currentUser.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  currentUser.attendance_status === 'checked_in'
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                    : 'bg-amber-500 hover:bg-amber-600 text-white'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>
                  {currentUser.attendance_status === 'checked_in'
                    ? 'Checked In (Click to Check Out)'
                    : 'Check In Now'}
                </span>
              </button>

              {onBackToWebsite && (
                <button
                  type="button"
                  onClick={onBackToWebsite}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Public Website</span>
                </button>
              )}

              <button
                type="button"
                onClick={onLogout}
                className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Switch Team ID / Sign Out</span>
              </button>
            </div>
          </div>
        </header>
      )}

      <div
        className={
          isEmbeddedInAdmin ? 'space-y-6' : 'max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6'
        }
      >
        {/* Strict Privacy & Isolation Banner */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0A2540] text-[#FF6A00] flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-[#0A2540] flex flex-wrap items-center gap-2">
                <span>
                  {isSuperAdmin
                    ? 'Master Admin Workspace (All Team Records Visible)'
                    : `Private Dashboard: ${currentUser.full_name} (ID #${currentUser.id} — ${currentUser.department})`}
                </span>
                <span className="px-2 py-0.5 rounded bg-orange-50 text-[#FF6A00] border border-orange-200 text-[10px] font-bold uppercase">
                  {isSuperAdmin ? 'All Team Access' : 'Only Your Data Visible'}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">
                {isSuperAdmin
                  ? 'Admin Mode: You can view, add, edit, and delete records across all team members.'
                  : 'Strict Personal Privacy Active: You can ONLY view, add, edit, and delete your own Attendance, Leaves, Tasks, Profile, and Assigned Client Leads. Other team members’ records are completely hidden.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold">
              ✅ Your Data: View / Add / Edit / Delete
            </span>
            {!isSuperAdmin && (
              <span className="px-3 py-1.5 rounded-xl bg-red-50 border border-red-200 text-red-700 font-bold flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" /> Other Team Data: Hidden
              </span>
            )}
          </div>
        </div>

        {/* KPI Summary Cards (Strictly Scoped to Logged-In Team Member or Admin) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => setActiveSubTab('attendance_leaves')}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm cursor-pointer hover:border-[#0096e8] transition-all"
          >
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-bold uppercase tracking-wider">
                {isSuperAdmin ? 'All Attendance Logs' : 'My Attendance Logs'}
              </span>
              <UserCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="font-display text-3xl font-extrabold text-[#0A2540] mt-2">
              {visibleAttendanceLogs.length}
            </p>
            <p className="text-xs text-emerald-600 font-semibold mt-1">
              {presentLogsCount} Present / WFH · Status:{' '}
              {currentUser.attendance_status === 'checked_in' ? 'Checked In' : 'Checked Out'}
            </p>
          </div>

          <div
            onClick={() => setActiveSubTab('attendance_leaves')}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm cursor-pointer hover:border-[#FF6A00] transition-all"
          >
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-bold uppercase tracking-wider">
                {isSuperAdmin ? 'All Leave Requests' : 'My Leave Requests'}
              </span>
              <Calendar className="w-4 h-4 text-[#FF6A00]" />
            </div>
            <p className="font-display text-3xl font-extrabold text-[#0A2540] mt-2">
              {visibleLeaveRequests.length}
            </p>
            <p className="text-xs text-amber-600 font-semibold mt-1">
              {pendingLeavesCount} Pending · {approvedLeavesCount} Approved
            </p>
          </div>

          <div
            onClick={() => setActiveSubTab('tasks')}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm cursor-pointer hover:border-[#0096e8] transition-all"
          >
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-bold uppercase tracking-wider">
                {isSuperAdmin ? 'All Project Tasks' : 'My Assigned Tasks'}
              </span>
              <ClipboardList className="w-4 h-4 text-[#0d6efd]" />
            </div>
            <p className="font-display text-3xl font-extrabold text-[#0A2540] mt-2">
              {visibleTasks.length}
            </p>
            <p className="text-xs text-slate-600 font-semibold mt-1">
              {inProgressTasksCount} In Progress · {completedTasksCount} Completed
            </p>
          </div>

          <div
            onClick={() => setActiveSubTab('leads')}
            className="bg-gradient-to-br from-[#0A2540] to-[#1e293b] text-white rounded-2xl p-5 shadow-sm cursor-pointer"
          >
            <div className="flex items-center justify-between text-xs text-amber-300">
              <span className="font-bold uppercase tracking-wider">
                {isSuperAdmin ? 'All Client Leads' : 'My Client Enquiries'}
              </span>
              <Inbox className="w-4 h-4 text-amber-400" />
            </div>
            <p className="font-display text-3xl font-extrabold mt-2">{visibleEnquiries.length}</p>
            <p className="text-xs text-slate-300 mt-1">
              {isSuperAdmin
                ? 'Master Admin Lead Queue'
                : `Assigned to ${currentUser.full_name}`}
            </p>
          </div>
        </div>

        {/* Navigation Tabs (Counts reflect ONLY the logged-in user's own data unless Admin) */}
        <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
          <button
            type="button"
            onClick={() => setActiveSubTab('attendance_leaves')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'attendance_leaves'
                ? 'bg-[#FF6A00] text-white shadow'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>
              Attendance &amp; Leave Management ({visibleAttendanceLogs.length} Logs /{' '}
              {visibleLeaveRequests.length} Leaves)
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('tasks')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'tasks'
                ? 'bg-[#0A2540] text-white shadow'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>Project Tasks &amp; Assignments ({visibleTasks.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('roster')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'roster'
                ? 'bg-[#0A2540] text-white shadow'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>
              {isSuperAdmin
                ? `Team Directory, Roles & Passwords (${visibleMembers.length})`
                : 'My Profile, Role & Password'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('leads')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'leads'
                ? 'bg-[#0A2540] text-white shadow'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Client Enquiries Desk ({visibleEnquiries.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('security')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'security'
                ? 'bg-[#0A2540] text-white shadow'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>My Password &amp; Quick Punch</span>
          </button>
        </div>

        {/* ===================================================================
            TAB 0: ATTENDANCE & LEAVE MANAGEMENT (ONLY CURRENT USER OR ADMIN)
           =================================================================== */}
        {activeSubTab === 'attendance_leaves' && (
          <div className="space-y-6">
            {leaveFeedbackMsg && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-bold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{leaveFeedbackMsg}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setLeaveFeedbackMsg('')}
                  className="text-emerald-700 hover:underline text-xs cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Quick Live Punch Bar (Shows ONLY currentUser for regular team member, or all for Admin) */}
            <div className="bg-gradient-to-r from-[#0A2540] via-[#0e3258] to-[#0A2540] text-white rounded-2xl p-5 shadow-md">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#FF6A00] font-bold">
                    {isSuperAdmin
                      ? 'Master Admin Live Attendance Board'
                      : `My Personal Live Attendance Status (ID #${currentUser.id})`}
                  </span>
                  <h3 className="font-display text-lg font-extrabold mt-0.5">
                    {isSuperAdmin
                      ? "Today's Team Punch-In / Punch-Out Status"
                      : `${currentUser.full_name} — Today's Punch-In / Punch-Out`}
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {isSuperAdmin
                      ? 'Admin Mode: Toggle attendance for any team member.'
                      : 'Only your own attendance card is visible here. Click below to Punch In or Punch Out.'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleAttendance(currentUser.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow ${
                      currentUser.attendance_status === 'checked_in'
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                        : 'bg-[#FF6A00] hover:bg-[#e55f00] text-white'
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    <span>
                      {currentUser.attendance_status === 'checked_in'
                        ? `Punch Out (${currentUser.full_name})`
                        : `Punch In Now (${currentUser.full_name})`}
                    </span>
                  </button>
                </div>
              </div>

              <div
                className={`grid grid-cols-1 ${
                  isSuperAdmin ? 'sm:grid-cols-2 lg:grid-cols-5' : 'sm:grid-cols-1 max-w-md'
                } gap-3 mt-4`}
              >
                {visibleMembers.map((m) => {
                  const isPresent = m.attendance_status === 'checked_in';
                  const isOnLeave = m.status === 'on_leave';
                  return (
                    <div
                      key={m.id}
                      className="p-3.5 rounded-xl border bg-white/15 border-[#FF6A00] flex flex-col justify-between gap-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-display text-xs font-bold text-white flex items-center gap-1">
                            <span>{m.full_name}</span>
                            {m.id === currentUser.id && (
                              <span className="px-1.5 py-0.2 rounded bg-[#FF6A00] text-white text-[9px] uppercase">
                                My ID #{m.id}
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-300 truncate">
                            {m.designation} · {m.department}
                          </div>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isOnLeave
                              ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                              : isPresent
                              ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30'
                              : 'bg-slate-500/30 text-slate-300'
                          }`}
                        >
                          {isOnLeave ? 'On Leave' : isPresent ? 'Present' : 'Checked Out'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[10px] text-slate-300">
                        <span>Last Punch: {m.last_check_in || '09:30 AM'}</span>
                        <button
                          type="button"
                          onClick={() => handleToggleAttendance(m.id)}
                          className="text-amber-300 hover:underline font-bold cursor-pointer"
                        >
                          {isPresent ? 'Mark Out' : 'Mark In'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2-Column Forms: Add/Edit My Daily Attendance + Apply/Edit My Leave */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Form 1: Add / Edit Daily Attendance */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="border-b border-slate-200 pb-4 mb-4 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-700 font-bold">
                      {editingAttId !== null
                        ? 'Editing My Attendance Entry'
                        : 'Daily Attendance Register'}
                    </span>
                    <h3 className="font-display text-lg font-extrabold text-[#0A2540] mt-0.5">
                      {editingAttId !== null
                        ? `Update Attendance (${attDate})`
                        : isSuperAdmin
                        ? 'Mark / Update Team Attendance'
                        : `Add / Update My Attendance (${currentUser.full_name})`}
                    </h3>
                  </div>
                  {editingAttId !== null && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingAttId(null);
                        setAttNotes('');
                      }}
                      className="px-3 py-1 rounded-lg bg-slate-100 text-xs font-bold text-slate-600 cursor-pointer"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>

                <form onSubmit={handleMarkDailyAttendance} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#0A2540] mb-1">
                        Team Member
                      </label>
                      <select
                        value={isSuperAdmin ? attMemberId : currentUser.id}
                        disabled={!isSuperAdmin}
                        onChange={(e) => setAttMemberId(Number(e.target.value))}
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-semibold bg-white disabled:bg-slate-100"
                      >
                        {visibleMembers.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.full_name} ({m.department})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0A2540] mb-1">
                        Attendance Date
                      </label>
                      <input
                        type="date"
                        required
                        value={attDate}
                        onChange={(e) => setAttDate(e.target.value)}
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#0A2540] mb-1">
                        Attendance Status
                      </label>
                      <select
                        value={attStatus}
                        onChange={(e) =>
                          setAttStatus(e.target.value as TeamAttendanceRecord['status'])
                        }
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-semibold bg-white"
                      >
                        <option value="present">✅ Present (Full Day)</option>
                        <option value="work_from_home">🏠 Work From Home (WFH)</option>
                        <option value="half_day">⏳ Half Day</option>
                        <option value="on_leave">🌴 On Leave</option>
                        <option value="absent">❌ Absent</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0A2540] mb-1">
                        Work Location / Mode
                      </label>
                      <select
                        value={attWorkMode}
                        onChange={(e) =>
                          setAttWorkMode(e.target.value as TeamAttendanceRecord['work_mode'])
                        }
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-semibold bg-white"
                      >
                        <option value="Office (Vaishali)">Office (Vaishali Sector 3)</option>
                        <option value="Remote / WFH">Remote / Work From Home</option>
                        <option value="Client Site Visit">Client Site Visit (Delhi NCR)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#0A2540] mb-1">
                        Check-In Time
                      </label>
                      <input
                        type="text"
                        value={attCheckInTime}
                        onChange={(e) => setAttCheckInTime(e.target.value)}
                        placeholder="09:30 AM"
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#0A2540] mb-1">
                        Check-Out Time
                      </label>
                      <input
                        type="text"
                        value={attCheckOutTime}
                        onChange={(e) => setAttCheckOutTime(e.target.value)}
                        placeholder="06:30 PM"
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0A2540] mb-1">
                      Daily Work Summary / Shift Notes
                    </label>
                    <input
                      type="text"
                      value={attNotes}
                      onChange={(e) => setAttNotes(e.target.value)}
                      placeholder="e.g. Completed WordPress service page & schema optimization..."
                      className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#0A2540] hover:bg-[#FF6A00] text-white font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>
                      {editingAttId !== null
                        ? 'Update My Attendance Record'
                        : 'Save My Daily Attendance'}
                    </span>
                  </button>
                </form>
              </div>

              {/* Form 2: Apply / Edit Leave Application */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="border-b border-slate-200 pb-4 mb-4 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#FF6A00] font-bold">
                      {editingLeaveId !== null
                        ? 'Editing My Leave Application'
                        : 'My Leave Application Desk'}
                    </span>
                    <h3 className="font-display text-lg font-extrabold text-[#0A2540] mt-0.5">
                      {editingLeaveId !== null
                        ? 'Update My Leave Request'
                        : `Apply for Leave (${currentUser.full_name})`}
                    </h3>
                  </div>
                  {editingLeaveId !== null && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingLeaveId(null);
                        setLeaveReason('');
                      }}
                      className="px-3 py-1 rounded-lg bg-slate-100 text-xs font-bold text-slate-600 cursor-pointer"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>

                <form onSubmit={handleApplyLeave} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#0A2540] mb-1">
                        Applicant Name
                      </label>
                      <select
                        value={isSuperAdmin ? leaveMemberId : currentUser.id}
                        disabled={!isSuperAdmin}
                        onChange={(e) => setLeaveMemberId(Number(e.target.value))}
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-semibold bg-white disabled:bg-slate-100"
                      >
                        {visibleMembers.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.full_name} ({m.designation})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0A2540] mb-1">
                        Leave Category
                      </label>
                      <select
                        value={leaveType}
                        onChange={(e) =>
                          setLeaveType(e.target.value as TeamLeaveRequest['leave_type'])
                        }
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-semibold bg-white"
                      >
                        <option value="Casual Leave (CL)">Casual Leave (CL)</option>
                        <option value="Sick / Medical Leave (SL)">
                          Sick / Medical Leave (SL)
                        </option>
                        <option value="Earned / Paid Leave (PL)">Earned / Paid Leave (PL)</option>
                        <option value="Half-Day Leave">Half-Day Leave</option>
                        <option value="Emergency Leave">Emergency Leave</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#0A2540] mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        required
                        value={leaveStartDate}
                        onChange={(e) => setLeaveStartDate(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#0A2540] mb-1">
                        End Date
                      </label>
                      <input
                        type="date"
                        required
                        value={leaveEndDate}
                        onChange={(e) => setLeaveEndDate(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#0A2540] mb-1">
                        Total Days
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="0.5"
                        max="30"
                        required
                        value={leaveTotalDays}
                        onChange={(e) => setLeaveTotalDays(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#0A2540] mb-1">
                        Work Handover To
                      </label>
                      <input
                        type="text"
                        value={leaveHandoverTo}
                        onChange={(e) => setLeaveHandoverTo(e.target.value)}
                        placeholder="e.g. Shiv Kumar"
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#0A2540] mb-1">
                        Emergency Contact Number
                      </label>
                      <input
                        type="text"
                        value={leaveEmergencyPhone}
                        onChange={(e) => setLeaveEmergencyPhone(e.target.value)}
                        placeholder="+91 8667666429"
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0A2540] mb-1">
                      Reason for Leave &amp; Project Handover Notes *
                    </label>
                    <input
                      type="text"
                      required
                      value={leaveReason}
                      onChange={(e) => setLeaveReason(e.target.value)}
                      placeholder="Explain reason for leave & status of active client deliverables..."
                      className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#FF6A00] hover:bg-[#e55f00] text-white font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>
                      {editingLeaveId !== null
                        ? 'Save Changes to My Leave Request'
                        : 'Submit My Leave Request'}
                    </span>
                  </button>
                </form>
              </div>
            </div>

            {/* Leave Requests List (Shows ONLY currentUser's leaves for team member; all for Admin) */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="font-display text-base font-bold text-[#0A2540]">
                    {isSuperAdmin
                      ? `All Team Leave Requests (${filteredLeaves.length})`
                      : `My Leave Applications (${filteredLeaves.length})`}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isSuperAdmin
                      ? 'Admin Mode: Approve, reject, edit, or delete any leave request.'
                      : 'Only your own leave applications are displayed here. You can edit or delete your leave requests.'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {(['all', 'pending', 'approved', 'rejected'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setLeaveFilterStatus(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize cursor-pointer ${
                        leaveFilterStatus === st
                          ? 'bg-[#0A2540] text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {st === 'all' ? `All (${visibleLeaveRequests.length})` : st}
                    </button>
                  ))}
                </div>
              </div>

              {filteredLeaves.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  No leave applications found for your account. Use the form above to apply for leave.
                </div>
              ) : (
                <div className="divide-y divide-slate-200">
                  {filteredLeaves.map((leave) => (
                    <div
                      key={leave.id}
                      className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-orange-50/20"
                    >
                      <div className="space-y-1.5 max-w-3xl flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-display text-sm font-extrabold text-[#0A2540]">
                            {leave.member_name}
                          </span>
                          <span className="text-xs text-slate-500">
                            ({leave.designation} · {leave.department})
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-[#FF6A00] text-[10px] font-bold">
                            {leave.leave_type}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              leave.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : leave.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {leave.status === 'pending'
                              ? '⏳ Pending Approval'
                              : leave.status === 'approved'
                              ? '✅ Approved'
                              : '❌ Rejected'}
                          </span>
                        </div>

                        <div className="text-xs font-bold text-[#0d6efd]">
                          📅 Duration: {leave.start_date} to {leave.end_date} ({leave.total_days}{' '}
                          {leave.total_days === 1 ? 'Day' : 'Days'}) · Handover:{' '}
                          <span className="text-[#0A2540]">{leave.handover_to_name}</span> ·
                          Emergency: {leave.emergency_contact}
                        </div>

                        <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200">
                          <strong>Reason:</strong> {leave.reason}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 pt-1">
                          <span className="text-[11px] text-slate-400">
                            Applied: {leave.applied_at}
                          </span>
                          {isSuperAdmin ? (
                            <input
                              type="text"
                              value={leave.admin_remark}
                              onChange={(e) =>
                                handleUpdateLeaveStatus(leave.id, leave.status, e.target.value)
                              }
                              placeholder="Admin approval/rejection remark..."
                              className="flex-1 min-w-[240px] px-3 py-1 bg-white border border-slate-300 rounded-lg text-xs text-slate-700"
                            />
                          ) : (
                            <span className="text-xs text-slate-600 font-medium">
                              Admin Status Note: <strong>{leave.admin_remark}</strong>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        {isSuperAdmin && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleUpdateLeaveStatus(leave.id, 'approved')}
                              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                                leave.status === 'approved'
                                  ? 'bg-emerald-600 text-white shadow'
                                  : 'bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200'
                              }`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleUpdateLeaveStatus(leave.id, 'rejected')}
                              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                                leave.status === 'rejected'
                                  ? 'bg-red-600 text-white shadow'
                                  : 'bg-red-50 hover:bg-red-600 text-red-700 hover:text-white border border-red-200'
                              }`}
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          </>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            setEditingLeaveId(leave.id);
                            setLeaveMemberId(leave.member_id);
                            setLeaveType(leave.leave_type);
                            setLeaveStartDate(leave.start_date);
                            setLeaveEndDate(leave.end_date);
                            setLeaveTotalDays(leave.total_days);
                            setLeaveReason(leave.reason);
                            setLeaveHandoverTo(leave.handover_to_name || '');
                            setLeaveEmergencyPhone(leave.emergency_contact || '');
                          }}
                          className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-[#0A2540] text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            updateLeaveRequests(leaveRequests.filter((l) => l.id !== leave.id))
                          }
                          className="px-3 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Daily Attendance Sheet / History Log (Shows ONLY currentUser's attendance unless Admin) */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="font-display text-base font-bold text-[#0A2540]">
                    {isSuperAdmin
                      ? `All Team Attendance Register (${filteredAttendance.length})`
                      : `My Attendance Register & Shift Logs (${filteredAttendance.length})`}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isSuperAdmin
                      ? 'Admin Mode: View, edit, or delete all team attendance entries.'
                      : 'Only your own attendance records are shown here. You can edit or delete any of your entries.'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  {isSuperAdmin && (
                    <select
                      value={attFilterMember}
                      onChange={(e) => setAttFilterMember(e.target.value)}
                      className="px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-semibold bg-white"
                    >
                      <option value="all">All Team Members</option>
                      {teamMembers.map((m) => (
                        <option key={m.id} value={String(m.id)}>
                          {m.full_name}
                        </option>
                      ))}
                    </select>
                  )}

                  <input
                    type="date"
                    value={attFilterDate === 'all' ? '' : attFilterDate}
                    onChange={(e) => setAttFilterDate(e.target.value || 'all')}
                    className="px-3 py-1.5 border border-slate-300 rounded-xl text-xs bg-white"
                  />
                  {attFilterDate !== 'all' && (
                    <button
                      type="button"
                      onClick={() => setAttFilterDate('all')}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-100 text-xs font-bold text-slate-700 cursor-pointer"
                    >
                      Show All Dates
                    </button>
                  )}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase">
                      <th className="py-3.5 px-4">Date</th>
                      <th className="py-3.5 px-4">Team Member</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Work Mode</th>
                      <th className="py-3.5 px-4">Check-In / Out</th>
                      <th className="py-3.5 px-4">Daily Work Notes</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredAttendance.map((record) => (
                      <tr key={record.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-[#0A2540] whitespace-nowrap">
                          {record.date}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-[#0A2540] flex items-center gap-1.5">
                            <span>{record.member_name}</span>
                            {record.member_id === currentUser.id && (
                              <span className="px-1.5 py-0.5 rounded bg-[#FF6A00] text-white text-[9px] uppercase">
                                My ID
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500">{record.department}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={record.status}
                            onChange={(e) => {
                              const nextSt = e.target.value as TeamAttendanceRecord['status'];
                              updateAttendanceLogs(
                                attendanceLogs.map((r) =>
                                  r.id === record.id ? { ...r, status: nextSt } : r
                                )
                              );
                            }}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border cursor-pointer ${
                              record.status === 'present'
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                                : record.status === 'work_from_home'
                                ? 'bg-blue-50 border-blue-200 text-blue-800'
                                : record.status === 'half_day'
                                ? 'bg-amber-50 border-amber-200 text-amber-800'
                                : 'bg-red-50 border-red-200 text-red-800'
                            }`}
                          >
                            <option value="present">Present</option>
                            <option value="work_from_home">WFH</option>
                            <option value="half_day">Half Day</option>
                            <option value="on_leave">On Leave</option>
                            <option value="absent">Absent</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-700 whitespace-nowrap">
                          {record.work_mode}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px] whitespace-nowrap">
                          <span className="text-emerald-700 font-bold">{record.check_in_time}</span>
                          {' → '}
                          <span className="text-slate-600">{record.check_out_time || '—'}</span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 max-w-xs">
                          <input
                            type="text"
                            value={record.notes}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateAttendanceLogs(
                                attendanceLogs.map((r) =>
                                  r.id === record.id ? { ...r, notes: val } : r
                                )
                              );
                            }}
                            className="w-full px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-xs"
                          />
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingAttId(record.id);
                                setAttMemberId(record.member_id);
                                setAttDate(record.date);
                                setAttStatus(record.status);
                                setAttWorkMode(record.work_mode);
                                setAttCheckInTime(record.check_in_time);
                                setAttCheckOutTime(record.check_out_time || '');
                                setAttNotes(record.notes);
                              }}
                              className="p-1.5 text-[#0A2540] hover:bg-slate-100 rounded-lg cursor-pointer"
                              title="Edit Attendance Entry"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                updateAttendanceLogs(
                                  attendanceLogs.filter((r) => r.id !== record.id)
                                )
                              }
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                              title="Delete Attendance Entry"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 1: PROJECT TASKS & ASSIGNMENTS (ONLY CURRENT USER OR ADMIN)
           =================================================================== */}
        {activeSubTab === 'tasks' && (
          <div className="space-y-6">
            {/* Add / Edit Project Task Form */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-base font-bold text-[#0A2540]">
                    {editingTaskId !== null
                      ? 'Edit My Task Details'
                      : isSuperAdmin
                      ? '+ Assign New Client Task to Team Member'
                      : `+ Add New Task to My Workspace (${currentUser.full_name})`}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {isSuperAdmin
                      ? 'Admin Mode: Create, edit, and delete tasks for any team member.'
                      : 'Only your own tasks are visible here. You can add new tasks, edit your tasks, update status, or delete them.'}
                  </p>
                </div>
                {editingTaskId !== null && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingTaskId(null);
                      setNewTaskTitle('');
                      setNewTaskClient('');
                      setNewTaskNotes('');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 text-xs font-bold text-slate-600 cursor-pointer"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <form
                onSubmit={handleSaveTask}
                className="mt-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3"
              >
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Task title (e.g. Homepage UI Redesign)"
                  className="lg:col-span-2 px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs"
                />
                <input
                  type="text"
                  value={newTaskClient}
                  onChange={(e) => setNewTaskClient(e.target.value)}
                  placeholder="Client / Company Name"
                  className="px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs"
                />
                <select
                  value={isSuperAdmin ? newTaskAssigneeId : currentUser.id}
                  disabled={!isSuperAdmin}
                  onChange={(e) => setNewTaskAssigneeId(Number(e.target.value))}
                  className="px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold bg-white disabled:bg-slate-100"
                >
                  {visibleMembers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.full_name} ({m.department})
                    </option>
                  ))}
                </select>
                <select
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value as TeamTask['priority'])}
                  className="px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold"
                >
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
                <input
                  type="date"
                  value={newTaskDueDate}
                  onChange={(e) => setNewTaskDueDate(e.target.value)}
                  className="px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs"
                />
                <input
                  type="text"
                  value={newTaskNotes}
                  onChange={(e) => setNewTaskNotes(e.target.value)}
                  placeholder="Task instructions, deliverables, or reference URL..."
                  className="md:col-span-2 lg:col-span-5 px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#FF6A00] hover:bg-[#e55f00] text-white font-bold text-xs rounded-xl cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>
                    {editingTaskId !== null
                      ? 'Save Task Changes'
                      : isSuperAdmin
                      ? 'Assign Task'
                      : 'Add My Task'}
                  </span>
                </button>
              </form>
            </div>

            {/* Filter & Task List (Strictly visibleTasks only) */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-display text-base font-bold text-[#0A2540]">
                    {isSuperAdmin
                      ? `All Team Tasks (${filteredTasks.length})`
                      : `My Assigned Tasks (${filteredTasks.length})`}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isSuperAdmin
                      ? 'Admin Mode: View and manage all team tasks.'
                      : `Showing ONLY tasks assigned to ${currentUser.full_name} (ID #${currentUser.id}). You can edit or delete any of your tasks.`}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={taskSearch}
                      onChange={(e) => setTaskSearch(e.target.value)}
                      placeholder="Search my tasks..."
                      className="pl-8 pr-3 py-1.5 border border-slate-300 rounded-xl text-xs"
                    />
                  </div>

                  {isSuperAdmin && (
                    <select
                      value={taskAssigneeFilter}
                      onChange={(e) => setTaskAssigneeFilter(e.target.value)}
                      className="px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-semibold"
                    >
                      <option value="all">All Team Members</option>
                      {teamMembers.map((m) => (
                        <option key={m.id} value={String(m.id)}>
                          {m.full_name}
                        </option>
                      ))}
                    </select>
                  )}

                  <select
                    value={taskStatusFilter}
                    onChange={(e) => setTaskStatusFilter(e.target.value)}
                    className="px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-semibold"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="review">In Review</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              {filteredTasks.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  No tasks found in your personal workspace. Add a new task using the form above.
                </div>
              ) : (
                <div className="divide-y divide-slate-200">
                  {filteredTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-orange-50/20 hover:bg-orange-50/40 transition-colors"
                    >
                      <div className="space-y-1.5 max-w-3xl flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-[#FF6A00] text-white text-[10px] font-bold uppercase">
                            {task.assigned_to_name}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              task.priority === 'high'
                                ? 'bg-red-100 text-red-700'
                                : task.priority === 'medium'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {task.priority} priority
                          </span>
                          <span className="text-xs font-bold text-[#0d6efd]">
                            {task.client_name}
                          </span>
                          <span className="text-xs text-slate-400">·</span>
                          <span className="text-xs text-slate-500">Due: {task.due_date}</span>
                        </div>

                        <h4 className="font-display text-base font-bold text-[#0A2540]">
                          {task.title}
                        </h4>

                        <input
                          type="text"
                          value={task.notes}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateTeamTasks(
                              teamTasks.map((t) =>
                                t.id === task.id ? { ...t, notes: val } : t
                              )
                            );
                          }}
                          placeholder="Update your task progress notes..."
                          className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-700"
                        />
                      </div>

                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <select
                          value={task.status}
                          onChange={(e) => {
                            const nextStatus = e.target.value as TeamTask['status'];
                            updateTeamTasks(
                              teamTasks.map((t) =>
                                t.id === task.id ? { ...t, status: nextStatus } : t
                              )
                            );
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
                            task.status === 'completed'
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                              : task.status === 'in_progress'
                              ? 'bg-blue-50 border-blue-300 text-blue-800'
                              : task.status === 'review'
                              ? 'bg-purple-50 border-purple-300 text-purple-800'
                              : 'bg-amber-50 border-amber-300 text-amber-800'
                          }`}
                        >
                          <option value="pending">⏳ Pending</option>
                          <option value="in_progress">⚡ In Progress</option>
                          <option value="review">🔍 Ready for Review</option>
                          <option value="completed">✅ Completed</option>
                        </select>

                        <button
                          type="button"
                          onClick={() => {
                            setEditingTaskId(task.id);
                            setNewTaskTitle(task.title);
                            setNewTaskClient(task.client_name);
                            setNewTaskProjectType(task.project_type);
                            setNewTaskAssigneeId(task.assigned_to_id);
                            setNewTaskPriority(task.priority);
                            setNewTaskDueDate(task.due_date);
                            setNewTaskNotes(task.notes);
                          }}
                          className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-[#0A2540] text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            updateTeamTasks(teamTasks.filter((t) => t.id !== task.id))
                          }
                          className="p-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 cursor-pointer"
                          title="Delete Task"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 2: TEAM DIRECTORY, ROLES & PASSWORDS (ONLY MY PROFILE FOR TEAM MEMBER)
           =================================================================== */}
        {activeSubTab === 'roster' && (
          <div className="space-y-6">
            {profileSavedMsg && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-bold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{profileSavedMsg}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setProfileSavedMsg('')}
                  className="text-emerald-700 hover:underline text-xs cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Profile Edit Form (Always available for logged-in member to edit their own profile, or Admin to add/edit any member) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-display text-base font-bold text-[#0A2540]">
                    {isSuperAdmin
                      ? editingMemberId !== null
                        ? `Edit Team Member Profile (${memberName})`
                        : '+ Add New Team Member & Assign Login Password (Admin)'
                      : `Edit My Personal Profile, Skills & Password (${currentUser.full_name})`}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {isSuperAdmin
                      ? 'Admin Mode: Create or update any team member profile, role, and login password.'
                      : 'Other team members are completely hidden. You can view and update your own profile details, phone, skills, and login password here.'}
                  </p>
                </div>
                {isSuperAdmin && editingMemberId !== null && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingMemberId(null);
                      setMemberName('');
                      setMemberDesignation('');
                      setMemberEmail('');
                      setMemberPhone('');
                      setMemberPin('Team@123');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 text-xs font-semibold text-slate-700 cursor-pointer"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <form
                onSubmit={handleSaveTeamMember}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
              >
                <input
                  type="text"
                  required
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  placeholder="Full Name"
                  className="px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs"
                />
                <input
                  type="text"
                  required
                  disabled={!isSuperAdmin}
                  value={memberDesignation}
                  onChange={(e) => setMemberDesignation(e.target.value)}
                  placeholder="Designation"
                  className="px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs disabled:bg-slate-100"
                />
                <select
                  value={memberDepartment}
                  disabled={!isSuperAdmin}
                  onChange={(e) =>
                    setMemberDepartment(e.target.value as TeamMember['department'])
                  }
                  className="px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold disabled:bg-slate-100"
                >
                  <option value="Management">Management</option>
                  <option value="Web Development">Web Development</option>
                  <option value="SEO & Digital Marketing">SEO &amp; Digital Marketing</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Sales & Support">Sales &amp; Support</option>
                </select>
                <select
                  value={memberRole}
                  disabled={!isSuperAdmin}
                  onChange={(e) => setMemberRole(e.target.value as TeamMember['role'])}
                  className="px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold disabled:bg-slate-100"
                >
                  <option value="developer">Developer</option>
                  <option value="seo_specialist">SEO Specialist</option>
                  <option value="team_lead">Team Lead</option>
                  <option value="sales_exec">Sales Executive</option>
                  <option value="admin">Admin</option>
                </select>
                <input
                  type="email"
                  required
                  disabled={!isSuperAdmin}
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  placeholder="Login Email"
                  className="px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs disabled:bg-slate-100"
                />
                <input
                  type="text"
                  value={memberPhone}
                  onChange={(e) => setMemberPhone(e.target.value)}
                  placeholder="Phone / WhatsApp (+91 ...)"
                  className="px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs"
                />
                <input
                  type="text"
                  required
                  value={memberPin}
                  onChange={(e) => setMemberPin(e.target.value)}
                  placeholder="Access Password / PIN"
                  className="px-3.5 py-2.5 border border-amber-400 bg-amber-50/40 rounded-xl text-xs font-mono font-bold text-[#0A2540]"
                />
                <input
                  type="text"
                  value={memberSkills}
                  onChange={(e) => setMemberSkills(e.target.value)}
                  placeholder="Skills (comma separated)"
                  className="px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs"
                />
                <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#0A2540] hover:bg-[#FF6A00] text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    {!isSuperAdmin || editingMemberId !== null
                      ? 'Save My Profile & Password'
                      : '+ Add Member to Team'}
                  </button>
                </div>
              </form>
            </div>

            {/* Profile Card(s) — Shows ONLY currentUser's own card for non-admin, or all for Admin */}
            <div
              className={`grid grid-cols-1 ${
                isSuperAdmin ? 'md:grid-cols-2 lg:grid-cols-3' : 'max-w-xl'
              } gap-5`}
            >
              {visibleMembers.map((member) => (
                <div
                  key={member.id}
                  className="bg-white border border-[#FF6A00] ring-2 ring-[#FF6A00]/15 rounded-2xl p-5 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0A2540] to-[#0096e8] text-white flex items-center justify-center font-display font-extrabold text-base shrink-0">
                          {member.full_name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .slice(0, 2)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-display text-base font-bold text-[#0A2540]">
                              {member.full_name}
                            </h4>
                            <span className="px-2 py-0.5 rounded bg-[#FF6A00] text-white text-[9px] font-bold uppercase">
                              ID #{member.id}
                            </span>
                          </div>
                          <p className="text-xs text-[#FF6A00] font-semibold">
                            {member.designation}
                          </p>
                          <span className="inline-block mt-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                            {member.department}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleAttendance(member.id)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase cursor-pointer ${
                          member.attendance_status === 'checked_in'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {member.attendance_status === 'checked_in' ? '● Online' : '○ Offline'}
                      </button>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Official Email:</span>
                        <span className="font-semibold text-[#0A2540]">{member.email}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Phone:</span>
                        <span className="tabular-nums">{member.phone}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">My Portal Password:</span>
                        <code className="px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-[#8B1E1E] font-mono font-bold text-[11px]">
                          {member.password_pin}
                        </code>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Last Check-In:</span>
                        <span className="text-[11px]">{member.last_check_in || 'Today'}</span>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {member.skills.map((sk, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-slate-100 text-[#0A2540] text-[10px] font-semibold"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingMemberId(member.id);
                        setMemberName(member.full_name);
                        setMemberDesignation(member.designation);
                        setMemberDepartment(member.department);
                        setMemberEmail(member.email);
                        setMemberPhone(member.phone);
                        setMemberPin(member.password_pin);
                        setMemberRole(member.role);
                        setMemberSkills(member.skills.join(', '));
                      }}
                      className="flex-1 py-2 px-3 rounded-xl bg-[#0A2540] hover:bg-[#FF6A00] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Load in Editor Above</span>
                    </button>
                    {isSuperAdmin && member.id !== 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          updateTeamMembers(teamMembers.filter((m) => m.id !== member.id))
                        }
                        className="p-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 cursor-pointer"
                        title="Remove Team Member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 3: CLIENT ENQUIRIES DESK (ONLY MY ASSIGNED / CREATED ENQUIRIES)
           =================================================================== */}
        {activeSubTab === 'leads' && (
          <div className="space-y-6">
            {/* Add / Edit Client Enquiry Form for Current Team Member */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-display text-base font-bold text-[#0A2540]">
                    {editingEnquiryId !== null
                      ? 'Edit My Client Enquiry / Follow-Up'
                      : `+ Add New Client Lead to My Desk (${currentUser.full_name})`}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {isSuperAdmin
                      ? 'Admin Mode: Add, assign, edit, or delete any client enquiry.'
                      : 'Only client enquiries assigned to or created by your Team ID are shown below. You can add, edit, or delete your own client leads.'}
                  </p>
                </div>
                {editingEnquiryId !== null && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingEnquiryId(null);
                      setEnqFullName('');
                      setEnqCompanyName('');
                      setEnqPhone('');
                      setEnqEmail('');
                      setEnqMessage('');
                      setEnqNotes('');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 text-xs font-bold text-slate-600 cursor-pointer"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <form
                onSubmit={handleSaveEnquiry}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
              >
                <input
                  type="text"
                  required
                  value={enqFullName}
                  onChange={(e) => setEnqFullName(e.target.value)}
                  placeholder="Client Full Name *"
                  className="px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs"
                />
                <input
                  type="text"
                  value={enqCompanyName}
                  onChange={(e) => setEnqCompanyName(e.target.value)}
                  placeholder="Company / Brand Name"
                  className="px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs"
                />
                <input
                  type="text"
                  required
                  value={enqPhone}
                  onChange={(e) => setEnqPhone(e.target.value)}
                  placeholder="Client Phone / WhatsApp *"
                  className="px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs"
                />
                <input
                  type="email"
                  value={enqEmail}
                  onChange={(e) => setEnqEmail(e.target.value)}
                  placeholder="Client Email"
                  className="px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs"
                />
                <input
                  type="text"
                  value={enqService}
                  onChange={(e) => setEnqService(e.target.value)}
                  placeholder="Service Interested"
                  className="px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs"
                />
                <input
                  type="text"
                  value={enqBudget}
                  onChange={(e) => setEnqBudget(e.target.value)}
                  placeholder="Estimated Budget"
                  className="px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs"
                />
                <select
                  value={isSuperAdmin ? enqAssigneeId : currentUser.id}
                  disabled={!isSuperAdmin}
                  onChange={(e) => setEnqAssigneeId(Number(e.target.value))}
                  className="px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold bg-white disabled:bg-slate-100"
                >
                  {visibleMembers.map((m) => (
                    <option key={m.id} value={m.id}>
                      Owner: {m.full_name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={enqNotes}
                  onChange={(e) => setEnqNotes(e.target.value)}
                  placeholder="Follow-up note / status remark"
                  className="px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs"
                />
                <input
                  type="text"
                  value={enqMessage}
                  onChange={(e) => setEnqMessage(e.target.value)}
                  placeholder="Client requirement summary..."
                  className="sm:col-span-2 lg:col-span-3 px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#FF6A00] hover:bg-[#e55f00] text-white font-bold text-xs rounded-xl cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>
                    {editingEnquiryId !== null ? 'Save Lead Changes' : 'Add Lead to My Desk'}
                  </span>
                </button>
              </form>
            </div>

            {/* Strictly Scoped Client Enquiries List */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-display text-base font-bold text-[#0A2540]">
                    {isSuperAdmin
                      ? `All Client Enquiries (${visibleEnquiries.length})`
                      : `My Assigned Client Enquiries (${visibleEnquiries.length})`}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isSuperAdmin
                      ? 'Admin Mode: View and manage all client leads.'
                      : `Showing ONLY enquiries assigned to ${currentUser.full_name} (ID #${currentUser.id}). Other team members' leads are hidden.`}
                  </p>
                </div>
              </div>

              {visibleEnquiries.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  No client enquiries assigned to your ID yet. You can add a new client lead above.
                </div>
              ) : (
                <div className="divide-y divide-slate-200">
                  {visibleEnquiries.map((enq) => (
                    <div key={enq.id} className="p-5 space-y-3 bg-orange-50/15">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-display text-base font-bold text-[#0A2540]">
                              {enq.full_name}
                            </span>
                            <span className="text-xs text-slate-500">
                              ({enq.company_name || 'Direct'})
                            </span>
                            <span className="px-2 py-0.5 rounded bg-[#0A2540] text-white text-[10px] font-bold">
                              Assigned: {enq.assigned_to_name || currentUser.full_name}
                            </span>
                          </div>
                          <div className="text-xs text-slate-600 mt-0.5">
                            {enq.phone} · {enq.email} ·{' '}
                            <strong className="text-[#FF6A00]">{enq.service_interested}</strong> ·{' '}
                            {enq.budget_range}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <a
                            href={`tel:${enq.phone.replace(/[^0-9+]/g, '')}`}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-1"
                          >
                            <Phone className="w-3.5 h-3.5" /> Call
                          </a>

                          <select
                            value={enq.status}
                            onChange={(e) => {
                              const nextStatus = e.target.value as ContactEnquiry['status'];
                              updateEnquiries(
                                allEnquiries.map((item) =>
                                  item.id === enq.id ? { ...item, status: nextStatus } : item
                                )
                              );
                            }}
                            className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold capitalize cursor-pointer"
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="qualified">Qualified</option>
                            <option value="proposal_sent">Proposal Sent</option>
                            <option value="closed_won">Closed Won</option>
                          </select>

                          <button
                            type="button"
                            onClick={() => {
                              setEditingEnquiryId(enq.id);
                              setEnqFullName(enq.full_name);
                              setEnqCompanyName(enq.company_name);
                              setEnqPhone(enq.phone);
                              setEnqEmail(enq.email);
                              setEnqService(enq.service_interested);
                              setEnqBudget(enq.budget_range);
                              setEnqMessage(enq.message);
                              setEnqNotes(enq.admin_notes);
                              setEnqAssigneeId(enq.assigned_to_id || currentUser.id);
                            }}
                            className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-[#0A2540] text-xs font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              updateEnquiries(allEnquiries.filter((item) => item.id !== enq.id))
                            }
                            className="p-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 cursor-pointer"
                            title="Delete Lead"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-slate-700 bg-white p-3.5 rounded-xl border border-slate-200">
                        {enq.message}
                      </p>

                      <input
                        type="text"
                        value={enq.admin_notes}
                        onChange={(e) => {
                          const notes = e.target.value;
                          updateEnquiries(
                            allEnquiries.map((item) =>
                              item.id === enq.id ? { ...item, admin_notes: notes } : item
                            )
                          );
                        }}
                        placeholder="Add your follow-up remark..."
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 4: MY PASSWORD & QUICK PUNCH (ONLY LOGGED-IN USER)
           =================================================================== */}
        {activeSubTab === 'security' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="font-display text-base font-bold text-[#0A2540]">
                Update My Team Portal Password / PIN
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Logged in account: <strong>{currentUser.full_name}</strong> (ID #{currentUser.id} ·{' '}
                {currentUser.email})
              </p>

              {pinSavedMsg && (
                <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{pinSavedMsg}</span>
                </div>
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newPersonalPin.trim() || newPersonalPin.trim().length < 4) return;
                  updateTeamMembers(
                    teamMembers.map((m) =>
                      m.id === currentUser.id
                        ? { ...m, password_pin: newPersonalPin.trim() }
                        : m
                    )
                  );
                  setPinSavedMsg('Your Personal Team Portal password has been updated!');
                  setNewPersonalPin('');
                }}
                className="mt-4 space-y-4"
              >
                <div>
                  <label className="block text-xs font-bold text-[#0A2540] mb-1">
                    My Current Password PIN
                  </label>
                  <input
                    type="text"
                    disabled
                    value={currentUser.password_pin}
                    className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0A2540] mb-1">
                    New Password / PIN (Min 4 characters)
                  </label>
                  <input
                    type="text"
                    required
                    value={newPersonalPin}
                    onChange={(e) => setNewPersonalPin(e.target.value)}
                    placeholder="Enter new secret password..."
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#FF6A00] hover:bg-[#e55f00] text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  Save My New Password
                </button>
              </form>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="font-display text-base font-bold text-[#0A2540]">
                {isSuperAdmin
                  ? 'All Team Quick Punch Control (Admin)'
                  : `My Quick Punch & Shift Status (${currentUser.full_name})`}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {isSuperAdmin
                  ? 'Admin Mode: Toggle Check-In / Check-Out for any team member.'
                  : 'Only your own shift status is shown here. Click to Punch In or Punch Out.'}
              </p>

              <div className="mt-4 space-y-2.5">
                {visibleMembers.map((m) => (
                  <div
                    key={m.id}
                    className="p-4 rounded-xl border border-[#FF6A00] bg-orange-50/30 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-display text-sm font-bold text-[#0A2540] flex items-center gap-1.5">
                        <span>{m.full_name}</span>
                        <span className="px-1.5 py-0.5 rounded bg-[#FF6A00] text-white text-[9px] uppercase">
                          ID #{m.id}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 mt-0.5">
                        {m.designation} · {m.department}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Last Punch: {m.last_check_in || 'Today'}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleAttendance(m.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer shadow-sm ${
                        m.attendance_status === 'checked_in'
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-[#0A2540] hover:bg-[#FF6A00] text-white'
                      }`}
                    >
                      {m.attendance_status === 'checked_in'
                        ? 'Checked In (Click to Punch Out)'
                        : 'Checked Out (Click to Punch In)'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
