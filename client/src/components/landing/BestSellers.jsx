import React from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", right: "10px", zIndex: 1 }}
      onClick={onClick}
    >
      <svg width="50" height="50" viewBox="0 0 24 24">
        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
      </svg>
    </div>
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", left: "10px", zIndex: 1 }}
      onClick={onClick}
    >
      <svg width="50" height="50" viewBox="0 0 24 24">
        <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
      </svg>
    </div>
  );
}

const BestSellers = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const products = [
    {
      id: 1,
      name: "Dark florish onepiece",
      price: "$95.00",
      image: "images/product-item-4.jpg",
    },
    {
      id: 2,
      name: "Baggy Shirt",
      price: "$55.00",
      image: "images/product-item-3.jpg",
    },
    {
      id: 3,
      name: "Cotton off-white shirt",
      price: "$65.00",
      image: "images/product-item-5.jpg",
    },
    {
      id: 4,
      name: "Handmade crop sweater",
      price: "$50.00",
      image: "images/product-item-6.jpg",
    },
    {
      id: 5,
      name: "Dark florish onepiece",
      price: "$70.00",
      image: "images/product-item-9.jpg",
    },
    {
      id: 6,
      name: "Cotton off-white shirt",
      price: "$70.00",
      image: "images/product-item-10.jpg",
    },
  ];

  return (
    <section
      id="best-sellers"
      className="py-5 position-relative overflow-hidden"
      style={{ backgroundColor: "#f1f1f0" }}
    >
      <Container>
        <div className="d-flex flex-wrap justify-content-between align-items-center mt-5 mb-3">
          <h4 className="text-uppercase">Best Selling Items</h4>
          <Button variant="link" className="text-decoration-none p-0">
            View All Products
          </Button>
        </div>

        <Slider {...settings} className="product-carousel">
          {products.map((product) => (
            <div key={product.id} className="px-2">
              <Card className="border-0 bg-transparent">
                <div className="position-relative">
                  <Card.Img
                    variant="top"
                    src={product.image}
                    alt={product.name}
                    className="img-fluid"
                  />
                  <Button
                    variant="link"
                    className="position-absolute top-0 end-0 p-2"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24">
                      <path
                        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                        fill="currentColor"
                      />
                    </svg>
                  </Button>
                </div>
                <Card.Body className="px-0">
                  <Card.Title className="text-uppercase">
                    <Button
                      variant="link"
                      className="text-dark p-0 text-decoration-none"
                    >
                      {product.name}
                    </Button>
                  </Card.Title>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold">{product.price}</span>
                    <Button variant="link" className="text-decoration-none p-0">
                      Add to cart
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </div>
          ))}
        </Slider>
      </Container>
    </section>
  );
};

export default BestSellers;
