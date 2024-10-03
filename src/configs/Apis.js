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

  majors: '/api/majors',
  major: (id) => `/api/majors/${id}`,
  facultiesSelectOptions: '/api/faculties/select-options',

  courses: '/api/courses',
  course: (id) => `/api/courses/${id}`,
  courseTypes: '/api/courses/types',

  faculties: '/api/faculties',
  faculty: (id) => `/api/faculties/${id}`,

  settings: '/api/settings',
  setting: (id) => `/api/settings/${id}`,

  educationPrograms: '/api/education-programs',
  educationProgram: (id) => `/api/education-programs/${id}`,
  coursesSelectOption: `/api/courses/select-options`,
  majorsSelectOption: `/api/majors/select-options`,
  cloneEducationProgram: (fromYear, toYear) =>
    `/api/education-programs/clone-batching/fromYear/${fromYear}/toYear/${toYear}`,

  newses: '/api/news',
  news: (id) => `/api/news/${id}`,
  staffSelectOption: `/api/staffs/select-options`,

  allSemester: '/api/semesters',

  finalExamBySemesterAndCourse: (semesterId, courseId) =>
    `/api/exam-schedules/semester/${semesterId}/course/${courseId}/final-exam`,
  adminAvailableTimeFinalExam: (courseClassId) =>
    `/api/exam-schedules/course-class/${courseClassId}/available-time-final-exam`,
  adminAvailableRoomFinalExam: (courseClassId) =>
    `/api/exam-schedules/course-class/${courseClassId}/available-room-final-exam`,
  adminUpdateFinalExam: (courseClassId) =>
    `/api/exam-schedules/course-class/${courseClassId}/final-exam`,
  courseWithFinalExamStatus: (semesterId) =>
    `/api/exam-schedules/semester/${semesterId}/course-with-final-exam-schedule-status`,
  courseFromCourseClassBySemester: (semesterId) =>
    `/api/courses/semester/${semesterId}/from-course-class`,
  courseClassBySemesterAndCourse: (semesterId, courseId) =>
    `/api/course-classes/semester/${semesterId}/course/${courseId}`,
  finalScoresByCourseClass: (courseClassId) =>
    `/api/scores/course-class/${courseClassId}/final-exam`,
  updateFinalScores: '/api/scores/update/final-exam',

  courseForRegistration: (semesterId) =>
    `/api/course-classes/semester/${semesterId}/course-with-courseclass-count`,

  courseClasses: '/api/course-classes',
  courseClass: (id) => `/api/course-classes/${id}`,
  semestersSelectOptions: '/api/semesters/select-options',
  courseClassTeacherSelectOptions: (courseId, semesterId) =>
    `/api/course-classes/course/${courseId}/semester/${semesterId}/select-options-available-teacher`,
  courseClassStudentClassSelectOptions: (courseId, semesterId) =>
    `/api/course-classes/course/${courseId}/semester/${semesterId}/select-options-available-student-class`,

  studentClassesWithStatus: (semesterId) =>
    `/api/timetables/semester/${semesterId}/student-classes-with-status`,
  courseClassWithStatus: (semesterId, studentClassId) =>
    `/api/timetables/semester/${semesterId}/student-class/${studentClassId}/course-classes-with-status`,
  adminTimeTableBySemesterAndStudentClass: (semesterId, studentClassId) =>
    `/api/timetables/semester/${semesterId}/student-class/${studentClassId}/schedules`,
  adminAvailableRoomTimeTables: (courseClassId) =>
    `/api/timetables/course-class/${courseClassId}/available-classrooms`,
  adminUpdateTimeTable: (courseClassId) =>
    `/api/timetables/course-class/${courseClassId}`,
  adminDeleteScheduleStudy: (scheduleId) =>
    `/api/timetables/schedule-study/${scheduleId}`,
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
