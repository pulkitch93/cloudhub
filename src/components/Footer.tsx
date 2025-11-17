const Footer = () => {
  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="container mx-auto px-6 py-4">
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Designed and developed by{' '}
            <a 
              href="https://www.linkedin.com/in/pulkit-chaudhary/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium transition-colors"
            >
              Pulkit Chaudhary
            </a>
            {' '}for Lenovo Hybrid Cloud.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
