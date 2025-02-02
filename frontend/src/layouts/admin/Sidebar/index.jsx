import React, { useEffect, useState } from "react";
import logo from "@/assets/logo.png";
import { useLocation, useNavigate } from "react-router-dom";
import { NAVIGATION } from "./navigations";
import NavTitle from "./NavTitle";
import NavLink from "./NavLink";


export default function Sidebar() {
    const [navItems, setNavItems] = useState([]);
    const navigate = useNavigate();
    const loc = useLocation();
    const [current, setCurrent] = useState(loc.pathname.split("admin/")[1]);

    useEffect(() => {
        setNavItems(NAVIGATION);
    }, []);


    return (

        <aside className="navbar fixed top-0 left-0 h-full w-64 shadow-2xl font-poppins">
            <div className="w-full p-5 flex gap-2 ">
                {/* Logo Section */}
                <div className="w-full text-2xl flex items-center gap-2 pl-7 pt-4">
                    <img src={logo} alt="Logo" className="w-12 h-12" />
                    <span>S.E.R.V</span>
                </div>
            </div>
            <nav className="mt-8 space-y-2 pl-7">
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
        </aside>
    );
}

