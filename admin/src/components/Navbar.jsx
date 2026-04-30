const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", Icon: Home },
  { key: "jobs", label: "Jobs", Icon: Briefcase },
  { key: "listJob", label: "List Job", Icon: List },
  { key: "company", label: "Companies", Icon: Building },
  {
    key: "companyQuestions",
    label: "Company Questions",
    Icon: Building,
    dropdown: [{ key: "listCompanyQ", label: "List Company Questions" }],
  },
  {
    key: "roleQuestions",
    label: "Role Questions",
    Icon: UserCheck,
    dropdown: [{ key: "listRoleQ", label: "List Role Questions" }],
  },
];

const ROUTES = {
  dashboard: "/",
  company: "/companies",
  jobs: "/addjobs",
  listJob: "/list/jobs",
  companyQuestions: "/company-questions",
  listCompanyQ: "/list/company-questions",
  roleQuestions: "/role-questions",
  listRoleQ: "/list/role-questions",
  login: "/login",
};



  const [active, setActive] = useState(pathToKey(location.pathname));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navContainerRef = useRef(null);
  const itemRefs = useRef({});
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  const [openDropdownKey, setOpenDropdownKey] = useState(null);
  const navCloseTimeoutRef = useRef(null);

  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200,
  );

  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  const isLGOnly = windowWidth >= 1024 && windowWidth < 1280;

  useEffect(() => {
    if (!isLGOnly) return;
    const handleDocClick = (e) => {
      const container = navContainerRef.current;
      if (!container) return;
      if (!container.contains(e.target)) {
        setOpenDropdownKey(null);
      }
    };
    document.addEventListener("mousedown", handleDocClick);
    return () => document.removeEventListener("mousedown", handleDocClick);
  }, [isLGOnly]);



  // Measure and update indicator position – useLayoutEffect prevents flicker
  const updateIndicator = useCallback(() => {
    const container = navContainerRef.current;
    const activeEl = itemRefs.current[active];
    if (!container || !activeEl) {
      setIndicatorStyle({ left: 0, width: 0 });
      return;
    }
    const containerRect = container.getBoundingClientRect();
    const activeRect = activeEl.getBoundingClientRect();
    setIndicatorStyle({
      left: activeRect.left - containerRect.left,
      width: activeRect.width,
    });
  }, [active]);

  useLayoutEffect(() => {
    updateIndicator();
    let rafId = null;
    const handleResize = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateIndicator);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [updateIndicator]);



  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const closeTimeoutRef = useRef(null);
  const userMenuContainerRef = useRef(null);

  const openUserMenu = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setUserMenuOpen(true);
  };
  const startCloseTimer = (delay = 250) => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => {
      setUserMenuOpen(false);
      closeTimeoutRef.current = null;
    }, delay);
  };

  const openNavDropdown = (key) => {
    if (navCloseTimeoutRef.current) {
      clearTimeout(navCloseTimeoutRef.current);
      navCloseTimeoutRef.current = null;
    }
    setOpenDropdownKey(key);
  };
  const closeNavDropdownDelayed = (delay = 200) => {
    if (navCloseTimeoutRef.current) clearTimeout(navCloseTimeoutRef.current);
    navCloseTimeoutRef.current = setTimeout(() => {
      setOpenDropdownKey(null);
      navCloseTimeoutRef.current = null;
    }, delay);
  };

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
      if (navCloseTimeoutRef.current) clearTimeout(navCloseTimeoutRef.current);
    };
  }, []);