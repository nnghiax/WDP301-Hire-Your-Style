import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Button,Spinner } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from 'chart.js';
import StoreOwnerSidebar from './StoreOwnerSidebar';
import HeaderStoreOwner from './HeaderStoreOwner';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

ChartJS.register(BarElement, CategoryScale, LinearScale);

function Revenue() {
  const [revenueDetails, setRevenueDetails] = useState([]);
  const [dailyRevenue, setDailyRevenue] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [yearlyRevenue, setYearlyRevenue] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user');
    const parseUser = JSON.parse(user);
    if (parseUser.role !== 'store_owner') {
      navigate('/error');
      return;
    }

    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [detailsRes, dailyRes, monthlyRes, yearlyRes] = await Promise.all([
          axios.get('http://localhost:9999/revenue/details', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:9999/revenue/daily', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:9999/revenue/monthly', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:9999/revenue/yearly', { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setRevenueDetails(detailsRes.data.data);
        setDailyRevenue(dailyRes.data.data);
        setMonthlyRevenue(monthlyRes.data.data);
        setYearlyRevenue(yearlyRes.data.data);
      } catch (error) {
        console.error('Error fetching revenue:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const dailyChartData = {
    labels: dailyRevenue.map(item => item.date),
    datasets: [{
      label: 'Doanh thu hàng ngày',
      data: dailyRevenue.map(item => item.totalRevenue),
      backgroundColor: 'rgba(75,192,192,0.6)',
    }],
  };

  const monthlyChartData = {
    labels: monthlyRevenue.map(item => item.yearMonth),
    datasets: [{
      label: 'Doanh thu hàng tháng',
      data: monthlyRevenue.map(item => item.totalRevenue),
      backgroundColor: 'rgba(54,162,235,0.6)',
    }],
  };

  const yearlyChartData = {
    labels: yearlyRevenue.map(item => item.year),
    datasets: [{
      label: 'Doanh thu hàng năm',
      data: yearlyRevenue.map(item => item.totalRevenue),
      backgroundColor: 'rgba(255,99,132,0.6)',
    }],
  };

  return (
    <div className="d-flex">
      <StoreOwnerSidebar />
      <div style={{ marginLeft: '250px', flexGrow: 1, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <HeaderStoreOwner />
        <Container fluid className="px-4">
          <Row className="mb-3">
            <Col>
              <h5 className="fw-bold">📈 Doanh thu</h5>
            </Col>
          </Row>
          <Row className="mb-4">
            <Col>
              <Card className="shadow-sm border-0">
                <Card.Body>
                  <Card.Title>Biểu đồ doanh thu hàng ngày</Card.Title>
                  <Bar data={dailyChartData} />
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card className="shadow-sm border-0">
                <Card.Body>
                  <Card.Title>Biểu đồ doanh thu hàng tháng</Card.Title>
                  <Bar data={monthlyChartData} />
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card className="shadow-sm border-0">
                <Card.Body>
                  <Card.Title>Biểu đồ doanh thu hàng năm</Card.Title>
                  <Bar data={yearlyChartData} />
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col>
              <Card className="shadow-sm border-0">
                <Card.Body>
                  <Card.Title>Chi tiết doanh thu</Card.Title>
                  <Table hover responsive className="align-middle">
                    <thead className="table-dark">
                      <tr>
                        <th>#</th>
                        <th>Người thuê</th>
                        <th>Sản phẩm</th>
                        <th>Số lượng</th>
                        <th>Giá</th>
                        <th>Tổng cộng</th>
                        <th>Ngày thuê</th>
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
                      ) : revenueDetails.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="text-center text-muted py-4">
                            Không có dữ liệu doanh thu.
                          </td>
                        </tr>
                      ) : (
                        revenueDetails.map((detail, index) => (
                          <tr key={detail.rentalId}>
                            <td>{index + 1}</td>
                            <td>{detail.user.name}</td>
                            <td>{detail.items.map(item => item.productName).join(', ')}</td>
                            <td>{detail.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                            <td>{detail.items.reduce((sum, item) => sum + item.subtotal, 0).toLocaleString()} VNĐ</td>
                            <td>{detail.totalAmount.toLocaleString()} VNĐ</td>
                            <td>{new Date(detail.rentalDate).toLocaleDateString('vi-VN')}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default Revenue;