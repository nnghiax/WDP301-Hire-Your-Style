import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Table, Card, Button, Modal, Form, Alert, Spinner, Pagination, FormControl } from 'react-bootstrap';
import StoreOwnerSidebar from './StoreOwnerSidebar';
import HeaderStoreOwner from './HeaderStoreOwner';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';

const customStyles = `
  .custom-modal .modal-dialog {
    max-width: 1000px;
  }
`;

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [storeId, setStoreId] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewError, setReviewError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  const navigate = useNavigate();

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  useEffect(() => {
    const user = localStorage.getItem('user');
    const parseUser = user ? JSON.parse(user) : null;

    if (!parseUser || parseUser.role !== 'store_owner') {
      navigate('/error');
      return;
    }

    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Không tìm thấy token. Vui lòng đăng nhập lại.');
          setLoading(false);
          return;
        }

        const [storeRes, productRes, categoryRes] = await Promise.all([
          axios.get('http://localhost:9999/store/list', {
            headers: { Authorization: `Bearer ${token}` },
          }).catch(() => ({ data: { data: [] } })),
          axios.get('http://localhost:9999/product/list', {
            headers: { Authorization: `Bearer ${token}` },
          }).catch(() => ({ data: { data: [] } })),
          axios.get('http://localhost:9999/cate/list', {
            headers: { Authorization: `Bearer ${token}` },
          }).catch(() => ({ data: { data: [] } })),
        ]);

        const userStore = storeRes.data.data.find(store => store.userId === parseUser._id);
        if (!userStore) {
          setError('Bạn chưa có cửa hàng. Vui lòng tạo cửa hàng trước.');
          setLoading(false);
          return;
        }

        setStoreId(userStore._id);
        setFormData(prev => ({ ...prev, storeId: userStore._id }));
        setProducts(productRes.data.data.filter(p => p.storeId === userStore._id));
        setCategories(categoryRes.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Không thể tải dữ liệu. Vui lòng kiểm tra kết nối hoặc đăng nhập lại.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const [formData, setFormData] = useState({
    storeId: '',
    categoryId: '',
    name: '',
    description: '',
    sizes: [],
    quantity: 0,
    price: 0,
    color: '',
    isAvailable: true,
    image: null,
  });

  const handleAddProduct = () => {
    if (!storeId) {
      setError('Không tìm thấy cửa hàng. Vui lòng tạo cửa hàng trước.');
      return;
    }
    setIsEdit(false);
    setFormData({
      storeId,
      categoryId: '',
      name: '',
      description: '',
      sizes: [],
      quantity: 0,
      price: 0,
      color: '',
      isAvailable: true,
      image: null,
    });
    setShowModal(true);
    setError('');
  };

  const handleEditProduct = (product) => {
    setIsEdit(true);
    setSelectedProduct(product);
    setFormData({
      storeId: product.storeId,
      categoryId: product.categoryId,
      name: product.name,
      description: product.description || '',
      sizes: product.sizes || [],
      quantity: product.quantity || 0,
      price: product.price || 0,
      color: product.color || '',
      isAvailable: product.isAvailable !== undefined ? product.isAvailable : true,
      image: null,
    });
    setShowModal(true);
    setError('');
  };

  const handleViewReviews = async (productId) => {
    setShowReviewModal(true);
    setReviewLoading(true);
    setReviewError('');
    setReviews([]);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:9999/review/product/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews(res.data.data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviewError('Lỗi khi tải đánh giá. Vui lòng thử lại.');
    } finally {
      setReviewLoading(false);
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.storeId || !formData.categoryId) {
      setError('Vui lòng chọn cửa hàng và danh mục.');
      return;
    }

    const form = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'sizes') {
        form.append(key, JSON.stringify(formData[key]));
      } else if (key === 'image' && formData[key]) {
        form.append(key, formData[key]);
      } else {
        form.append(key, formData[key]);
      }
    });

    try {
      const token = localStorage.getItem('token');
      if (isEdit) {
        const res = await axios.put(`http://localhost:9999/product/update/${selectedProduct._id}`, form, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
        });
        setProducts(products.map(p => (p._id === selectedProduct._id ? res.data.data : p)));
        showSuccessMessage('Cập nhật sản phẩm thành công!');
      } else {
        const res = await axios.post('http://localhost:9999/product/create', form, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
        });
        setProducts([...products, res.data.data]);
        showSuccessMessage('Thêm sản phẩm thành công!');
      }
      setShowModal(false);
      setError('');
      setCurrentPage(1); 
    } catch (error) {
      console.error('Error submitting product:', error);
      setError(error.response?.data?.message || 'Lỗi khi lưu sản phẩm. Vui lòng thử lại.');
    }
  };

  const handleDelete = async (proId) => {
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này không?')) {
      try {
        await axios.delete(`http://localhost:9999/product/delete/${proId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setProducts(products.filter(p => p._id !== proId));
        showSuccessMessage('Xóa sản phẩm thành công!');
      
        if (filteredProducts.length <= productsPerPage * (currentPage - 1) + 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        setError(error.response?.data?.message || 'Lỗi khi xóa sản phẩm. Vui lòng thử lại.');
      }
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (error && !storeId) {
    return (
      <div className="d-flex">
        <StoreOwnerSidebar />
        <div style={{ marginLeft: '250px', flexGrow: 1, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
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
      <div style={{ marginLeft: '250px', flexGrow: 1, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <HeaderStoreOwner />
        <Container fluid className="px-4">
          <style>{customStyles}</style>
          <Row className="mb-3 align-items-center">
            <Col xs={12} md={6} className="mb-2 mb-md-0">
              <FormControl
                type="text"
                placeholder="Tìm kiếm theo tên sản phẩm..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); 
                }}
              />
            </Col>
            <Col xs={12} md={6} className="text-md-end">
              <Button variant="primary" onClick={handleAddProduct} disabled={!storeId}>
                Thêm sản phẩm
              </Button>
            </Col>
          </Row>
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          <Card className="shadow-sm border-0">
            <Card.Body className="p-3">
              <Table hover responsive className="align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Ảnh</th>
                    <th>Tên sản phẩm</th>
                    <th>Giá</th>
                    <th>Số lượng</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="text-center py-4">
                        <Spinner animation="border" variant="primary" />
                        <div>Đang tải dữ liệu...</div>
                      </td>
                    </tr>
                  ) : currentProducts.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center text-muted py-4">
                        Không có sản phẩm nào.
                      </td>
                    </tr>
                  ) : (
                    currentProducts.map((product, index) => (
                      <tr key={product._id}>
                        <td>{indexOfFirstProduct + index + 1}</td>
                        <td>
                          <img
                            src={product.image || '/images/default-product.png'}
                            alt={product.name}
                            width={50}
                            height={50}
                            style={{ objectFit: 'cover' }}
                          />
                        </td>
                        <td>{product.name}</td>
                        <td>{product.price.toLocaleString()} VNĐ</td>
                        <td>{product.quantity}</td>
                        <td>{product.isAvailable ? 'Có sẵn' : 'Hết hàng'}</td>
                        <td>
                          <Button variant="info text-white" size="sm" className="me-2" onClick={() => handleEditProduct(product)}>
                            Sửa
                          </Button>
                          <Button variant="danger" size="sm" className="me-2" onClick={() => handleDelete(product._id)}>
                            Xóa
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleViewReviews(product._id)}
                          >
                            Xem đánh giá
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
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
            </Card.Body>
          </Card>

          <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg" className="custom-modal">
            <Modal.Header closeButton>
              <Modal.Title>{isEdit ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Danh mục</Form.Label>
                  <Form.Select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    required
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map(category => (
                      <option key={category._id} value={category._id}>{category.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Tên sản phẩm</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Mô tả</Form.Label>
                  <Form.Control
                    as="textarea"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Kích thước (XS, S, M, L, XL, XXL)</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.sizes.join(',')}
                    onChange={(e) => setFormData({ ...formData, sizes: e.target.value.split(',').map(s => s.trim()) })}
                    placeholder="VD: XS,S,M"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Số lượng</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Giá</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Màu sắc</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Trạng thái</Form.Label>
                  <Form.Check
                    type="checkbox"
                    label="Có sẵn"
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Hình ảnh</Form.Label>
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

          <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)} centered size="lg" className="custom-modal">
            <Modal.Header closeButton>
              <Modal.Title>Đánh giá sản phẩm</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {reviewError && <Alert variant="danger">{reviewError}</Alert>}
              {reviewLoading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" variant="primary" />
                  <div>Đang tải đánh giá...</div>
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-4">
                  <i className="fas fa-comments fa-4x text-muted mb-3"></i>
                  <h5 className="fw-bold">Chưa có đánh giá nào</h5>
                  <p className="text-muted">Sản phẩm này chưa nhận được đánh giá từ người dùng.</p>
                </div>
              ) : (
                reviews.map((review) => (
                  <Card key={review._id} className="shadow-sm border-0 mb-3">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div>
                          <strong>{review.userId?.name || 'Khách hàng ẩn danh'}</strong>
                          <div>
                            {[...Array(5)].map((_, i) => (
                              <i
                                key={i}
                                className={`fas fa-star ${i < review.rating ? 'text-warning' : 'text-muted'} me-1`}
                              ></i>
                            ))}
                          </div>
                        </div>
                        <small className="text-muted">{formatDate(review.createdAt)}</small>
                      </div>
                      <p className="mb-0">{review.comment || 'Không có bình luận'}</p>
                    </Card.Body>
                  </Card>
                ))
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowReviewModal(false)}>
                Đóng
              </Button>
            </Modal.Footer>
          </Modal>
        </Container>
      </div>
    </div>
  );
}

export default ManageProducts;