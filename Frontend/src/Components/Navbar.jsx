import { Navbar, Nav, Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

const BlogNavbar = () => {
    return (
        <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="navbar-custom">
            <Container>
                <Navbar.Brand
                    as={NavLink}
                    to="/"
                    className="navbar-brand-custom"
                >
                    <span className="brand-icon">💻</span> DOZZYDAVE'S BLOG
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />

                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto nav-links">
                        <Nav.Link as={NavLink} to="/" end className="nav-link-custom">
                            Home
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/about" className="nav-link-custom">
                            About
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/blog" className="nav-link-custom">
                            Blog
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default BlogNavbar;
