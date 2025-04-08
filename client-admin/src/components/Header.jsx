import { useAuth } from "../contexts/AuthContext";

function Header() {
  const { currentUser } = useAuth();

  return (
    <header>
      <div className="header-user-info">
        <span>{currentUser?.email}</span>
      </div>
    </header>
  );
}

export default Header;
