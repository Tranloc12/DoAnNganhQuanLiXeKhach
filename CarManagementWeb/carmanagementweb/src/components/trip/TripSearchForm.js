import React, { useState } from 'react';
import { Form, Row, Col, Button, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faChevronDown, faArrowRightArrowLeft } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// KHÔNG CẦN import './TripSearchForm.css'; NỮA nếu bạn nhúng CSS vào đây

function TripSearchForm() {
    const [tripType, setTripType] = useState('oneWay'); // 'oneWay' hoặc 'roundTrip'
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [departureDate, setDepartureDate] = useState(new Date());
    const [returnDate, setReturnDate] = useState(null); // Chỉ dùng cho khứ hồi
    const [numTickets, setNumTickets] = useState(1);

    const handleSearch = (e) => {
        e.preventDefault();
        console.log({
            tripType,
            origin,
            destination,
            departureDate: departureDate.toDateString(),
            returnDate: returnDate ? returnDate.toDateString() : null,
            numTickets
        });
        // Logic gọi API hoặc điều hướng ở đây
    };

    const handleSwapLocations = () => {
        setOrigin(destination);
        setDestination(origin);
    };

    // CSS được định nghĩa trực tiếp trong file JS
    const inlineCss = `
        .trip-search-form-container {
            max-width: 900px;
            margin: 30px auto;
            border: 1px solid #ddd;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        .active-tab {
            background-color: #dc3545 !important;
            color: white !important;
            border-color: #dc3545 !important;
            font-weight: bold;
        }

        .inactive-tab {
            background-color: #f8f9fa !important;
            color: #495057 !important;
            border-color: #e2e6ea !important;
        }

        /* Tùy chỉnh cho DatePicker */
        .react-datepicker-wrapper {
            width: 100%;
        }

        .react-datepicker__input-container {
            width: 100%;
        }

        /* Tùy chỉnh cho nút tìm kiếm */
        .custom-search-button {
            background-color: #ff6600 !important;
            border-color: #ff6600 !important;
            font-size: 1.1rem;
            padding: 0.75rem 2.5rem;
        }

        .custom-search-button:hover {
            background-color: #e65c00 !important;
            border-color: #e65c00 !important;
        }
    `;

    return (
        <div className="trip-search-form-container p-4 rounded shadow-sm bg-white">
            {/* Inject CSS vào DOM */}
            <style>{inlineCss}</style>

            {/* Tabs cho Một chiều / Khứ hồi */}
            <div className="d-flex mb-3">
                <Button
                    variant={tripType === 'oneWay' ? 'danger' : 'light'}
                    className={`me-2 ${tripType === 'oneWay' ? 'active-tab' : 'inactive-tab'}`}
                    onClick={() => setTripType('oneWay')}
                >
                    Một chiều
                </Button>
                <Button
                    variant={tripType === 'roundTrip' ? 'danger' : 'light'}
                    className={`${tripType === 'roundTrip' ? 'active-tab' : 'inactive-tab'}`}
                    onClick={() => setTripType('roundTrip')}
                >
                    Khứ hồi
                </Button>
                <div className="ms-auto">
                    <Button variant="link" className="text-decoration-none text-secondary">
                        Hướng dẫn mua vé
                    </Button>
                </div>
            </div>

            <Form onSubmit={handleSearch}>
                <Row className="mb-3 align-items-end">
                    {/* Điểm đi */}
                    <Col md={4} className="mb-3 mb-md-0">
                        <Form.Group controlId="formOrigin">
                            <Form.Label className="fw-bold">Điểm đi</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Chọn điểm đi"
                                value={origin}
                                onChange={(e) => setOrigin(e.target.value)}
                                required
                            />
                        </Form.Group>
                    </Col>

                    {/* Swap button */}
                    <Col md={1} className="d-flex justify-content-center align-items-center mb-3 mb-md-0">
                        <Button variant="outline-secondary" size="sm" onClick={handleSwapLocations}>
                            <FontAwesomeIcon icon={faArrowRightArrowLeft} />
                        </Button>
                    </Col>

                    {/* Điểm đến */}
                    <Col md={4} className="mb-3 mb-md-0">
                        <Form.Group controlId="formDestination">
                            <Form.Label className="fw-bold">Điểm đến</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Chọn điểm đến"
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="mb-4">
                    {/* Ngày đi */}
                    <Col md={6} className="mb-3 mb-md-0">
                        <Form.Group controlId="formDepartureDate">
                            <Form.Label className="fw-bold">Ngày đi</Form.Label>
                            <InputGroup>
                                <DatePicker
                                    selected={departureDate}
                                    onChange={(date) => setDepartureDate(date)}
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control" // Bootstrap styling
                                    wrapperClassName="w-100" // Make DatePicker span full width
                                    required
                                />
                                <InputGroup.Text>
                                    <FontAwesomeIcon icon={faCalendarAlt} />
                                </InputGroup.Text>
                            </InputGroup>
                        </Form.Group>
                    </Col>

                    {/* Ngày về (chỉ hiển thị nếu là Khứ hồi) */}
                    {tripType === 'roundTrip' && (
                        <Col md={6} className="mb-3 mb-md-0">
                            <Form.Group controlId="formReturnDate">
                                <Form.Label className="fw-bold">Ngày về</Form.Label>
                                <InputGroup>
                                    <DatePicker
                                        selected={returnDate}
                                        onChange={(date) => setReturnDate(date)}
                                        dateFormat="dd/MM/yyyy"
                                        className="form-control"
                                        wrapperClassName="w-100"
                                        minDate={departureDate || new Date()} // Ngày về không thể trước ngày đi
                                        required={tripType === 'roundTrip'}
                                    />
                                    <InputGroup.Text>
                                        <FontAwesomeIcon icon={faCalendarAlt} />
                                    </InputGroup.Text>
                                </InputGroup>
                            </Form.Group>
                        </Col>
                    )}

                    {/* Số vé */}
                    <Col md={tripType === 'roundTrip' ? 6 : 6}> {/* Adjust col size if returnDate is shown */}
                        <Form.Group controlId="formNumTickets">
                            <Form.Label className="fw-bold">Số vé</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type="number"
                                    min="1"
                                    value={numTickets}
                                    onChange={(e) => setNumTickets(parseInt(e.target.value))}
                                    required
                                />
                                <InputGroup.Text>
                                    <FontAwesomeIcon icon={faChevronDown} /> {/* Dùng icon mũi tên xuống như hình */}
                                </InputGroup.Text>
                            </InputGroup>
                        </Form.Group>
                    </Col>
                </Row>

                {/* Phần tìm kiếm gần đây (Tùy chọn) */}
                <div className="recent-searches p-3 bg-light rounded mb-4">
                    <p className="fw-bold mb-2">Tìm kiếm gần đây</p>
                    <div className="d-flex flex-wrap">
                        {/* Ví dụ về một mục tìm kiếm gần đây. Bạn sẽ hiển thị dynamic data ở đây */}
                        <Button variant="outline-secondary" size="sm" className="me-2 mb-2">
                            An Nhơn - TP. Hồ Chí Minh<br/>
                            <small>03/08/2025</small>
                        </Button>
                         <Button variant="outline-secondary" size="sm" className="me-2 mb-2">
                            TP. HCM - Bình Định<br/>
                            <small>11/07/2025</small>
                        </Button>
                        {/* Thêm các mục khác tương tự */}
                    </div>
                </div>

                {/* Nút Tìm chuyến xe */}
                <div className="text-center">
                    <Button variant="danger" type="submit" className="px-5 py-2 fw-bold custom-search-button">
                        Tìm chuyến xe
                    </Button>
                </div>
            </Form>
        </div>
    );
}

export default TripSearchForm;