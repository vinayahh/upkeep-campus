/**
 * UPKEEP - Campus Maintenance & Issue Management Platform
 * Initial Demo Data Store
 */

const INITIAL_DATA = {
  currentUser: {
    id: "user_stu_1",
    name: "Alex Vance",
    email: "alex.vance@campus.edu",
    role: "student", // "student" | "staff" | "admin"
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    department: "Computer Science"
  },
  
  users: [
    {
      id: "user_stu_1",
      name: "Alex Vance",
      email: "alex.vance@campus.edu",
      role: "student",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      department: "Computer Science"
    },
    {
      id: "user_staff_1",
      name: "Arun Kumar",
      email: "arun.k@campus.edu",
      role: "staff",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      department: "Equipment & Electrical",
      skills: ["Equipment", "Electrical", "Wi-Fi / Network"],
      activeTasks: 3,
      completedTasks: 24,
      availability: "available" // "available" | "on_task" | "off_duty"
    },
    {
      id: "user_staff_2",
      name: "Maria Santos",
      email: "maria.s@campus.edu",
      role: "staff",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      department: "Plumbing & Sanitization",
      skills: ["Plumbing", "Washroom"],
      activeTasks: 2,
      completedTasks: 31,
      availability: "available"
    },
    {
      id: "user_staff_3",
      name: "David Chen",
      email: "david.c@campus.edu",
      role: "staff",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      department: "HVAC & Climate Control",
      skills: ["AC / Fan", "Electrical"],
      activeTasks: 1,
      completedTasks: 19,
      availability: "on_task"
    },
    {
      id: "user_staff_4",
      name: "Sarah Jenkins",
      email: "sarah.j@campus.edu",
      role: "admin",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
      department: "Facilities Management"
    }
  ],

  categories: [
    { id: "cat_elec", name: "Electrical", icon: "zap", color: "#F59E0B", description: "Wiring, sockets, lighting, and power outlets" },
    { id: "cat_plumb", name: "Plumbing", icon: "droplet", color: "#3B82F6", description: "Water leaks, pipes, drainage, and faucets" },
    { id: "cat_furn", name: "Furniture", icon: "armchair", color: "#8B5CF6", description: "Desks, chairs, whiteboards, and doors" },
    { id: "cat_wifi", name: "Wi-Fi / Network", icon: "wifi", color: "#10B981", description: "Routers, slow connection, ethernet ports" },
    { id: "cat_ac", name: "AC / Fan", icon: "wind", color: "#06B6D4", description: "Air conditioning cooling, fan noise, thermostats" },
    { id: "cat_equip", name: "Equipment", icon: "monitor", color: "#6366F1", description: "Projectors, lab equipment, audio systems" },
    { id: "cat_wash", name: "Washroom", icon: "bath", color: "#EC4899", description: "Cleanliness, paper supplies, soap dispenser" },
    { id: "cat_class", name: "Classroom", icon: "book-open", color: "#14B8A6", description: "Podiums, markers, smartboards, window blinds" },
    { id: "cat_other", name: "Other", icon: "help-circle", color: "#64748B", description: "General campus maintenance inquiries" }
  ],

  locations: [
    {
      building: "Block A",
      floors: [
        { name: "Ground Floor", rooms: ["Room S101", "Room S102", "Faculty Lounge"] },
        { name: "1st Floor", rooms: ["Room S105", "Lab 1", "Auditorium Main"] },
        { name: "2nd Floor", rooms: ["Room S204", "Lab 3", "Conference Hall A"] }
      ]
    },
    {
      building: "Block B",
      floors: [
        { name: "Ground Floor", rooms: ["Cafeteria East", "Library Reception"] },
        { name: "1st Floor", rooms: ["Room 304", "Computer Lab 2"] },
        { name: "2nd Floor", rooms: ["Study Hall B", "Server Room"] }
      ]
    },
    {
      building: "Science Tower",
      floors: [
        { name: "3rd Floor", rooms: ["Physics Lab 4", "Chemistry Research Room"] },
        { name: "4th Floor", rooms: ["BioTech Center", "Lecture Hall 401"] }
      ]
    }
  ],

  issues: [
    {
      id: "UPK-1024",
      ticketId: "UPK-1024",
      title: "Projector display flicker & no audio",
      description: "The ceiling projector in Room S204 flickers intermittently during lectures and audio HDMI port is disconnected.",
      category: "Equipment",
      building: "Block A",
      floor: "2nd Floor",
      room: "Room S204",
      priority: "high", // "low" | "medium" | "high" | "emergency"
      status: "in_progress", // "reported" | "under_review" | "assigned" | "in_progress" | "resolved" | "reopened"
      reportedBy: "Alex Vance",
      reporterEmail: "alex.vance@campus.edu",
      assignedToId: "user_staff_1",
      assignedToName: "Arun Kumar",
      photoUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80",
      createdAt: "2026-10-03T10:42:00.000Z",
      updatedAt: "2026-10-03T15:40:00.000Z",
      resolutionConfirmed: null, // true | false | null
      updates: [
        { id: "u1", author: "Alex Vance", role: "Student", message: "Issue reported with high priority rating.", timestamp: "2026-10-03T10:42:00.000Z" },
        { id: "u2", author: "Sarah Jenkins", role: "Admin", message: "Issue reviewed and prioritized. Assigned to Arun Kumar.", timestamp: "2026-10-03T11:20:00.000Z" },
        { id: "u3", author: "Arun Kumar", role: "Staff", message: "Inspected wiring. Replacement HDMI cable and bulb module ordered.", timestamp: "2026-10-03T15:40:00.000Z" }
      ]
    },
    {
      id: "UPK-1023",
      ticketId: "UPK-1023",
      title: "Wi-Fi access point disconnected",
      description: "Campus-Secure Wi-Fi network is completely unavailable in Lab 3. Students cannot access course portals.",
      category: "Wi-Fi / Network",
      building: "Block A",
      floor: "2nd Floor",
      room: "Lab 3",
      priority: "high",
      status: "in_progress",
      reportedBy: "Marcus Wright",
      reporterEmail: "marcus.w@campus.edu",
      assignedToId: "user_staff_1",
      assignedToName: "Arun Kumar",
      photoUrl: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=80",
      createdAt: "2026-10-03T09:15:00.000Z",
      updatedAt: "2026-10-03T12:00:00.000Z",
      resolutionConfirmed: null,
      updates: [
        { id: "u1", author: "Marcus Wright", role: "Student", message: "Submitted network connectivity report.", timestamp: "2026-10-03T09:15:00.000Z" },
        { id: "u2", author: "Arun Kumar", role: "Staff", message: "PoE switch in Block A closet rebooted. Testing signal quality.", timestamp: "2026-10-03T12:00:00.000Z" }
      ]
    },
    {
      id: "UPK-1022",
      ticketId: "UPK-1022",
      title: "AC unit cooling leak & strange noise",
      description: "Split air conditioner in Room 304 is leaking water onto desk #12 and vibrating heavily.",
      category: "AC / Fan",
      building: "Block B",
      floor: "1st Floor",
      room: "Room 304",
      priority: "emergency",
      status: "assigned",
      reportedBy: "Elena Rostova",
      reporterEmail: "elena.r@campus.edu",
      assignedToId: "user_staff_3",
      assignedToName: "David Chen",
      photoUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80",
      createdAt: "2026-10-03T08:30:00.000Z",
      updatedAt: "2026-10-03T08:45:00.000Z",
      resolutionConfirmed: null,
      updates: [
        { id: "u1", author: "Elena Rostova", role: "Student", message: "Emergency report submitted due to water dripping near electric outlet.", timestamp: "2026-10-03T08:30:00.000Z" },
        { id: "u2", author: "Sarah Jenkins", role: "Admin", message: "Flagger as Emergency. Assigned to HVAC specialist David Chen.", timestamp: "2026-10-03T08:45:00.000Z" }
      ]
    },
    {
      id: "UPK-1021",
      ticketId: "UPK-1021",
      title: "Broken armrest on lecture seat S-14",
      description: "Wooden armrest snapped off completely in Auditorium Main, leaving sharp edges.",
      category: "Furniture",
      building: "Block A",
      floor: "1st Floor",
      room: "Auditorium Main",
      priority: "medium",
      status: "reported",
      reportedBy: "Alex Vance",
      reporterEmail: "alex.vance@campus.edu",
      assignedToId: null,
      assignedToName: "Unassigned",
      photoUrl: "https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?w=600&auto=format&fit=crop&q=80",
      createdAt: "2026-10-02T16:20:00.000Z",
      updatedAt: "2026-10-02T16:20:00.000Z",
      resolutionConfirmed: null,
      updates: [
        { id: "u1", author: "Alex Vance", role: "Student", message: "Reported broken chair armrest.", timestamp: "2026-10-02T16:20:00.000Z" }
      ]
    },
    {
      id: "UPK-1020",
      ticketId: "UPK-1020",
      title: "Sink drainage clogged",
      description: "Leftmost sink in 2nd Floor Washroom is backing up water and overflowing onto the floor.",
      category: "Plumbing",
      building: "Block A",
      floor: "2nd Floor",
      room: "Room S204", // near S204 washroom
      priority: "high",
      status: "resolved",
      reportedBy: "Alex Vance",
      reporterEmail: "alex.vance@campus.edu",
      assignedToId: "user_staff_2",
      assignedToName: "Maria Santos",
      photoUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80",
      createdAt: "2026-10-01T11:00:00.000Z",
      updatedAt: "2026-10-02T14:10:00.000Z",
      resolvedAt: "2026-10-02T14:10:00.000Z",
      resolutionConfirmed: null, // Waiting student verification!
      updates: [
        { id: "u1", author: "Alex Vance", role: "Student", message: "Reported plumbing clog.", timestamp: "2026-10-01T11:00:00.000Z" },
        { id: "u2", author: "Maria Santos", role: "Staff", message: "Cleared trap obstruction and sanitized area. Issue resolved.", timestamp: "2026-10-02T14:10:00.000Z" }
      ]
    },
    {
      id: "UPK-1019",
      ticketId: "UPK-1019",
      title: "Tube light flickering violently",
      description: "Fluorescent tube light over white board in Room S102 keeps flashing.",
      category: "Electrical",
      building: "Block A",
      floor: "Ground Floor",
      room: "Room S102",
      priority: "low",
      status: "resolved",
      reportedBy: "Liam Connor",
      reporterEmail: "liam.c@campus.edu",
      assignedToId: "user_staff_1",
      assignedToName: "Arun Kumar",
      photoUrl: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&auto=format&fit=crop&q=80",
      createdAt: "2026-09-30T14:00:00.000Z",
      updatedAt: "2026-10-01T10:30:00.000Z",
      resolvedAt: "2026-10-01T10:30:00.000Z",
      resolutionConfirmed: true, // Confirmed fixed by student!
      updates: [
        { id: "u1", author: "Liam Connor", role: "Student", message: "Reported flickering ballast.", timestamp: "2026-09-30T14:00:00.000Z" },
        { id: "u2", author: "Arun Kumar", role: "Staff", message: "Replaced ballast with modern LED panel.", timestamp: "2026-10-01T10:30:00.000Z" },
        { id: "u3", author: "Liam Connor", role: "Student", message: "Confirmed issue resolved: 'Yes, it's fixed'.", timestamp: "2026-10-01T11:00:00.000Z" }
      ]
    },
    {
      id: "UPK-1018",
      ticketId: "UPK-1018",
      title: "Desktop Workstation #4 network card failure",
      description: "PC #4 in Computer Lab 2 cannot obtain IP address via DHCP.",
      category: "Equipment",
      building: "Block B",
      floor: "1st Floor",
      room: "Computer Lab 2",
      priority: "medium",
      status: "resolved",
      reportedBy: "Sophia Lin",
      reporterEmail: "sophia.l@campus.edu",
      assignedToId: "user_staff_1",
      assignedToName: "Arun Kumar",
      photoUrl: null,
      createdAt: "2026-09-28T09:10:00.000Z",
      updatedAt: "2026-09-29T15:00:00.000Z",
      resolvedAt: "2026-09-29T15:00:00.000Z",
      resolutionConfirmed: true,
      updates: [
        { id: "u1", author: "Arun Kumar", role: "Staff", message: "Replaced Ethernet patch lead and recrimped wall connector.", timestamp: "2026-09-29T15:00:00.000Z" }
      ]
    }
  ],

  notifications: [
    {
      id: "n1",
      userId: "user_stu_1",
      ticketId: "UPK-1024",
      icon: "wrench",
      title: "Ticket Assigned",
      message: "Your issue UPK-1024 (Projector) has been assigned to Arun Kumar.",
      read: false,
      timestamp: "2026-10-03T11:20:00.000Z"
    },
    {
      id: "n2",
      userId: "user_stu_1",
      ticketId: "UPK-1024",
      icon: "clock",
      title: "In Progress Update",
      message: "Arun Kumar updated status of UPK-1024 to In Progress.",
      read: false,
      timestamp: "2026-10-03T15:40:00.000Z"
    },
    {
      id: "n3",
      userId: "user_stu_1",
      ticketId: "UPK-1020",
      icon: "check-circle",
      title: "Issue Resolved - Action Required",
      message: "UPK-1020 (Sink clog) was marked as resolved. Please confirm if fixed.",
      read: false,
      timestamp: "2026-10-02T14:10:00.000Z"
    },
    {
      id: "n4",
      userId: "user_staff_1",
      ticketId: "UPK-1024",
      icon: "alert-circle",
      title: "New High Priority Task",
      message: "You were assigned to UPK-1024 in Room S204.",
      read: true,
      timestamp: "2026-10-03T11:20:00.000Z"
    }
  ]
};

// Preset demo photos for issue reporting simulation
const PRESET_DEMO_PHOTOS = [
  { label: "Broken Projector", url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80" },
  { label: "AC Dripping Water", url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80" },
  { label: "Wi-Fi Router Error", url: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=80" },
  { label: "Damaged Desk Chair", url: "https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?w=600&auto=format&fit=crop&q=80" },
  { label: "Sink Overflow", url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80" }
];
