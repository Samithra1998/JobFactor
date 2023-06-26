import main from "../assets/images/main.svg";
import Wrapper from "../assets/wrappers/Testing";
import {Logo} from "../components";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <Wrapper>
      <nav>
        <Logo/>
      </nav>
      <div className="container page">
        <div className="info">
          <h1>
            Job<span> tracking</span> app
          </h1>
          <p>
            I'm baby art party crucifix truffaut microdosing yes plz disrupt.
            Waistcoat gastropub pour-over neutra DIY. Kickstarter subway tile
            hashtag cupping pitchfork disrupt try-hard tumblr deep v. Poutine
            lyft migas vexillologist everyday carry selvage.
          </p>
          <Link to='/register' className='btn btn-hero'>
            Login/Register
          </Link>
        </div>
        <img src={main} alt='main_img' className='img main-img'/>
      </div>
    </Wrapper>
  );
};

export default Landing;
