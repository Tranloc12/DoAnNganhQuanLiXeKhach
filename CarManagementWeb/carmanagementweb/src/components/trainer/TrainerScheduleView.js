import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Form, Alert, Spinner, Button } from 'react-bootstrap';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import styled from 'styled-components';
import { FaComments } from 'react-icons/fa';
import { authApis, endpoints } from '../../configs/Apis.js';
import { MyUserContext } from '../../contexts/Contexts';
import { useChat } from '../../contexts/ChatContext';

const localizer = momentLocalizer(moment);

const StyledCalendarContainer = styled.div`
  .rbc-calendar {
    height: 600px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

  .rbc-header {
    background-color: #f8f9fa;
    font-weight: 600;
    padding: 10px;
    border-bottom: 2px solid #dee2e6;
  }

  .rbc-today {
    background-color: #fff3cd;
  }

  .rbc-event {
    border-radius: 4px;
    border: none;
    padding: 2px 5px;
    font-size: 12px;
    font-weight: 500;
  }
`;

const MemberCard = styled(Card)`
  margin-bottom: 1rem;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  transition: all 0.3s ease;
  max-height: 500px;
  overflow-y: auto;

  &:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    transform: translateY(-2px);
  }

  .card-body {
    padding: 1rem;
  }

  .card-text div {
    margin-bottom: 0.25rem;
    line-height: 1.3;
  }
`;

const TrainerScheduleView = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [workoutLoading, setWorkoutLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const user = useContext(MyUserContext);
  const { openChat, startNewConversation } = useChat();

  useEffect(() => {
    const loadSubscriptions = async () => {
      try {
        setLoading(true);
        const response = await authApis().get(endpoints['trainer-subscriptions']);
        const subscriptionsData = Array.isArray(response.data) ? response.data : [];
        setSubscriptions(subscriptionsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching trainer subscriptions:', err);
        setError('Không thể tải danh sách hội viên');
        setSubscriptions([]); 
      } finally {
        setLoading(false);
      }
    };

    if (user?.userRole === 'ROLE_TRAINER') {
      loadSubscriptions();
    }
  }, [user]);

  // Load workouts for selected subscription
  useEffect(() => {
    if (!selectedSubscription) {
      setWorkouts([]);
      return;
    }

    const loadWorkouts = async () => {
      try {
        setWorkoutLoading(true);
        const response = await authApis().get(
          endpoints['workout-by-subscription'](selectedSubscription.id)
        );
        // Ensure response.data is always an array
        const workoutsData = Array.isArray(response.data) ? response.data : [];
        const formattedWorkouts = workoutsData.map(w => ({
          id: w.id,
          title: w.type,
          start: new Date(w.startTime),
          end: new Date(w.endTime),
          status: w.status
        }));
        setWorkouts(formattedWorkouts);
      } catch (err) {
        console.error('Error fetching workouts:', err);
        setError('Không thể tải lịch tập của hội viên');
        setWorkouts([]); // Set empty array on error
      } finally {
        setWorkoutLoading(false);
      }
    };

    loadWorkouts();
  }, [selectedSubscription]);

  // Handle chat with member
  const handleChatWithMember = async (member) => {
    try {
      await startNewConversation({
        id: member.id.toString(),
        name: member.username,
        role: 'ROLE_MEMBER',
        isSupport: false
      });
      openChat();
    } catch (error) {
      console.error('Error starting chat with member:', error);
    }
  };

  const eventStyle = (event) => {
    let backgroundColor = '#2196F3';
    if (event.status === 'APPROVED') backgroundColor = '#4CAF50';
    if (event.status === 'MEMBER') backgroundColor = '#CCCCC7';
    if (event.status === 'TRAINER') backgroundColor = '#FF9800';
    if (event.status === 'MEMBER_DELETE') backgroundColor = '#F44336';
    if (event.status === 'TRAINER_DELETE') backgroundColor = '#E91E63';

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        color: 'white',
        border: 'none'
      }
    };
  };

  if (loading || !user) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" />
        <p>Đang tải...</p>
      </Container>
    );
  }

  if (user.userRole !== 'ROLE_TRAINER') {
    return (
      <Container className="my-5">
        <Alert variant="danger">Chỉ trainer mới có thể truy cập trang này</Alert>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <h2 className="mb-4">Xem Lịch Tập Hội Viên</h2>

      <Row>
        <Col md={4}>
          <h5>Danh sách hội viên</h5>
          {!Array.isArray(subscriptions) || subscriptions.length === 0 ? (
            <Alert variant="info">Chưa có hội viên nào đăng ký với bạn</Alert>
          ) : (
            subscriptions.map(sub => (
              <MemberCard
                key={sub.id}
                className={selectedSubscription?.id === sub.id ? 'border-primary' : ''}
              >
                <Card.Body>
                  <Card.Title className="h6">
                    {sub.memberId.firstName} {sub.memberId.lastName}
                  </Card.Title>
                  <Card.Text className="small text-muted">
                    <div><strong>Username:</strong> {sub.memberId.username}</div>
                    <div><strong>Email:</strong> {sub.memberId.email}</div>
                    <div><strong>SĐT:</strong> {sub.memberId.phone || 'Chưa cập nhật'}</div>

                    {/* Member Info */}
                    {sub.memberId.memberInfoId && (
                      <>
                        <div><strong>Tuổi:</strong> {sub.memberId.memberInfoId.age || 'Chưa cập nhật'}</div>
                        <div><strong>Chiều cao:</strong> {sub.memberId.memberInfoId.height ? `${sub.memberId.memberInfoId.height} cm` : 'Chưa cập nhật'}</div>
                        <div><strong>Cân nặng:</strong> {sub.memberId.memberInfoId.weight ? `${sub.memberId.memberInfoId.weight} kg` : 'Chưa cập nhật'}</div>
                        <div><strong>Mục tiêu:</strong> {sub.memberId.memberInfoId.fitnessGoal || 'Chưa cập nhật'}</div>
                        <div><strong>Kinh nghiệm:</strong> {sub.memberId.memberInfoId.experienceLevel || 'Chưa cập nhật'}</div>
                        {sub.memberId.memberInfoId.medicalConditions && (
                          <div><strong>Tình trạng sức khỏe:</strong> {sub.memberId.memberInfoId.medicalConditions}</div>
                        )}
                      </>
                    )}

                    <hr className="my-2" />
                    <div><strong>Gói:</strong> {sub.packageId.name}</div>
                    <div><strong>Giá:</strong> {sub.packageId.price?.toLocaleString('vi-VN')} VNĐ</div>
                    <div><strong>Thời hạn:</strong> {moment(sub.startDate).format('DD/MM/YYYY')} - {moment(sub.endDate).format('DD/MM/YYYY')}</div>
                    {sub.remainingSessions && (
                      <div><strong>Buổi còn lại:</strong> {sub.remainingSessions}</div>
                    )}
                    <div><strong>Trạng thái:</strong>
                      <span className={`ms-1 ${sub.isActive ? 'text-success' : 'text-danger'}`}>
                        {sub.isActive ? 'Đang hoạt động' : 'Không hoạt động'}
                      </span>
                    </div>
                  </Card.Text>
                  <div className="d-flex gap-2">
                    <Button
                      variant={selectedSubscription?.id === sub.id ? 'primary' : 'outline-primary'}
                      size="sm"
                      onClick={() => setSelectedSubscription(sub)}
                    >
                      {selectedSubscription?.id === sub.id ? 'Đang xem' : 'Xem lịch tập'}
                    </Button>
                    <Button
                      variant="outline-success"
                      size="sm"
                      onClick={() => handleChatWithMember(sub.memberId)}
                      title="Chat với hội viên"
                    >
                      <FaComments />
                    </Button>
                  </div>
                </Card.Body>
              </MemberCard>
            ))
          )}
        </Col>

        <Col md={8}>
          {selectedSubscription ? (
            <StyledCalendarContainer>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5>Lịch tập của {selectedSubscription.memberId.firstName} {selectedSubscription.memberId.lastName}</h5>
                {workoutLoading && <Spinner animation="border" size="sm" />}
              </div>

              <Calendar
                localizer={localizer}
                events={workouts}
                startAccessor="start"
                endAccessor="end"
                defaultView="week"
                views={["week", "month"]}
                date={currentDate}
                onNavigate={setCurrentDate}
                min={new Date(new Date().setHours(4, 0, 0, 0))}
                max={new Date(new Date().setHours(22, 0, 0, 0))}
                step={60}
                timeslots={1}
                eventPropGetter={eventStyle}
                formats={{ timeGutterFormat: 'HH:mm' }}
                messages={{
                  next: "Tiếp",
                  previous: "Trước",
                  today: "Hôm nay",
                  month: "Tháng",
                  week: "Tuần",
                  day: "Ngày"
                }}
              />

              <div className="mt-3">
                <h6>Chú thích trạng thái:</h6>
                <div className="d-flex flex-wrap gap-3">
                  <span><span className="badge" style={{ backgroundColor: '#CCCCC7' }}>MEMBER</span> - Hội viên tạo</span>
                  <span><span className="badge" style={{ backgroundColor: '#FF9800' }}>TRAINER</span> - Trainer đề xuất</span>
                  <span><span className="badge" style={{ backgroundColor: '#4CAF50' }}>APPROVED</span> - Đã duyệt</span>
                  <span><span className="badge" style={{ backgroundColor: '#F44336' }}>MEMBER_DELETE</span> - Hội viên đề xuất xóa</span>
                  <span><span className="badge" style={{ backgroundColor: '#E91E63' }}>TRAINER_DELETE</span> - Trainer đề xuất xóa</span>
                </div>
              </div>
            </StyledCalendarContainer>
          ) : (
            <Alert variant="info">
              Vui lòng chọn một hội viên để xem lịch tập
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default TrainerScheduleView;
