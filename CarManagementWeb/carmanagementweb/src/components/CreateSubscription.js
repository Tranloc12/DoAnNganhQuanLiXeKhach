import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Modal, Spinner } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { authApis, endpoints } from '../configs/Apis.js';
import { MyUserContext } from '../contexts/Contexts';
import GymPackageList from './GymPackageList';
import Apis from '../configs/Apis.js';
import { formatPrice } from '../utils/apiUtils';

const CreateSubscription = () => {
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [trainerId, setTrainerId] = useState('');
  const [trainers, setTrainers] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [searchParams] = useSearchParams();
  const user = useContext(MyUserContext);

  useEffect(() => {
    // Get package ID from URL params if available
    const packageId = searchParams.get('packageId');
    if (packageId) {
      setSelectedPackageId(parseInt(packageId));
      fetchPackageDetails(parseInt(packageId));
    }

    fetchTrainers();
  }, [searchParams]);

  const fetchPackageDetails = async (packageId) => {
    try {
      // First try to get individual package details
      let response;
      try {
        response = await Apis.get(`${endpoints['gym-packages']}/${packageId}`);
        console.log('Package details response (individual):', response.data);
      } catch (individualError) {
        console.warn('Individual package endpoint failed, falling back to list endpoint:', individualError);

        // Fallback: Get all packages and find the one we need
        const listResponse = await Apis.get(endpoints['gym-packages']);
        console.log('Package list response:', listResponse.data);

        if (Array.isArray(listResponse.data)) {
          const foundPackage = listResponse.data.find(pkg => pkg.id === parseInt(packageId));
          if (foundPackage) {
            response = { data: foundPackage };
            console.log('Found package in list:', foundPackage);
          } else {
            throw new Error(`Package with ID ${packageId} not found in list`);
          }
        } else {
          throw new Error('Invalid response format from list endpoint');
        }
      }

      // Validate package data before setting state
      if (response.data) {
        const packageData = response.data;

        // Log price specifically to debug NaN issue
        console.log('Package price:', packageData.price, 'Type:', typeof packageData.price);

        // Ensure price is a valid number
        if (packageData.price === null || packageData.price === undefined || isNaN(packageData.price)) {
          console.warn('Invalid price detected, setting to 0:', packageData.price);
          packageData.price = 0;
        }

        setSelectedPackage(packageData);
      } else {
        console.error('No package data received');
        setError('Không thể tải thông tin gói tập');
      }
    } catch (error) {
      console.error('Error fetching package details:', error);
      setError('Có lỗi xảy ra khi tải thông tin gói tập');
    }
  };

  const fetchTrainers = async () => {
    try {
      // Try secure endpoint first, fallback to public endpoint
      let response;
      try {
        response = await authApis().get(endpoints['secure-trainers']);
      } catch (secureError) {
        console.log('Secure endpoint failed, trying public endpoint:', secureError);
        response = await Apis.get(endpoints['trainers']);
      }

      // Ensure response.data is always an array
      const trainersData = Array.isArray(response.data) ? response.data : [];
      setTrainers(trainersData);
    } catch (error) {
      console.error('Error fetching trainers:', error);
      setTrainers([]); // Set empty array on error
    }
  };

  const handlePackageSelect = async (packageId) => {
    setSelectedPackageId(packageId);
    await fetchPackageDetails(packageId);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedPackageId) {
      setError('Vui lòng chọn gói tập');
      return;
    }
    if (!startDate) {
      setError('Vui lòng chọn ngày bắt đầu');
      return;
    }
    if (!trainerId) {
      setError('Vui lòng chọn huấn luyện viên');
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmSubscription = async () => {
    setLoading(true);
    setError('');

    try {
      console.log('=== DEBUG: Creating subscription ===');
      console.log('Selected Package ID:', selectedPackageId);
      console.log('Start Date:', startDate);
      console.log('Trainer ID:', trainerId);
      console.log('Selected Package:', selectedPackage);

      const formData = new FormData();
      formData.append('packageId', selectedPackageId);
      formData.append('startDate', startDate);
      formData.append('trainerId', trainerId); // trainerId is now required

      // Log FormData contents
      for (let [key, value] of formData.entries()) {
        console.log(`FormData ${key}:`, value);
      }

      console.log('Sending request to:', endpoints['create-subscription']);
      const response = await authApis().post(endpoints['create-subscription'], formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Subscription creation response:', response.data);

      // Get subscription ID from response
      const subscriptionId = response.data.subscriptionId;

      // Create VNPay payment URL
      const paymentResponse = await authApis().post(endpoints['create-vnpay-payment'](subscriptionId));
      const paymentUrl = paymentResponse.data.paymentUrl;

      // Redirect to VNPay
      window.location.href = paymentUrl;

    } catch (error) {
      console.error('Error creating subscription:', error);
      setError('Có lỗi xảy ra khi tạo đăng ký. Vui lòng thử lại.');
    } finally {
      setLoading(false);
      setShowConfirmModal(false);
    }
  };

  const calculateFinalPrice = () => {
    if (!selectedPackage) return 0;

    // Safely handle price and discount values
    const originalPrice = selectedPackage.price || 0;
    const discount = selectedPackage.discount || 0;

    // Validate that originalPrice is a valid number
    if (isNaN(originalPrice) || originalPrice < 0) {
      console.warn('Invalid original price:', originalPrice);
      return 0;
    }

    // Validate discount is within reasonable range
    if (isNaN(discount) || discount < 0 || discount > 100) {
      console.warn('Invalid discount:', discount);
      return originalPrice;
    }

    return originalPrice * (1 - discount / 100);
  };

  if (!user) {
    return (
      <Container className="mt-5">
        <Alert variant="warning">
          Vui lòng đăng nhập để đăng ký gói tập.
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Đăng ký gói tập</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        <Col md={8}>
          <GymPackageList onSelect={handlePackageSelect} />
        </Col>

        <Col md={4}>
          <Card className="sticky-top" style={{ top: '20px' }}>
            <Card.Header>
              <h5>Thông tin đăng ký</h5>
            </Card.Header>
            <Card.Body>
              {selectedPackage ? (
                <>
                  <h6>{selectedPackage.namePack}</h6>
                  <p className="text-muted">{selectedPackage.description}</p>

                  <div className="mb-3">
                    <strong>Giá gốc:</strong> {formatPrice(selectedPackage.price)}
                    {selectedPackage.discount > 0 && (
                      <>
                        <br />
                        <strong>Giảm giá:</strong> {selectedPackage.discount}%
                        <br />
                        <strong className="text-success">Giá cuối:</strong> {formatPrice(calculateFinalPrice())}
                      </>
                    )}
                  </div>

                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Ngày bắt đầu</Form.Label>
                      <Form.Control
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Huấn luyện viên <span className="text-danger">*</span></Form.Label>
                      <Form.Select
                        value={trainerId}
                        onChange={(e) => setTrainerId(e.target.value)}
                        required
                      >
                        <option value="">-- Chọn huấn luyện viên --</option>
                        {Array.isArray(trainers) && trainers.map(trainer => (
                          <option key={trainer.id} value={trainer.id}>
                            {trainer.username}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>

                    <Button
                      type="submit"
                      variant="primary"
                      className="w-100"
                      disabled={loading}
                    >
                      {loading ? <Spinner size="sm" /> : 'Đăng ký và thanh toán'}
                    </Button>
                  </Form>
                </>
              ) : (
                <p className="text-muted">Vui lòng chọn gói tập để xem thông tin</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Confirmation Modal */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận đăng ký</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPackage && (
            <>
              <p><strong>Gói tập:</strong> {selectedPackage.namePack}</p>
              <p><strong>Giá:</strong> {formatPrice(calculateFinalPrice())}</p>
              <p><strong>Ngày bắt đầu:</strong> {startDate}</p>
              <p><strong>Huấn luyện viên:</strong> {Array.isArray(trainers) ? trainers.find(t => t.id == trainerId)?.username : 'N/A'}</p>
              <p className="text-info">Bạn sẽ được chuyển đến trang thanh toán VNPay để hoàn tất đăng ký.</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={confirmSubscription} disabled={loading}>
            {loading ? <Spinner size="sm" /> : 'Xác nhận và thanh toán'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CreateSubscription;
