import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminSidebar from './AdminSidebar';
import HeaderAdmin from './HeaderAdmin';

ChartJS.register(BarElement, CategoryScale, LinearScale);

const customStyles = `
  .shadow-sm {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

function AdminDashboard() {
  const [commissionData, setCommissionData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user');
    const parseUser = user ? JSON.parse(user) : null;

    if (!parseUser || parseUser.role !== 'admin') {
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

        const commissionRes = await axios.get('http://localhost:9999/revenue/admin/commission', {
          headers: { Authorization: `Bearer ${token}` },
        }).catch(() => ({ data: { data: {} } }));

        setCommissionData(commissionRes.data.data);
      } catch (error) {
        console.error('Error fetching commission data:', error);
        setError('Không thể tải dữ liệu hoa hồng. Vui lòng kiểm tra kết nối hoặc đăng nhập lại.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const monthlyCommissionChartData = {
    labels: Object.values(commissionData).flatMap(store =>
      Object.keys(store.monthly).map(month => `${store.storeName} - ${month}`)
    ),
    datasets: [{
      label: 'Hoa hồng hàng tháng',
      data: Object.values(commissionData).flatMap(store => Object.values(store.monthly)),
      backgroundColor: 'rgba(54,162,235,0.6)',
    }],
  };

  const yearlyCommissionChartData = {
    labels: Object.values(commissionData).flatMap(store =>
      Object.keys(store.yearly).map(year => `${store.storeName} - ${year}`)
    ),
    datasets: [{
      label: 'Hoa hồng hàng năm',
      data: Object.values(commissionData).flatMap(store => Object.values(store.yearly)),
      backgroundColor: 'rgba(255,99,132,0.6)',
    }],
  };

  return (
    <div className="d-flex">
      <AdminSidebar />
      <div style={{ marginLeft: '250px', flexGrow: 1, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <HeaderAdmin />
        <Container fluid className="px-4">
          <style>{customStyles}</style>
          <Row className="mb-3">
            <Col>
              <h5 className="fw-bold">📊 Bảng điều khiển quản trị</h5>
            </Col>
          </Row>
          {error && <Alert variant="danger">{error}</Alert>}
          {loading ? (
            <Row>
              <Col className="text-center py-4">
                <Spinner animation="border" variant="primary" />
                <div>Đang tải dữ liệu...</div>
              </Col>
            </Row>
          ) : (
            <>
              <Row className="mb-4">
                <Col>
                  <Card className="shadow-sm border-0">
                    <Card.Body>
                      <Card.Title>💰 Hoa hồng hàng tháng theo cửa hàng</Card.Title>
                      <Bar data={monthlyCommissionChartData} />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Card className="shadow-sm border-0">
                    <Card.Body>
                      <Card.Title>💰 Hoa hồng hàng năm theo cửa hàng</Card.Title>
                      <Bar data={yearlyCommissionChartData} />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </>
          )}
        </Container>
      </div>
    </div>
  );
}

export default AdminDashboard;