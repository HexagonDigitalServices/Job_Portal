const Toast = ({ message, type = "success", onClose }) => {
  const [isExiting, setIsExiting] = useState(false);
  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 300);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const borderClass =
    type === "success"
      ? "border-green-500"
      : type === "info"
        ? "border-blue-500"
        : "border-red-500";

  return (
    <div
      className={s.toastContainer(borderClass, isExiting)}
      style={s.toastAnimationStyle}
      role="status"
      aria-live="polite"
    >
      {type === "success" ? (
        <CheckCircle className={s.toastSuccessIcon} />
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
        <X className={s.toastCloseIcon} />
      </button>
    </div>
  );
};

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [view, setView] = useState("login");
  const [resetEmail, setResetEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = s.globalStyles;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);


              {view === "forgot" && (
                <>
                  <h2 className={s.headerTitle}>Forgot Password</h2>
                  <p className={s.headerSubtitle}>
                    Enter your email to receive a reset code.
                  </p>

                  <form onSubmit={handleForgotPassword} className={s.form}>
                    <div>
                      <label className={s.label}>Email address</label>
                      <div className={s.inputWrapper}>
                        <Mail className={s.inputIcon} />
                        <input
                          type="email"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          required
                          className={s.inputField}
                          placeholder="you@domain.com"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className={s.submitButtonForgot}
                    >
                      {isLoading ? "Sending OTP..." : "Send Reset Code"}
                    </button>

                    <button
                      type="button"
                      onClick={() => setView("login")}
                      className={s.secondaryButton}
                    >
                      Back to Login
                    </button>
                  </form>
                </>
              )}

              {view === "reset" && (
                <>
                  <h2 className={s.headerTitle}>Reset Password</h2>
                  <p className={s.headerSubtitle}>
                    Enter the code sent to {resetEmail}
                  </p>

                  <form onSubmit={handleResetPassword} className={s.form}>
                    <div>
                      <label className={s.label}>6-Digit Code</label>
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                        className={s.otpInput}
                        maxLength={6}
                        placeholder="000000"
                      />
                    </div>

                    <div>
                      <label className={s.label}>New Password</label>
                      <div className={s.inputWrapper}>
                        <Lock className={s.inputIcon} />
                        <input
                          type={showResetPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                          className={s.passwordInput}
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowResetPassword(!showResetPassword)
                          }
                          className={s.passwordToggle}
                        >
                          {showResetPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className={s.submitButtonReset}
                    >
                      {isLoading ? "Resetting..." : "Reset Password"}
                    </button>

                    <button
                      type="button"
                      onClick={() => setView("login")}
                      className={s.secondaryButton}
                    >
                      Cancel
                    </button>
                  </form>
                </>
              )}