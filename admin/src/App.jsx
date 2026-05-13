const location = useLocation();
const [showTopBtn, setShowTopBtn] = useState(false);

/* Scroll to top on route change */
useEffect(() => {
  if (location.hash) {
    const id = location.hash.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "auto", block: "start" });
      return;
    }
  }
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}, [location.pathname, location.hash]);

/* Show button when scrolling */
useEffect(() => {
  const handleScroll = () => {
    setShowTopBtn(window.scrollY > 300);
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);

/* Scroll to top click */
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

{
  /* Go To Top Button */
}
{
  showTopBtn && (
    <button
      onClick={scrollToTop}
      className="
            fixed bottom-6 right-6
             text-white
            p-3 rounded-full
            shadow-lg 
            transition-all duration-300
            cursor-pointer
            z-50
             bg-blue-400  hover:bg-blue-600
          "
    >
      <SquareArrowUp size={22} />
    </button>
  );
}
