
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    alert('Logged out successfully!');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">NewsMonkey</Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><Link className="nav-link" to="/general">General</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/business">Business</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/entertainment">Entertainment</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/health">Health</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/science">Science</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/sports">Sports</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/technology">Technology</Link></li>
            {token && (
              <li className="nav-item"><Link className="nav-link" to="/bookmarks">Bookmarks</Link></li>
            )}
          </ul>

          <ul className="navbar-nav ms-auto">
            <li className="nav-item"><Link className="nav-link" to="/register">Register</Link></li>
            {!token ? (
              <li className="nav-item">
                <Link className="nav-link " to="/login">Login</Link>
              </li>
            ) : (
              <li className="nav-item">
                <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            )}
            
          </ul>
        </div>
      </div>
    </nav>
  );
}




