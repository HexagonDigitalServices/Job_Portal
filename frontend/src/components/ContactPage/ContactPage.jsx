  const Toast = ({ message, type = "success", onClose }) => {
    const [isExiting, setIsExiting] = useState(false);
    const handleClose = () => {
      setIsExiting(true);
      setTimeout(onClose, 300);
    };
    React.useEffect(() => {
      const t = setTimeout(handleClose, 3000);
      return () => clearTimeout(t);
    }, []); // eslint-disable-line

    const borderClass =
      type === "success" ? "border-green-500" : "border-red-500";

    return (
      <div
        className={s.toastContainer(borderClass, isExiting)}
        role="status"
        aria-live="polite"
      >
        {type === "success" ? (
          <svg className={s.toastSuccessIcon} viewBox="0 0 24 24" fill="none">
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M7 13l2.5 2.5L17 8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg className={s.toastErrorIcon} viewBox="0 0 24 24" fill="none">
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M15 9L9 15M9 9l6 6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        <p className={s.toastMessage}>{message}</p>
        <button
          onClick={handleClose}
          className={s.toastCloseButton}
          aria-label="Close notification"
        >
          <svg className={s.toastCloseIcon} viewBox="0 0 24 24" fill="none">
            <path
              d="M6 6l12 12M6 18L18 6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    );
  };

   
                  <div>
                    <h3 className={s.leftPanelTitle}>Let's Talk</h3>
                    <p className={s.leftPanelDescription}>
                      Have a project in mind or just want to chat? Reach out to
                      us through any of these channels.
                    </p>
                    <div className={s.contactInfoList}>
                      <div className={s.contactItem}>
                        <div className={s.contactIconWrapper}>
                          <MapPin className={s.mapIcon} />
                        </div>
                        <div>
                          <p className={s.contactLabel}>Visit us</p>
                          <p className={s.contactValue}>
                            123 Business Ave, Suite 100
                            <br />
                            San Francisco, CA 94107
                          </p>
                        </div>
                      </div>

                      <div className={s.contactItem}>
                        <div className={s.contactIconWrapper}>
                          <Mail className={s.mailIcon} />
                        </div>
                        <div>
                          <p className={s.contactLabel}>Email us</p>
                          <p className={s.contactValue}>
                            hello@jobportal.com
                            <br />
                            support@jobportal.com
                          </p>
                        </div>
                      </div>

                      <div className={s.contactItem}>
                        <div className={s.contactIconWrapper}>
                          <Phone className={s.phoneIcon} />
                        </div>
                        <div>
                          <p className={s.contactLabel}>Call us</p>
                          <p className={s.contactValue}>+1 (555) 123-4567</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={s.leftPanelFooter}>
                    We typically reply within 1–2 business days.
                  </div>
             