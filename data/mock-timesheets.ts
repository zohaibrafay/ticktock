import type { Week, Entry } from "@/lib/schemas";



export const Weeks: Week[] = [
  { id: "04-w1", weekNo: 1, startDate: "2026-04-01", endDate: "2026-04-05", status: "Completed" },
  { id: "04-w2", weekNo: 2, startDate: "2026-04-06", endDate: "2026-04-12", status: "Completed" },
  { id: "04-w3", weekNo: 3, startDate: "2026-04-13", endDate: "2026-04-19", status: "Incomplete" },
  { id: "04-w4", weekNo: 4, startDate: "2026-04-20", endDate: "2026-04-26", status: "Missing" },
  { id: "05-w1", weekNo: 5, startDate: "2026-04-27", endDate: "2026-05-03", status: "Completed" },
  { id: "05-w2", weekNo: 6, startDate: "2026-05-04", endDate: "2026-05-10", status: "Incomplete" },
  { id: "05-w3", weekNo: 7, startDate: "2026-05-11", endDate: "2026-05-17", status: "Incomplete" },
  { id: "05-w4", weekNo: 8, startDate: "2026-05-18", endDate: "2026-05-24", status: "Missing" },
];


export const TimeSheets: Entry[] = [
  { id: "T01", wId: "04-w1", date: "2026-04-01", hrs: 8, description: "Sprint kickoff", project: "Alert", workType: "Planning" },
  { id: "T02", wId: "04-w1", date: "2026-04-02", hrs: 6, description: "UI wireframes", project: "Alert", workType: "Design" },
  { id: "T03", wId: "04-w1", date: "2026-04-03", hrs: 5, description: "Project setup", project: "Balance", workType: "Deploy" },
  { id: "T04", wId: "04-w1", date: "2026-04-05", hrs: 4, description: "Bug fixing", project: "Schedule", workType: "Bug Fix" },

  { id: "T05", wId: "04-w2", date: "2026-04-06", hrs: 7, description: "Dashboard development", project: "Alert", workType: "Development" },
  { id: "T06", wId: "04-w2", date: "2026-04-08", hrs: 5, description: "Requirement meeting", project: "Schedule", workType: "Requirement" },
  { id: "T07", wId: "04-w2", date: "2026-04-10", hrs: 6, description: "Feature testing", project: "Compliance", workType: "Testing" },
  { id: "T08", wId: "04-w2", date: "2026-04-12", hrs: 4, description: "Code review", project: "Balance", workType: "Approval" },

  { id: "T09", wId: "04-w3", date: "2026-04-13", hrs: 8, description: "Component optimization", project: "Alert", workType: "Development" },
  { id: "T10", wId: "04-w3", date: "2026-04-15", hrs: 5, description: "UX polishing", project: "Internal", workType: "Design" },
  { id: "T11", wId: "04-w3", date: "2026-04-17", hrs: 6, description: "Integration tests", project: "Compliance", workType: "Testing" },
  { id: "T12", wId: "04-w3", date: "2026-04-19", hrs: 4, description: "Release prep", project: "Balance", workType: "Under Review" },

  { id: "T13", wId: "04-w4", date: "2026-04-20", hrs: 7, description: "Feature module", project: "Alert", workType: "Feature" },
  { id: "T14", wId: "04-w4", date: "2026-04-22", hrs: 5, description: "Performance tuning", project: "Compliance", workType: "Bug Fix" },
  { id: "T15", wId: "04-w4", date: "2026-04-24", hrs: 6, description: "Sprint demo", project: "Balance", workType: "Planning" },
  { id: "T16", wId: "04-w4", date: "2026-04-26", hrs: 4, description: "Docs update", project: "Internal", workType: "Development" },

  { id: "T17", wId: "05-w1", date: "2026-04-27", hrs: 8, description: "API integration", project: "Alert", workType: "Development" },
  { id: "T18", wId: "05-w1", date: "2026-04-29", hrs: 6, description: "Regression testing", project: "Schedule", workType: "Testing" },
  { id: "T19", wId: "05-w1", date: "2026-05-01", hrs: 5, description: "UI polishing", project: "Alert", workType: "Design" },
  { id: "T20", wId: "05-w1", date: "2026-05-03", hrs: 3, description: "Deployment check", project: "Balance", workType: "Deploy" },

  { id: "T21", wId: "05-w2", date: "2026-05-04", hrs: 7, description: "Feature enhancement", project: "Alert", workType: "Feature" },
  { id: "T22", wId: "05-w2", date: "2026-05-06", hrs: 5, description: "Requirement review", project: "Schedule", workType: "Requirement" },
  { id: "T23", wId: "05-w2", date: "2026-05-08", hrs: 6, description: "QA validation", project: "Compliance", workType: "UAT Test" },
  { id: "T24", wId: "05-w2", date: "2026-05-10", hrs: 4, description: "Approval meeting", project: "Balance", workType: "Approval" },

  { id: "T25", wId: "05-w3", date: "2026-05-11", hrs: 8, description: "Accessibility updates", project: "Alert", workType: "Development" },
  { id: "T26", wId: "05-w3", date: "2026-05-13", hrs: 5, description: "Bug analysis", project: "Compliance", workType: "Bug Fix" },
  { id: "T27", wId: "05-w3", date: "2026-05-15", hrs: 6, description: "Automation setup", project: "Compliance", workType: "Testing" },
  { id: "T28", wId: "05-w3", date: "2026-05-17", hrs: 4, description: "Sprint planning", project: "Internal", workType: "Planning" },

  { id: "T29", wId: "05-w4", date: "2026-05-18", hrs: 7, description: "Feature delivery", project: "Alert", workType: "Feature" },
  { id: "T30", wId: "05-w4", date: "2026-05-20", hrs: 5, description: "Beta testing", project: "Balance", workType: "Beta" },
  { id: "T31", wId: "05-w4", date: "2026-05-22", hrs: 6, description: "Release deployment", project: "Schedule", workType: "Deploy" },
  { id: "T32", wId: "05-w4", date: "2026-05-24", hrs: 4, description: "Retrospective", project: "Internal", workType: "Planning" },
];