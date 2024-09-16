import React from 'react'
import { Card, ListGroup } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Urls from '../configs/Urls'

const StudentFeatures = () => {
  const features = [
    { label: 'Đăng ký môn học', url: Urls['courseRegistration'] },
    { label: 'Xem học phí', url: Urls['invoice'] },
    { label: 'Xem thời khóa biểu tuần', url: Urls['timetable'] },
    { label: 'Xem thời khóa biểu học kỳ', url: Urls['timetableSemester'] },
    { label: 'Xem lịch thi', url: Urls['examSchedule'] },
  ]

  return <Features features={features} />
}

const Features = ({ features }) => {
  return (
    <Card className='mb-3'>
      <Card.Header>
        <strong>Tính Năng</strong>
      </Card.Header>
      <ListGroup variant='flush'>
        {features.map((feature, index) => (
          <ListGroup.Item key={index}>
            <Link to={feature.url} className='nav-link'>
              {feature.label}
            </Link>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Card>
  )
}

export { StudentFeatures }
