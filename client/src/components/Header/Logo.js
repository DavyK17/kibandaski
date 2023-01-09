import Icon from "../../assets/icons/icon.png";
import Wordmark from "../../assets/icons/wordmark.png";

const Logo = props => {
    const { windowWidth } = props;
    
    return (
        <a href="https://github.com/DavyK17/kibandaski-client" target="_blank" rel="noopener noreferrer">
            <img src={windowWidth > 991 ? Wordmark : Icon} alt={windowWidth > 991 ? "Kibandaski wordmark" : "Kibandaski logo"} height="40" />
        </a>
    )
}

export default Logo;