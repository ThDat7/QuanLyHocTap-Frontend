import { useEffect, useState } from 'react'
import { Button, Table } from 'react-bootstrap'
import { authApis, endpoints } from '../../configs/Apis'
import {
  generatePath,
  Link,
  useParams,
  useSearchParams,
} from 'react-router-dom'
import Urls from '../../configs/Urls'

const AdminCourseRegistrationDetail = () => {
  const [courseClasses, setCourseClasses] = useState([])
  const [total, setTotal] = useState(0)

  const { courseId, semesterId } = useParams()

  const [searchParam] = useSearchParams()
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParam.get('page') || 1)
  )

  useEffect(() => {
    fetchCourseClasses()
  }, [currentPage])

  const fetchCourseClasses = async () => {
    try {
      const url = endpoints['courseClassBySemesterAndCourse'](
        semesterId,
        courseId
      )
      const res = await authApis.get(url)
      setTotal(res.data.result.total)
      setCourseClasses(res.data.result.data)
    } catch (e) {
      console.error(e)
    }
  }

  const handleDelete = async (id) => {
    try {
      const url = endpoints['courseClass'](id)
      await authApis.delete(url)
      await fetchCourseClasses()
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <>
      <Link
        className='mb-3 btn btn-primary'
        to={`${Urls['adminCourseClass']}/create`}
      >
        Tạo lớp
      </Link>
      <Table hover bordered striped>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên môn học</th>
            <th>Mã môn</th>
            <th>Tín chỉ</th>
            <th>Nhóm</th>
            <th>Tên giảng viên</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {courseClasses.map((cc) => {
            let url = generatePath(Urls['adminCourseClassDetail'], {
              id: cc.id,
            })
            return (
              <tr key={cc.id}>
                <td>{cc.id}</td>
                <td>{cc.courseName}</td>
                <td>{cc.courseCode}</td>
                <td>{cc.courseCredits}</td>
                <td>{cc.studentClassName}</td>
                <td>{cc.teacherName}</td>
                <td>
                  <Link className='btn btn-success' to={url}>
                    Chi tiết
                  </Link>
                  <Button
                    className='btn btn-danger'
                    onClick={() => handleDelete(cc.id)}
                  >
                    Xóa
                  </Button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </Table>
    </>
  )
}

export default AdminCourseRegistrationDetail
