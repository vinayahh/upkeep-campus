/**
 * UPKEEP - Campus Maintenance & Issue Management Platform
 * Application Core & View Controller
 */

// ==========================================================================
// STATE MANAGEMENT & LOCAL STORAGE
// ==========================================================================

let state = {
  currentUser: INITIAL_DATA.currentUser,
  users: INITIAL_DATA.users,
  categories: INITIAL_DATA.categories,
  locations: INITIAL_DATA.locations,
  issues: INITIAL_DATA.issues,
  notifications: INITIAL_DATA.notifications,
  currentView: "student_dashboard", // Views: student_dashboard, report_wizard, my_issues, issue_detail, staff_dashboard, admin_overview, admin_issues, admin_staff, admin_locations, admin_analytics, login
  selectedIssueId: null,
  
  // Wizard Transient State
  wizardStep: 1,
  wizardData: {
    category: "",
    building: "Block A",
    floor: "2nd Floor",
    room: "Room S204",
    title: "",
    description: "",
    photoUrl: "",
    priority: "medium"
  },

  // Filters
  myIssuesFilter: { status: "all", category: "all", search: "" },
  staffTaskFilter: "assigned_all",
  adminIssuesFilter: { status: "all", priority: "all", search: "" }
};

function filterStaffTasks(filterKey) {
  state.staffTaskFilter = filterKey;
  state.currentView = "staff_dashboard";
  window.scrollTo({ top: 0, behavior: 'smooth' });
  render();
}

function filterAdminIssues(statusKey) {
  state.adminIssuesFilter.status = statusKey;
  state.currentView = "admin_issues";
  window.scrollTo({ top: 0, behavior: 'smooth' });
  render();
}

// Initialize State from LocalStorage if available
function loadSavedState() {
  const saved = localStorage.getItem("upkeep_state_v1");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      state.issues = parsed.issues || INITIAL_DATA.issues;
      state.notifications = parsed.notifications || INITIAL_DATA.notifications;
      state.users = parsed.users || INITIAL_DATA.users;
      state.locations = parsed.locations || INITIAL_DATA.locations;
    } catch (e) {
      console.warn("Failed to load local storage state, using defaults.");
    }
  }
}

function saveState() {
  localStorage.setItem("upkeep_state_v1", JSON.stringify({
    issues: state.issues,
    notifications: state.notifications,
    users: state.users,
    locations: state.locations
  }));
}

function resetDemoData() {
  localStorage.removeItem("upkeep_state_v1");
  state.issues = JSON.parse(JSON.stringify(INITIAL_DATA.issues));
  state.notifications = JSON.parse(JSON.stringify(INITIAL_DATA.notifications));
  state.users = JSON.parse(JSON.stringify(INITIAL_DATA.users));
  state.locations = JSON.parse(JSON.stringify(INITIAL_DATA.locations));
  showToast("Demo data successfully reset to initial state!");
  render();
}

// ==========================================================================
// SVG ICON UTILITY
// ==========================================================================

function getIconSvg(name, size = 18, color = "currentColor") {
  const icons = {
    "zap": `<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>`,
    "droplet": `<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>`,
    "armchair": `<path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3M3 11v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2zM5 18v2M19 18v2"></path>`,
    "wifi": `<path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"></path>`,
    "wind": `<path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2M9.6 4.6A2 2 0 1 1 11 8H2M12.6 19.4A2 2 0 1 0 14 16H2"></path>`,
    "monitor": `<rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line>`,
    "bath": `<path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-2.12 0 1.5 1.5 0 0 0 0 2.12L7 8M2 12h20v4a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5v-4z"></path>`,
    "book-open": `<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>`,
    "help-circle": `<circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line>`,
    "check-circle": `<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>`,
    "clock": `<circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>`,
    "alert-triangle": `<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>`,
    "alert-circle": `<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>`,
    "wrench": `<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>`,
    "plus": `<line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>`,
    "search": `<circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>`,
    "filter": `<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>`,
    "arrow-right": `<line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline>`,
    "arrow-left": `<line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline>`,
    "refresh-cw": `<polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>`,
    "map-pin": `<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>`,
    "building": `<rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="9" y1="6" x2="9" y2="6.01"></line><line x1="15" y1="6" x2="15" y2="6.01"></line><line x1="9" y1="10" x2="9" y2="10.01"></line><line x1="15" y1="10" x2="15" y2="10.01"></line><line x1="9" y1="14" x2="9" y2="14.01"></line><line x1="15" y1="14" x2="15" y2="14.01"></line><line x1="9" y1="18" x2="15" y2="18"></line>`,
    "user": `<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>`,
    "bar-chart-2": `<line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line>`,
    "bell": `<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path>`,
    "x": `<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>`,
    "chevron-right": `<polyline points="9 18 15 12 9 6"></polyline>`
  };

  const path = icons[name] || icons["help-circle"];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon">${path}</svg>`;
}

// ==========================================================================
// TOAST NOTIFICATIONS
// ==========================================================================

function showToast(message, type = "success") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    ${type === 'success' ? getIconSvg('check-circle', 18, '#10B981') : getIconSvg('alert-circle', 18, '#EF4444')}
    <span>${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(20px)";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ==========================================================================
// ROLE SWITCHING & AUTH
// ==========================================================================

function switchRole(roleName) {
  if (roleName === "student") {
    state.currentUser = state.users.find(u => u.role === "student");
    state.currentView = "student_dashboard";
  } else if (roleName === "staff") {
    state.currentUser = state.users.find(u => u.role === "staff");
    state.currentView = "staff_dashboard";
  } else if (roleName === "admin") {
    state.currentUser = state.users.find(u => u.role === "admin");
    state.currentView = "admin_overview";
  }
  showToast(`Switched user role to ${state.currentUser.name} (${state.currentUser.role.toUpperCase()})`);
  render();
}

function navigateTo(viewName, issueId = null) {
  state.currentView = viewName;
  if (issueId) state.selectedIssueId = issueId;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  render();
}

// ==========================================================================
// AI ASSISTANT SIMULATOR (Keyword Intelligence)
// ==========================================================================

function runAIAssistantCheck(text) {
  if (!text || text.length < 5) return null;
  const lower = text.toLowerCase();
  
  let suggestedCat = null;
  let suggestedPriority = null;

  if (lower.includes("projector") || lower.includes("screen") || lower.includes("monitor") || lower.includes("display") || lower.includes("computer")) {
    suggestedCat = "Equipment";
    suggestedPriority = "high";
  } else if (lower.includes("wifi") || lower.includes("wi-fi") || lower.includes("network") || lower.includes("internet") || lower.includes("router")) {
    suggestedCat = "Wi-Fi / Network";
    suggestedPriority = "medium";
  } else if (lower.includes("ac") || lower.includes("air condition") || lower.includes("fan") || lower.includes("cooling") || lower.includes("heating")) {
    suggestedCat = "AC / Fan";
    suggestedPriority = lower.includes("leak") ? "emergency" : "medium";
  } else if (lower.includes("water") || lower.includes("leak") || lower.includes("sink") || lower.includes("toilet") || lower.includes("pipe")) {
    suggestedCat = "Plumbing";
    suggestedPriority = "high";
  } else if (lower.includes("light") || lower.includes("spark") || lower.includes("power") || lower.includes("wire") || lower.includes("socket")) {
    suggestedCat = "Electrical";
    suggestedPriority = lower.includes("spark") ? "emergency" : "high";
  } else if (lower.includes("desk") || lower.includes("chair") || lower.includes("bench") || lower.includes("table")) {
    suggestedCat = "Furniture";
    suggestedPriority = "low";
  }

  if (suggestedCat) {
    return { category: suggestedCat, priority: suggestedPriority };
  }
  return null;
}

// ==========================================================================
// DUPLICATE ISSUE DETECTION ENGINE
// ==========================================================================

function checkForDuplicateIssues(building, room, category) {
  return state.issues.find(issue => 
    issue.status !== "resolved" &&
    issue.building === building &&
    issue.room === room &&
    (issue.category === category || issue.category.includes(category))
  );
}

// ==========================================================================
// VIEW RENDERERS
// ==========================================================================

function renderHeader() {
  const user = state.currentUser;
  const unreadCount = state.notifications.filter(n => n.userId === user.id && !n.read).length;

  return `
    <div class="top-demo-bar">
      <span>🚀 <strong>UPKEEP SaaS Demo Platform</strong> — Role-based maintenance workflow</span>
      <div class="demo-pills">
        <span style="margin-right: 4px; font-weight: 600;">Switch Demo Role:</span>
        <button class="demo-role-btn ${user.role === 'student' ? 'active' : ''}" onclick="switchRole('student')">
          <span class="role-dot"></span> Student (Alex)
        </button>
        <button class="demo-role-btn ${user.role === 'staff' ? 'active' : ''}" onclick="switchRole('staff')">
          <span class="role-dot"></span> Staff (Arun)
        </button>
        <button class="demo-role-btn ${user.role === 'admin' ? 'active' : ''}" onclick="switchRole('admin')">
          <span class="role-dot"></span> Admin (Sarah)
        </button>
        <button class="demo-role-btn" style="background: rgba(239, 68, 68, 0.2);" onclick="resetDemoData()">
          Reset Demo
        </button>
      </div>
    </div>

    <header class="main-header">
      <div class="brand-logo" onclick="navigateTo('${user.role === 'student' ? 'student_dashboard' : user.role === 'staff' ? 'staff_dashboard' : 'admin_overview'}')">
        <div class="logo-icon-box">
          ${getIconSvg('wrench', 22, '#FFFFFF')}
        </div>
        <div class="logo-text-group">
          <span class="logo-title">UPKEEP</span>
          <span class="logo-tagline">Report. Resolve. Improve.</span>
        </div>
      </div>

      <nav class="nav-links">
        ${user.role === 'student' ? `
          <div class="nav-item ${state.currentView === 'student_dashboard' ? 'active' : ''}" onclick="navigateTo('student_dashboard')">
            ${getIconSvg('building', 18)} Home
          </div>
          <div class="nav-item ${state.currentView === 'my_issues' ? 'active' : ''}" onclick="navigateTo('my_issues')">
            ${getIconSvg('wrench', 18)} My Issues
          </div>
          <button class="btn btn-primary btn-sm" onclick="startNewWizard()">
            ${getIconSvg('plus', 16)} Report Issue
          </button>
        ` : user.role === 'staff' ? `
          <div class="nav-item ${state.currentView === 'staff_dashboard' ? 'active' : ''}" onclick="navigateTo('staff_dashboard')">
            ${getIconSvg('wrench', 18)} My Tasks
          </div>
        ` : `
          <div class="nav-item ${state.currentView === 'admin_overview' ? 'active' : ''}" onclick="navigateTo('admin_overview')">
            ${getIconSvg('bar-chart-2', 18)} Overview
          </div>
          <div class="nav-item ${state.currentView === 'admin_issues' ? 'active' : ''}" onclick="navigateTo('admin_issues')">
            ${getIconSvg('wrench', 18)} All Issues
          </div>
          <div class="nav-item ${state.currentView === 'admin_staff' ? 'active' : ''}" onclick="navigateTo('admin_staff')">
            ${getIconSvg('user', 18)} Staff
          </div>
          <div class="nav-item ${state.currentView === 'admin_locations' ? 'active' : ''}" onclick="navigateTo('admin_locations')">
            ${getIconSvg('map-pin', 18)} Locations
          </div>
          <div class="nav-item ${state.currentView === 'admin_analytics' ? 'active' : ''}" onclick="navigateTo('admin_analytics')">
            ${getIconSvg('bar-chart-2', 18)} Analytics
          </div>
        `}
      </nav>

      <div class="header-actions">
        <button class="notification-btn" onclick="toggleNotificationDrawer()">
          ${getIconSvg('bell', 20)}
          ${unreadCount > 0 ? `<span class="notification-badge">${unreadCount}</span>` : ''}
        </button>
        <div class="user-profile-btn" onclick="navigateTo('login')">
          <img src="${user.avatar}" class="user-avatar" alt="Avatar"/>
          <span class="user-name">${user.name}</span>
          <span class="user-role-badge ${user.role}">${user.role}</span>
        </div>
      </div>
    </header>
  `;
}

// --------------------------------------------------------------------------
// STUDENT DASHBOARD
// --------------------------------------------------------------------------

function renderStudentDashboard() {
  const user = state.currentUser;
  const userIssues = state.issues.filter(i => i.reportedBy === user.name || i.reporterEmail === user.email);
  
  const allCount = userIssues.length;
  const openCount = userIssues.filter(i => i.status === 'reported' || i.status === 'under_review').length;
  const progressCount = userIssues.filter(i => i.status === 'assigned' || i.status === 'in_progress' || i.status === 'reopened').length;
  const resolvedCount = userIssues.filter(i => i.status === 'resolved').length;

  return `
    <div class="content-area">
      <!-- Welcome Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px;">
        <div>
          <h1 style="font-size: 1.75rem; margin-bottom: 4px;">Good morning, ${user.name} 👋</h1>
          <p style="color: var(--text-muted);">Let's keep your campus running smoothly.</p>
        </div>
        <button class="btn btn-primary btn-lg" onclick="startNewWizard()">
          ${getIconSvg('plus', 20)} Report an Issue
        </button>
      </div>

      <!-- Campus Pulse Banner -->
      <div class="campus-pulse-card">
        <div class="pulse-content">
          <h3>${getIconSvg('zap', 20, '#60A5FA')} Campus Pulse</h3>
          <p style="color: #CBD5E1; max-width: 480px; font-size: 0.9rem;">
            Real-time status of campus facilities. Issues reported by students are handled directly by specialized engineering teams.
          </p>
          <div class="pulse-stats">
            <div class="pulse-stat-item">
              <span class="pulse-num">92%</span>
              <span class="pulse-label">Resolution Rate</span>
            </div>
            <div class="pulse-stat-item">
              <span class="pulse-num">${state.issues.filter(i => i.status !== 'resolved').length}</span>
              <span class="pulse-label">Active Campus Tasks</span>
            </div>
            <div class="pulse-stat-item">
              <span class="pulse-num">1.8 days</span>
              <span class="pulse-label">Avg Resolution Time</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Metric Cards -->
      <div class="metrics-grid">
        <div class="metric-card ${state.currentView === 'my_issues' && state.myIssuesFilter.status === 'all' ? 'active' : ''}" onclick="filterMyIssues('all')">
          <div class="metric-info">
            <div style="display: flex; align-items: center; gap: 6px;">
              <h4>All Issues</h4>
              <span class="metric-arrow">${getIconSvg('chevron-right', 14, 'var(--text-subtle)')}</span>
            </div>
            <div class="metric-value">${allCount}</div>
          </div>
          <div class="metric-icon-box" style="background: #F1F5F9; color: #475569;">
            ${getIconSvg('wrench', 24, '#475569')}
          </div>
        </div>

        <div class="metric-card ${state.currentView === 'my_issues' && state.myIssuesFilter.status === 'open' ? 'active' : ''}" onclick="filterMyIssues('open')">
          <div class="metric-info">
            <div style="display: flex; align-items: center; gap: 6px;">
              <h4>Open Issues</h4>
              <span class="metric-arrow">${getIconSvg('chevron-right', 14, 'var(--text-subtle)')}</span>
            </div>
            <div class="metric-value">${openCount}</div>
          </div>
          <div class="metric-icon-box" style="background: #FEF3C7; color: #D97706;">
            ${getIconSvg('alert-circle', 24, '#D97706')}
          </div>
        </div>

        <div class="metric-card ${state.currentView === 'my_issues' && state.myIssuesFilter.status === 'in_progress' ? 'active' : ''}" onclick="filterMyIssues('in_progress')">
          <div class="metric-info">
            <div style="display: flex; align-items: center; gap: 6px;">
              <h4>In Progress</h4>
              <span class="metric-arrow">${getIconSvg('chevron-right', 14, 'var(--text-subtle)')}</span>
            </div>
            <div class="metric-value">${progressCount}</div>
          </div>
          <div class="metric-icon-box" style="background: #E0F2FE; color: #0284C7;">
            ${getIconSvg('clock', 24, '#0284C7')}
          </div>
        </div>

        <div class="metric-card ${state.currentView === 'my_issues' && state.myIssuesFilter.status === 'resolved' ? 'active' : ''}" onclick="filterMyIssues('resolved')">
          <div class="metric-info">
            <div style="display: flex; align-items: center; gap: 6px;">
              <h4>Resolved</h4>
              <span class="metric-arrow">${getIconSvg('chevron-right', 14, 'var(--text-subtle)')}</span>
            </div>
            <div class="metric-value">${resolvedCount}</div>
          </div>
          <div class="metric-icon-box" style="background: #DCFCE7; color: #16A34A;">
            ${getIconSvg('check-circle', 24, '#16A34A')}
          </div>
        </div>
      </div>

      <!-- Recent Reports Section -->
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h3 style="font-size: 1.1rem;">My Recent Reports</h3>
          <button class="btn btn-secondary btn-sm" onclick="navigateTo('my_issues')">View All Issues (${userIssues.length})</button>
        </div>

        ${userIssues.length === 0 ? `
          <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
            ${getIconSvg('check-circle', 40, '#10B981')}
            <h4 style="margin-top: 12px; margin-bottom: 6px;">No issues reported yet</h4>
            <p style="font-size: 0.88rem; margin-bottom: 16px;">Everything looks good! Report any campus issues when you spot them.</p>
            <button class="btn btn-primary btn-sm" onclick="startNewWizard()">+ Report an Issue</button>
          </div>
        ` : `
          <div style="display: flex; flex-direction: column; gap: 12px;">
            ${userIssues.slice(0, 4).map(issue => `
              <div class="card card-hover" style="padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; cursor: pointer;" onclick="navigateTo('issue_detail', '${issue.id}')">
                <div style="display: flex; align-items: center; gap: 16px;">
                  <div style="background: var(--primary-light); width: 44px; height: 44px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center;">
                    ${getIconSvg('wrench', 20, 'var(--primary)')}
                  </div>
                  <div>
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                      <span style="font-weight: 700; font-size: 0.95rem;">${issue.title}</span>
                      <span class="priority-badge ${issue.priority}">${issue.priority.toUpperCase()}</span>
                    </div>
                    <div style="font-size: 0.8rem; color: var(--text-muted);">
                      <span style="font-weight: 600;">${issue.ticketId}</span> · ${issue.category} · ${issue.building}, ${issue.room}
                    </div>
                  </div>
                </div>
                <div style="display: flex; align-items: center; gap: 16px;">
                  <span class="status-pill ${issue.status}">${issue.status.replace('_', ' ')}</span>
                  ${getIconSvg('chevron-right', 18, 'var(--text-subtle)')}
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    </div>
  `;
}

// --------------------------------------------------------------------------
// MULTI-STEP REPORT AN ISSUE WIZARD
// --------------------------------------------------------------------------

function startNewWizard() {
  state.wizardStep = 1;
  state.wizardData = {
    category: "",
    building: "Block A",
    floor: "2nd Floor",
    room: "Room S204",
    title: "",
    description: "",
    photoUrl: "",
    priority: "medium"
  };
  navigateTo("report_wizard");
}

function setWizardCategory(catName) {
  state.wizardData.category = catName;
  state.wizardStep = 2;
  render();
}

function selectPresetPhoto(photoUrl) {
  state.wizardData.photoUrl = photoUrl;
  render();
}

function handleWizardDescriptionInput(title, desc) {
  state.wizardData.title = title;
  state.wizardData.description = desc;
  
  // AI keyword auto-detection check
  const suggestion = runAIAssistantCheck(`${title} ${desc}`);
  const aiBox = document.getElementById("aiSuggestionContainer");
  
  if (suggestion && aiBox) {
    aiBox.innerHTML = `
      <div class="ai-suggestion-box">
        <div>
          <div class="ai-suggestion-title">${getIconSvg('zap', 14)} AI Smart Suggestion</div>
          <div style="font-size: 0.82rem; color: var(--text-main); margin-top: 2px;">
            Suggested Category: <strong>${suggestion.category}</strong> | Suggested Priority: <strong style="text-transform: capitalize;">${suggestion.priority}</strong>
          </div>
        </div>
        <button class="btn btn-soft btn-sm" onclick="applyAISuggestion('${suggestion.category}', '${suggestion.priority}')">Apply Suggestion</button>
      </div>
    `;
  }
}

function applyAISuggestion(cat, prio) {
  state.wizardData.category = cat;
  state.wizardData.priority = prio;
  showToast(`Applied AI suggestion: Category (${cat}), Priority (${prio.toUpperCase()})`);
  render();
}

function proceedWizardNext() {
  if (state.wizardStep === 2) {
    state.wizardStep = 3;
  } else if (state.wizardStep === 3) {
    if (!state.wizardData.title) {
      showToast("Please enter an issue title before proceeding.", "error");
      return;
    }
    // Check for duplicate issue
    const duplicate = checkForDuplicateIssues(state.wizardData.building, state.wizardData.room, state.wizardData.category);
    if (duplicate) {
      openDuplicateModal(duplicate);
      return;
    }
    state.wizardStep = 4;
  } else if (state.wizardStep === 4) {
    state.wizardStep = 5;
  } else if (state.wizardStep === 5) {
    state.wizardStep = 6; // Summary / Submit
  }
  render();
}

function submitIssueWizard() {
  const newTicketId = `UPK-${1025 + state.issues.length}`;
  const newIssue = {
    id: newTicketId,
    ticketId: newTicketId,
    title: state.wizardData.title,
    description: state.wizardData.description || "No description provided.",
    category: state.wizardData.category || "Other",
    building: state.wizardData.building,
    floor: state.wizardData.floor,
    room: state.wizardData.room,
    priority: state.wizardData.priority,
    status: "reported",
    reportedBy: state.currentUser.name,
    reporterEmail: state.currentUser.email,
    assignedToId: null,
    assignedToName: "Unassigned",
    photoUrl: state.wizardData.photoUrl || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    resolutionConfirmed: null,
    updates: [
      { id: "u1", author: state.currentUser.name, role: "Student", message: "Issue submitted by student.", timestamp: new Date().toISOString() }
    ]
  };

  state.issues.unshift(newIssue);
  
  // Add notification
  state.notifications.unshift({
    id: `n_${Date.now()}`,
    userId: state.currentUser.id,
    ticketId: newTicketId,
    icon: "alert-circle",
    title: "Issue Submitted Successfully",
    message: `Your issue ${newTicketId} has been logged and sent to facilities admin.`,
    read: false,
    timestamp: new Date().toISOString()
  });

  saveState();
  showToast(`✓ Ticket ${newTicketId} created successfully!`);
  navigateTo("issue_detail", newTicketId);
}

function renderReportWizard() {
  const data = state.wizardData;
  const step = state.wizardStep;

  return `
    <div class="content-area">
      <div class="wizard-container">
        <div class="wizard-header">
          <h2>Report a Campus Problem</h2>
          <p style="color: var(--text-muted); font-size: 0.9rem;">Fill in the details below to submit a ticket to maintenance staff.</p>
        </div>

        <!-- Progress Steps Bar -->
        <div class="wizard-steps-bar">
          <div class="step-indicator ${step >= 1 ? (step > 1 ? 'completed' : 'active') : ''}">1</div>
          <div class="step-indicator ${step >= 2 ? (step > 2 ? 'completed' : 'active') : ''}">2</div>
          <div class="step-indicator ${step >= 3 ? (step > 3 ? 'completed' : 'active') : ''}">3</div>
          <div class="step-indicator ${step >= 4 ? (step > 4 ? 'completed' : 'active') : ''}">4</div>
          <div class="step-indicator ${step >= 5 ? (step > 5 ? 'completed' : 'active') : ''}">5</div>
        </div>

        <div class="card">
          ${step === 1 ? `
            <h3 style="margin-bottom: 8px;">Step 1 — What is the category?</h3>
            <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 20px;">Select the category that best fits the issue.</p>

            <div class="category-grid">
              ${state.categories.map(cat => `
                <div class="category-card ${data.category === cat.name ? 'selected' : ''}" onclick="setWizardCategory('${cat.name}')">
                  <div class="category-icon">
                    ${getIconSvg(cat.icon, 24)}
                  </div>
                  <div class="category-title">${cat.name}</div>
                  <div class="category-desc">${cat.description}</div>
                </div>
              `).join('')}
            </div>
          ` : step === 2 ? `
            <h3 style="margin-bottom: 8px;">Step 2 — Where is the problem located?</h3>
            <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 20px;">Provide exact location details so maintenance can find it.</p>

            <div class="form-group">
              <label class="form-label">Building</label>
              <select class="form-control" onchange="state.wizardData.building = this.value; render();">
                ${state.locations.map(loc => `<option value="${loc.building}" ${data.building === loc.building ? 'selected' : ''}>${loc.building}</option>`).join('')}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Floor</label>
              <select class="form-control" onchange="state.wizardData.floor = this.value; render();">
                <option value="Ground Floor" ${data.floor === 'Ground Floor' ? 'selected' : ''}>Ground Floor</option>
                <option value="1st Floor" ${data.floor === '1st Floor' ? 'selected' : ''}>1st Floor</option>
                <option value="2nd Floor" ${data.floor === '2nd Floor' ? 'selected' : ''}>2nd Floor</option>
                <option value="3rd Floor" ${data.floor === '3rd Floor' ? 'selected' : ''}>3rd Floor</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Room / Specific Spot</label>
              <input type="text" class="form-control" value="${data.room}" onchange="state.wizardData.room = this.value;" placeholder="e.g. Room S204, Lab 3, Washroom"/>
            </div>

            <div style="display: flex; justify-content: space-between; margin-top: 24px;">
              <button class="btn btn-secondary" onclick="state.wizardStep = 1; render();">Back</button>
              <button class="btn btn-primary" onclick="proceedWizardNext()">Continue to Description</button>
            </div>
          ` : step === 3 ? `
            <h3 style="margin-bottom: 8px;">Step 3 — Describe the issue</h3>
            <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 20px;">Provide a clear title and short summary of the problem.</p>

            <div class="form-group">
              <label class="form-label">Issue Title *</label>
              <input type="text" class="form-control" value="${data.title}" oninput="handleWizardDescriptionInput(this.value, document.getElementById('wizardDescField').value)" placeholder="e.g. Projector not turning on"/>
            </div>

            <div class="form-group">
              <label class="form-label">Detailed Description</label>
              <textarea id="wizardDescField" class="form-control" rows="4" oninput="handleWizardDescriptionInput(state.wizardData.title, this.value)" placeholder="Describe what happens, when it started, or any symptoms...">${data.description}</textarea>
            </div>

            <div id="aiSuggestionContainer"></div>

            <div style="display: flex; justify-content: space-between; margin-top: 24px;">
              <button class="btn btn-secondary" onclick="state.wizardStep = 2; render();">Back</button>
              <button class="btn btn-primary" onclick="proceedWizardNext()">Continue to Photos</button>
            </div>
          ` : step === 4 ? `
            <h3 style="margin-bottom: 8px;">Step 4 — Add a photo</h3>
            <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 20px;">Adding a photo helps staff identify required tools before arrival.</p>

            <div class="photo-upload-zone" onclick="document.getElementById('demoPhotoUploader').click()">
              ${getIconSvg('monitor', 36, 'var(--text-subtle)')}
              <div style="font-weight: 600; margin-top: 8px;">Click to select or drag photo here</div>
              <div style="font-size: 0.78rem; color: var(--text-muted);">PNG, JPG up to 10MB</div>
              <input type="file" id="demoPhotoUploader" style="display: none;" onchange="if(this.files[0]) selectPresetPhoto(URL.createObjectURL(this.files[0]))"/>
            </div>

            ${data.photoUrl ? `
              <div style="text-align: center; margin-bottom: 16px;">
                <span style="font-size: 0.8rem; font-weight: 600; color: var(--status-resolved-fg);">✓ Photo Attached</span>
                <div><img src="${data.photoUrl}" class="photo-preview-img" alt="Preview"/></div>
              </div>
            ` : ''}

            <div style="margin-bottom: 20px;">
              <span style="font-size: 0.8rem; font-weight: 600; color: var(--text-muted);">Or pick a sample photo preset for demo:</span>
              <div class="preset-photos-bar">
                ${PRESET_DEMO_PHOTOS.map(p => `
                  <button class="preset-photo-chip" onclick="selectPresetPhoto('${p.url}')">📷 ${p.label}</button>
                `).join('')}
              </div>
            </div>

            <div style="display: flex; justify-content: space-between; margin-top: 24px;">
              <button class="btn btn-secondary" onclick="state.wizardStep = 3; render();">Back</button>
              <button class="btn btn-primary" onclick="proceedWizardNext()">Continue to Priority</button>
            </div>
          ` : step === 5 ? `
            <h3 style="margin-bottom: 8px;">Step 5 — Priority Suggestion</h3>
            <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 20px;">Indicate the impact level of this issue on your study/work.</p>

            <div class="priority-options-grid">
              <div class="priority-option-card ${data.priority === 'low' ? 'selected' : ''}" onclick="state.wizardData.priority = 'low'; render();">
                <div class="priority-badge low" style="margin-bottom: 6px;">LOW</div>
                <div style="font-weight: 700; font-size: 0.9rem;">Minor Inconvenience</div>
                <div style="font-size: 0.78rem; color: var(--text-muted);">Small cosmetic issue, non-urgent item</div>
              </div>

              <div class="priority-option-card ${data.priority === 'medium' ? 'selected' : ''}" onclick="state.wizardData.priority = 'medium'; render();">
                <div class="priority-badge medium" style="margin-bottom: 6px;">MEDIUM</div>
                <div style="font-weight: 700; font-size: 0.9rem;">Needs Attention</div>
                <div style="font-size: 0.78rem; color: var(--text-muted);">Impairs standard room usage</div>
              </div>

              <div class="priority-option-card ${data.priority === 'high' ? 'selected' : ''}" onclick="state.wizardData.priority = 'high'; render();">
                <div class="priority-badge high" style="margin-bottom: 6px;">HIGH</div>
                <div style="font-weight: 700; font-size: 0.9rem;">Affecting Class / Work</div>
                <div style="font-size: 0.78rem; color: var(--text-muted);">Disrupts ongoing lecture or lab work</div>
              </div>

              <div class="priority-option-card ${data.priority === 'emergency' ? 'selected' : ''}" onclick="state.wizardData.priority = 'emergency'; render();">
                <div class="priority-badge emergency" style="margin-bottom: 6px;">EMERGENCY</div>
                <div style="font-weight: 700; font-size: 0.9rem;">Safety Hazard</div>
                <div style="font-size: 0.78rem; color: var(--text-muted);">Water flood, exposed electrical spark, safety risk</div>
              </div>
            </div>

            <p style="font-size: 0.78rem; color: var(--text-subtle); margin-bottom: 20px;">
              * Note: Student priority is a suggestion and may be adjusted by facilities staff after review.
            </p>

            <div style="display: flex; justify-content: space-between; margin-top: 24px;">
              <button class="btn btn-secondary" onclick="state.wizardStep = 4; render();">Back</button>
              <button class="btn btn-primary" onclick="proceedWizardNext()">Review & Submit</button>
            </div>
          ` : `
            <!-- Step 6 Final Review & Submit -->
            <h3 style="margin-bottom: 8px;">Review Issue Summary</h3>
            <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 20px;">Please confirm all details before logging the ticket.</p>

            <div style="background: var(--bg-main); border-radius: var(--radius-md); padding: 20px; margin-bottom: 24px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <span style="font-size: 0.82rem; color: var(--text-muted);">Category</span>
                <span style="font-weight: 700;">${data.category}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <span style="font-size: 0.82rem; color: var(--text-muted);">Location</span>
                <span style="font-weight: 700;">${data.building} · ${data.floor} · ${data.room}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <span style="font-size: 0.82rem; color: var(--text-muted);">Title</span>
                <span style="font-weight: 700;">${data.title}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <span style="font-size: 0.82rem; color: var(--text-muted);">Priority</span>
                <span class="priority-badge ${data.priority}">${data.priority.toUpperCase()}</span>
              </div>
              ${data.photoUrl ? `
                <div style="margin-top: 12px; text-align: center;">
                  <img src="${data.photoUrl}" style="max-height: 140px; border-radius: var(--radius-md);" alt="Attached"/>
                </div>
              ` : ''}
            </div>

            <div style="display: flex; justify-content: space-between;">
              <button class="btn btn-secondary" onclick="state.wizardStep = 5; render();">Back</button>
              <button class="btn btn-success btn-lg" onclick="submitIssueWizard()">Submit Issue Now</button>
            </div>
          `}
        </div>
      </div>
    </div>
  `;
}

// --------------------------------------------------------------------------
// DUPLICATE MODAL OVERLAY
// --------------------------------------------------------------------------

function openDuplicateModal(existingIssue) {
  const modal = document.getElementById("duplicateModal");
  if (!modal) return;

  document.getElementById("duplicateModalContent").innerHTML = `
    <div style="text-align: center; margin-bottom: 16px;">
      ${getIconSvg('alert-triangle', 48, '#F59E0B')}
      <h3 style="margin-top: 12px; color: var(--text-main);">A similar issue has already been reported</h3>
      <p style="font-size: 0.88rem; color: var(--text-muted);">An active report exists in the exact same location and category.</p>
    </div>

    <div style="background: var(--bg-main); border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 16px; margin-bottom: 20px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
        <span style="font-weight: 700; color: var(--primary);">${existingIssue.ticketId}</span>
        <span class="status-pill ${existingIssue.status}">${existingIssue.status.replace('_', ' ')}</span>
      </div>
      <div style="font-weight: 700; margin-bottom: 4px;">${existingIssue.title}</div>
      <div style="font-size: 0.8rem; color: var(--text-muted);">Location: ${existingIssue.building}, ${existingIssue.room}</div>
      <div style="font-size: 0.8rem; color: var(--text-muted);">Reported by: ${existingIssue.reportedBy}</div>
    </div>

    <div style="display: flex; gap: 12px; justify-content: flex-end;">
      <button class="btn btn-secondary" onclick="closeDuplicateModal(); navigateTo('issue_detail', '${existingIssue.id}')">
        View Existing Issue
      </button>
      <button class="btn btn-primary" onclick="closeDuplicateModal(); state.wizardStep = 4; render();">
        Report Anyway
      </button>
    </div>
  `;

  modal.classList.add("open");
}

function closeDuplicateModal() {
  const modal = document.getElementById("duplicateModal");
  if (modal) modal.classList.remove("open");
}

// --------------------------------------------------------------------------
// ISSUE DETAIL PAGE & TIMELINE TRACKER
// --------------------------------------------------------------------------

function handleResolutionConfirmation(issueId, isFixed) {
  const issue = state.issues.find(i => i.id === issueId);
  if (!issue) return;

  if (isFixed) {
    issue.resolutionConfirmed = true;
    issue.updates.push({
      id: `u_${Date.now()}`,
      author: state.currentUser.name,
      role: "Student",
      message: "✓ Student verified resolution: 'Yes, it is fixed'.",
      timestamp: new Date().toISOString()
    });
    showToast("Thank you for confirming resolution!");
  } else {
    // Reopen issue!
    issue.status = "reopened";
    issue.resolutionConfirmed = false;
    issue.updates.push({
      id: `u_${Date.now()}`,
      author: state.currentUser.name,
      role: "Student",
      message: "↻ Student reported issue still persists. Ticket reopened.",
      timestamp: new Date().toISOString()
    });
    
    // Notify staff & admin
    state.notifications.unshift({
      id: `n_${Date.now()}`,
      userId: issue.assignedToId || "user_staff_1",
      ticketId: issue.ticketId,
      icon: "refresh-cw",
      title: "Issue Reopened by Student",
      message: `Student reported that ${issue.ticketId} in ${issue.room} is still having problems.`,
      read: false,
      timestamp: new Date().toISOString()
    });

    showToast("Ticket reopened and sent back to staff queue.", "error");
  }

  saveState();
  render();
}

function renderIssueDetail() {
  const issue = state.issues.find(i => i.id === state.selectedIssueId) || state.issues[0];
  if (!issue) return `<div class="content-area">Issue not found</div>`;

  const stages = [
    { key: "reported", label: "Reported" },
    { key: "under_review", label: "Under Review" },
    { key: "assigned", label: "Assigned" },
    { key: "in_progress", label: "In Progress" },
    { key: "resolved", label: "Resolved" }
  ];

  const currentStageIndex = issue.status === 'reopened' ? 3 : stages.findIndex(s => s.key === issue.status);

  return `
    <div class="content-area">
      <button class="btn btn-secondary btn-sm" style="margin-bottom: 20px;" onclick="history.back() || navigateTo('student_dashboard')">
        ${getIconSvg('arrow-left', 16)} Back to List
      </button>

      <div class="issue-detail-header">
        <div>
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 6px;">
            <h1 style="font-size: 1.6rem;">${issue.title}</h1>
            <span class="priority-badge ${issue.priority}">${issue.priority.toUpperCase()}</span>
            <span class="status-pill ${issue.status}">${issue.status.replace('_', ' ')}</span>
          </div>
          <div style="font-size: 0.88rem; color: var(--text-muted);">
            <strong style="color: var(--primary);">${issue.ticketId}</strong> · Category: <strong>${issue.category}</strong> · Location: <strong>${issue.building} · ${issue.floor} · ${issue.room}</strong>
          </div>
        </div>
        <div style="text-align: right; font-size: 0.8rem; color: var(--text-subtle);">
          Reported: ${new Date(issue.createdAt).toLocaleDateString()} ${new Date(issue.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </div>
      </div>

      <!-- Timeline Card -->
      <div class="timeline-card">
        <h4 style="font-size: 0.9rem; color: var(--text-muted); text-transform: uppercase; margin-bottom: 16px;">Resolution Timeline</h4>
        <div class="timeline-tracker">
          <div class="timeline-line"></div>
          ${stages.map((stage, idx) => `
            <div class="timeline-step ${idx === currentStageIndex ? 'active' : idx < currentStageIndex ? 'completed' : ''}">
              <div class="timeline-node">
                ${idx < currentStageIndex ? getIconSvg('check-circle', 18, 'white') : (idx + 1)}
              </div>
              <span class="timeline-label">${stage.label}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Resolution Confirmation Banner (Requirement 10) -->
      ${issue.status === 'resolved' && issue.resolutionConfirmed === null && state.currentUser.role === 'student' ? `
        <div class="resolution-confirm-box">
          <div class="confirm-text">
            <h4>Is this issue actually fixed?</h4>
            <p>Staff marked this ticket as completed. Please confirm if the problem is resolved in your room.</p>
          </div>
          <div class="confirm-actions">
            <button class="btn btn-success" onclick="handleResolutionConfirmation('${issue.id}', true)">
              ${getIconSvg('check-circle', 18)} Yes, it's fixed
            </button>
            <button class="btn btn-danger" onclick="handleResolutionConfirmation('${issue.id}', false)">
              ${getIconSvg('refresh-cw', 18)} Still having the problem
            </button>
          </div>
        </div>
      ` : issue.resolutionConfirmed === true ? `
        <div style="background: #DCFCE7; border: 1px solid #86EFAC; border-radius: var(--radius-md); padding: 14px 20px; margin-bottom: 24px; font-weight: 600; color: #166534; display: flex; align-items: center; gap: 10px;">
          ${getIconSvg('check-circle', 20, '#16A34A')}
          Resolution confirmed by student on ${new Date(issue.updatedAt).toLocaleDateString()}
        </div>
      ` : ''}

      <!-- Issue Details & Activity Log Split -->
      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px;">
        <div>
          <!-- Description & Photos Card -->
          <div class="card" style="margin-bottom: 24px;">
            <h3 style="font-size: 1.1rem; margin-bottom: 12px;">Issue Description</h3>
            <p style="color: var(--text-main); font-size: 0.95rem; line-height: 1.6; margin-bottom: 20px;">${issue.description}</p>
            ${issue.photoUrl ? `
              <div style="margin-top: 16px;">
                <h4 style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 8px;">Attached Photo</h4>
                <img src="${issue.photoUrl}" style="max-width: 100%; max-height: 320px; border-radius: var(--radius-md);" alt="Issue Photo"/>
              </div>
            ` : ''}
          </div>

          <!-- Activity Log Updates -->
          <div class="card">
            <h3 style="font-size: 1.1rem; margin-bottom: 16px;">Progress Log & Activity Updates</h3>
            <div class="activity-log">
              ${issue.updates.map(upd => `
                <div class="activity-item">
                  <div class="activity-avatar">${upd.author.charAt(0)}</div>
                  <div class="activity-content">
                    <div class="activity-header">
                      <span class="activity-author">${upd.author} <span style="font-size: 0.72rem; font-weight: 600; color: var(--primary);">(${upd.role})</span></span>
                      <span class="activity-time">${new Date(upd.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                    </div>
                    <div class="activity-msg">${upd.message}</div>
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- Add Progress Note Form for Staff / Admin -->
            ${state.currentUser.role !== 'student' ? `
              <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--border-light);">
                <h4 style="font-size: 0.88rem; margin-bottom: 8px;">Add Progress Update</h4>
                <div style="display: flex; gap: 12px;">
                  <input type="text" id="staffUpdateMsg" class="form-control" placeholder="Write update note..."/>
                  <button class="btn btn-primary" onclick="addStaffProgressNote('${issue.id}')">Add Note</button>
                </div>
              </div>
            ` : ''}
          </div>
        </div>

        <!-- Sidebar Info -->
        <div>
          <div class="card">
            <h3 style="font-size: 1rem; margin-bottom: 16px;">Assignment Info</h3>
            <div style="margin-bottom: 16px;">
              <span style="font-size: 0.8rem; color: var(--text-muted);">Assigned Specialist</span>
              <div style="font-weight: 700; margin-top: 4px; font-size: 0.95rem;">${issue.assignedToName}</div>
            </div>
            <div style="margin-bottom: 16px;">
              <span style="font-size: 0.8rem; color: var(--text-muted);">Reported By</span>
              <div style="font-weight: 600; margin-top: 4px;">${issue.reportedBy}</div>
              <div style="font-size: 0.78rem; color: var(--text-subtle);">${issue.reporterEmail}</div>
            </div>

            ${state.currentUser.role === 'admin' ? `
              <button class="btn btn-primary btn-sm" style="width: 100%; margin-top: 8px;" onclick="openAssignStaffModal('${issue.id}')">
                Reassign Specialist
              </button>
            ` : ''}
          </div>
        </div>
      </div>
    </div>
  `;
}

function addStaffProgressNote(issueId) {
  const input = document.getElementById("staffUpdateMsg");
  if (!input || !input.value.trim()) return;

  const issue = state.issues.find(i => i.id === issueId);
  if (!issue) return;

  issue.updates.push({
    id: `u_${Date.now()}`,
    author: state.currentUser.name,
    role: state.currentUser.role === 'admin' ? 'Admin' : 'Staff',
    message: input.value.trim(),
    timestamp: new Date().toISOString()
  });

  saveState();
  showToast("Progress update saved!");
  render();
}

// --------------------------------------------------------------------------
// MY ISSUES PAGE (STUDENT)
// --------------------------------------------------------------------------

function filterMyIssues(statusKey) {
  state.myIssuesFilter.status = statusKey;
  navigateTo("my_issues");
}

function renderMyIssues() {
  const user = state.currentUser;
  let list = state.issues.filter(i => i.reportedBy === user.name || i.reporterEmail === user.email);

  const filter = state.myIssuesFilter;
  if (filter.status !== 'all') {
    if (filter.status === 'open') list = list.filter(i => i.status === 'reported' || i.status === 'under_review');
    else if (filter.status === 'in_progress') list = list.filter(i => i.status === 'assigned' || i.status === 'in_progress' || i.status === 'reopened');
    else if (filter.status === 'resolved') list = list.filter(i => i.status === 'resolved');
  }

  if (filter.search) {
    const q = filter.search.toLowerCase();
    list = list.filter(i => i.title.toLowerCase().includes(q) || i.ticketId.toLowerCase().includes(q) || i.room.toLowerCase().includes(q));
  }

  const filterTitleLabel = filter.status === 'open' ? 'Open Issues' :
                           filter.status === 'in_progress' ? 'In Progress Issues' :
                           filter.status === 'resolved' ? 'Resolved Issues' : 'All Issues';

  return `
    <div class="content-area">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
        <h2>${filterTitleLabel} <span style="font-size: 1.1rem; color: var(--text-muted); font-weight: 500;">(${list.length})</span></h2>
        <button class="btn btn-primary" onclick="startNewWizard()">+ Report Issue</button>
      </div>

      <!-- Tabs & Search -->
      <div class="card" style="margin-bottom: 24px; padding: 16px 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap;">
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-sm ${filter.status === 'all' ? 'btn-primary' : 'btn-secondary'}" onclick="filterMyIssues('all')">All Issues</button>
            <button class="btn btn-sm ${filter.status === 'open' ? 'btn-primary' : 'btn-secondary'}" onclick="filterMyIssues('open')">Open</button>
            <button class="btn btn-sm ${filter.status === 'in_progress' ? 'btn-primary' : 'btn-secondary'}" onclick="filterMyIssues('in_progress')">In Progress</button>
            <button class="btn btn-sm ${filter.status === 'resolved' ? 'btn-primary' : 'btn-secondary'}" onclick="filterMyIssues('resolved')">Resolved</button>
          </div>
          <div style="width: 260px;">
            <input type="text" class="form-control" style="padding: 8px 12px;" placeholder="Search title, ticket ID..." value="${filter.search}" oninput="state.myIssuesFilter.search = this.value; render();"/>
          </div>
        </div>
      </div>

      <!-- List -->
      ${list.length === 0 ? `
        <div class="card" style="text-align: center; padding: 48px 20px;">
          ${getIconSvg('wrench', 40, 'var(--text-subtle)')}
          <h4 style="margin-top: 12px; margin-bottom: 6px;">No issues match your filter</h4>
          <p style="font-size: 0.88rem; color: var(--text-muted);">Try adjusting your search criteria or report a new issue.</p>
        </div>
      ` : `
        <div style="display: flex; flex-direction: column; gap: 16px;">
          ${list.map(issue => `
            <div class="card card-hover" style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;" onclick="navigateTo('issue_detail', '${issue.id}')">
              <div style="display: flex; align-items: center; gap: 16px;">
                <div style="background: var(--primary-light); width: 48px; height: 48px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center;">
                  ${getIconSvg('wrench', 22, 'var(--primary)')}
                </div>
                <div>
                  <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 4px;">
                    <span style="font-weight: 700; font-size: 1rem;">${issue.title}</span>
                    <span class="priority-badge ${issue.priority}">${issue.priority.toUpperCase()}</span>
                  </div>
                  <div style="font-size: 0.82rem; color: var(--text-muted);">
                    <strong style="color: var(--primary);">${issue.ticketId}</strong> · Category: ${issue.category} · Location: ${issue.building}, ${issue.room}
                  </div>
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 20px;">
                <span class="status-pill ${issue.status}">${issue.status.replace('_', ' ')}</span>
                ${getIconSvg('chevron-right', 20, 'var(--text-subtle)')}
              </div>
            </div>
          `).join('')}
        </div>
      `}
    </div>
  `;
}

// --------------------------------------------------------------------------
// MAINTENANCE STAFF DASHBOARD
// --------------------------------------------------------------------------

function updateStaffTaskStatus(issueId, newStatus) {
  const issue = state.issues.find(i => i.id === issueId);
  if (!issue) return;

  issue.status = newStatus;
  issue.updatedAt = new Date().toISOString();
  if (newStatus === 'resolved') {
    issue.resolvedAt = new Date().toISOString();
    issue.resolutionConfirmed = null; // Prompts student confirm!
  }

  issue.updates.push({
    id: `u_${Date.now()}`,
    author: state.currentUser.name,
    role: "Staff",
    message: `Status updated to ${newStatus.replace('_', ' ').toUpperCase()}`,
    timestamp: new Date().toISOString()
  });

  saveState();
  showToast(`Task ${issue.ticketId} status updated to ${newStatus.toUpperCase()}`);
  render();
}

function renderStaffDashboard() {
  const user = state.currentUser;
  const assigned = state.issues.filter(i => i.assignedToId === user.id || i.assignedToName === user.name);
  
  const assignedAllCount = assigned.length;
  const progressCount = assigned.filter(i => i.status === 'in_progress' || i.status === 'assigned' || i.status === 'reopened').length;
  const urgentCount = assigned.filter(i => (i.priority === 'high' || i.priority === 'emergency') && i.status !== 'resolved').length;
  const completedCount = assigned.filter(i => i.status === 'resolved').length;

  if (!state.staffTaskFilter) state.staffTaskFilter = 'assigned_all';

  let filteredTasks = assigned;
  if (state.staffTaskFilter === 'in_progress') {
    filteredTasks = assigned.filter(i => i.status === 'in_progress' || i.status === 'assigned' || i.status === 'reopened');
  } else if (state.staffTaskFilter === 'urgent') {
    filteredTasks = assigned.filter(i => (i.priority === 'high' || i.priority === 'emergency') && i.status !== 'resolved');
  } else if (state.staffTaskFilter === 'completed') {
    filteredTasks = assigned.filter(i => i.status === 'resolved');
  }

  const staffTitleLabel = state.staffTaskFilter === 'in_progress' ? 'In Progress Tasks' :
                          state.staffTaskFilter === 'urgent' ? 'Urgent / High Priority Tasks' :
                          state.staffTaskFilter === 'completed' ? 'Completed Tasks' : 'Assigned to Me';

  return `
    <div class="content-area">
      <div style="margin-bottom: 28px;">
        <h1 style="font-size: 1.75rem; margin-bottom: 4px;">Good morning, ${user.name} 🔧</h1>
        <p style="color: var(--text-muted); font-size: 0.9rem;">Specialization: ${user.department || 'Equipment & Facilities'}</p>
      </div>

      <!-- Metrics -->
      <div class="metrics-grid">
        <div class="metric-card ${state.staffTaskFilter === 'assigned_all' ? 'active' : ''}" onclick="filterStaffTasks('assigned_all')">
          <div class="metric-info">
            <div style="display: flex; align-items: center; gap: 6px;">
              <h4>Assigned to Me</h4>
              <span class="metric-arrow">${getIconSvg('chevron-right', 14, 'var(--text-subtle)')}</span>
            </div>
            <div class="metric-value">${assignedAllCount}</div>
          </div>
          <div class="metric-icon-box" style="background: #E0E7FF; color: #4F46E5;">
            ${getIconSvg('wrench', 24, '#4F46E5')}
          </div>
        </div>

        <div class="metric-card ${state.staffTaskFilter === 'in_progress' ? 'active' : ''}" onclick="filterStaffTasks('in_progress')">
          <div class="metric-info">
            <div style="display: flex; align-items: center; gap: 6px;">
              <h4>In Progress</h4>
              <span class="metric-arrow">${getIconSvg('chevron-right', 14, 'var(--text-subtle)')}</span>
            </div>
            <div class="metric-value">${progressCount}</div>
          </div>
          <div class="metric-icon-box" style="background: #E0F2FE; color: #0284C7;">
            ${getIconSvg('clock', 24, '#0284C7')}
          </div>
        </div>

        <div class="metric-card ${state.staffTaskFilter === 'urgent' ? 'active' : ''}" onclick="filterStaffTasks('urgent')">
          <div class="metric-info">
            <div style="display: flex; align-items: center; gap: 6px;">
              <h4>Urgent / High Priority</h4>
              <span class="metric-arrow">${getIconSvg('chevron-right', 14, 'var(--text-subtle)')}</span>
            </div>
            <div class="metric-value">${urgentCount}</div>
          </div>
          <div class="metric-icon-box" style="background: #FEE2E2; color: #DC2626;">
            ${getIconSvg('alert-triangle', 24, '#DC2626')}
          </div>
        </div>

        <div class="metric-card ${state.staffTaskFilter === 'completed' ? 'active' : ''}" onclick="filterStaffTasks('completed')">
          <div class="metric-info">
            <div style="display: flex; align-items: center; gap: 6px;">
              <h4>Completed Tasks</h4>
              <span class="metric-arrow">${getIconSvg('chevron-right', 14, 'var(--text-subtle)')}</span>
            </div>
            <div class="metric-value">${completedCount}</div>
          </div>
          <div class="metric-icon-box" style="background: #DCFCE7; color: #16A34A;">
            ${getIconSvg('check-circle', 24, '#16A34A')}
          </div>
        </div>
      </div>

      <!-- Task Queue Card with Filter Tabs -->
      <div class="card" id="staffTaskQueue">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
          <h3 style="font-size: 1.15rem;">${staffTitleLabel} <span style="font-size: 0.9rem; color: var(--text-muted); font-weight: 500;">(${filteredTasks.length})</span></h3>
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-sm ${state.staffTaskFilter === 'assigned_all' ? 'btn-primary' : 'btn-secondary'}" onclick="filterStaffTasks('assigned_all')">Assigned to Me</button>
            <button class="btn btn-sm ${state.staffTaskFilter === 'in_progress' ? 'btn-primary' : 'btn-secondary'}" onclick="filterStaffTasks('in_progress')">In Progress</button>
            <button class="btn btn-sm ${state.staffTaskFilter === 'urgent' ? 'btn-primary' : 'btn-secondary'}" onclick="filterStaffTasks('urgent')">Urgent / High Priority</button>
            <button class="btn btn-sm ${state.staffTaskFilter === 'completed' ? 'btn-primary' : 'btn-secondary'}" onclick="filterStaffTasks('completed')">Completed</button>
          </div>
        </div>

        ${filteredTasks.length === 0 ? `
          <div style="text-align: center; padding: 40px; color: var(--text-muted);">
            ${getIconSvg('check-circle', 36, '#10B981')}
            <div style="margin-top: 10px; font-weight: 600;">No tasks match this filter.</div>
          </div>
        ` : `
          <div style="display: flex; flex-direction: column; gap: 16px;">
            ${filteredTasks.map(issue => `
              <div class="card card-hover" style="border-left: 4px solid ${issue.priority === 'emergency' ? '#DC2626' : issue.priority === 'high' ? '#F97316' : '#3B82F6'}; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
                    <span style="font-weight: 800; font-size: 1.05rem;">${issue.title}</span>
                    <span class="priority-badge ${issue.priority}">${issue.priority.toUpperCase()}</span>
                    <span class="status-pill ${issue.status}">${issue.status.replace('_', ' ')}</span>
                  </div>
                  <div style="font-size: 0.85rem; color: var(--text-muted);">
                    <strong style="color: var(--primary);">${issue.ticketId}</strong> · Location: <strong>${issue.building}, ${issue.floor}, ${issue.room}</strong> · Category: ${issue.category}
                  </div>
                </div>
                <div style="display: flex; gap: 10px;">
                  <button class="btn btn-secondary btn-sm" onclick="navigateTo('issue_detail', '${issue.id}')">View Ticket</button>
                  ${issue.status !== 'in_progress' && issue.status !== 'resolved' ? `
                    <button class="btn btn-primary btn-sm" onclick="updateStaffTaskStatus('${issue.id}', 'in_progress')">Start Work</button>
                  ` : ''}
                  ${issue.status !== 'resolved' ? `
                    <button class="btn btn-success btn-sm" onclick="updateStaffTaskStatus('${issue.id}', 'resolved')">Mark Resolved</button>
                  ` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    </div>
  `;
}

// --------------------------------------------------------------------------
// ADMIN OVERVIEW & ISSUE MANAGEMENT
// --------------------------------------------------------------------------

function openAssignStaffModal(issueId) {
  const modal = document.getElementById("assignStaffModal");
  if (!modal) return;

  const issue = state.issues.find(i => i.id === issueId);
  const staffList = state.users.filter(u => u.role === 'staff');

  document.getElementById("assignStaffModalContent").innerHTML = `
    <h3 style="margin-bottom: 12px;">Assign Specialist to ${issue.ticketId}</h3>
    <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 20px;">
      Issue: <strong>${issue.title}</strong> (${issue.category} · ${issue.room})
    </p>

    <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px;">
      ${staffList.map(staff => `
        <div class="card card-hover" style="padding: 14px 18px; display: flex; justify-content: space-between; align-items: center; cursor: pointer;" onclick="assignStaffToIssue('${issue.id}', '${staff.id}', '${staff.name}')">
          <div style="display: flex; align-items: center; gap: 12px;">
            <img src="${staff.avatar}" style="width: 40px; height: 40px; border-radius: 50%;" alt="Staff"/>
            <div>
              <div style="font-weight: 700; font-size: 0.92rem;">${staff.name}</div>
              <div style="font-size: 0.78rem; color: var(--text-muted);">${staff.department}</div>
            </div>
          </div>
          <button class="btn btn-soft btn-sm">Assign Specialist</button>
        </div>
      `).join('')}
    </div>
  `;

  modal.classList.add("open");
}

function assignStaffToIssue(issueId, staffId, staffName) {
  const issue = state.issues.find(i => i.id === issueId);
  if (!issue) return;

  issue.assignedToId = staffId;
  issue.assignedToName = staffName;
  issue.status = "assigned";
  issue.updates.push({
    id: `u_${Date.now()}`,
    author: state.currentUser.name,
    role: "Admin",
    message: `Issue assigned to maintenance specialist ${staffName}.`,
    timestamp: new Date().toISOString()
  });

  const modal = document.getElementById("assignStaffModal");
  if (modal) modal.classList.remove("open");

  saveState();
  showToast(`Ticket ${issue.ticketId} assigned to ${staffName}`);
  render();
}

function renderAdminOverview() {
  const total = state.issues.length;
  const openCount = state.issues.filter(i => i.status === 'reported' || i.status === 'under_review').length;
  const progressCount = state.issues.filter(i => i.status === 'assigned' || i.status === 'in_progress' || i.status === 'reopened').length;
  const resolvedCount = state.issues.filter(i => i.status === 'resolved').length;

  const currentFilter = state.adminIssuesFilter.status || 'all';

  let filteredIssues = state.issues;
  if (currentFilter === 'open') {
    filteredIssues = state.issues.filter(i => i.status === 'reported' || i.status === 'under_review');
  } else if (currentFilter === 'in_progress') {
    filteredIssues = state.issues.filter(i => i.status === 'assigned' || i.status === 'in_progress' || i.status === 'reopened');
  } else if (currentFilter === 'resolved') {
    filteredIssues = state.issues.filter(i => i.status === 'resolved');
  }

  const adminTitleLabel = currentFilter === 'open' ? 'Open & Pending Issues' :
                          currentFilter === 'in_progress' ? 'In Progress Issues' :
                          currentFilter === 'resolved' ? 'Resolved Issues' : 'All Campus Issues';

  return `
    <div class="content-area">
      <div style="margin-bottom: 28px;">
        <h1 style="font-size: 1.75rem; margin-bottom: 4px;">Facilities Operations Dashboard</h1>
        <p style="color: var(--text-muted); font-size: 0.9rem;">Overview of all campus maintenance tickets, workloads, and resolution speeds.</p>
      </div>

      <!-- Key Metrics -->
      <div class="metrics-grid">
        <div class="metric-card ${currentFilter === 'all' ? 'active' : ''}" onclick="filterAdminIssues('all')">
          <div class="metric-info">
            <div style="display: flex; align-items: center; gap: 6px;">
              <h4>Total Issues</h4>
              <span class="metric-arrow">${getIconSvg('chevron-right', 14, 'var(--text-subtle)')}</span>
            </div>
            <div class="metric-value">${total}</div>
          </div>
          <div class="metric-icon-box" style="background: #F1F5F9; color: #475569;">
            ${getIconSvg('wrench', 24, '#475569')}
          </div>
        </div>

        <div class="metric-card ${currentFilter === 'open' ? 'active' : ''}" onclick="filterAdminIssues('open')">
          <div class="metric-info">
            <div style="display: flex; align-items: center; gap: 6px;">
              <h4>Open / Pending</h4>
              <span class="metric-arrow">${getIconSvg('chevron-right', 14, 'var(--text-subtle)')}</span>
            </div>
            <div class="metric-value">${openCount}</div>
          </div>
          <div class="metric-icon-box" style="background: #FEF3C7; color: #D97706;">
            ${getIconSvg('alert-circle', 24, '#D97706')}
          </div>
        </div>

        <div class="metric-card ${currentFilter === 'in_progress' ? 'active' : ''}" onclick="filterAdminIssues('in_progress')">
          <div class="metric-info">
            <div style="display: flex; align-items: center; gap: 6px;">
              <h4>In Progress</h4>
              <span class="metric-arrow">${getIconSvg('chevron-right', 14, 'var(--text-subtle)')}</span>
            </div>
            <div class="metric-value">${progressCount}</div>
          </div>
          <div class="metric-icon-box" style="background: #E0F2FE; color: #0284C7;">
            ${getIconSvg('clock', 24, '#0284C7')}
          </div>
        </div>

        <div class="metric-card ${currentFilter === 'resolved' ? 'active' : ''}" onclick="filterAdminIssues('resolved')">
          <div class="metric-info">
            <div style="display: flex; align-items: center; gap: 6px;">
              <h4>Resolved</h4>
              <span class="metric-arrow">${getIconSvg('chevron-right', 14, 'var(--text-subtle)')}</span>
            </div>
            <div class="metric-value">${resolvedCount}</div>
          </div>
          <div class="metric-icon-box" style="background: #DCFCE7; color: #16A34A;">
            ${getIconSvg('check-circle', 24, '#16A34A')}
          </div>
        </div>
      </div>

      <!-- Recent / Filtered Issues Table -->
      <div class="table-container" id="adminIssuesTable">
        <div style="padding: 20px 24px; border-bottom: 1px solid var(--border-light); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
          <h3 style="font-size: 1.1rem;">${adminTitleLabel} <span style="font-size: 0.9rem; color: var(--text-muted); font-weight: 500;">(${filteredIssues.length})</span></h3>
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-sm ${currentFilter === 'all' ? 'btn-primary' : 'btn-secondary'}" onclick="filterAdminIssues('all')">All</button>
            <button class="btn btn-sm ${currentFilter === 'open' ? 'btn-primary' : 'btn-secondary'}" onclick="filterAdminIssues('open')">Open / Pending</button>
            <button class="btn btn-sm ${currentFilter === 'in_progress' ? 'btn-primary' : 'btn-secondary'}" onclick="filterAdminIssues('in_progress')">In Progress</button>
            <button class="btn btn-sm ${currentFilter === 'resolved' ? 'btn-primary' : 'btn-secondary'}" onclick="filterAdminIssues('resolved')">Resolved</button>
          </div>
        </div>

        ${filteredIssues.length === 0 ? `
          <div style="text-align: center; padding: 40px; color: var(--text-muted);">
            No issues match the selected filter.
          </div>
        ` : `
          <table class="data-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Issue Title</th>
                <th>Category</th>
                <th>Location</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Assigned Specialist</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${filteredIssues.map(issue => `
                <tr>
                  <td><strong style="color: var(--primary); cursor: pointer;" onclick="navigateTo('issue_detail', '${issue.id}')">${issue.ticketId}</strong></td>
                  <td><span style="font-weight: 600;">${issue.title}</span></td>
                  <td>${issue.category}</td>
                  <td>${issue.building} · ${issue.room}</td>
                  <td><span class="priority-badge ${issue.priority}">${issue.priority.toUpperCase()}</span></td>
                  <td><span class="status-pill ${issue.status}">${issue.status.replace('_', ' ')}</span></td>
                  <td>${issue.assignedToName}</td>
                  <td>
                    <button class="btn btn-soft btn-sm" onclick="openAssignStaffModal('${issue.id}')">Assign</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `}
      </div>
    </div>
  `;
}

// --------------------------------------------------------------------------
// ADMIN STAFF MANAGEMENT & LOCATION MANAGEMENT
// --------------------------------------------------------------------------

function renderAdminStaff() {
  const staffList = state.users.filter(u => u.role === 'staff');

  return `
    <div class="content-area">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px;">
        <div>
          <h1 style="font-size: 1.75rem; margin-bottom: 4px;">Maintenance Staff Roster</h1>
          <p style="color: var(--text-muted); font-size: 0.9rem;">Manage engineering staff, active workloads, and skill sets.</p>
        </div>
        <button class="btn btn-primary" onclick="showToast('Staff addition modal ready!')">+ Add New Staff</button>
      </div>

      <div class="staff-grid">
        ${staffList.map(staff => `
          <div class="staff-card">
            <div class="staff-card-header">
              <img src="${staff.avatar}" class="staff-avatar-lg" alt="Avatar"/>
              <div>
                <h3 style="font-size: 1.05rem;">${staff.name}</h3>
                <span style="font-size: 0.8rem; color: var(--text-muted);">${staff.department}</span>
              </div>
            </div>

            <div>
              <div style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px;">Skills & Categories</div>
              ${(staff.skills || ["General Maintenance"]).map(sk => `<span class="skill-tag">${sk}</span>`).join('')}
            </div>

            <div style="display: flex; justify-content: space-between; border-top: 1px solid var(--border-light); padding-top: 14px; font-size: 0.85rem;">
              <div>Active Tasks: <strong>${staff.activeTasks || 2}</strong></div>
              <div>Completed: <strong>${staff.completedTasks || 20}</strong></div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderAdminLocations() {
  return `
    <div class="content-area">
      <div style="margin-bottom: 28px;">
        <h1 style="font-size: 1.75rem; margin-bottom: 4px;">Campus Location Hierarchy</h1>
        <p style="color: var(--text-muted); font-size: 0.9rem;">Structure buildings, floors, and rooms for location-based reporting.</p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;">
        ${state.locations.map(loc => `
          <div class="card">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px;">
              ${getIconSvg('building', 24, 'var(--primary)')}
              <h3 style="font-size: 1.2rem;">${loc.building}</h3>
            </div>
            
            ${loc.floors.map(fl => `
              <div style="margin-bottom: 14px;">
                <div style="font-weight: 700; font-size: 0.88rem; color: var(--text-main); margin-bottom: 6px;">${fl.name}</div>
                <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                  ${fl.rooms.map(rm => `<span style="background: var(--bg-main); border: 1px solid var(--border-light); font-size: 0.78rem; padding: 4px 8px; border-radius: var(--radius-sm);">${rm}</span>`).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// --------------------------------------------------------------------------
// ADMIN ANALYTICS DASHBOARD
// --------------------------------------------------------------------------

function renderAdminAnalytics() {
  return `
    <div class="content-area">
      <div style="margin-bottom: 28px;">
        <h1 style="font-size: 1.75rem; margin-bottom: 4px;">Campus Maintenance Analytics</h1>
        <p style="color: var(--text-muted); font-size: 0.9rem;">Performance distribution, category metrics, and issue density.</p>
      </div>

      <div class="analytics-grid">
        <!-- Category Split Chart -->
        <div class="chart-card">
          <div class="chart-header">
            <h3>Issue Categories Split</h3>
            <span style="font-size: 0.8rem; color: var(--text-muted);">Last 30 Days</span>
          </div>
          <div class="bar-chart-container">
            <div class="bar-item">
              <div class="bar-meta"><span>Equipment</span><span>32%</span></div>
              <div class="bar-track"><div class="bar-fill" style="width: 32%; background: #6366F1;"></div></div>
            </div>
            <div class="bar-item">
              <div class="bar-meta"><span>Furniture</span><span>24%</span></div>
              <div class="bar-track"><div class="bar-fill" style="width: 24%; background: #8B5CF6;"></div></div>
            </div>
            <div class="bar-item">
              <div class="bar-meta"><span>Wi-Fi / Network</span><span>18%</span></div>
              <div class="bar-track"><div class="bar-fill" style="width: 18%; background: #10B981;"></div></div>
            </div>
            <div class="bar-item">
              <div class="bar-meta"><span>Plumbing</span><span>14%</span></div>
              <div class="bar-track"><div class="bar-fill" style="width: 14%; background: #3B82F6;"></div></div>
            </div>
            <div class="bar-item">
              <div class="bar-meta"><span>AC / Climate</span><span>12%</span></div>
              <div class="bar-track"><div class="bar-fill" style="width: 12%; background: #06B6D4;"></div></div>
            </div>
          </div>
        </div>

        <!-- Most Reported Locations -->
        <div class="chart-card">
          <div class="chart-header">
            <h3>Most Reported Campus Buildings</h3>
            <span style="font-size: 0.8rem; color: var(--text-muted);">Issue Count</span>
          </div>
          <div class="bar-chart-container">
            <div class="bar-item">
              <div class="bar-meta"><span>Block A (Academic Main)</span><span>18 reports</span></div>
              <div class="bar-track"><div class="bar-fill" style="width: 75%; background: #2563EB;"></div></div>
            </div>
            <div class="bar-item">
              <div class="bar-meta"><span>Block B (Library & Labs)</span><span>11 reports</span></div>
              <div class="bar-track"><div class="bar-fill" style="width: 48%; background: #2563EB;"></div></div>
            </div>
            <div class="bar-item">
              <div class="bar-meta"><span>Science Tower</span><span>7 reports</span></div>
              <div class="bar-track"><div class="bar-fill" style="width: 30%; background: #2563EB;"></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// --------------------------------------------------------------------------
// NOTIFICATION DRAWER TOGGLE
// --------------------------------------------------------------------------

function toggleNotificationDrawer() {
  const user = state.currentUser;
  const userNotes = state.notifications.filter(n => n.userId === user.id);
  
  // Mark read
  userNotes.forEach(n => n.read = true);
  saveState();

  const modal = document.getElementById("notificationModal");
  if (!modal) return;

  document.getElementById("notificationModalContent").innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <h3 style="font-size: 1.15rem;">Notifications</h3>
      <button class="btn btn-secondary btn-sm" onclick="document.getElementById('notificationModal').classList.remove('open'); render();">Close</button>
    </div>

    ${userNotes.length === 0 ? `
      <div style="text-align: center; padding: 30px; color: var(--text-muted);">No new notifications</div>
    ` : `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        ${userNotes.map(n => `
          <div style="padding: 12px 16px; border-radius: var(--radius-md); background: var(--bg-main); border-left: 3px solid var(--primary); cursor: pointer;" onclick="document.getElementById('notificationModal').classList.remove('open'); navigateTo('issue_detail', '${n.ticketId}')">
            <div style="font-weight: 700; font-size: 0.9rem; margin-bottom: 2px;">${n.title}</div>
            <div style="font-size: 0.82rem; color: var(--text-main); margin-bottom: 4px;">${n.message}</div>
            <div style="font-size: 0.72rem; color: var(--text-subtle);">${new Date(n.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
          </div>
        `).join('')}
      </div>
    `}
  `;

  modal.classList.add("open");
}

// ==========================================================================
// MAIN APP RENDER LOOP
// ==========================================================================

function render() {
  const root = document.getElementById("appRoot");
  if (!root) return;

  let viewHtml = "";

  switch (state.currentView) {
    case "student_dashboard":
      viewHtml = renderStudentDashboard();
      break;
    case "report_wizard":
      viewHtml = renderReportWizard();
      break;
    case "my_issues":
      viewHtml = renderMyIssues();
      break;
    case "issue_detail":
      viewHtml = renderIssueDetail();
      break;
    case "staff_dashboard":
      viewHtml = renderStaffDashboard();
      break;
    case "admin_overview":
      viewHtml = renderAdminOverview();
      break;
    case "admin_issues":
      viewHtml = renderAdminOverview(); // Filterable table
      break;
    case "admin_staff":
      viewHtml = renderAdminStaff();
      break;
    case "admin_locations":
      viewHtml = renderAdminLocations();
      break;
    case "admin_analytics":
      viewHtml = renderAdminAnalytics();
      break;
    default:
      viewHtml = renderStudentDashboard();
  }

  root.innerHTML = renderHeader() + viewHtml;
}

// Initial Boot
document.addEventListener("DOMContentLoaded", () => {
  loadSavedState();
  render();
});
