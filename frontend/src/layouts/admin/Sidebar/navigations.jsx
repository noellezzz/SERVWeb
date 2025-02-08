
import DashboardIcon from "@mui/icons-material/Dashboard";
import BarChartIcon from "@mui/icons-material/BarChart";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import SettingsIcon from "@mui/icons-material/Settings";
import GroupIcon from "@mui/icons-material/Group";
import ReportIcon from "@mui/icons-material/Description";
import RateReviewIcon from '@mui/icons-material/RateReview';

export const NAVIGATION = [
    { type: "menu", segment: "", title: "Dashboard", icon: <DashboardIcon /> },
    { type: "title", title: "Sentiment Analysis" },
    { type: "menu", segment: "feedbacks", title: "Feedbacks", icon: <RateReviewIcon /> },
    { type: "menu", segment: "assessments", title: "Assessments", icon: <NoteAltIcon /> },
    { type: "menu", segment: "reports", title: "Reports", icon: <ReportIcon /> },
    // { type: "menu", segment: "analytics", title: "Analytics", icon: <BarChartIcon /> },

    { type: "title", title: "Management", },
    // { type: "menu", segment: "services", title: "Manage Services", icon: <GroupIcon /> },
    { type: "menu", segment: "users", title: "Manage Users", icon: <GroupIcon /> },
    // { type: "menu", segment: "employees", title: "Manage Employees", icon: <GroupIcon /> },
    { type: "menu", segment: "settings", title: "Settings", icon: <SettingsIcon /> },
];
