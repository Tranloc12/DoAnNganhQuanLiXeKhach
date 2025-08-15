import React, { useContext, useEffect, useState } from 'react';
import { authApis, endpoints } from '../../configs/Apis.js';
import { Alert, Badge, Button, Card, Col, Row, Spinner } from 'react-bootstrap';
import { MyUserContext } from '../../contexts/Contexts';
import { getChoiceLabel } from '../../utils/apiUtils';
import { format as dateFormat } from 'date-fns';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaComments } from 'react-icons/fa';
import { useChat } from '../../contexts/ChatContext';

const SubscriptionCard = styled(Card)`
  margin-bottom: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-5px);
  }
`;

const HeaderTitle = styled.h2`
  font-weight: bold;
  margin-bottom: 30px;
  color: #333;
  text-align: center;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
`;

const BadgeContainer = styled.div`
  margin-bottom: 10px;
`;

const StyledBadge = styled(Badge)`
  font-size: 0.9rem;
  padding: 8px 12px;
  margin-right: 10px;
`;

const ActionContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const MySubscription = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useContext(MyUserContext);
  const { openChat, startNewConversation } = useChat();

  useEffect(() => {
    const fetchSubscriptions = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const response = await authApis().get(endpoints['my-subscriptions']);

        // Ensure response.data is always an array
        const subscriptionsData = Array.isArray(response.data) ? response.data : [];

        // Filter only active and paid subscriptions
        const activeSubscriptions = subscriptionsData.filter(sub =>
          sub.isActive && sub.paymentStatus === 'PAID'
        );

        setSubscriptions(activeSubscriptions);
        setLoading(false);
      } catch (err) {
        setError('Failed to load your subscriptions. Please try again later.');
        setSubscriptions([]);
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [user]);

  // Handle chat with trainer
  const handleChatWithTrainer = async (trainer) => {
    try {
      await startNewConversation({
        id: trainer.id.toString(),
        name: trainer.username,
        role: 'ROLE_TRAINER',
        isSupport: false
      });
      openChat();
    } catch (error) {
      console.error('Error starting chat with trainer:', error);
    }
  };



  const renderDate = (date) => {
    if (!date) return 'N/A';
    return dateFormat(new Date(date), 'dd/MM/yyyy');
  };

  const getStatusBadge = (isActive, paymentStatus) => {
    if (isActive && paymentStatus === 'PAID') {
      return <StyledBadge bg="success">Đang hoạt động</StyledBadge>;
    } else if (paymentStatus === 'PENDING') {
      return <StyledBadge bg="warning">Chờ thanh toán</StyledBadge>;
    } else if (paymentStatus === 'FAILED') {
      return <StyledBadge bg="danger">Thanh toán thất bại</StyledBadge>;
    } else if (!isActive) {
      return <StyledBadge bg="secondary">Không hoạt động</StyledBadge>;
    } else {
      return <StyledBadge bg="secondary">Chưa xác định</StyledBadge>;
    }
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (!user) {
    return <Alert variant="info">Vui lòng đăng nhập để xem gói tập của bạn.</Alert>;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (subscriptions.length === 0) {
    return (
      <div className="my-5">
        <HeaderTitle>Gói tập của tôi</HeaderTitle>
        <Alert variant="info">
          Bạn chưa có gói tập nào. Hãy tham khảo các gói tập để bắt đầu!
        </Alert>
        <div className="text-center mt-4">
          <Button variant="primary" as={Link} to="/create-subscription">
            Đăng ký gói tập
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="my-5">
      <HeaderTitle>Gói tập của tôi</HeaderTitle>

      {subscriptions.map((subscription) => {
        try {
          console.log('Rendering subscription:', subscription.id, subscription);

          // Safe access to nested properties
          const packageName = subscription.packageId?.namePack || 'Unknown Package';
          const trainerName = subscription.trainerId?.username || 'No Trainer';
          const memberName = subscription.memberId?.username || 'Unknown Member';

          return (
            <SubscriptionCard key={subscription.id}>
              <Card.Body>
                <Row>
                  <Col md={8}>
                    <Card.Title className="mb-3">{packageName}</Card.Title>
                    <BadgeContainer>
                      {getStatusBadge(subscription.isActive, subscription.paymentStatus)}
                      <StyledBadge bg="info">Có huấn luyện viên</StyledBadge>
                    </BadgeContainer>

                    <Card.Text>
                      <strong>Ngày bắt đầu:</strong> {renderDate(subscription.startDate)}<br />
                      <strong>Ngày kết thúc:</strong> {renderDate(subscription.endDate)}<br />
                      <strong>Số buổi với huấn luyện viên còn lại:</strong> {subscription.remainingSessions || 'Không giới hạn'}<br />
                      <strong>Huấn luyện viên:</strong> {trainerName}
                      {subscription.trainerId && (
                        <Button
                          variant="link"
                          size="sm"
                          className="p-1 ms-2"
                          onClick={() => handleChatWithTrainer(subscription.trainerId)}
                          title="Chat với huấn luyện viên"
                        >
                          <FaComments className="text-success" />
                        </Button>
                      )}
                      <br />
                      <strong>Mô tả gói tập:</strong> {subscription.packageId?.description || 'No description'}
                    </Card.Text>
                  </Col>
                  <Col md={4} className="d-flex flex-column justify-content-between">
                    <div className="text-md-end mb-3">
                      <h4>{subscription.packageId?.price?.toLocaleString() || 0} VNĐ</h4>
                      <p className="text-muted">{getChoiceLabel(subscription.packageId?.choice) || 'N/A'}</p>
                    </div>
                    {(subscription.isActive || subscription.paymentStatus === 'PAID') && (
                      <div className="mt-auto">
                        <ActionContainer>
                          <Button variant="outline-primary" as={Link} to={`/schedule/${subscription.id}`} className="w-100">
                            Lên lịch tập
                          </Button>
                          <Button variant="outline-secondary" as={Link} to="/member-progress" className="w-100">
                            Xem tiến độ
                          </Button>
                          <Button
                            variant="outline-success"
                            onClick={() => handleChatWithTrainer(subscription.trainerId)}
                            className="w-100"
                            title="Chat với huấn luyện viên"
                          >
                            <FaComments className="me-2" />
                            Chat với trainer
                          </Button>
                          <Button
                            variant="outline-danger"
                            as={Link}
                            to={`/reviews/add?subscriptionId=${subscription.id}`}
                            className="w-100"
                          >
                            Đánh giá gói tập
                          </Button>
                        </ActionContainer>
                      </div>
                    )}
                  </Col>
                </Row>
              </Card.Body>
            </SubscriptionCard>
          );
        } catch (error) {
          console.error('Error rendering subscription:', subscription.id, error);
          return (
            <SubscriptionCard key={subscription.id}>
              <Card.Body>
                <Alert variant="danger">
                  Error loading subscription {subscription.id}: {error.message}
                </Alert>
              </Card.Body>
            </SubscriptionCard>
          );
        }
      })}

      <div className="text-center mt-4">
        <Button variant="primary" as={Link} to="/create-subscription">
          Đăng ký thêm gói tập
        </Button>
      </div>
    </div>
  );
};

export default MySubscription;
