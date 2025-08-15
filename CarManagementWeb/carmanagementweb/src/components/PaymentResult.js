import React, { useEffect, useState } from 'react';
import { Container, Card, Alert, Button, Spinner } from 'react-bootstrap';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { authApis, endpoints } from '../configs/Apis.js';

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const [paymentResult, setPaymentResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const processPaymentResult = async () => {
      try {
        const params = {};
        for (let [key, value] of searchParams.entries()) {
          params[key] = value;
        }

        const response = await authApis().get(endpoints['vnpay-return'], { params });
        setPaymentResult(response.data);
      } catch (error) {
        console.error('Error processing payment result:', error);
        setError('Có lỗi xảy ra khi xử lý kết quả thanh toán');
      } finally {
        setLoading(false);
      }
    };

    processPaymentResult();
  }, [searchParams]);

  const getStatusMessage = (responseCode) => {
    switch (responseCode) {
      case '00':
        return 'Thanh toán thành công';
      case '07':
        return 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).';
      case '09':
        return 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.';
      case '10':
        return 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần';
      case '11':
        return 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.';
      case '12':
        return 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.';
      case '13':
        return 'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP).';
      case '24':
        return 'Giao dịch không thành công do: Khách hàng hủy giao dịch';
      case '51':
        return 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.';
      case '65':
        return 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.';
      case '75':
        return 'Ngân hàng thanh toán đang bảo trì.';
      case '79':
        return 'Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định.';
      case '72':
        return 'Giao dịch bị từ chối bởi ngân hàng phát hành';
      default:
        return 'Giao dịch thất bại';
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Đang xử lý...</span>
        </Spinner>
        <p className="mt-3">Đang xử lý kết quả thanh toán...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <Alert.Heading>Lỗi</Alert.Heading>
          <p>{error}</p>
          <hr />
          <div className="d-flex justify-content-end">
            <Button variant="outline-danger" as={Link} to="/gym-packages">
              Quay lại danh sách gói tập
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Card className="mx-auto" style={{ maxWidth: '600px' }}>
        <Card.Header className={`text-center ${paymentResult?.success ? 'bg-success text-white' : 'bg-danger text-white'}`}>
          <h4>
            {paymentResult?.success ? '✅ Thanh toán thành công' : '❌ Thanh toán thất bại'}
          </h4>
        </Card.Header>
        <Card.Body>
          {paymentResult?.success ? (
            <Alert variant="success">
              <Alert.Heading>Chúc mừng!</Alert.Heading>
              <p>Bạn đã đăng ký gói tập thành công. Gói tập của bạn đã được kích hoạt.</p>
            </Alert>
          ) : (
            <Alert variant="danger">
              <Alert.Heading>Thanh toán thất bại</Alert.Heading>
              <p>{getStatusMessage(paymentResult?.responseCode)}</p>
            </Alert>
          )}

          {paymentResult && (
            <div className="mt-4">
              <h6>Thông tin giao dịch:</h6>
              <ul className="list-unstyled">
                {paymentResult.packageName && (
                  <li><strong>Gói tập:</strong> {paymentResult.packageName}</li>
                )}
                {paymentResult.amount && (
                  <li><strong>Số tiền:</strong> {formatPrice(paymentResult.amount)}</li>
                )}
                <li><strong>Mã giao dịch:</strong> {searchParams.get('vnp_TxnRef')}</li>
                <li><strong>Thời gian:</strong> {new Date().toLocaleString('vi-VN')}</li>
              </ul>
            </div>
          )}
        </Card.Body>
        <Card.Footer className="text-center">
          {paymentResult?.success ? (
            <div>
              <Button variant="primary" as={Link} to="/my-subscriptions" className="me-2">
                Xem gói tập của tôi
              </Button>
              <Button variant="outline-primary" as={Link} to="/gym-packages">
                Đăng ký thêm gói tập
              </Button>
            </div>
          ) : (
            <div>
              <Button variant="primary" onClick={() => navigate('/create-subscription')} className="me-2">
                Thử lại
              </Button>
              <Button variant="outline-secondary" as={Link} to="/gym-packages">
                Quay lại danh sách gói tập
              </Button>
            </div>
          )}
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default PaymentResult;

