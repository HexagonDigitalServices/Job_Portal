 if (data.success) {
          const mapped = data.applicants.map((app) => ({
            id: app.applicationId,
            name: app.name,
            email: app.email,
            phone: app.phone,
            appliedForRole: role || data.jobName,
            appliedAt: app.appliedDate,
            resumeFile: app.resume,
            userId: app._id,
          }));
          setFiltered(mapped);
        }
     
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  };

 
                            <svg
                              className={s.resumeIcon}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                           

      <style>{`
        @keyframes gentleFadeUp {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .group { animation: gentleFadeUp 0.45s ease-out forwards; opacity: 0; }
      `}</style>
