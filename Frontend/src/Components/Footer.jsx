import { Container } from "react-bootstrap";

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-3 mt-auto">
      <Container className="text-center">
        <small>
          © {new Date().getFullYear()} MyBlog. All rights reserved.
        </small>
      </Container>
    </footer>
  );
};

export default Footer;










