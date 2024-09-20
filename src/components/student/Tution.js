import { useEffect, useState } from 'react'
import { authApis, endpoints } from '../../configs/Apis'
import { Table, Form } from 'react-bootstrap'

const Invoice = () => {
  const [semesters, setSemesters] = useState()
  const [semesterSelected, setSemesterSelected] = useState()
  const [invoices, setInvoices] = useState([])

  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        const response = await authApis.get(endpoints.studentAllSemester)
        setSemesters(response.data.result)
        setSemesterSelected(response.data.result[0])
      } catch (error) {
        console.error(error)
      }
    }

    fetchSemesters()
    fetchInvoices()
  }, [])

  useEffect(() => {
    fetchInvoices()
  }, [semesterSelected])

  const fetchInvoices = async () => {
    if (!semesters) return

    try {
      const url = endpoints.invoiceBySemester(semesterSelected.id)
      const response = await authApis.get(url)
      setInvoices(response.data.result)
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
    <>
      <div className='container mt-4'>
        <div className='d-flex justify-content-between align-items-center mb-3'>
          <h3 className='text-primary'>Xem Học Phí</h3>
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
        <Table bordered>
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên môn học</th>
              <th>Mã môn học</th>
              <th>Số TC</th>
              <th>Số tiền</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.courseName}</td>
                <td>{item.courseCode}</td>
                <td>{item.courseCredits}</td>
                <td>{item.tuition}</td>
              </tr>
            ))}
            <tr>
              <td colSpan='4'>Tổng tiền</td>
              <td>{invoices.reduce((acc, cur) => acc + cur.tuition, 0)}</td>
            </tr>
          </tbody>
        </Table>
      </div>
    </>
  )
}

export default Invoice
