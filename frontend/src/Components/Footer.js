export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        
      
        <div className="footer-section">
          <h3>About Me</h3>
          <p>
            Hi 👋 I'm Sankalp Mali, a BE Computer Science student passionate about 
            full-stack development, Java, and building real-world projects.
          </p>
        </div>

     
        <div className="footer-section">
          <h3>Contact</h3>
          <p>9359471257</p>
          <p>malisankalp2003@gmail.com</p>
          <p> Pune, Maharashtra</p>
          <div className="socials">
            <a href="https://github.com/sankalpan" target="_blank" rel="noreferrer">GitHub</a>
            <a href="https://www.linkedin.com/in/sankalp-mali-b5875225b" target="_blank" rel="noreferrer">LinkedIn</a>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Sankalp Mali | All Rights Reserved
      </div>
    </footer>
  );
}
