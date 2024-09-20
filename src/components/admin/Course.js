import { useEffect, useState } from 'react'
import { authApis, endpoints } from '../../configs/Apis'
import Urls from '../../configs/Urls'
import { useNavigate, useParams } from 'react-router'
import BaseForm from '../BaseForm'
import BaseList from '../BaseList'

const Course = () => {
  const fields = [
    { field: 'id', label: 'ID' },
    { field: 'code', label: 'Mã môn' },
    { field: 'name', label: 'Tên' },
  ]

  return (
    <BaseList
      fields={fields}
      url={Urls['adminCourse']}
      endpoint={endpoints['courses']}
    />
  )
}

const CourseEdit = () => {
  const { id } = useParams()
  const isCreate = !parseInt(id)

  const [course, setCourse] = useState({})
  const [courseTypes, setCourseTypes] = useState([])
  const nav = useNavigate()

  useEffect(() => {
    const fetchCourse = async () => {
      if (isCreate) return

      try {
        const res = await authApis.get(endpoints['course'](id))
        setCourse(res.data.result)
      } catch (e) {
        console.error(e)
      }
    }

    const fetchCourseTypes = async () => {
      try {
        const res = await authApis.get(endpoints['courseTypes'])
        setCourseTypes(res.data.result)
      } catch (e) {
        console.error(e)
      }
    }

    fetchCourse()
    fetchCourseTypes()
  }, [id])

  const majorType = [
    { name: 'name', label: 'Tên' },
    { name: 'code', label: 'Mã môn' },
    { name: 'credits', label: 'Tín chỉ' },
    {
      name: 'type',
      label: 'Loại',
      values: courseTypes,
      type: 'select',
    },
    { name: 'sessionInWeek', label: 'Số buổi trong tuần' },
    { name: 'theoryPeriod', label: 'Tín chỉ lý thuyết' },
    { name: 'practicePeriod', label: 'Tín chỉ thực hành' },
  ]

  const handleSubmit = async (e) => {
    try {
      e.preventDefault()
      if (isCreate) await create()
      else await update()

      const listUrl = Urls['adminCourse']
      nav(listUrl)
    } catch (e) {
      console.error(e)
    }
  }

  const update = async () => {
    await authApis.put(endpoints['course'](id), course)
  }

  const create = async () => {
    await authApis.post(endpoints['courses'], course)
  }

  const handleChange = (e, field) => {
    setCourse({ ...course, [field]: e.target.value })
  }

  return (
    <>
      {course &&
        majorType.map((field, index) => (
          <BaseForm
            key={index}
            field={field}
            value={course[field.name]}
            handleChange={handleChange}
          />
        ))}

      <button onClick={handleSubmit} className='btn btn-primary'>
        Lưu
      </button>
    </>
  )
}

export { CourseEdit }
export default Course
