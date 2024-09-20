import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Button, Table, Form } from 'react-bootstrap'
import './CourseRegistration.css' // Custom CSS for styling
import { authApis, endpoints } from '../../configs/Apis'
import moment from 'moment'

const CourseRegistration = () => {
  const [data, setData] = useState()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = endpoints.courseRegisterInfo
        const res = await authApis.get(url)
        setData(res.data.result)
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [])

  const totalCreditsRegistered = () => {
    if (!data) return 0
    return data.registeredCourses.reduce(
      (total, courseClass) => total + courseClass.courseCredits,
      0
    )
  }

  const checkboxCourseChange = async (e, courseClass) => {
    let isChecked = e.target.checked
    if (isChecked) await registerCourse(courseClass)
    else await unRegisterCourse(courseClass)
  }

  const registerCourse = async (courseClass) => {
    try {
      const url = endpoints.registerCourse(courseClass.id)
      const res = await authApis.post(url)
      setData(res.data.result)
    } catch (error) {
      console.error(error)
    }
  }

  const isCourseRegistered = (courseClass) => {
    return data.registeredCourses.some(
      (registered) => registered.id === courseClass.id
    )
  }

  const unRegisterCourse = async (courseClass) => {
    try {
      const url = endpoints.unRegisterCourse(courseClass.id)
      const res = await authApis.post(url)
      setData(res.data.result)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      {data && (
        <>
          <Row className='mb-3'>
            <Col>
              <h5>
                Đăng Ký Môn Học Học Kỳ {data.semester} - Năm Học {data.year}
              </h5>
            </Col>
            <Col>
              <Form.Select className='form-select'>
                <option value='1'>
                  {/* studentclass will get from reducer use later */}
                  Môn học mở theo lớp sinh viên DH21IT03
                </option>
              </Form.Select>
              <Form.Select className='form-select'></Form.Select>
            </Col>
          </Row>
          <Table bordered>
            <thead>
              <tr>
                <th>Mã MH</th>
                <th>Tên môn học</th>
                <th>Nhóm</th>
                <th>Số TC</th>
                <th>Lớp</th>
                <th>Số lượng</th>
                <th>Còn lại</th>
                <th>Thời khóa biểu</th>
              </tr>
            </thead>
            <tbody>
              {data.openCourses.map((courseClass, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type='checkbox'
                      onChange={(e) => checkboxCourseChange(e, courseClass)}
                      checked={isCourseRegistered(courseClass)}
                    />
                  </td>
                  <td>{courseClass.courseCode}</td>
                  <td>{courseClass.courseName}</td>
                  <td>{courseClass.courseCredits}</td>
                  <td>{courseClass.studentClassName}</td>
                  <td>{courseClass.capacity}</td>
                  <td>{courseClass.remaining}</td>
                  <td>
                    <Schedules
                      schedules={courseClass.scheduleStudies}
                      teacherCode={courseClass.teacherCode}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <h6>Danh sách môn học đã đăng ký:</h6>
          Số tín chỉ đã đăng ký: <b>{totalCreditsRegistered()}</b>
          <Table bordered>
            <thead>
              <tr>
                <th>Xóa</th>
                <th>Mã MH</th>
                <th>Tên môn học</th>
                <th>Số TC</th>
                <th>Lớp</th>
                <th>Thời gian đăng ký</th>
                <th>Trạng thái</th>
                <th>Thời khóa biểu</th>
              </tr>
            </thead>
            <tbody>
              {data.registeredCourses.map((courseClass, index) => (
                <tr key={index}>
                  <td>
                    <Button
                      variant='danger'
                      size='sm'
                      onClick={() => unRegisterCourse(courseClass)}
                    >
                      X
                    </Button>
                  </td>
                  <td>{courseClass.courseCode}</td>
                  <td>{courseClass.courseName}</td>
                  <td>{courseClass.courseCredits}</td>
                  <td>{courseClass.studentClassName}</td>
                  <td>{courseClass.timeRegistered}</td>
                  <td>Đã đăng ký</td>
                  <td>
                    <Schedules
                      schedules={courseClass.scheduleStudies}
                      teacherCode={courseClass.teacherCode}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Row className='justify-content-end'>
            <Col className='text-end'>
              <Button variant='primary'>Xuất phiếu đăng ký</Button>
            </Col>
          </Row>
        </>
      )}
    </>
  )
}

const Schedules = ({ schedules, teacherCode }) => {
  const formmatScheduleString = (schedule) => {
    const startDate = moment(schedule.startDate, 'DD/MM/YYYY')
    const endDate = startDate.add(schedule.weekLength, 'weeks')
    const startDateString = startDate.format('DD/MM/YYYY')
    const endDateString = endDate.format('DD/MM/YYYY')
    const day = startDate.day()
    const time = `từ tiết ${schedule.shiftStart} đến tiết 
    ${schedule.shiftStart + schedule.shiftLength}`
    return `Thứ ${day}, ${time}, Ph ${schedule.roomName}, GV ${teacherCode}, ${startDateString} đến ${endDateString}`
  }

  return (
    <>
      {schedules &&
        schedules.map((schedule, index) => (
          <React.Fragment key={index}>
            {index > 0 && <hr />}
            {formmatScheduleString(schedule)}
          </React.Fragment>
        ))}
    </>
  )
}

export default CourseRegistration
