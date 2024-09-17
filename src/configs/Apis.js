import axios from 'axios'
import Cookies from 'js-cookie'

const SERVER_CONTEXT = '/'
const SERVER_PORT = '80'
const SERVER_HOST = 'localhost'

export const endpoints = {
  studentAllSemester: '/api/semesters/current-student',
  studentTimetableBySemester: (semesterId) =>
    `/api/timetables/semester/${semesterId}/current-student`,
  studyResult: '/api/study-results/current-student',
  examScheduleBySemester: (semesterId) =>
    `/api/exam-schedules/semester/${semesterId}/current-student`,
  courseRegisterInfo: '/api/course-registers/by-current-education-program',
  registerCourse: (courseClassId) =>
    `/api/course-registers/register-course/${courseClassId}`,
  unRegisterCourse: (courseClassId) =>
    `/api/course-registers/unregister-course/${courseClassId}`,
  searchEducationProgram: '/api/education-programs/search',
  'education-program-view': (id) => `/api/education-programs/view/${id}`,
  allNews: '/api/news',
  newsView: (newsId) => `/api/news/view/${newsId}`,
  currentStudentStatus: '/api/student-status/current-student',
  invoiceBySemester: (semesterId) =>
    `/api/invoices/semester/${semesterId}/current-student`,

  teacherAllSemester: '/api/semesters/current-teacher',
  semesterNoneLocked: '/api/semesters/none-locked',
  teacherTimetableBySemester: (semesterId) =>
    `/api/timetables/semester/${semesterId}/current-teacher`,
  teacherExamScheduleBySemester: (semesterId) =>
    `/api/exam-schedules/semester/${semesterId}/current-teacher`,
  teacherAvailableDateMidtermExam: (courseClassId) =>
    `/api/exam-schedules/course-class/${courseClassId}/available-date-midterm-exam`,
  teacherUpdateMidtermExam: (courseClassId) =>
    `/api/exam-schedules/course-class/${courseClassId}/midterm-exam/current-teacher`,
  teacherCourseClassTeaching: (semesterId) =>
    `/api/course-classes/semester/${semesterId}/current-teacher-teaching`,
  teacherScoreByCourseClass: (courseClassId) =>
    `/api/scores/course-class/${courseClassId}/current-teacher`,
  teacherUpdateScore: '/api/scores/update/current-teacher',
  teacherCourseOutlines: `/api/course-outlines/current-teacher`,
  teacherCourseOutlineView: (id) =>
    `/api/course-outlines/${id}/current-teacher`,
  teacherUpdateCourseOutline: (id) =>
    `/api/course-outlines/${id}/current-teacher`,

  faculties: '/api/faculties',
  faculty: (id) => `/api/faculties/${id}`,

  newses: '/api/news',
  news: (id) => `/api/news/${id}`,
  staffSelectOption: `/api/staffs/select-options`,
}

export default axios.create({
  baseURL: `http://${SERVER_HOST}:${SERVER_PORT}${SERVER_CONTEXT}`,
})

const authApis = axios.create({
  baseURL: `http://${SERVER_HOST}:${SERVER_PORT}${SERVER_CONTEXT}`,
  headers: {
    authorization: Cookies.get('token'),
  },
})

authApis.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token')
    if (token) {
      config.headers['authorization'] = token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export { authApis }
