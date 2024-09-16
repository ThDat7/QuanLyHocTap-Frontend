import { useEffect, useState } from 'react'
import { authApis, endpoints } from '../../configs/Apis'

const StudentStatus = () => {
  const [studentStatues, setStudentStatues] = useState([])

  useEffect(() => {
    const fetchStudentStatues = async () => {
      try {
        const url = endpoints.currentStudentStatus
        const response = await authApis.get(url)
        setStudentStatues(response.data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchStudentStatues()
  }, [])

  console.log(studentStatues)

  return (
    <div className='h-100 d-flex align-items-center flex-column '>
      {studentStatues.map((item) => (
        <tr>
          <td className='border-bottom'>
            <button
              className={
                item.isLock
                  ? 'btn btn-danger btn-block'
                  : 'btn btn-success btn-block'
              }
              disabled
            >
              {item.isLock ? 'Bị khóa' : 'Không bị khóa'}
            </button>
          </td>
          <td className='align-middle border-bottom'>
            Học kỳ {item.semester.semester} - Năm học {item.semester.year}
          </td>
        </tr>
      ))}
    </div>
  )
}

export default StudentStatus
