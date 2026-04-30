        if (jobsData.success) {
          const mappedJobs = jobsData.jobs.map((j) => ({
            id: j._id,
            name: j.companyName,
            role: j.roleName,
            location: j.location,
            category: j.category,
            logo: j.companyLogo?.startsWith("http")
              ? j.companyLogo
              : `http://localhost:5000${j.companyLogo || ""}`,
            applicants: j.applicantsCount || 0,
            status: j.status || "active",
          }));
          setJobs(mappedJobs);
        }
     
    
        if (jobsData.success) {
          const mappedJobs = jobsData.jobs.map((j) => ({
            id: j._id,
            name: j.companyName,
            role: j.roleName,
            location: j.location,
            category: j.category,
            logo: j.companyLogo?.startsWith("http")
              ? j.companyLogo
              : `http://localhost:5000${j.companyLogo || ""}`,
            applicants: j.applicantsCount || 0,
            status: j.status || "active",
          }));
          setJobs(mappedJobs);
        }
    

  const stats = [
    {
      label: "Total Jobs",
      value: dashboardStats.totalJobs,
      icon: Briefcase,
      colors: statColors.blue,
    },
    {
      label: "Closed Jobs",
      value: dashboardStats.closedJobs,
      icon: Briefcase,
      colors: statColors.rose,
    },
    {
      label: "Total Applicants",
      value: dashboardStats.totalApplicants,
      icon: Users,
      colors: statColors.emerald,
    },
    {
      label: "Active Companies",
      value: dashboardStats.totalCompanies,
      icon: Building,
      colors: statColors.amber,
    },
  ];

  const uniqueCompanies = [...new Set(jobs.map((c) => c.name))];
  const uniqueRoles = [...new Set(jobs.map((c) => c.role))];

  // Filter jobs based on selected filters
  const filteredJobs = jobs.filter((job) => {
    const matchesCompany = companyFilter === "" || job.name === companyFilter;
    const matchesRole = roleFilter === "" || job.role === roleFilter;
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;
    return matchesCompany && matchesRole && matchesStatus;
  });