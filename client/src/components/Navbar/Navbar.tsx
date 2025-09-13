import "./Navbar.css";

type NavbarProps = {
  userName: string;
  logout: () => void;
};

export function Navbar({ userName, logout }: NavbarProps) {
  return (
    <nav className="navbar">
      <div className="navbar-section navbar-left">
        <h1>Izq</h1>
      </div>
      <div className="navbar-section navbar-center">
        <h1>Centro</h1>
      </div>
      <div className="navbar-section navbar-right">
        {userName}
        <button onClick={logout}>Cerrar sesión</button>
      </div>
    </nav>
  );
}
