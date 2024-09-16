import React, { useEffect, useState } from 'react'
import { Table, Button, Form } from 'react-bootstrap'
import { authApis, endpoints } from '../../configs/Apis'
import moment from 'moment'

const TimeTableSemester = () => {
  const [semesters, setSemesters] = useState()
  const [semesterSelected, setSemesterSelected] = useState()
  const [courseClassSchedules, setCourseClassSchedules] = useState([])

  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        const response = await authApis.get(endpoints.studentAllSemester)
        setSemesters(response.data)
        setSemesterSelected(response.data[0])
      } catch (error) {
        console.error(error)
      }
    }

    fetchSemesters()
    fetchSchedules()
  }, [])
  useEffect(() => {
    fetchSchedules()
  }, [semesterSelected])

  const fetchSchedules = async () => {
    if (!semesterSelected) return

    try {
      const response = await authApis.get(
        endpoints.studentTimetableBySemester(semesterSelected.id)
      )
      setCourseClassSchedules(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  const handleChangeSemesterFilter = (e) => {
    const idSelected = parseInt(e.target.value)
    const semester = semesters.filter((s) => s.id === idSelected)
    if (semester.length > 0) setSemesterSelected(semester[0])
  }

  return (
    <div className='container mt-4'>
      <div className='d-flex justify-content-between align-items-center mb-3'>
        <h3 className='text-primary'>Xem TKB học kỳ</h3>
        <div>
          <Form.Select
            onChange={handleChangeSemesterFilter}
            className='me-2'
            style={{ width: '180px', display: 'inline-block' }}
          >
            {semesters &&
              semesters.map((s, i) => (
                <option key={i} value={s.id}>
                  Học kỳ {s.semester} Năm học {s.year}
                </option>
              ))}
          </Form.Select>
          <Form.Select style={{ width: '180px', display: 'inline-block' }}>
            <option>Thời khóa biểu cá nhân</option>
          </Form.Select>
        </div>
        <div>
          <Button variant='outline-primary' className='me-2'>
            In
          </Button>
          <Button variant='outline-primary'>In</Button>
        </div>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Mã MH</th>
            <th>Tên môn học</th>
            <th>Nhóm tổ</th>
            <th>Số tín chỉ</th>
            <th>Lớp</th>
            <th>Thứ</th>
            <th>Tiết bắt đầu</th>
            <th>Số tiết</th>
            <th>Phòng</th>
            <th>Giảng viên</th>
            <th>Thời gian học</th>
          </tr>
        </thead>
        <tbody>
          {courseClassSchedules.map((courseClass, index) => {
            const ScheduleCells = ({ schedule, teacherName }) => {
              const startDate = moment(schedule.startDate, 'DD/MM/YYYY')
              const startDateString = startDate.format('DD/MM/YYYY')
              const dayInWeek = startDate.day()
              const endStudy = startDate.add(schedule.weekLength, 'weeks')
              const endStudyString = endStudy.format('DD/MM/YYYY')

              const studyTime = `${startDateString} - ${endStudyString}`
              return (
                <>
                  <td>{dayInWeek}</td>
                  <td>{schedule.shiftStart}</td>
                  <td>{schedule.shiftLength}</td>
                  <td>{schedule.roomName}</td>
                  <td>{teacherName}</td>
                  <td>{studyTime}</td>
                </>
              )
            }

            const scheduleCount = courseClass.schedules.length
            return (
              <>
                <tr key={index}>
                  <td rowSpan={scheduleCount}>{courseClass.courseCode}</td>
                  <td rowSpan={scheduleCount}>{courseClass.courseName}</td>
                  <td rowSpan={scheduleCount}>
                    {courseClass.studentClassName}
                  </td>
                  <td rowSpan={scheduleCount}>{courseClass.courseCredits}</td>
                  <td rowSpan={scheduleCount}>
                    {courseClass.studentClassName}
                  </td>
                  {courseClass.schedules &&
                    courseClass.schedules.length > 0 && (
                      <ScheduleCells
                        key={index}
                        schedule={courseClass.schedules[0]}
                        teacherName={courseClass.teacherName}
                      />
                    )}
                </tr>
                {scheduleCount > 1 &&
                  [...Array(scheduleCount - 1)].map((_, index) => (
                    <tr key={index}>
                      <ScheduleCells
                        key={index}
                        schedule={courseClass.schedules[index + 1]}
                        teacherName={courseClass.teacherName}
                      />
                    </tr>
                  ))}
              </>
            )
          })}
        </tbody>
      </Table>
    </div>
  )
}

export default TimeTableSemester
