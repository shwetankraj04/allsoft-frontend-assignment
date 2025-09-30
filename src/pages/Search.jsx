import { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Table,
  Alert,
} from "react-bootstrap";

export default function Search() {
  const [majorHead, setMajorHead] = useState("");
  const [minorHead, setMinorHead] = useState("");
  const [minorOptions, setMinorOptions] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  //   const token = localStorage.getItem("token");
  const token = "dummy_token_for_frontend_testing"; // Dummy token for frontend testing
  // Dynamic minor head options
  useEffect(() => {
    if (majorHead === "Personal") {
      setMinorOptions(["John", "Tom", "Emily"]);
    } else if (majorHead === "Professional") {
      setMinorOptions(["Accounts", "HR", "IT", "Finance"]);
    } else {
      setMinorOptions([]);
    }
    setMinorHead("");
  }, [majorHead]);

  // Add tag
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  // Remove tag
  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Handle search
  const handleSearch = async () => {
    setError("");
    setMessage("");
    try {
      const body = {
        major_head: majorHead,
        minor_head: minorHead,
        from_date: fromDate,
        to_date: toDate,
        tags: tags.map((t) => ({ tag_name: t })),
        uploaded_by: "",
        start: 0,
        length: 50,
        filterId: "",
        search: { value: "" },
      };

      const res = await axios.post(
        "https://apis.allsoft.co/api/documentManagement/searchDocumentEntry",
        body,
        { headers: { token } }
      );

      if (res.data.status) {
        setResults(res.data.data || []);
        if ((res.data.data || []).length === 0)
          setMessage("No documents found.");
      } else {
        setError(res.data.data || "Search failed.");
      }
    } catch (err) {
      console.error(err);
      setError("Error performing search.");
    }
  };

  // Handle file download (simulated)
  const handleDownload = (file) => {
    alert(`Simulate downloading file: ${file.file_name || "Unknown"}`);
  };

  // Handle file preview (simulated)
  const handlePreview = (file) => {
    if (file.file_type?.includes("pdf") || file.file_type?.includes("image")) {
      alert(`Simulate preview of ${file.file_name}`);
    } else {
      alert("Preview not supported for this file type.");
    }
  };

  return (
    <Container className="mt-5">
      <h3 className="mb-4 text-center">Search Documents</h3>

      {error && <Alert variant="danger">{error}</Alert>}
      {message && <Alert variant="info">{message}</Alert>}

      <Row className="mb-3">
        <Col md={3}>
          <Form.Group>
            <Form.Label>Major Head</Form.Label>
            <Form.Select
              value={majorHead}
              onChange={(e) => setMajorHead(e.target.value)}
            >
              <option value="">Select Major Head</option>
              <option value="Personal">Personal</option>
              <option value="Professional">Professional</option>
            </Form.Select>
          </Form.Group>
        </Col>

        <Col md={3}>
          <Form.Group>
            <Form.Label>
              {majorHead === "Personal" ? "Name" : "Department"}
            </Form.Label>
            <Form.Select
              value={minorHead}
              onChange={(e) => setMinorHead(e.target.value)}
            >
              <option value="">Select</option>
              {minorOptions.map((option, idx) => (
                <option key={idx} value={option}>
                  {option}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>

        <Col md={3}>
          <Form.Group>
            <Form.Label>From Date</Form.Label>
            <Form.Control
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </Form.Group>
        </Col>

        <Col md={3}>
          <Form.Group>
            <Form.Label>To Date</Form.Label>
            <Form.Control
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>

      {/* Tags */}
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Tags</Form.Label>
            <div className="d-flex">
              <Form.Control
                type="text"
                placeholder="Enter tag and press Add"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
              />
              <Button className="ms-2" onClick={handleAddTag}>
                Add
              </Button>
            </div>
            <div className="mt-2">
              {tags.map((t, idx) => (
                <span
                  key={idx}
                  className="badge bg-primary me-2"
                  style={{ fontSize: "0.9rem", cursor: "pointer" }}
                  onClick={() => handleRemoveTag(t)}
                >
                  {t} &times;
                </span>
              ))}
            </div>
          </Form.Group>
        </Col>

        <Col md={6} className="d-flex align-items-end">
          <Button onClick={handleSearch} className="w-100">
            Search
          </Button>
        </Col>
      </Row>

      {/* Results Table */}
      {results.length > 0 && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>File Name</th>
              <th>Category</th>
              <th>Tags</th>
              <th>Remarks</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {results.map((file, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{file.file_name}</td>
                <td>
                  {file.major_head} / {file.minor_head}
                </td>
                <td>{file.tags?.map((t) => t.tag_name).join(", ")}</td>
                <td>{file.document_remarks}</td>
                <td>
                  <Button
                    size="sm"
                    className="me-2"
                    onClick={() => handlePreview(file)}
                  >
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() => handleDownload(file)}
                  >
                    Download
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}
