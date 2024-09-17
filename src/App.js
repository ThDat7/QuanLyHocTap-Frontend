import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Col, Container, Row } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import Footer from './layout/Footer'
import Header from './layout/Header'
import Sidebar from './layout/Sidebar'
import Urls from './configs/Urls'
import Forbidden from './components/Forbidden'
import ExamSchedule from './components/student/ExamSchedule'
import StudyResult from './components/student/StudyResult'
import StudentTimetable from './components/student/Timetable'
import CourseRegistration from './components/student/CourseRegistration'
import TimeTableSemester from './components/student/TimeTableSemester'
import SearchResult from './components/educationProgram/SearchResult'
import EducationPrograms from './components/educationProgram/EducationPrograms'
import { default as TeacherTimeTable } from './components/teacher/Timetable'
import { default as TeacherExamSchedule } from './components/teacher/ExamSchedule'
import News, { NewsView } from './components/News'
import StudentStatus from './components/student/StudentStatus'
import Invoice from './components/student/Tution'
import Score from './components/teacher/Score'
import CourseOutlines from './components/teacher/CourseOutline'
import CourseOutlineEdit from './components/teacher/CourseOutlineEdit'
import Major, { MajorEdit } from './components/admin/Major'
import Course, { CourseEdit } from './components/admin/Course'
import Faculty, { FacultyEdit } from './components/admin/Faculty'
import { NewsEdit } from './components/admin/News'
import { default as AdminNews } from './components/admin/News'

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Container fluid className='full-width-height'>
          <Row>
            <Col md={8}>
              <Routes>
                <Route path={Urls['forbidden']} element={<Forbidden />} />
                <Route path={Urls['home']} element={<News />} />
                <Route path={`${Urls['newsView']}:id`} element={<NewsView />} />
                <Route path={Urls['examSchedule']} element={<ExamSchedule />} />
                <Route path={Urls['studyResult']} element={<StudyResult />} />
                <Route
                  path={Urls['timetableSemester']}
                  element={<TimeTableSemester />}
                />
                <Route
                  path={Urls['timetable']}
                  element={<StudentTimetable />}
                />
                <Route
                  path={Urls['courseRegistration']}
                  element={<CourseRegistration />}
                />
                <Route
                  path={Urls['searchEducationProgram']}
                  element={<SearchResult />}
                />
                <Route
                  path={`${Urls['educationProgramView']}:id`}
                  element={<EducationPrograms />}
                />
                <Route
                  path={Urls['studentStatus']}
                  element={<StudentStatus />}
                />
                <Route
                  path={Urls['teacherTimeTable']}
                  element={<TeacherTimeTable />}
                />
                <Route path={Urls['invoice']} element={<Invoice />} />
                <Route
                  path={Urls['teacherExamSchedule']}
                  element={<TeacherExamSchedule />}
                />
                <Route path={Urls['teacherScore']} element={<Score />} />
                <Route
                  path={Urls['teacherCourseOutlines']}
                  element={<CourseOutlines />}
                />
                <Route
                  path={`${Urls['teacherCourseOutlineView']}:id`}
                  element={<CourseOutlineEdit />}
                />

                <Route path={`${Urls['adminMajor']}`} element={<Major />} />
                <Route
                  path={`${Urls['adminMajor']}:id`}
                  element={<MajorEdit />}
                />
                <Route
                  path={`${Urls['adminMajor']}create`}
                  element={<MajorEdit />}
                />
                <Route path={`${Urls['adminCourse']}`} element={<Course />} />
                <Route
                  path={`${Urls['adminCourse']}:id`}
                  element={<CourseEdit />}
                />
                <Route
                  path={`${Urls['adminCourse']}create`}
                  element={<CourseEdit />}
                />
                <Route path={`${Urls['adminFaculty']}`} element={<Faculty />} />
                <Route
                  path={`${Urls['adminFaculty']}:id`}
                  element={<FacultyEdit />}
                />
                <Route
                  path={`${Urls['adminFaculty']}create`}
                  element={<FacultyEdit />}
                />
                <Route path={`${Urls['adminNews']}`} element={<AdminNews />} />
                <Route
                  path={`${Urls['adminNews']}:id`}
                  element={<NewsEdit />}
                />
                <Route
                  path={`${Urls['adminNews']}create`}
                  element={<NewsEdit />}
                />
              </Routes>
            </Col>

            <Col md={4}>
              <Sidebar />
            </Col>
          </Row>
        </Container>
        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App
