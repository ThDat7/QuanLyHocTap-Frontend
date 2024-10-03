import { useEffect, useState } from 'react'
import { authApis, endpoints } from '../../configs/Apis'
import { Button, Form, Table } from 'react-bootstrap'
import { useSearchParams } from 'react-router-dom'
import Page from '../Pagination'

const FinalScore = () => {
  const [semesters, setSemesters] = useState([])
  const [semesterSelected, setSemesterSelected] = useState()

  const [courses, setCourses] = useState([])
  const [courseSelected, setCourseSelected] = useState()

  const [courseClasses, setCourseClasses] = useState([])
  const [total, setTotal] = useState(0)
  const [courseClassSelected, setCourseClassSelected] = useState()

  const [searchParam] = useSearchParams()
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParam.get('page') || 1)
  )

  const [scores, setScores] = useState([])

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
    fetchCourses()
  }, [])

  useEffect(() => {
    fetchCourses()
  }, [semesterSelected])

  useEffect(() => {
    fetchCourseClasses()
  }, [courseSelected])

  useEffect(() => {
    fetchScores()
  }, [courseClassSelected])

  const fetchCourses = async () => {
    if (!semesterSelected) return

    try {
      const url = endpoints.courseFromCourseClassBySemester(semesterSelected.id)
      const response = await authApis.get(url)
      setCourses(response.data.result)
      setCourseSelected(response.data.result[0])
    } catch (error) {
      console.error(error)
    }
  }

  const fetchCourseClasses = async () => {
    if (!(semesterSelected && courseSelected)) {
      setCourseClasses([])
      return
    }

    try {
      const url = endpoints.courseClassBySemesterAndCourse(
        semesterSelected.id,
        courseSelected.id
      )
      const response = await authApis.get(url)
      const data = response.data.result
      setCourseClasses(data.data)
      setTotal(data.total)
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
        endpoints.finalScoresByCourseClass(courseClassSelected.id)
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

  const handleSelectCourseClass = (e, cc) => {
    if (!e.target.checked) return

    setCourseClassSelected(cc)
  }
  const handleChangeCourseFilter = (e) => {
    const idSelected = parseInt(e.target.value)
    const course = courses.filter((c) => c.id === idSelected)
    if (course.length > 0) setCourseSelected(course[0])
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

      await authApis.post(endpoints.updateFinalScores, data)
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
            onChange={handleChangeCourseFilter}
            className='me-2'
            style={{ width: '180px', display: 'inline-block' }}
          >
            {courses &&
              courses.map((c, i) => (
                <option key={i} value={c.id}>
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
              <th>Tên môn</th>
              <th>Mã môn</th>
              <th>Tín chỉ</th>
              <th>Tổ</th>
              <th>Giáo viên</th>
            </tr>
          </thead>
          <tbody>
            {courseClasses.map((cc, index) => (
              <tr key={index}>
                <td>
                  <Form.Check
                    type='radio'
                    onChange={(e) => handleSelectCourseClass(e, cc)}
                  />
                </td>
                <td>{index + 1}</td>
                <td>{cc.courseName}</td>
                <td>{cc.courseCode}</td>
                <td>{cc.courseCredits}</td>
                <td>{cc.studentClassName}</td>
                <td>{cc.teacherName}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Page
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          total={total}
        />
      </>

      <>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Stt</th>
              <th>MSSV</th>
              <th>Họ</th>
              <th>Tên</th>
              <th>Điểm cuối kỳ</th>
              {/* <th>Điểm tổng môn</th> */}
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
      </>
    </div>
  )
}
export default FinalScore
