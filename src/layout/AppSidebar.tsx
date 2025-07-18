import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ChevronDownIcon,
  DocsIcon,
  GridIcon,
  HorizontaLDots,
  InfoIcon,
  ListIcon,
  PageIcon,
  TableIcon,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const adminNav: NavItem[] = [
  { icon: <GridIcon />, name: "Dashboard", path: "/dashboard" },
  {
    icon: <ListIcon />,
    name: "Master Data",
    subItems: [
      { name: "Data Pengguna", path: "/master/data-pengguna" },
      // { name: "Data Kelompok", path: "/master/data-kelompok" },
      { name: "Data Berita", path: "/master/data-berita" },
      { name: "Data Jenjang", path: "/master/data-jenjang" },
      { name: "Data Angkatan", path: "/master/data-angkatan" },
    ],
  },
  {
    icon: <TableIcon />,
    name: "Assesment",
    subItems: [
      { name: "Tema", path: "/assesment/tema" },
      { name: "Assesment Answer", path: "/assesment/answer" },
      { name: "Assesment Questions", path: "/assesment/question" },
    ],
  },
  { icon: <GridIcon />, name: "Kurikulum", path: "/kurikulum" },
  { name: "Presensi", icon: <PageIcon />, path: "/presensi" },
];
const mentorNav: NavItem[] = [
   { icon: <GridIcon />, name: "Home", path: "/" },
  {
    name: "Assesment",
    icon: <TableIcon />,
    subItems: [
      { name: "Kurikulum", path: "/kurikulum" },
      { name: "Assesment Answer", path: "/assesment/answer" },
      { name: "Assesment Questions", path: "/assesment/question" },
    ],
  },
  { name: "Presensi", icon: <PageIcon />, path: "/presensi" },
  { name: "Informasi", icon: <InfoIcon />, path: "/info" },
];
const menteeNav: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/",
  },
  {
    name: "Assesment",
    icon: <TableIcon />,
    subItems: [{ name: "Assesment Questions", path: "/assesment/question" }],
  },
  { name: "Informasi", icon: <InfoIcon />, path: "/info" },
 
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    let matched = false;
    const items = getNavItems();
    items.forEach((nav, index) => {
      if (nav.subItems) {
        nav.subItems.forEach((subItem) => {
          if (isActive(subItem.path)) {
            setOpenSubmenu({ type: "main", index });
            matched = true;
          }
        });
      }
    });
    if (!matched) setOpenSubmenu(null);
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `main-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number) => {
    setOpenSubmenu((prev) =>
      prev?.index === index ? null : { type: "main", index }
    );
  };

  const getNavItems = (): NavItem[] => {
    const role = localStorage.getItem("role");
    if (role === "super admin" || role === "admin") return adminNav;
    if (role === "mentor") return mentorNav;
    return menteeNav;
  };

  const renderMenuItems = (items: NavItem[]) => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index)}
              className={`menu-item group ${
                openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              }`}
            >
              <span className="menu-item-icon-size">
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.index === index ? "rotate-180 text-brand-500" : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span className="menu-item-icon-size">
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`main-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.index === index
                    ? `${subMenuHeight[`main-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed top-0 mt-16 lg:mt-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 h-screen z-50 border-r border-gray-200
        transition-all duration-300 ease-in-out
        ${isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <div className="flex flex-row gap-4 dark:text-white">
              <img src="/images/logo/bkpk-sq.png" alt="Logo" width={60} />
              <div className="flex flex-col justify-center items-center">
                <h3 className="font-semibold text-xl">Mentoris</h3>
                <p>BKPK STTNF</p>
              </div>
            </div>
          ) : (
            <img src="/images/logo/bkpk-sq.png" alt="Logo" width={60} />
          )}
        </Link>
      </div>

      <div className="flex flex-col overflow-y-auto no-scrollbar">
        <nav className="mb-6">
          <h2
            className={`mb-4 text-xs uppercase text-gray-400 ${
              !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
            }`}
          >
            {isExpanded || isHovered || isMobileOpen ? "Menu" : <HorizontaLDots className="size-6" />}
          </h2>
          {renderMenuItems(getNavItems())}
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
