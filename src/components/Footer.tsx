const footerLinks = {
  Platform: ["Resume Screening", "Candidate Ranking", "Dashboard", "Application Tracking"],
  Solutions: ["Enterprise Hiring", "Startup Recruiting", "Campus Recruitment", "Remote Hiring"],
  Resources: ["Documentation", "API Reference", "Blog", "Case Studies"],
  Company: ["About Us", "Careers", "Contact", "Privacy Policy"],
};

const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <a href="/" className="font-display text-xl font-bold">
              SmartRecruit<span className="text-glow">AI</span>
            </a>
            <p className="text-sm opacity-50 mt-3 leading-relaxed">
              AI-powered recruitment that saves time, reduces bias, and finds the best talent.
            </p>
          </div>
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-display text-sm font-semibold mb-4 opacity-80">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm opacity-50 hover:opacity-80 transition-opacity">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-primary-foreground/10 pt-8 text-center">
          <p className="text-xs opacity-40">
            © {new Date().getFullYear()} SmartRecruitAI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
