import './navBar.css'
import { Link } from 'react-router-dom';

export default function Navbar({ links }) {
  return (
    <ul className='navbar'>
      <div className='links'>
        {links.filter(link => link.label !== 'Logout').map((link, i) => (
          <li key={i} className='nav-link'>
            <Link className='nav-a' to={`/${link.path}`}>{link.label}</Link>
          </li>
        ))}
      </div>
      {links.filter(link => link.label === 'Logout').map((link, i) => (
        <li key={i} className='nav-link logout-link-container'>
          <button className='nav-logout-button' onClick={link.onClick}>
            {link.label}
          </button>
        </li>
      ))}
    </ul>
  );
}
