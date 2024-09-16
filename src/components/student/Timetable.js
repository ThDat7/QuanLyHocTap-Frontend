import React from 'react'
import './Timetable.css'
import { authApis, endpoints } from '../../configs/Apis'
import TimeTable from '../TimeTable'

const StudentTimetable = () => {
  const fetchSemesters = async () => {
    return await authApis.get(endpoints.studentAllSemester)
  }

  const fetchSchedules = async (semesterId) => {
    return await authApis.get(endpoints.studentTimetableBySemester(semesterId))
  }

  return (
    <TimeTable
      fetchSemesters={fetchSemesters}
      fetchSchedules={fetchSchedules}
    />
  )
}

export default StudentTimetable
