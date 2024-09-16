import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Col, Container, Row } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import Footer from './layout/Footer'
import Header from './layout/Header'
import Sidebar from './layout/Sidebar'
import Urls from './configs/Urls'
import Forbidden from './components/Forbidden'
import StudentTimetable from './components/student/Timetable'
import CourseRegistration from './components/student/CourseRegistration'
import TimeTableSemester from './components/student/TimeTableSemester'
import News, { NewsView } from './components/News'
import Invoice from './components/student/Tution'

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
                <Route path={Urls['invoice']} element={<Invoice />} />
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
