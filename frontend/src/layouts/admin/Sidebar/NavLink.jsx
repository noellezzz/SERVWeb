
const NavLink = ({ item }) => {
    const active = "bg-primary text-white rounded-l-full";

    return (
        <div
            key={item.segment}
            className={`flex items-center p-3 cursor-pointer ${item?.isActive ? active : ""} `}
            onClick={item?.onClick}
        >
            {item.icon}
            <span className="ml-2">{item.title}</span>
        </div>
    );
};

export default NavLink;