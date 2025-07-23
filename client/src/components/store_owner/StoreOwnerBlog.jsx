import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Alert, Spinner, Pagination, FormControl } from 'react-bootstrap';
import StoreOwnerSidebar from './StoreOwnerSidebar';
import HeaderStoreOwner from './HeaderStoreOwner';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../css/StoreOwnerBlog.css'; 

function StoreOwnerBlog() {
  const [blogs, setBlogs] = useState([]);
  const [stores, setStores] = useState([]);
  const [storeId, setStoreId] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 9;

  const navigate = useNavigate();

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Không tìm thấy token. Vui lòng đăng nhập lại.');
        setLoading(false);
        return;
      }

      const [storeRes, blogRes] = await Promise.all([
        axios.get('http://localhost:9999/store/list', {
          headers: { Authorization: `Bearer ${token}` },
        }).catch(() => ({ data: { data: [] } })),
        axios.get('http://localhost:9999/blog/list', {
          headers: { Authorization: `Bearer ${token}` },
        }).catch(() => ({ data: { data: [] } })),
      ]);

      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userStore = storeRes.data.data.find(store => store.userId === user._id);
      if (!userStore) {
        setError('Bạn chưa có cửa hàng. Vui lòng tạo cửa hàng trước.');
        setLoading(false);
        return;
      }

      setStoreId(userStore._id);
      setStores(storeRes.data.data.filter(store => store.userId === user._id));
      setBlogs(blogRes.data.data);
      console.log('Fetched blogs:', blogRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Không thể tải dữ liệu. Vui lòng kiểm tra kết nối hoặc đăng nhập lại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const user = localStorage.getItem('user');
    const parseUser = user ? JSON.parse(user) : null;

    if (!parseUser || parseUser.role !== 'store_owner') {
      navigate('/error');
      return;
    }
    fetchData();
  }, [navigate]);

  const [formData, setFormData] = useState({
    storeId: '',
    title: '',
    content: '',
    isPublished: true,
    image: null,
  });

  const handleAddBlog = () => {
    if (!storeId) {
      setError('Không tìm thấy cửa hàng. Vui lòng tạo cửa hàng trước.');
      return;
    }
    setIsEdit(false);
    setFormData({
      storeId,
      title: '',
      content: '',
      isPublished: true,
      image: null,
    });
    setShowModal(true);
    setError('');
  };

  const handleEditBlog = (blog) => {
    setIsEdit(true);
    setSelectedBlog(blog);
    setFormData({
      storeId: blog.storeId,
      title: blog.title,
      content: blog.content,
      isPublished: blog.isPublished,
      image: null,
    });
    setShowModal(true);
    setError('');
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.storeId) {
      setError('Vui lòng chọn cửa hàng.');
      return;
    }

    const form = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'image' && formData[key]) {
        form.append(key, formData[key]);
      } else {
        form.append(key, formData[key]);
      }
    });

    try {
      const token = localStorage.getItem('token');
      if (isEdit) {
        const res = await axios.put(`http://localhost:9999/blog/update/${selectedBlog._id}`, form, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
        });
        setBlogs(blogs.map(b => (b._id === selectedBlog._id ? res.data.data : b)));
        showSuccessMessage('Cập nhật bài viết thành công!');
      } else {
        const res = await axios.post('http://localhost:9999/blog/create', form, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
        });
        setBlogs([...blogs, res.data.data]);
        showSuccessMessage('Thêm bài viết thành công!');
      }
      setShowModal(false);
      setError('');
      setCurrentPage(1);
      await fetchData();
    } catch (error) {
      console.error('Error submitting blog:', error);
      setError(error.response?.data?.message || 'Lỗi khi lưu bài viết. Vui lòng thử lại.');
    }
  };

  const handleDelete = async (blogId) => {
    if (window.confirm('Bạn có chắc muốn xóa bài viết này không?')) {
      try {
        await axios.delete(`http://localhost:9999/blog/delete/${blogId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setBlogs(blogs.filter(b => b._id !== blogId));
        showSuccessMessage('Xóa bài viết thành công!');
 
        if (filteredBlogs.length <= blogsPerPage * (currentPage - 1) + 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
        await fetchData();
      } catch (error) {
        console.error('Error deleting blog:', error);
        setError(error.response?.data?.message || 'Lỗi khi xóa bài viết. Vui lòng thử lại.');
      }
    }
  };


  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (error && !storeId) {
    return (
      <div className="d-flex">
        <StoreOwnerSidebar />
        <div className="dashboard-container">
          <HeaderStoreOwner />
          <Container fluid className="px-4">
            <Alert variant="danger">{error}</Alert>
          </Container>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex">
      <StoreOwnerSidebar />
      <div className="dashboard-container">
        <HeaderStoreOwner />
        <Container fluid className="px-4">
          <Row className="mb-3 align-items-center">
            <Col xs={12} md={6} className="mb-2 mb-md-0">
              <div className="header-title">
                <span>Danh sách bài viết</span>
              </div>
              <FormControl
                type="text"
                placeholder="Tìm kiếm theo tiêu đề bài viết..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); 
                }}
              />
            </Col>
            <Col xs={12} md={6} className="text-md-end">
              <div className="action-buttons">
                <Button variant="primary" onClick={handleAddBlog} disabled={!storeId}>
                  Thêm bài viết
                </Button>
              </div>
            </Col>
          </Row>
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          <div className="blog-grid">
            {loading ? (
              <div className="text-center py-4">
                <Spinner animation="border" variant="primary" />
                <div>Đang tải dữ liệu...</div>
              </div>
            ) : currentBlogs.length === 0 ? (
              <div className="text-center text-muted py-4">
                Không có bài viết nào.
              </div>
            ) : (
              currentBlogs.map((blog, index) => (
                <Card key={blog._id} className="blog-card">
                  <img
                    src={blog.image || '/images/default-blog.png'}
                    alt={blog.title}
                    className="blog-image"
                  />
                  <Card.Body className="blog-content">
                    <div className="blog-title">{blog.title}</div>
                    <div className="blog-meta">Ngày tạo: {formatDate(blog.createdAt)}</div>
                    <div className={`blog-status ${!blog.isPublished ? 'draft' : ''}`}>
                      {blog.isPublished ? 'Công khai' : 'Nháp'}
                    </div>
                    <div className="blog-actions">
                      <button
                        className="icon-btn edit"
                        onClick={() => handleEditBlog(blog)}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className="icon-btn delete"
                        onClick={() => handleDelete(blog._id)}
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </Card.Body>
                </Card>
              ))
            )}
          </div>
          {totalPages > 1 && (
            <Pagination className="justify-content-center mt-3">
              <Pagination.First
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
              />
              <Pagination.Prev
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              />
              {[...Array(totalPages)].map((_, i) => (
                <Pagination.Item
                  key={i + 1}
                  active={i + 1 === currentPage}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              />
              <Pagination.Last
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
              />
            </Pagination>
          )}
          <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg" className="custom-modal">
            <Modal.Header closeButton>
              <Modal.Title>{isEdit ? 'Sửa bài viết' : 'Thêm bài viết'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label">Cửa hàng</Form.Label>
                  <Form.Select
                    value={formData.storeId}
                    onChange={(e) => setFormData({ ...formData, storeId: e.target.value })}
                    required
                    disabled={stores.length <= 1}
                  >
                    <option value="">Chọn cửa hàng</option>
                    {stores.map(store => (
                      <option key={store._id} value={store._id}>{store.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label">Tiêu đề</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label">Nội dung</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label">Trạng thái</Form.Label>
                  <Form.Check
                    type="checkbox"
                    label="Công khai"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label">Hình ảnh</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  {isEdit ? 'Cập nhật' : 'Thêm'}
                </Button>
              </Form>
            </Modal.Body>
          </Modal>
        </Container>
      </div>
    </div>
  );
}

export default StoreOwnerBlog;