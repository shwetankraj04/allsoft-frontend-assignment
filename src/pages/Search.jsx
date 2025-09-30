import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Table,
  Alert,
} from "react-bootstrap";
import axios from "axios";

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

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Redirect to login if no token
  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [token, navigate]);

  // Update minor options when majorHead changes
  useEffect(() => {
    if (majorHead === "Personal") setMinorOptions(["John", "Tom", "Emily"]);
    else if (majorHead === "Professional")
      setMinorOptions(["Accounts", "HR", "IT", "Finance"]);
    else setMinorOptions([]);
    setMinorHead("");
  }, [majorHead]);

  // Add a tag
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  // Remove a tag
  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Perform search
  const handleSearch = async () => {
    setError("");
    setMessage("");
    setResults([]);

    if (!token) {
      setError("No valid token found. Please login again.");
      return;
    }

    const tagArray = tags.map((t) => ({ tag_name: t }));

    const body = {
      major_head: majorHead,
      minor_head: minorHead,
      from_date: fromDate,
      to_date: toDate,
      tags: tagArray,
      uploaded_by: "",
      start: 0,
      length: 10,
      filterId: "",
      search: { value: "" },
    };

    try {
      const res = await axios.post(
        "https://apis.allsoft.co/api/documentManagement/searchDocumentEntry",
        body,
        { headers: { token } }
      );

      if (res.data.status) {
        if (res.data.data.length > 0) {
          setResults(res.data.data);
          setMessage(`${res.data.data.length} documents found`);
        } else {
          setMessage("No documents found.");
        }
      } else {
        setError(res.data.data || "Error performing search.");
      }
    } catch (err) {
      console.error(err);
      setError("Error performing search. Make sure your token is valid.");
    }
  };

  const handlePreview = (file) => {
    if (file.file_type?.includes("pdf") || file.file_type?.includes("image")) {
      alert(`Previewing file: ${file.file_name}`);
    } else {
      alert("Preview not supported for this file type.");
    }
  };

  const handleDownload = (file) => {
    alert(`Downloading file: ${file.file_name}`);
  };

  const handleDownloadAll = () => {
    if (results.length > 0) alert("Downloading all files as ZIP");
    else setMessage("No files to download.");
  };

  return (
    <Container className="mt-5">
      <h3 className="mb-2 text-center">Search Documents</h3>

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
        <>
          <Button
            className="mb-3"
            variant="secondary"
            onClick={handleDownloadAll}
          >
            Download All as ZIP
          </Button>

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
        </>
      )}
    </Container>
  );
}
