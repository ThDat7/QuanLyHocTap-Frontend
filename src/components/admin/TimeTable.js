import { useEffect, useState } from 'react'
import { authApis, endpoints } from '../../configs/Apis'
import { Button, Card, Form } from 'react-bootstrap'
import { TimeTable } from '../TimeTable'
import moment from 'moment'

const AdminTimeTable = () => {
  const [semesters, setSemesters] = useState([])
  const [semesterSelected, setSemesterSelected] = useState()

  const [studentClasses, setStudentClasses] = useState([])
  const [studentClassSelected, setStudentClassSelected] = useState()

  const [courseClasses, setCourseClasses] = useState([])
  const [courseClassSelected, setCourseClassSelected] = useState()

  const [courseClassSchedules, setCourseClassSchedules] = useState([])

  const fetchSemesters = async () => {
    try {
      const url = endpoints['allSemester']
      const response = await authApis.get(url)
      setSemesters(response.data.result)
      setSemesterSelected(response.data.result[0])
    } catch (error) {
      console.error(error)
    }
  }

  const fetchStudentClasses = async () => {
    if (!semesterSelected) return

    try {
      const url = endpoints.studentClassesWithStatus(semesterSelected.id)
      const response = await authApis.get(url)
      setStudentClasses(response.data.result)
    } catch (error) {
      console.error(error)
    }
  }

  const fetchCourseClasses = async () => {
    if (!semesterSelected || !studentClassSelected) return

    try {
      const url = endpoints.courseClassWithStatus(
        semesterSelected.id,
        studentClassSelected
      )
      const response = await authApis.get(url)
      setCourseClasses(response.data.result)
    } catch (error) {
      console.error(error)
    }
  }

  const fetchCourseClassSchedules = async () => {
    if (!semesterSelected || !studentClassSelected) return

    try {
      const url = endpoints.adminTimeTableBySemesterAndStudentClass(
        semesterSelected.id,
        studentClassSelected
      )
      const response = await authApis.get(url)
      setCourseClassSchedules(response.data.result)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchSemesters()
  }, [])

  useEffect(() => {
    fetchStudentClasses()
  }, [semesterSelected])

  useEffect(() => {
    fetchCourseClasses()
    fetchCourseClassSchedules()
  }, [studentClassSelected])

  const handleChangeSemesterFilter = (e) => {
    const idSelected = parseInt(e.target.value)
    const semester = semesters.filter((s) => s.id === idSelected)
    if (semester.length > 0) setSemesterSelected(semester[0])
  }

  const scheduleOfCourseClass = courseClassSchedules.find(
    (e) => e.id === parseInt(courseClassSelected)
  )?.schedules

  return (
    <>
      <div>
        <Form.Select
          className=''
          value={semesterSelected?.id}
          onChange={handleChangeSemesterFilter}
        >
          <option>---</option>
          {semesters.map((s, i) => (
            <option key={i} value={s.id}>
              Học kỳ {s.semester} Năm học {s.year}
            </option>
          ))}
        </Form.Select>

        <Form.Select
          className=''
          value={studentClassSelected}
          onChange={(e) => setStudentClassSelected(e.target.value)}
        >
          <option>---</option>
          {studentClasses.map((s, i) => (
            <option
              key={i}
              value={s.id}
              className={s.status ? 'text-success' : 'text-danger'}
            >
              {s.name}
            </option>
          ))}
        </Form.Select>

        <Form.Select
          className=''
          value={courseClassSelected}
          onChange={(e) => setCourseClassSelected(e.target.value)}
        >
          <option>---</option>
          {courseClasses.map((c, i) => (
            <option
              key={i}
              value={c.id}
              className={c.status ? 'text-success' : 'text-danger'}
            >
              {c.courseName}
            </option>
          ))}
        </Form.Select>
      </div>

      <TimeTableEdit
        fetchCourseClassSchedules={fetchCourseClassSchedules}
        courseClassId={courseClassSelected}
        scheduleOfCourseClass={scheduleOfCourseClass}
      />

      {courseClassSchedules.length > 0 && semesterSelected && (
        <TimeTable
          courseClassSchedules={courseClassSchedules}
          semesterSelected={semesterSelected}
        />
      )}
    </>
  )
}

const TimeTableEdit = ({
  fetchCourseClassSchedules,
  courseClassId,
  scheduleOfCourseClass,
}) => {
  const initScheduleForm = {
    id: '',
    shiftStart: '',
    shiftLength: '',
    startDate: '',
    weekLength: '',
    roomType: '',
    roomId: '',
  }

  const [scheduleForm, setScheduleForm] = useState(initScheduleForm)
  const [scheduleSelected, setScheduleSelected] = useState()
  const [availableRooms, setAvailableRooms] = useState([])

  useEffect(() => {
    if (!scheduleSelected) setScheduleForm(initScheduleForm)
    else setScheduleForm(scheduleSelected)
  }, [scheduleSelected])

  const handleSaveSchedule = async () => {
    try {
      const url = endpoints.adminUpdateTimeTable(courseClassId)
      await authApis.post(url, scheduleForm)
      await fetchCourseClassSchedules()
    } catch (error) {
      console.error(error)
    }
  }

  const handleDeleteSchedule = async () => {
    try {
      const url = endpoints.adminDeleteScheduleStudy(scheduleSelected.id)
      await authApis.delete(url)
      await fetchCourseClassSchedules()
    } catch (error) {
      console.error(error)
    }
  }

  const handleSelectSchedule = (s) => {
    if (scheduleSelected?.id === s.id) setScheduleSelected()
    else setScheduleSelected(s)
  }

  const handleChangeScheduleForm = (e, field) => {
    setScheduleForm({ ...scheduleForm, [field]: e.target.value })
  }

  const handleLoadClassroom = async () => {
    try {
      const url = endpoints.adminAvailableRoomTimeTables(courseClassId)
      const response = await authApis.post(url, scheduleForm)
      setAvailableRooms(response.data.result)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <div className='d-flex justify-content-between'>
        <Card style={{ width: '22rem', height: '32rem', overflow: 'auto' }}>
          <Card.Body>
            {scheduleOfCourseClass?.map((s, i) => {
              const isSelected = scheduleSelected?.id === s.id
              const roomType =
                s.roomType === 'CLASS_ROOM' ? 'Lý thuyết' : 'Thực hành'

              return (
                <Card
                  key={i}
                  onClick={() => handleSelectSchedule(s)}
                  bg={isSelected ? 'primary' : ''}
                  style={{ width: '18rem', height: '15rem', cursor: 'pointer' }}
                >
                  <Card.Title>{roomType}</Card.Title>
                  <Card.Body>
                    <p>Tiết bắt đầu: {s.shiftStart}</p>
                    <p>Độ dài tiết: {s.shiftLength}</p>
                    <p>Ngày bắt đầu: {s.startDate}</p>
                    <p>Độ dài tuần: {s.weekLength}</p>
                    <p>Phòng: {s.roomName}</p>
                  </Card.Body>
                </Card>
              )
            })}
          </Card.Body>
        </Card>
        <div className='w-50'>
          <label htmlFor='shiftStart'>Tiết bắt đầu</label>
          <Form.Control
            id='shiftStart'
            type='number'
            value={scheduleForm.shiftStart}
            onChange={(e) => handleChangeScheduleForm(e, 'shiftStart')}
          />
          <label htmlFor='shiftLength'>Độ dài tiết</label>
          <Form.Control
            id='shiftLength'
            type='number'
            value={scheduleForm.shiftLength}
            onChange={(e) => handleChangeScheduleForm(e, 'shiftLength')}
          />
          <label htmlFor='startDate'>Ngày bắt đầu</label>
          <Form.Control
            id='startDate'
            type='text'
            pattern='\d{2}/\d{2}/\d{4}'
            value={scheduleForm.startDate}
            onChange={(e) => handleChangeScheduleForm(e, 'startDate')}
          />
          <label htmlFor='weekLength'>Độ dài tuần</label>
          <Form.Control
            id='weekLength'
            type='number'
            onChange={(e) => handleChangeScheduleForm(e, 'weekLength')}
            value={scheduleForm.weekLength}
          />
          <label htmlFor='roomType'>Loại</label>
          <Form.Select
            id='roomType'
            value={scheduleForm.roomType}
            onChange={(e) => handleChangeScheduleForm(e, 'roomType')}
          >
            <option value='CLASS_ROOM'>Lý thuyết</option>
            <option value='LAB_ROOM'>Thực hành</option>
          </Form.Select>
          <label htmlFor='roomId'>Phòng</label>
          <div className='d-flex'>
            <Form.Select
              id='roomId'
              value={scheduleForm.roomId}
              onChange={(e) => handleChangeScheduleForm(e, 'roomId')}
            >
              {availableRooms.map((r, i) => (
                <option key={i} value={r.id}>
                  {r.name}
                </option>
              ))}
            </Form.Select>
            <Button onClick={handleLoadClassroom}>Load</Button>
          </div>
          <Button variant='success' onClick={handleSaveSchedule}>
            Lưu
          </Button>
          <Button variant='danger' onClick={handleDeleteSchedule}>
            Xóa
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AdminTimeTable
