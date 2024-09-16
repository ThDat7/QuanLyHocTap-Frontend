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
  allNews: '/api/news',
  newsView: (newsId) => `/api/news/view/${newsId}`,
  invoiceBySemester: (semesterId) =>
    `/api/invoices/semester/${semesterId}/current-student`,
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
