import { useEffect, useState } from 'react'
import { authApis, endpoints } from '../../configs/Apis'
import Urls from '../../configs/Urls'
import { useNavigate, useParams } from 'react-router'
import BaseForm from '../BaseForm'
import BaseList from '../BaseList'
import { Button, Form } from 'react-bootstrap'
import Select from 'react-select'

const EducationProgram = () => {
  const fields = [
    { field: 'id', label: 'ID' },
    { field: 'majorName', label: 'Ngành' },
    { field: 'schoolYear', label: 'Năm học' },
    { field: 'numberOfCourses', label: 'Số môn học' },
  ]

  const [fromYear, setFromYear] = useState()
  const [toYear, setToYear] = useState()
  const [msg, setMsg] = useState()

  const handleClone = async () => {
    try {
      const res = await authApis.get(
        endpoints['cloneEducationProgram'](fromYear, toYear)
      )
      const data = res.data.result
      setMsg(`Clone thành công ${data.totalCloned} chương trình học`)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <>
      {msg && <div className='text-success'>{msg}</div>}
      <div>
        <label htmlFor='fromYear'>Từ năm</label>
        <Form.Control
          id='fromYear'
          type='text'
          value={fromYear}
          onChange={(e) => setFromYear(e.target.value)}
        />
        <label htmlFor='toYear'>Sang năm</label>
        <Form.Control
          id='toYear'
          type='text'
          value={toYear}
          onChange={(e) => setToYear(e.target.value)}
        />
        <Button onClick={handleClone}>Sao chép</Button>
      </div>
      <BaseList
        fields={fields}
        url={Urls['adminEducationProgram']}
        endpoint={endpoints['educationPrograms']}
      />
    </>
  )
}

const EducationProgramEdit = () => {
  const { id } = useParams()
  const isCreate = !parseInt(id)

  const [ep, setEp] = useState({})

  const [majors, setMajors] = useState([])
  const [courses, setCourses] = useState([])

  const [courseSelected, setCourseSelected] = useState()
  const [semesterSelected, setSemesterSelected] = useState()
  const [epcSelected, setEpcSelected] = useState()

  const nav = useNavigate()

  useEffect(() => {
    const fetchEp = async () => {
      if (isCreate) return

      try {
        const res = await authApis.get(endpoints['educationProgram'](id))
        setEp(res.data.result)
      } catch (e) {
        console.error(e)
      }
    }

    const fetchMajors = async () => {
      try {
        const res = await authApis.get(endpoints['majorsSelectOption'])
        setMajors(res.data.result)
      } catch (e) {
        console.error(e)
      }
    }

    const fetchCourse = async () => {
      try {
        const res = await authApis.get(endpoints['coursesSelectOption'])
        setCourses(res.data.result)
      } catch (e) {
        console.error(e)
      }
    }

    fetchEp()
    fetchCourse()
    fetchMajors()
  }, [id])

  const semesters = Array.from({ length: 15 }, (_, i) => i + 1)
  const semesterSelectOptions = semesters.map((semester) => ({
    value: semester,
    label: `Học kỳ ${semester}`,
  }))

  const epBaseType = [
    {
      name: 'majorId',
      label: 'Ngành',
      values: majors,
      type: 'select',
    },
    { name: 'schoolYear', label: 'Năm học' },
  ]

  const handleSubmit = async (e) => {
    try {
      e.preventDefault()

      if (isCreate) await create()
      else await update()

      const listUrl = Urls['adminEducationProgram']
      nav(listUrl)
    } catch (e) {
      console.error(e)
    }
  }

  const create = async () => {
    await authApis.post(endpoints['educationPrograms'], ep)
  }

  const update = async () => {
    await authApis.put(endpoints['educationProgram'](id), ep)
  }

  const handleChange = (e, field) => {
    setEp({ ...ep, [field]: e.target.value })
  }

  const handleAddEpc = () => {
    if (!courseSelected || !semesterSelected) return

    const epc = {
      courseId: courseSelected.value,
      courseOutlineUrl: '',
      semester: semesterSelected.value,
    }
    setEp({
      ...ep,
      educationProgramCourses: [...ep.educationProgramCourses, epc],
    })
  }

  const handleRemoveEpc = () => {
    if (!epcSelected) return

    const newEpcs = ep.educationProgramCourses.filter(
      (epc) => epc.id !== epcSelected.id
    )

    setEp({
      ...ep,
      educationProgramCourses: newEpcs,
    })
  }

  return (
    <>
      {ep && (
        <>
          {epBaseType.map((field, index) => (
            <BaseForm
              key={index}
              field={field}
              value={ep[field.name]}
              handleChange={handleChange}
            />
          ))}

          <div className='row'>
            {semesters.map((semester, index) => (
              <div key={index} className='col-4 border semester-${semester}'>
                <div className='d-flex justify-content-center border-bottom p-2'>
                  Học kỳ {semester}
                </div>
                <div className='ps-3 py-2 courses-content list-group list-group-numbered'>
                  {ep.educationProgramCourses
                    ?.filter((epc) => epc.semester === semester)
                    .map((epc, index) => (
                      <div
                        key={index}
                        className={
                          epcSelected?.id === epc.id
                            ? 'list-group-item list-group-item-action active'
                            : 'list-group-item list-group-item-action'
                        }
                        onClick={() => setEpcSelected(epc)}
                      >
                        <a href={epc.courseOutlineUrl} className='text-primary'>
                          {
                            courses.filter(
                              (course) => epc.courseId === course.value
                            )[0].label
                          }
                        </a>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div className='d-flex w-100'>
        {courses && (
          <Select
            placeholder='Học kỳ'
            options={semesterSelectOptions}
            onChange={setSemesterSelected}
          />
        )}
        {courses && (
          <Select
            placeholder='Môn học'
            options={courses}
            onChange={setCourseSelected}
          />
        )}
        <Button variant='success' onClick={handleAddEpc}>
          Thêm
        </Button>
        <Button variant='danger' onClick={handleRemoveEpc}>
          Xóa
        </Button>
      </div>
      <button onClick={handleSubmit} className='btn btn-primary'>
        Lưu
      </button>
    </>
  )
}

export { EducationProgramEdit }
export default EducationProgram
