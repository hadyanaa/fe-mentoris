import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";

// Assume these icons are imported from an icon library
import {
  ChevronDownIcon,
  DocsIcon,
  GridIcon,
  HorizontaLDots,
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
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/",
  },
  {
    icon: <ListIcon />,
    name: "Master Data",
    subItems: [
      { name: "Data Pengguna", path: "/master/data-pengguna", pro: false },
      { name: "Data Kelompok", path: "/master/data-kelompok", pro: false },
      { name: "Data Berita", path: "/master/data-berita", pro: false },
      { name: "Data Jenjang", path: "/master/data-jenjang", pro: false },
      { name: "Data Angkatan", path: "/master/data-angkatan", pro: false }
    ],
  },
  {
    icon: <TableIcon />,
    name: "Assesment",
    subItems: [
      { name: "Tema", path: "/assesment/tema", pro: false },
      { name: "Assesment Answer", path: "/assesment/answer", pro: false },
      { name: "Assesment Questions", path: "/assesment/question", pro: false },
    ],
  },
  {
    icon: <PageIcon />,
    name: "Kurikulum",
    path: "/kurikulum",
  },
  {
    icon: <DocsIcon />,
    name: "Presensi",
    path: "/presensi",
  },
];
const mentorNav: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/",
  },
  {
    icon: <TableIcon />,
    name: "Assesment",
    subItems: [
      { name: "Tema", path: "/assesment/tema", pro: false },
      { name: "Assesment Answer", path: "/assesment/answer", pro: false },
      { name: "Assesment Questions", path: "/assesment/question", pro: false },
    ],
  },
  {
    icon: <PageIcon />,
    name: "Kurikulum",
    path: "/kurikulum",
  },
  {
    icon: <DocsIcon />,
    name: "Presensi",
    path: "/presensi",
  },
];
const menteeNav: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/",
  },
  {
    icon: <TableIcon />,
    name: "Assesment",
    subItems: [
      { name: "Assesment Answer", path: "/assesment/answer", pro: false },
    ],
  },
  {
    icon: <DocsIcon />,
    name: "Presensi",
    path: "/presensi",
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => location.pathname === path;
  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    ["main"].forEach((menuType) => {
      const items = adminNav;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={`menu-item-icon-size  ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
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
                <span
                  className={`menu-item-icon-size ${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
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
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
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
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            pro
                          </span>
                        )}
                      </span>
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

  // get dummy user
  const [user, setUser] = useState<{
    nama:string,
    role: string,
    angkatan: number
  }[]>([]);
  useEffect(() => {
    fetch('/src/api-dummy/user.json')
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => console.error("Gagal mengambil data:", err));
  }, []);

  // ubah angka untuk mengubah sidebar: 0-1 admin, 2 untuk mentor, 3 untuk mentee 
  let sampleUser = user[3]

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <div className="flex flex-row gap-4 dark:text-white">
                <img
                  className="dark:hidden"
                  src="/images/logo/bkpk-sq.png"
                  alt="Logo"
                  width={60}
                  height={20}
                />
                <img
                  className="hidden dark:block"
                  src="/images/logo/bkpk-w.png"
                  alt="Logo"
                  width={60}
                  height={40}
                />
                <div className="flex flex-col justify-center items-center">
                  <h3 className="font-semibold text-xl">Mentoris</h3>
                  <p>BKPK STTNF</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <img
                className="dark:hidden"
                src="/images/logo/bkpk-sq.png"
                alt="Logo"
                width={60}
                height={60}
              />
              <img
                className="hidden dark:block"
                src="/images/logo/bkpk-w.png"
                alt="Logo"
                width={60}
                height={40}
              />
            </>
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots className="size-6" />
                )}
              </h2>
              {renderMenuItems(
                sampleUser?.role === "super" || sampleUser?.role === "admin" ? adminNav :
                sampleUser?.role === "mentor" ? mentorNav : menteeNav
                , "main")}
            </div>

          </div>
        </nav>
        {/* {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null} */}
      </div>
    </aside>
  );
};

export default AppSidebar;
