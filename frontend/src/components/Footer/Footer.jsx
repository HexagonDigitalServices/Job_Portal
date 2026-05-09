const ContactItem = ({ icon, text, href }) => (
  <div className={s.contactItemContainer}>
    <div className={s.contactIconWrapper}>{icon}</div>
    {href ? (
      <a href={href} className={s.contactText}>
        {text}
      </a>
    ) : (
      <span className={s.contactTextNoLink}>{text}</span>
    )}
  </div>
);

     <div className={s.socialIconsContainer}>
              <SocialIcon
                href="#"
                icon={<LuLinkedin className="w-4 h-4 sm:w-5 sm:h-5" />}
                label="LinkedIn"
              />
              <SocialIcon
                href="#"
                icon={<LuTwitter className="w-4 h-4 sm:w-5 sm:h-5" />}
                label="Twitter"
              />
              <SocialIcon
                href="#"
                icon={<LuFacebook className="w-4 h-4 sm:w-5 sm:h-5" />}
                label="Facebook"
              />{" "}
              <SocialIcon
                href="#"
                icon={<LuInstagram className="w-4 h-4 sm:w-5 sm:h-5" />}
                label="Instagram"
              />
            </div>

            <ul className={s.linkList}>
              <FooterLink
                href="/jobs"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Find Jobs
              </FooterLink>
              <FooterLink
                href="/companies"
                icon={<Building className="w-4 h-4" />}
              >
                Companies
              </FooterLink>
              <FooterLink href="/roles" icon={<UserCog className="w-4 h-4" />}>
                Roles
              </FooterLink>
              <FooterLink href="/saved" icon={<Bookmark className="w-4 h-4" />}>
                Saved
              </FooterLink>
              <FooterLink
                href="/contact"
                icon={<UserPen className="w-4 h-4" />}
              >
                Contact
              </FooterLink>
            </ul>

            <ul className={s.linkList}>
              <FooterLink href="/" icon={<ArrowRight className="w-4 h-4" />}>
                Post a Job
              </FooterLink>
              <FooterLink href="/" icon={<Award className="w-4 h-4" />}>
                Pricing
              </FooterLink>
              <FooterLink href="/" icon={<Users className="w-4 h-4" />}>
                Recruitment Solutions
              </FooterLink>
              <FooterLink href="/" icon={<Briefcase className="w-4 h-4" />}>
                Employer Dashboard
              </FooterLink>
              <FooterLink href="/" icon={<Shield className="w-4 h-4" />}>
                Employer Branding
              </FooterLink>
            </ul>

