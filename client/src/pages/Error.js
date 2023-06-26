import { Link } from "react-router-dom";
import img from "../assets/images/not-found.svg";
import Wrapper from "../assets/wrappers/ErrorPage";

const Error = () => {
  return (
    <Wrapper className="full-page">
      <div>
        <img src={img} alt="err-img" />
        <h3>Ohh! Page not found</h3>
        <p>We can't seem to be find the page you're looking for</p>
        <Link to='/landing'>Back to home</Link>
      </div>
    </Wrapper>
  );
};
export default Error;
