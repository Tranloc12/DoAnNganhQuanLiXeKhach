import React from 'react';
import { Steps } from 'antd';
import 'antd/dist/reset.css'; // Import CSS của Ant Design

const { Step } = Steps;

// Giả định các bước
const steps = [
  {
    title: 'Chọn ghế',
  },
  {
    title: 'Thông tin khách hàng',
  },
  {
    title: 'Điểm đón/trả',
  },
  {
    title: 'Thanh toán',
  },
];

const BookingSteps = ({ currentStep }) => {
  return (
    <div id="step-booking-mobile" className="py-4 md:py-8 px-4 md:px-0">
      <Steps current={currentStep}>
        {steps.map(item => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
    </div>
  );
};

export default BookingSteps;