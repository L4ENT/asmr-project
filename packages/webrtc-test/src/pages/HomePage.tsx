import React from "react";
import { Link } from "react-router-dom";

const HomePage: React.FC = () => {
  return (
    <ul>
      <li>
        <Link to="/host">Я хост</Link>
      </li>
      <li>
        <Link to="/peer">Я пир</Link>
      </li>
    </ul>
  );
};

export default HomePage;
