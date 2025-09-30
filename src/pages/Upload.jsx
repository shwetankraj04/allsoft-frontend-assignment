import { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";

export default function Upload() {
  const [majorHead, setMajorHead] = useState("");
  const [minorHead, setMinorHead] = useState("");
  const [minorOptions, setMinorOptions] = useState([]);
  const [documentDate, setDocumentDate] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [remarks, setRemarks] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // Fetch existing tags from backend
  const fetchTags = async (term = "") => {
    try {
      const res = await axios.post(
        "https://apis.allsoft.co/api/documentManagement/documentTags",
        { term },
        { headers: { token } }
      );
      return res.data?.data || [];
    } catch (err) {
      console.warn("Error fetching tags:", err);
      return [];
    }
  };

  // Handle Major Head change
  useEffect(() => {
    if (majorHead === "Personal") {
      setMinorOptions(["John", "Tom", "Emily"]); // Static names
    } else if (majorHead === "Professional") {
      setMinorOptions(["Accounts", "HR", "IT", "Finance"]); // Departments
    } else {
      setMinorOptions([]);
    }
    setMinorHead("");
  }, [majorHead]);

  // Handle adding a tag
  const handleAddTag = async () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
      // Optionally, call backend to save new tag
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const allowedTypes = ["application/pdf", "image/png", "image/jpeg"];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Only PDF and Image files are allowed.");
      return;
    }
    setError("");
    setFile(selectedFile);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    const data = {
      major_head: majorHead,
      minor_head: minorHead,
      document_date: documentDate,
      document_remarks: remarks,
      tags: tags.map((tag) => ({ tag_name: tag })),
      user_id: "demo_user", // Replace with logged in user ID if needed
    };

    const formData = new FormData();
    formData.append("file", file);
    formData.append("data", JSON.stringify(data));

    try {
      const res = await axios.post(
        "https://apis.allsoft.co/api/documentManagement/saveDocumentEntry",
        formData,
        { headers: { token, "Content-Type": "multipart/form-data" } }
      );
      if (res.data.status) {
        setMessage("File uploaded successfully!");
        setError("");
        // Reset form
        setMajorHead("");
        setMinorHead("");
        setDocumentDate("");
        setTags([]);
        setFile(null);
        setRemarks("");
      } else {
        setError(res.data.data || "Upload failed.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("Error uploading file.");
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={8}>
          <h3 className="mb-4 text-center">Upload Document</h3>

          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}

          <Form onSubmit={handleSubmit}>
            {/* Major Head */}
            <Form.Group className="mb-3">
              <Form.Label>Category (Major Head)</Form.Label>
              <Form.Select
                value={majorHead}
                onChange={(e) => setMajorHead(e.target.value)}
              >
                <option value="">Select Category</option>
                <option value="Personal">Personal</option>
                <option value="Professional">Professional</option>
              </Form.Select>
            </Form.Group>

            {/* Minor Head */}
            <Form.Group className="mb-3">
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

            {/* Date Picker */}
            <Form.Group className="mb-3">
              <Form.Label>Document Date</Form.Label>
              <Form.Control
                type="date"
                value={documentDate}
                onChange={(e) => setDocumentDate(e.target.value)}
              />
            </Form.Group>

            {/* Tags */}
            <Form.Group className="mb-3">
              <Form.Label>Tags</Form.Label>
              <div className="d-flex">
                <Form.Control
                  type="text"
                  placeholder="Enter tag and press Add"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                />
                <Button type="button" className="ms-2" onClick={handleAddTag}>
                  Add
                </Button>
              </div>
              <div className="mt-2">
                {tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="badge bg-primary me-2"
                    style={{ fontSize: "0.9rem" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Form.Group>

            {/* Remarks */}
            <Form.Group className="mb-3">
              <Form.Label>Remarks</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </Form.Group>

            {/* File */}
            <Form.Group className="mb-3">
              <Form.Label>Upload File (PDF/Image)</Form.Label>
              <Form.Control type="file" onChange={handleFileChange} />
            </Form.Group>

            <Button type="submit" className="w-100">
              Upload
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
