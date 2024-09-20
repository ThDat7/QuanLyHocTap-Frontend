import { useEffect, useState } from 'react'
import { authApis, endpoints } from '../../configs/Apis'
import { Button, Form, Table } from 'react-bootstrap'

const Score = () => {
  const [semesters, setSemesters] = useState()
  const [semesterSelected, setSemesterSelected] = useState()

  const [courseClasses, setCourseClasses] = useState([])
  const [courseClassSelected, setCourseClassSelected] = useState()

  const [scores, setScores] = useState([])

  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        const response = await authApis.get(endpoints.semesterNoneLocked)
        setSemesters(response.data.result)
        setSemesterSelected(response.data.result[0])
      } catch (error) {
        console.error(error)
      }
    }

    fetchSemesters()
    fetchCourseClasses()
    fetchScores()
  }, [])

  useEffect(() => {
    fetchCourseClasses()
  }, [semesterSelected])

  useEffect(() => {
    fetchScores()
  }, [courseClassSelected])

  const fetchCourseClasses = async () => {
    if (!semesterSelected) {
      setCourseClasses([])
      return
    }

    try {
      const url = endpoints.teacherCourseClassTeaching(semesterSelected.id)
      const response = await authApis.get(url)
      setCourseClasses(response.data.result)
      setCourseClassSelected(response.data.result[0])
    } catch (error) {
      console.error(error)
    }
  }

  const fetchScores = async () => {
    if (!courseClassSelected) {
      setScores([])
      return
    }

    try {
      const response = await authApis.get(
        endpoints.teacherScoreByCourseClass(courseClassSelected.id)
      )
      setScores(response.data.result)
    } catch (error) {
      console.error(error)
    }
  }

  const handleEditScore = (e, index) => {
    const newScores = [...scores]
    newScores[index].score = e.target.value
    setScores(newScores)
  }

  const handleChangeCourseClassFilter = (e) => {
    const idSelected = parseInt(e.target.value)
    const courseClass = courseClasses.filter((cc) => cc.id === idSelected)
    if (courseClass.length > 0) setCourseClassSelected(courseClass[0])
  }

  const handleChangeSemesterFilter = (e) => {
    const idSelected = parseInt(e.target.value)
    const semester = semesters.filter((s) => s.id === idSelected)
    if (semester.length > 0) setSemesterSelected(semester[0])
  }

  const handleSaveClick = async () => {
    try {
      const data = scores.map((score) => ({
        studyId: score.studyId,
        score: score.score,
      }))

      await authApis.post(endpoints.teacherUpdateScore, data)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className='container mt-4'>
      <div className='d-flex justify-content-between align-items-center mb-3'>
        <h3 className='text-primary'>Quản lý điểm</h3>
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
            onChange={handleChangeCourseClassFilter}
            className='me-2'
            style={{ width: '180px', display: 'inline-block' }}
          >
            {courseClasses &&
              courseClasses.map((cc, i) => (
                <option key={i} value={cc.id}>
                  Môn học {cc.courseName} Mã môn {cc.courseCode}
                  {/* Mã lớp {cc.} */}
                </option>
              ))}
          </Form.Select>
        </div>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Stt</th>
            <th>MSSV</th>
            <th>Họ</th>
            <th>Tên</th>
            <th>Điểm quá trình</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((score, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{score.studentCode}</td>
              <td>{score.studentLastName}</td>
              <td>{score.studentFirstName}</td>
              <td>
                <Form.Control
                  type='number'
                  value={score.score}
                  onChange={(e) => handleEditScore(e, index)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className='d-flex justify-content-end'>
        <Button size='lg' variant='primary' onClick={handleSaveClick}>
          Lưu
        </Button>
      </div>
    </div>
  )
}
export default Score
