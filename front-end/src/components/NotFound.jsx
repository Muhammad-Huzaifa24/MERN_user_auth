import { Link } from "react-router-dom";
const NotFound = () => {
  return (
    <>
      <h1>Page Not found</h1>
      <br />
      <Link to="/home">back to home page</Link>
    </>
  );
};

export default NotFound;
