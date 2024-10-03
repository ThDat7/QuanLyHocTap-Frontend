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
    { label: 'Xem kết quả học tập', url: Urls['studyResult'] },
    { label: 'Tình trạng khóa mã sinh viên', url: Urls['studentStatus'] },
  ]

  return <Features features={features} />
}

const TeacherFeatures = () => {
  const features = [
    { label: 'Thời khóa biểu giảng dạy', url: Urls['teacherTimeTable'] },
    { label: 'Quản lý lịch thi', url: Urls['teacherExamSchedule'] },
    { label: 'Quản lý điểm', url: Urls['teacherScore'] },
    { label: 'Quản lý đề cương', url: Urls['teacherCourseOutlines'] },
  ]

  return <Features features={features} />
}

const AdminFeatures = () => {
  const features = [
    { label: 'Lich thi', url: Urls['adminExamSchedule'] },
    { label: 'Diem cuoi ky', url: Urls['adminFinalScore'] },
    { label: 'Thông báo', url: Urls['adminNews'] },
    { label: 'Khoa', url: Urls['adminFaculty'] },
    { label: 'Ngành', url: Urls['adminMajor'] },
    { label: 'Môn', url: Urls['adminCourse'] },
    { label: 'Cài đặt', url: Urls['adminSetting'] },
    { label: 'Chương trình đào tạo', url: Urls['adminEducationProgram'] },
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
              <div className='text-primary'>{feature.label}</div>
            </Link>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Card>
  )
}

export { StudentFeatures, TeacherFeatures, AdminFeatures }
