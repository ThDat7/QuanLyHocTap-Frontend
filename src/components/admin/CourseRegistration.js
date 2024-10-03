import React, { useEffect, useState } from 'react'
import { Table, Form, Button } from 'react-bootstrap'
import { authApis, endpoints } from '../../configs/Apis'
import Page from '../Pagination'
import { generatePath, Link, useSearchParams } from 'react-router-dom'
import Urls from '../../configs/Urls'

const AdminCourseRegistration = () => {
  const [semesters, setSemesters] = useState([])
  const [semesterSelected, setSemesterSelected] = useState()

  const [courses, setCourses] = useState([])
  const [total, setTotal] = useState(0)

  const [searchParam] = useSearchParams()
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParam.get('page') || 1)
  )

  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        const url = endpoints.allSemester
        const response = await authApis.get(url)
        const result = response.data.result
        setSemesters(result)
        setSemesterSelected(result[0])
      } catch (error) {
        console.error(error)
      }
    }

    fetchSemesters()
    fetchCourse()
  }, [])

  useEffect(() => {
    fetchCourse()
  }, [semesterSelected, currentPage])

  const fetchCourse = async () => {
    if (!semesterSelected) return

    try {
      const response = await authApis.get(
        endpoints.courseForRegistration(semesterSelected.id)
      )
      const result = response.data.result
      setCourses(result.data)
      setTotal(result.total)
    } catch (error) {
      console.error(error)
    }
  }

  const handleChangeSemesterFilter = (e) => {
    const idSelected = parseInt(e.target.value)
    const semester = semesters.filter((s) => s.id === idSelected)
    if (semester.length > 0) setSemesterSelected(semester[0])
  }

  return (
    <div className='container mt-4'>
      <div className='d-flex justify-content-between align-items-center mb-3'>
        <h3 className='text-primary'>Xem Lịch Thi</h3>
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
        </div>
      </div>
      <>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên môn học</th>
              <th>Tín chỉ</th>
              <th>Số lớp cần mở</th>
              <th>Số lớp hiện tại</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course, index) => {
              const url = generatePath(Urls.adminCourseRegistrationDetail, {
                semesterId: semesterSelected.id,
                courseId: course.id,
              })
              return (
                <tr key={index}>
                  <td>{course.id}</td>
                  <td>{course.name}</td>
                  <td>{course.credit}</td>
                  <td>{course.needCount}</td>
                  <td>{course.presentCount}</td>
                  <td>
                    <Link className='btn btn-success' to={url}>
                      Chi tiết
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </Table>

        <Page
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          total={total}
        />
      </>
    </div>
  )
}

export default AdminCourseRegistration
