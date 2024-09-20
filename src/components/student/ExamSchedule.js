import React, { useEffect, useState } from 'react'
import { Table, Button, Form } from 'react-bootstrap'
import { authApis, endpoints } from '../../configs/Apis'
import moment from 'moment'

const ExamSchedule = () => {
  const [semesters, setSemesters] = useState()
  const [semesterSelected, setSemesterSelected] = useState()
  const [examSchedules, setExamSchedules] = useState([])

  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        const response = await authApis.get(endpoints.studentAllSemester)
        setSemesters(response.data.result)
        setSemesterSelected(response.data.result[0])
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
    if (!semesters) return

    try {
      const response = await authApis.get(
        endpoints.examScheduleBySemester(semesterSelected.id)
      )
      setExamSchedules(response.data.result)
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
        <h3 className='text-primary'>Xem Lịch Thi</h3>
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
            <option>Lịch thi học kỳ cá nhân</option>
          </Form.Select>
        </div>
        <div>
          <Button variant='outline-primary' className='me-2'>
            In
          </Button>
          <Button variant='outline-primary'>Xuất Excel</Button>
        </div>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Stt</th>
            <th>Mã MH</th>
            <th>Tên môn học</th>
            <th>Loại</th>
            <th>Nhóm thi</th>
            <th>Sĩ số</th>
            <th>Ngày thi</th>
            <th>Giờ bắt đầu</th>
            <th>Phòng thi</th>
            <th>Địa điểm thi</th>
            <th>GC dự thi</th>
            <th>Cấm thi</th>
          </tr>
        </thead>
        <tbody>
          {examSchedules.map((exam, index) => {
            const dateTimeExam = moment(exam.startTime, 'DD/MM/YYYY HH:mm:ss')
            const date = dateTimeExam.format('DD/MM/YYYY')
            const time = dateTimeExam.format('HH:mm')
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{exam.courseCode}</td>
                <td>{exam.courseName}</td>
                <td>{exam.type == 'FINAL' ? 'Cuối kỳ' : 'Giữa kỳ'}</td>
                <td>{exam.studentClassName}</td>
                <td>{exam.quantityStudent}</td>
                <td>{date}</td>
                <td>{time}</td>
                <td>{exam.roomName}</td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            )
          })}
        </tbody>
      </Table>
    </div>
  )
}

export default ExamSchedule
