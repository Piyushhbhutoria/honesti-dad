const Footer = () => {
  return (
    <footer className="glass mt-12 border-t border-white/10 dark:border-white/5">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <p className="text-muted-foreground text-sm">
            Made with ❤️ by{" "}
            <a 
              href="https://www.linkedin.com/in/piyushh-bhutoria/"
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors duration-300 font-medium"
            >
              Piyushh
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
