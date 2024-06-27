import './navBar.css';
import { Link } from 'react-router-dom';

export default function Navbar({ links }) {
  return (
    <ul className='navbar'>
      {links.map((link, i) => (
        <li key={i} className='nav-link'>
          {link.onClick ? (
            <button onClick={link.onClick} className='nav-a'>{link.label}</button>
          ) : (
            <Link className='nav-a' to={"/" + link.path}>{link.label}</Link>
          )}
        </li>
      ))}
    </ul>
  );
}
