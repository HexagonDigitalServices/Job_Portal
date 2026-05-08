const slugify = (str) =>
  str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");

function RoleCard({ role }) {
  const [imgError, setImgError] = useState(false);
  const initials = role.roleName
    ? role.roleName
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
    : "??";

  const colorClass = s.getColorClass("role", role.roleName);
  const slug = slugify(role.roleName);

  return (
    <Link
      to={`/roles/${slug}`}
      state={{ selectedRoleSlug: slug }}
      className={s.cardLink}
    >
      <div className={s.roleCardGlow}></div>

      <article className={s.cardArticle}>
        <div className={s.cardFlex}>
          <div className={s.cardLeftFlex}>
            <div
              className={s.logoContainer(colorClass)}
              style={{ width: 56, height: 56, overflow: "hidden" }}
            >
              {!imgError && role.image ? (
                <img
                  src={role.image}
                  alt={`${role.roleName} logo`}
                  onError={() => setImgError(true)}
                  className={s.logoImage}
                />
              ) : (
                <span className={s.logoFallbackText}>{initials}</span>
              )}
            </div>

            <div>
              <h3 className={s.cardTitle}>{role.roleName}</h3>
              <p className={s.cardSubtitle}>
                {role.questionsCount || "0"} Questions
              </p>
            </div>
          </div>

          <div>
            <CircleArrowOutUpRight className={s.cardIcon} />
          </div>
        </div>
      </article>
    </Link>
  );
}
