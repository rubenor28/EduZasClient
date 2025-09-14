import "./Navbar.css";

type NavbarProps = {
  userName: string;
  logout: () => void;
};

export function Navbar({ userName, logout }: NavbarProps) {
  return (
    <nav className="navbar">
      <div className="navbar-section navbar-left"></div>
      <div className="navbar-section navbar-center"></div>
      <div className="navbar-section navbar-right">
        <p>Hola {userName}</p>
        <button className="blue-button" onClick={logout}>
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}
