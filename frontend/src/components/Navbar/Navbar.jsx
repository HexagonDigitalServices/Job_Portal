const navItems = [
  { id: "home", label: "Home", path: "/", icon: <Home size={18} /> },
  { id: "jobs", label: "Jobs", path: "/jobs", icon: <Search size={18} /> },
  {
    id: "companies",
    label: "Companies",
    path: "/companies",
    icon: <Briefcase size={18} />,
  },
  { id: "roles", label: "Roles", path: "/roles", icon: <UserCog size={18} /> },
  { id: "saved", label: "Saved", path: "/saved", icon: <Bookmark size={18} /> },
  {
    id: "contact",
    label: "Contact",
    path: "/contact",
    icon: <UserPen size={18} />,
  },
];
const STORAGE_KEY = "jobportal_user";

useEffect(() => {
  const handleScroll = () => setIsScrolled(window.scrollY > 10);
  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);

useEffect(() => {
  const path = location.pathname || "/";
  const matched =
    navItems.find((i) => i.path === path) ||
    navItems.find((i) => path.startsWith(i.path) && i.path !== "/");
  setActiveNavItem(matched ? matched.id : "home");
}, [location]);

useEffect(() => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) setUser(JSON.parse(raw));
    else setUser(null);
  } catch (e) {
    setUser(null);
  }
  setIsUserMenuOpen(false);
}, [location]);

useEffect(() => {
  const onStorage = (e) => {
    if (e.key === STORAGE_KEY) {
      try {
        setUser(e.newValue ? JSON.parse(e.newValue) : null);
      } catch {
        setUser(null);
      }
    }
  };
  window.addEventListener("storage", onStorage);
  return () => window.removeEventListener("storage", onStorage);
}, []);

useEffect(() => {
  const onClick = (e) => {
    if (
      isUserMenuOpen &&
      userMenuRef.current &&
      !userMenuRef.current.contains(e.target)
    ) {
      setIsUserMenuOpen(false);
    }
  };
  document.addEventListener("mousedown", onClick);
  return () => document.removeEventListener("mousedown", onClick);
}, [isUserMenuOpen]);

useEffect(() => {
  const onResize = () => {
    if (window.innerWidth >= 1024) {
      setIsMobileMenuOpen(false);
    }
  };
  window.addEventListener("resize", onResize);
  return () => window.removeEventListener("resize", onResize);
}, []);
