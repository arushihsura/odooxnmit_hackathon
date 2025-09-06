import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Badge from 'react-bootstrap/Badge'

const LandingPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const userValid = () => {
    let token = localStorage.getItem("userdbtoken");
    if (token) {
      console.log("user valid")
    } else {
      navigate("*")
    }
  }

  useEffect(() => {
    userValid();
  }, [])

  const categories = [
    { name: 'All', icon: '🔍' },
    { name: 'Laptops', icon: '💻' },
    { name: 'Watches', icon: '⌚' },
    { name: 'Speakers', icon: '🔊' },
    { name: 'Furniture', icon: '🪑' },
    { name: 'Appliances', icon: '🏠' },
    { name: 'Others', icon: '📦' }
  ];

  const featuredProducts = [
    {
      id: 1,
      title: 'MacBook Pro 13"',
      price: '$899',
      status: 'sold',
      image: '/api/placeholder/300/200',
      category: 'Laptops'
    },
    {
      id: 2,
      title: 'Gaming Setup',
      price: '$1,299',
      status: 'coming-soon',
      image: '/api/placeholder/300/200',
      category: 'Others'
    },
    {
      id: 3,
      title: 'Wooden Desk',
      price: '$249',
      status: 'available',
      image: '/api/placeholder/300/200',
      category: 'Furniture'
    },
    {
      id: 4,
      title: 'Coffee Machine',
      price: '$179',
      status: 'available',
      image: '/api/placeholder/300/200',
      category: 'Appliances'
    }
  ];

  const getStatusBadge = (status) => {
    switch(status) {
      case 'sold':
        return <Badge bg="danger" className="position-absolute top-0 start-0 m-2">Sold</Badge>;
      case 'coming-soon':
        return <Badge bg="warning" className="position-absolute top-0 start-0 m-2">Coming Soon</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-light min-vh-100">
      <Container className="py-5">
        {/* Hero Section */}
        <Row className="text-center mb-5">
          <Col>
            <h1 className="display-4 fw-bold mb-3">
              A <span className="text-primary">better</span> way to shop
            </h1>
            <p className="lead text-muted mb-4">
              Buy and sell pre-owned items with trust & ease
            </p>
            <div className="d-flex gap-3 justify-content-center">
              <Button 
                variant="dark" 
                size="lg" 
                className="rounded-pill px-4 py-2"
              >
                🛍️ Buy
              </Button>
              <Button 
                variant="primary" 
                size="lg" 
                className="rounded-pill px-4 py-2"
                style={{ backgroundColor: '#87CEEB', borderColor: '#87CEEB' }}
              >
                🏷️ Sell
              </Button>
            </div>
          </Col>
        </Row>

        {/* Categories Section */}
        <Row className="mb-5">
          <Col>
            <div className="d-flex gap-2 justify-content-center flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category.name}
                  variant={selectedCategory === category.name ? "primary" : "outline-secondary"}
                  className="rounded-pill px-3 py-2 mb-2"
                  onClick={() => setSelectedCategory(category.name)}
                  style={{
                    backgroundColor: selectedCategory === category.name ? '#87CEEB' : 'transparent',
                    borderColor: selectedCategory === category.name ? '#87CEEB' : '#6c757d'
                  }}
                >
                  <span className="me-2">{category.icon}</span>
                  {category.name}
                </Button>
              ))}
            </div>
          </Col>
        </Row>

        {/* Featured Products Section */}
        <Row className="mb-4">
          <Col>
            <h2 className="fw-bold mb-2">Featured Products</h2>
            <p className="text-muted">27 products found</p>
          </Col>
        </Row>

        {/* Products Grid */}
        <Row>
          {featuredProducts.map((product) => (
            <Col md={6} lg={3} key={product.id} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <div className="position-relative">
                  <Card.Img 
                    variant="top" 
                    src={product.image} 
                    style={{ height: '200px', objectFit: 'cover' }}
                    className="rounded-top"
                  />
                  {getStatusBadge(product.status)}
                </div>
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="h6 mb-2">{product.title}</Card.Title>
                  <Card.Text className="text-muted small mb-2">{product.category}</Card.Text>
                  <div className="mt-auto d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-primary">{product.price}</span>
                    {product.status === 'available' && (
                      <Button size="sm" variant="outline-primary" className="rounded-pill">
                        View
                      </Button>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Load More Button */}
        <Row className="mt-4">
          <Col className="text-center">
            <Button 
              variant="outline-primary" 
              size="lg" 
              className="rounded-pill px-4"
            >
              Load More Products
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default LandingPage