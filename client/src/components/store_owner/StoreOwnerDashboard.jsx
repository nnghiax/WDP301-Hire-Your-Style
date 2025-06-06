import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from 'chart.js';
import StoreOwnerSidebar from './StoreOwnerSidebar';
import HeaderStoreOwner from './HeaderStoreOwner';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

ChartJS.register(BarElement, CategoryScale, LinearScale);

const StoreOwnerDashboard = () => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
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
        const [totalRes, monthlyRes] = await Promise.all([
          axios.get('http://localhost:9999/revenue/total', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:9999/revenue/monthly', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setTotalRevenue(totalRes.data.data.totalRevenue);
        setMonthlyRevenue(monthlyRes.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [navigate]);

  const chartData = {
    labels: monthlyRevenue.map(item => item.yearMonth),
    datasets: [{
      label: 'Doanh thu hàng tháng',
      data: monthlyRevenue.map(item => item.totalRevenue),
      backgroundColor: 'rgba(75,192,192,0.6)',
    }],
  };

  return (
    <div className="d-flex">
      <StoreOwnerSidebar />
      <div style={{ marginLeft: '250px', flexGrow: 1, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <HeaderStoreOwner />
        <Container fluid className="p-4">
          <Row className="mb-4">
            <Col md={4}>
              <Card className="shadow-sm border-0">
                <Card.Body>
                  <Card.Title>💰 Tổng doanh thu</Card.Title>
                  <Card.Text className="fs-4 fw-semibold">
                    {totalRevenue.toLocaleString()} VNĐ
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card className="shadow-sm border-0">
                <Card.Body>
                  <Card.Title>📈 Biểu đồ doanh thu hàng tháng</Card.Title>
                  <Bar data={chartData} />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default StoreOwnerDashboard;