import React from 'react'
import './Timetable.css'
import { authApis, endpoints } from '../../configs/Apis'
import { TimeTableByWeek } from '../TimeTable'

const TeacherTimeTable = () => {
  const fetchSemesters = async () => {
    return await authApis.get(endpoints.teacherAllSemester)
  }

  const fetchSchedules = async (semesterId) => {
    return await authApis.get(endpoints.teacherTimetableBySemester(semesterId))
  }

  return (
    <TimeTableByWeek
      fetchSemesters={fetchSemesters}
      fetchSchedules={fetchSchedules}
    />
  )
}
export default TeacherTimeTable
