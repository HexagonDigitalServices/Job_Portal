  roleName,
            companyName,
            techStack,
            location,
            experience,
            salary,
            salaryType,
            jobType,
            postDate,
            category,
            openings,
            overview,
            responsibilities,
            jobCriteria,
            education,

        if (typeof techStack === "string") techStack = JSON.parse(techStack);
        if (typeof responsibilities === "string") responsibilities = JSON.parse(responsibilities);
        if (typeof jobCriteria === "string") jobCriteria = JSON.parse(jobCriteria);
        if (typeof education === "string") education = JSON.parse(education);

        let postDateValue;
        if (postDate) {
            if (typeof postDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(postDate)) {
                const [year, month, day] = postDate.split("-");
                postDateValue = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
            } else {
                postDateValue = new Date(postDate);
            }
            if (isNaN(postDateValue.getTime())) {
                postDateValue = new Date();
            }
        } else {
            postDateValue = new Date();
        }

        let companyLogo = "";
        if (req.file) {
            const uploadRes = await uploadToCloudinary(req.file.buffer, "jobportal/logos", "image", req.file.originalname);
            companyLogo = uploadRes.secure_url;
        }


        //search by roleName, companyName, or techstack
        if (search) {
            query.$or = [
                { roleName: { $regex: search, $options: "i" } },
                { companyName: { $regex: search, $options: "i" } },
                { techStack: { $regex: search, $options: "i" } }
            ];
        }
        if (roleName) query.roleName = { $regex: roleName, $options: "i" };
        if (companyName) query.companyName = { $regex: companyName, $options: "i" };
        if (location) query.location = { $regex: location, $options: "i" };
        if (experience) query.experience = { $regex: experience, $options: "i" };

        if (category) {
            const categories = Array.isArray(category) ? category : category.split(",");
            query.category = { $in: categories.map(cat => new RegExp(cat, "i")) };
        }
        if (jobType) {
            const types = Array.isArray(jobType) ? jobType : jobType.split(",");
            const normalizeTypeToRegex = (type) => {
                const raw = String(type).trim();
                const escaped = raw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                // Normalize spaces, hyphens, underscores
                const normalized = escaped.replace(/[-_\s]+/g, "[-_\\s]*");
                return new RegExp(`^${normalized}$`, "i");
            };
            query.jobType = { $in: types.map(normalizeTypeToRegex) };
        }

        if (minSalary || maxSalary) {
            query.salary = {};
            if (minSalary) query.salary.$gte = Number(minSalary);
            if (maxSalary) query.salary.$lte = Number(maxSalary);
        }


// Update a job
export const updateJob = async (req, res) => {
    try {
        let {
            roleName,
            companyName,
            techStack,
            location,
            experience,
            salary,
            salaryType,
            jobType,
            postDate,
            category,
            openings,
            overview,
            responsibilities,
            jobCriteria,
            education,
        } = req.body;

        // Handle arrays if sent as JSON strings from frontend FormData
        if (typeof techStack === "string") techStack = JSON.parse(techStack);
        if (typeof responsibilities === "string") responsibilities = JSON.parse(responsibilities);
        if (typeof jobCriteria === "string") jobCriteria = JSON.parse(jobCriteria);
        if (typeof education === "string") education = JSON.parse(education);

        let postDateValue;
        if (postDate) {
            if (typeof postDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(postDate)) {
                const [year, month, day] = postDate.split("-");
                // Use UTC to prevent timezone shifts across days
                postDateValue = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
            } else {
                postDateValue = new Date(postDate);
            }
            if (isNaN(postDateValue.getTime())) {
                postDateValue = new Date();
            }
        } else {
            postDateValue = new Date();
        }

        let job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }

        // Admins can update any job

        let companyLogo = job.companyLogo;
        if (req.file) {
            const uploadRes = await uploadToCloudinary(req.file.buffer, "jobportal/logos", "image", req.file.originalname);
            companyLogo = uploadRes.secure_url;
        }

        job = await Job.findByIdAndUpdate(
            req.params.id,
            {
                companyLogo,
                roleName,
                companyName,
                techStack,
                location,
                experience,
                salary,
                salaryType,
                jobType,
                postDate: postDateValue,
                category,
                openings,
                overview,
                responsibilities,
                jobCriteria,
                education,
            },
            { returnDocument: 'after', runValidators: true }
        );

        return res.status(200).json({
            success: true,
            message: "Job updated successfully",
            job,
        });
    } catch (error) {
        console.error("Error updating job:", error);
        return res.status(500).json({ success: false, message: error.message || "Server error" });
    }
};
