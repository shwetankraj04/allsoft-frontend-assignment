import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleUploadClick = () => {
    navigate("/upload");
  };

  return (
    <Container className="mt-5 text-center">
      <h2>Welcome to Document Management System</h2>
      <p>You are logged in successfully.</p>

      <Row className="justify-content-center mt-4">
        <Col md={4}>
          <Button className="w-100 mb-3" onClick={handleUploadClick}>
            Upload Document
          </Button>

          <Button
            className="w-100"
            onClick={() => alert("Search Page coming soon")}
          >
            Search Documents
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
