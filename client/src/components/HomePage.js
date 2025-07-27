import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import { useNavigate } from 'react-router-dom';
import heroAnimation from '../animations/TeamCollaboration.json';

function HomePage() {
    const navigate = useNavigate(); // initialize navigate

    const handleCreateGroup = () => {
        navigate('/Group'); // route to GroupForm
    };

    const handleorder = () => {
        navigate('/order'); // route to place order
    };

    return (
        <div>
            {/* Hero Section */}
            <section className="py-5 bg-light">
                <Container>
                    <Row className="align-items-center">
                        <Col md={6}>
                            <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                                Buy Together, Save More!
                            </motion.h1>
                            <p>Join hands with your community to get wholesale prices on everyday items.</p>
                            <Button variant="primary" className="me-3" onClick={handleCreateGroup}>
                                Create a Group
                            </Button>
                            <Button variant="outline-primary" onClick={handleorder}>Order</Button>
                        </Col>
                        <Col md={6}>
                            <Lottie animationData={heroAnimation} loop={true} />
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* How It Works Section */}
            <section className="py-5">
                <Container>
                    <h2 className="text-center mb-4">How It Works</h2>
                    <Row>
                        {[
                            { step: "Create a Group", desc: "Start a group with the item you want." },
                            { step: "Join Groups", desc: "Find ongoing group orders in your area." },
                            { step: "Vendors Bid", desc: "Vendors offer the best bulk prices." },
                            { step: "Bulk Delivery", desc: "Get items delivered at a discounted rate." },
                        ].map((item, i) => (
                            <Col md={3} key={i}>
                                <Card className="mb-3 text-center shadow-sm">
                                    <Card.Body>
                                        <Card.Title>{item.step}</Card.Title>
                                        <Card.Text>{item.desc}</Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            {/* Footer */}
            <footer className="py-4 text-center bg-dark text-light">
                <Container>
                    <p>© 2025 SupplySync. All rights reserved.</p>
                </Container>
            </footer>
        </div>
    );
}

export default HomePage;
