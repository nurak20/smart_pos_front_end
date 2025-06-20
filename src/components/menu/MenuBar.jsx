import React from "react";
import { NavLink } from "react-router-dom";

const MenuBar = ({ items }) => {
    return (
        <div className="menu-bar">
            <h3>Admin Dashboard</h3>
            <ul>
                {items.map((item) => (
                    <li key={item.id}>
                        <NavLink
                            to={item.path}
                            className={({ isActive }) => (isActive ? "active-link" : "")}
                        >
                            {item.name}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MenuBar;
