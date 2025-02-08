import React, { useEffect, useState } from "react";
import logo from "@/assets/logo.png";
import { useLocation, useNavigate } from "react-router-dom";
import { NAVIGATION } from "./navigations";
import NavTitle from "./NavTitle";
import NavLink from "./NavLink";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "@/states/slices/theme.slice";
import { ChevronLeft } from "@mui/icons-material";

export default function Sidebar() {
    const navigate = useNavigate();
    const loc = useLocation();
    const dispatch = useDispatch();
    const { isSidebarOpen } = useSelector((state) => state.theme);

    const [navItems, setNavItems] = useState([]);
    const [current, setCurrent] = useState(loc.pathname.split("admin/")[1]);

    useEffect(() => {
        setNavItems(NAVIGATION);
    }, []);


    return isSidebarOpen && (
        <aside className="navbar relative w-64 font-poppins">
            <div className="w-full p-5 flex items-center gap-2 ">
                {/* Logo Section */}
                <div className="w-full text-2xl flex items-center gap-2 pl-7 pt-4">
                    <img src={logo} alt="Logo" className="w-12 h-12" />
                    <span>S.E.R.V</span>
                </div>
                {/* Sidebar Toggle Button */}
                <button
                    className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-md"
                    onClick={() => dispatch(toggleSidebar())}
                >
                    <ChevronLeft />
                </button>

            </div>
            <nav className="pl-7 overflow-y-auto h-5/6 pb-20">
                {navItems.map((item, idx) => {
                    if (item.type === "menu") {
                        item.isActive = item.segment === current;
                        item.onClick = () => {
                            navigate(`/admin/${item.segment}`);
                            setCurrent(item.segment);
                        };
                        return <NavLink item={item} key={idx} />;
                    }
                    if (item.type === "title") {
                        return <NavTitle item={item} key={idx} />;
                    }
                })}
            </nav>
            {/* Logout Button */}
            <div className="absolute bottom-0 w-full p-5">
                <button
                    className="w-full py-2 bg-red-500 text-white rounded-md"
                    onClick={() => {
                        localStorage.removeItem("token");
                        navigate("/login");
                    }}
                >
                    Logout
                </button>
            </div>
        </aside>
    );
}

