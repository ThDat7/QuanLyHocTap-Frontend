import React, { useEffect, useState } from 'react'
import { Table, Form, Button } from 'react-bootstrap'
import { authApis, endpoints } from '../../configs/Apis'

const TeacherExamSchedule = () => {
  const [semesters, setSemesters] = useState()
  const [semesterSelected, setSemesterSelected] = useState()
  const [examSchedules, setExamSchedules] = useState([])
  const [examSelected, setExamSelected] = useState()
  const [availableSchedules, setAvailableSchedules] = useState([])
  const [timeSelected, setTimeSelected] = useState()

  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        const response = await authApis.get(endpoints.semesterNoneLocked)
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

  useEffect(() => {
    const fetchAvailableSchedules = async () => {
      try {
        const url = endpoints.teacherAvailableDateMidtermExam(
          examSelected.courseClassId
        )
        const response = await authApis.get(url)
        setAvailableSchedules(response.data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchAvailableSchedules()
  }, [examSelected])

  let theoryCount = 0
  let practiceCount = 0

  const fetchSchedules = async () => {
    if (!semesterSelected) return

    try {
      const response = await authApis.get(
        endpoints.teacherExamScheduleBySemester(semesterSelected.id)
      )
      setExamSchedules(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  const handleChangeSemesterFilter = (e) => {
    const idSelected = parseInt(e.target.value)
    const semester = semesters.filter((s) => s.id === idSelected)
    if (semester.length > 0) setSemesterSelected(semester[0])
  }

  const handleSelectExam = (e, exam) => {
    if (!e.target.checked) return

    setExamSelected(exam)
    setTimeSelected(exam.startTime)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = endpoints.teacherUpdateMidtermExam(examSelected.courseClassId)
      const data = { startTime: timeSelected }
      await authApis.post(url, data)
      await fetchSchedules()
    } catch (error) {
      console.error(error)
    }
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
            <option>Lịch thi môn học đang dạy</option>
          </Form.Select>
        </div>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th></th>
            <th>Stt</th>
            <th>Mã MH</th>
            <th>Tên môn học</th>
            <th>Buổi học thứ</th>
            <th>Thời gian</th>
            <th>Phòng</th>
          </tr>
        </thead>
        <tbody>
          {examSchedules.map((exam, index) => {
            return (
              <tr key={index}>
                <td>
                  <Form.Check
                    type='radio'
                    onChange={(e) => handleSelectExam(e, exam)}
                  />
                </td>
                <td>{index + 1}</td>
                <td>{exam.courseCode}</td>
                <td>{exam.courseName}</td>
                <td>{exam.weekInScheduleStudy}</td>
                <td>{exam.startTime}</td>
                <td>{exam.roomName}</td>
              </tr>
            )
          })}
        </tbody>
      </Table>

      <form>
        <label htmlFor='startTime'>Thời gian</label>

        <Form.Select
          onChange={(e) => setTimeSelected(e.target.value)}
          id='startTime'
          value={timeSelected}
          style={{ marginBottom: '30px' }}
        >
          {availableSchedules.map((schedule, index) => {
            let count
            if (schedule.type == 'Lý thuyết') count = ++theoryCount
            else count = ++practiceCount

            return (
              <option key={index} value={schedule.startTime}>
                Tuần {count} - {schedule.type} - {schedule.startTime}
              </option>
            )
          })}
        </Form.Select>

        <Button variant='primary' type='submit' onClick={handleSubmit}>
          Lưu
        </Button>
      </form>
    </div>
  )
}

export default TeacherExamSchedule
