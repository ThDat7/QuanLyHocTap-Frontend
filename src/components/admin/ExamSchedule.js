import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Table, Form, Button, Card, Container, Row, Col } from 'react-bootstrap'
import { authApis, endpoints } from '../../configs/Apis'
import { useSearchParams } from 'react-router-dom'
import Page from '../Pagination'
import DatePicker from 'react-datepicker'

import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'

const AdminExamSchedule = () => {
  const [semesters, setSemesters] = useState([])
  const [semesterSelected, setSemesterSelected] = useState()

  const [courses, setCourses] = useState([])
  const [courseSelected, setCourseSelected] = useState()

  const [examSchedules, setExamSchedules] = useState([])
  const [total, setTotal] = useState(0)
  const [examSelected, setExamSelected] = useState()

  const [searchParam] = useSearchParams()
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParam.get('page') || 1)
  )

  const [availableTimes, setAvailableTimes] = useState([])
  const [timeSlotSelected, setTimeSlotSelected] = useState()

  const [availableRooms, setAvailableRooms] = useState([])
  const [roomSelected, setRoomSelected] = useState()

  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        const url = endpoints.allSemester
        const response = await authApis.get(url)
        setSemesters(response.data.result)
        setSemesterSelected(response.data.result[0])
      } catch (error) {
        console.error(error)
      }
    }

    fetchSemesters()
    fetchCourse()
  }, [])

  useEffect(() => {
    fetchCourse()
  }, [semesterSelected])

  useEffect(() => {
    fetchAvailableTimes()
  }, [courseSelected, currentPage])

  useEffect(() => {
    const fetchAvailableTimes = async () => {
      try {
        const url = endpoints.adminAvailableTimeFinalExam(
          examSelected.courseClassId
        )
        const response = await authApis.get(url)
        setAvailableTimes(response.data.result.startTimeSlots)
      } catch (error) {
        console.error(error)
      }
    }
    fetchAvailableTimes()
  }, [examSelected])

  useEffect(() => {
    const fetchAvailableRooms = async () => {
      if (!timeSlotSelected) return

      try {
        const url = endpoints.adminAvailableRoomFinalExam(
          examSelected.courseClassId
        )
        const data = { startTime: timeSlotSelected }
        const response = await authApis.post(url, data)
        setAvailableRooms(response.data.result)
      } catch (error) {
        console.error(error)
      }
    }
    fetchAvailableRooms()
  }, [timeSlotSelected])

  const fetchCourse = async () => {
    if (!semesterSelected) return

    try {
      const response = await authApis.get(
        endpoints.courseWithFinalExamStatus(semesterSelected.id)
      )
      setCourses(response.data.result)
      setCourseSelected(response.data.result[0])
      setExamSelected(null)
    } catch (error) {
      console.error(error)
    }
  }

  const fetchAvailableTimes = async () => {
    if (!(semesterSelected && courseSelected)) return
    try {
      const url = endpoints.finalExamBySemesterAndCourse(
        semesterSelected.id,
        courseSelected.id
      )
      const urlWithPage = `${url}?page=${currentPage}`
      const response = await authApis.get(urlWithPage)
      const data = response.data.result
      setExamSchedules(data.data)
      setTotal(data.total)
    } catch (error) {
      console.error(error)
    }
  }

  const handleChangeSemesterFilter = (e) => {
    const idSelected = parseInt(e.target.value)
    const semester = semesters.filter((s) => s.id === idSelected)
    if (semester.length > 0) setSemesterSelected(semester[0])
  }

  const handleChangeCourseFilter = (e) => {
    const idSelected = parseInt(e.target.value)
    const course = courses.filter((c) => c.id === idSelected)
    if (course.length > 0) setCourseSelected(course[0])
  }

  const handleSelectExam = (e, exam) => {
    if (!e.target.checked) return

    setExamSelected(exam)
    setTimeSlotSelected(exam.startTime)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = endpoints.adminUpdateFinalExam(examSelected.courseClassId)
      const data = { time: timeSlotSelected, roomId: roomSelected }
      await authApis.post(url, data)
      await fetchAvailableTimes()
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
          <Form.Select
            onChange={handleChangeCourseFilter}
            className='me-2'
            style={{ width: '180px', display: 'inline-block' }}
          >
            {courses &&
              courses.map((c, i) => (
                <option
                  className={
                    c.isHaveFullFinalExamSchedule
                      ? 'text-success'
                      : 'text-danger'
                  }
                  key={i}
                  value={c.id}
                >
                  {c.code} - {c.name}
                </option>
              ))}
          </Form.Select>
        </div>
      </div>
      <>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th></th>
              <th>Stt</th>
              <th>Mã MH</th>
              <th>Tên môn học</th>
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
                  <td>{exam.startTime}</td>
                  <td>{exam.roomName}</td>
                </tr>
              )
            })}
          </tbody>
        </Table>

        <Page
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          total={total}
        />
      </>

      <form>
        <TimeSlotSelect
          timeSlots={availableTimes}
          timeSlotSelected={timeSlotSelected}
          setTimeSlotSelected={setTimeSlotSelected}
        />

        <label htmlFor='startTime'>Phòng</label>
        <Form.Select
          onChange={(e) => setRoomSelected(e.target.value)}
          id='startTime'
          value={roomSelected}
          style={{ marginBottom: '30px' }}
        >
          {availableRooms.map((room, index) => (
            <option key={index} value={room.id}>
              {room.name}
            </option>
          ))}
        </Form.Select>

        <Button variant='primary' type='submit' onClick={handleSubmit}>
          Lưu
        </Button>
      </form>
    </div>
  )
}

const TimeSlotSelect = ({
  timeSlots,
  timeSlotSelected,
  setTimeSlotSelected,
}) => {
  const [selectedDate, setSelectedDate] = useState(null)
  const [availableTimes, setAvailableTimes] = useState([])
  const [selectedTime, setSelectedTime] = useState(null)

  const dateFormat = 'DD/MM/YYYY'
  const timeFormat = 'HH:mm:ss'
  const timeSlotFormat = 'HH:mm'
  const dateTimeFormat = `${dateFormat} ${timeFormat}`

  const processedSlots = useMemo(() => {
    return timeSlots.map((slot) => moment(slot, dateTimeFormat))
  }, [timeSlots])

  const availableDates = useMemo(() => {
    const result = []
    processedSlots.forEach((slot) => {
      const dateStr = slot.format(dateFormat)
      const timeSlot = slot.format(timeSlotFormat)
      const dts = result.find((dts) => dts.date === dateStr)
      if (dts) {
        dts.times.push(timeSlot)
      } else {
        result.push({ date: dateStr, times: [timeSlot] })
      }
    })
    if (result.length > 0)
      setSelectedDate(moment(result[0].date, dateFormat).toDate())

    return result
  }, [processedSlots])

  useEffect(() => {
    if (!(selectedDate && selectedTime)) return

    const selectedTimeMoment = moment(selectedTime, timeSlotFormat)

    const timeSlot = moment(selectedDate, dateFormat)
      .hour(selectedTimeMoment.hour())
      .minute(selectedTimeMoment.minute())
      .second(0)

    const timeSlotStr = timeSlot.format(dateTimeFormat)

    setTimeSlotSelected(timeSlotStr)
  }, [selectedTime])

  useCallback(() => {
    if (timeSlotSelected) {
      const date = moment(timeSlotSelected, dateFormat).toDate()
      const timeSlot = moment(timeSlotSelected, timeSlotFormat)

      setSelectedDate(date)
      setSelectedTime(timeSlot)
    }
  }, [timeSlotSelected])

  const isDateAvailable = (date) => {
    const dateStr = moment(date).format(dateFormat)
    return availableDates.some((dts) => dts.date === dateStr)
  }

  const handleDateChange = (date) => {
    setSelectedDate(date)
    setSelectedTime(null)

    const dateStr = moment(date).format(dateFormat)
    const timesForSelectedDate = availableDates.find(
      (dts) => dts.date === dateStr
    )?.times

    setAvailableTimes(timesForSelectedDate)
  }

  const handleTimeChange = (timeOption) => {
    if (selectedTime === timeOption) setSelectedTime(null)
    else setSelectedTime(timeOption)
  }

  return (
    <>
      <div>Chọn ngày</div>
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        filterDate={isDateAvailable}
        dateFormat='dd/MM/yyyy'
        placeholderText='Chọn ngày'
        className='date-picker'
      />

      <Container
        style={{
          border: '1px solid',
          borderRadius: '0.3rem',
          minHeight: '10rem',
          padding: '2rem',
        }}
      >
        <Row>
          {availableTimes.map((time, index) => {
            const bgColor =
              selectedTime === time ? 'bg-primary' : 'bg-secondary'

            return (
              <Col key={index}>
                <div
                  className={`d-flex 
                    justify-content-center 
                    align-items-center 
                    text-white 
                    ${bgColor}`}
                  key={index}
                  onClick={() => handleTimeChange(time)}
                  style={{
                    border: '1px solid',
                    borderRadius: '0.3rem',
                    width: '7rem',
                    height: '3rem',
                    cursor: 'pointer',
                  }}
                >
                  {time}
                </div>
              </Col>
            )
          })}

          {availableTimes.length > 0 &&
            Array.from(Array(7 - (availableTimes.length % 7))).map(
              (_, index) => <Col key={index}></Col>
            )}
        </Row>
      </Container>
    </>
  )
}

export default AdminExamSchedule
