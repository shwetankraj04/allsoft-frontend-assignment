import { useState, useEffect, useRef } from "react";
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
  const fileInputRef = useRef(null);

  // Fetch existing tags from backend on mount
  useEffect(() => {
    const fetchTags = async () => {
      if (!token) return;
      try {
        const res = await axios.post(
          "https://apis.allsoft.co/api/documentManagement/documentTags",
          { term: "" },
          { headers: { token } }
        );
        const existingTags = res.data?.data || [];
        // setTags(existingTags.map((t) => t.tag_name));
      } catch (err) {
        console.warn("Error fetching tags:", err);
      }
    };
    fetchTags();
  }, [token]);

  // Handle Major Head change
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

  // Handle adding a tag
  const handleAddTag = () => {
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
    const ext = selectedFile.name.split(".").pop().toLowerCase();
    if (
      !allowedTypes.includes(selectedFile.type) &&
      !["pdf", "png", "jpg", "jpeg"].includes(ext)
    ) {
      setError("Only PDF and Image files are allowed.");
      return;
    }
    setError("");
    setFile(selectedFile);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!majorHead || !minorHead || !documentDate || !file) {
      setError("Please fill all required fields and select a file.");
      return;
    }

    const data = {
      major_head: majorHead,
      minor_head: minorHead,
      document_date: documentDate.split("-").reverse().join("-"), // convert YYYY-MM-DD to DD-MM-YYYY
      document_remarks: remarks,
      tags: tags.map((tag) => ({ tag_name: tag })),
      user_id: "demo_user", // Replace with logged-in user ID if needed
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
        if (fileInputRef.current) fileInputRef.current.value = "";
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

            <Form.Group className="mb-3">
              <Form.Label>Document Date</Form.Label>
              <Form.Control
                type="date"
                value={documentDate}
                onChange={(e) => setDocumentDate(e.target.value)}
              />
            </Form.Group>

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

            <Form.Group className="mb-3">
              <Form.Label>Remarks</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Upload File (PDF/Image)</Form.Label>
              <Form.Control
                type="file"
                onChange={handleFileChange}
                ref={fileInputRef}
              />
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
