import React, { useEffect, useState } from 'react'
import './Timetable.css'
import moment from 'moment'
import { Form } from 'react-bootstrap'

const TimeTable = ({ fetchSemesters, fetchSchedules }) => {
  const [semesters, setSemesters] = useState()
  const [semesterSelected, setSemesterSelected] = useState()
  const [weekSelected, setWeekSelected] = useState()
  const [courseClassSchedules, setCourseClassSchedules] = useState([])

  let weeks = []
  let schedules = []

  useEffect(() => {
    const fetchAndSetSemesters = async () => {
      try {
        const response = await fetchSemesters()
        setSemesters(response.data)
        setSemesterSelected(response.data[0])
      } catch (error) {
        console.error(error)
      }
    }

    fetchAndSetSemesters()
    fetchAndSetSchedules()
  }, [])
  useEffect(() => {
    fetchAndSetSchedules()
  }, [semesterSelected, weekSelected])
  useEffect(() => {
    setWeekSelected(1)
  }, [semesterSelected])

  const fetchAndSetSchedules = async () => {
    if (!semesters || !weekSelected) return

    try {
      const response = await fetchSchedules(semesterSelected.id)
      setCourseClassSchedules(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  const calculateWeeks = () => {
    if (!semesterSelected) return

    const formatDate = (date) => date.format('YYYY-MM-DD')

    let startDate = moment(semesterSelected.startDate, 'DD/MM/YYYY')

    if (startDate.day() !== 1) {
      throw new Error('startDate phải là ngày thứ Hai.')
    }

    for (let i = 0; i < semesterSelected.durationWeeks; i++) {
      let endDate = startDate.clone().add(6, 'days')

      weeks.push({
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
      })

      startDate.add(7, 'days')
    }
  }

  calculateWeeks()

  const filterMatchWeekSchedule = () => {
    courseClassSchedules.map((e) => {
      e.schedules.map((schedule) => {
        const startDateSchedule = moment(schedule.startDate, 'DD/MM/YYYY')
        const endDateSchedule = startDateSchedule
          .clone()
          .add(schedule.weekLength, 'weeks')

        if (
          startDateSchedule.isSameOrBefore(weeks[weekSelected].endDate) &&
          endDateSchedule.isSameOrAfter(weeks[weekSelected].startDate)
        ) {
          const day = startDateSchedule.day() + 1
          schedules.push({
            courseName: e.courseName,
            courseCode: e.courseCode,
            studentClassName: e.studentClassName,
            teacherName: e.teacherName,
            day,
            start: schedule.shiftStart,
            duration: schedule.shiftLength,
            type: schedule.roomType,
            roomName: schedule.roomName,
          })
        }
      })
    })
  }

  filterMatchWeekSchedule()

  const dayOfWeeks = [
    {
      name: 'Thứ 2',
      value: 2,
    },
    {
      name: 'Thứ 3',
      value: 3,
    },
    {
      name: 'Thứ 4',
      value: 4,
    },
    {
      name: 'Thứ 5',
      value: 5,
    },
    {
      name: 'Thứ 6',
      value: 6,
    },
    {
      name: 'Thứ 7',
      value: 7,
    },
    {
      name: 'Chủ Nhật',
      value: 1,
    },
  ]

  const handleChangeSemesterFilter = (e) => {
    const idSelected = parseInt(e.target.value)
    const semester = semesters.filter((s) => s.id === idSelected)
    if (semester.length > 0) setSemesterSelected(semester[0])
  }

  return (
    <div className='timetable-container'>
      <div className='timetable-header'>
        <h5>THỜI KHÓA BIỂU TUẦN</h5>
        <div>
          <Form.Select className='' onChange={handleChangeSemesterFilter}>
            {semesters &&
              semesters.map((s, i) => (
                <option key={i} value={s.id}>
                  Học kỳ {s.semester} Năm học {s.year}
                </option>
              ))}
          </Form.Select>

          <Form.Select
            className=''
            onChange={(e) => setWeekSelected(e.target.value)}
          >
            {weeks &&
              weeks.map((e, i) => (
                <option key={i} value={i}>
                  Tuần {i + 1} [từ ngày {e.startDate} đến ngày {e.endDate}]
                </option>
              ))}
          </Form.Select>
        </div>
        <button className='btn btn-primary'>In</button>
      </div>
      <div className='timetable-table'>
        <table>
          <thead>
            <tr>
              <th>Tiết</th>
              <th>Thứ 2</th>
              <th>Thứ 3</th>
              <th>Thứ 4</th>
              <th>Thứ 5</th>
              <th>Thứ 6</th>
              <th>Thứ 7</th>
              <th>Chủ Nhật</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 10 }, (_, shiftIndex) => (
              <tr key={shiftIndex}>
                <td className='header'>{`Tiết ${shiftIndex + 1}`}</td>
                {dayOfWeeks.map((day, dayIndex) => {
                  const isMatchDay = (schedule) => schedule['day'] === day.value
                  const isMatchShift = (schedule) =>
                    schedule['start'] === shiftIndex + 1
                  const isCoverShift = (schedule) => {
                    return (
                      schedule['start'] <= shiftIndex + 1 &&
                      schedule['start'] + schedule['duration'] > shiftIndex + 1
                    )
                  }

                  const matchSchedule = schedules.filter(
                    (i) => isMatchDay(i) && isMatchShift(i)
                  )[0]

                  if (matchSchedule)
                    return (
                      <ScheduleCard key={dayIndex} schedule={matchSchedule} />
                    )
                  else if (
                    schedules.some((i) => isMatchDay(i) && isCoverShift(i))
                  )
                    return <React.Fragment key={dayIndex}></React.Fragment>
                  else return <td key={dayIndex}></td>
                })}

                <td className='header'>{getTimeShift(shiftIndex)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='timetable-navigation'>
        <button className='btn'>Trước</button>
        <button className='btn'>Sau</button>
      </div>
    </div>
  )
}

function getTimeShift(shift) {
  const startTime = { hours: 7, minutes: 0 }
  const date = new Date(0, 0, 0, startTime.hours, startTime.minutes)
  const minutesPerShift = 45
  const restTime = 5
  const minutes = shift * (minutesPerShift + restTime)
  date.setMinutes(date.getMinutes() + minutes)
  const newHours = date.getHours().toString().padStart(2, '0')
  const newMinutes = date.getMinutes().toString().padStart(2, '0')
  return `${newHours}:${newMinutes}`
}

const ScheduleCard = ({ schedule }) => {
  return (
    <td
      rowSpan={schedule['duration']}
      className={`timetable-item ${
        schedule.type === 'CLASS_ROOM' ? 'theory' : 'practice'
      }`}
      style={{
        gridRow: `span ${schedule.duration}`,
      }}
    >
      <strong>{schedule.courseName}</strong>
      <br />
      <span>Nhóm: {schedule.studentClassName}</span>
      <br />
      <span>Phòng: {schedule.roomName}</span>
      <br />
      <span>GV: {schedule.teacherName}</span>
    </td>
  )
}

export default TimeTable
