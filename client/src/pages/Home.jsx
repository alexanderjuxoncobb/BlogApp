import { useState, useEffect } from "react";

function Home() {
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/users");
        const data = await response.json();
        setMessage(data.message);
        setUsers(data.users);
        console.log(users);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Home Page</h1>
      <p>API Message: {message}</p>
      {users &&
        users.map((user) => {
          return <p key={user.id}>{user.email}</p>;
        })}
    </div>
  );
}

export default Home;
