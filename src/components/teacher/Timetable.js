import React from 'react'
import './Timetable.css'
import { authApis, endpoints } from '../../configs/Apis'
import TimeTable from '../TimeTable'

const TeacherTimeTable = () => {
  const fetchSemesters = async () => {
    return await authApis.get(endpoints.teacherAllSemester)
  }

  const fetchSchedules = async (semesterId) => {
    return await authApis.get(endpoints.teacherTimetableBySemester(semesterId))
  }

  return (
    <TimeTable
      fetchSemesters={fetchSemesters}
      fetchSchedules={fetchSchedules}
    />
  )
}
export default TeacherTimeTable
