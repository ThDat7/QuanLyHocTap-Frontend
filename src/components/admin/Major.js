import { useEffect, useState } from 'react'
import { authApis, endpoints } from '../../configs/Apis'
import Urls from '../../configs/Urls'
import { useNavigate, useParams } from 'react-router'
import BaseForm from '../BaseForm'
import BaseList from '../BaseList'

const Major = () => {
  const fields = [
    { field: 'id', label: 'ID' },
    { field: 'name', label: 'Tên' },
    { field: 'alias', label: 'Ký hiệu' },
    { field: 'faculty', label: 'Khoa' },
  ]

  return (
    <div>
      <BaseList
        fields={fields}
        url={Urls['adminMajor']}
        endpoint={endpoints['majors']}
      />
    </div>
  )
}

const MajorEdit = () => {
  const { id } = useParams()
  const isCreate = !parseInt(id)

  const [major, setMajor] = useState({})
  const [faculties, setFaculties] = useState([])
  const nav = useNavigate()

  useEffect(() => {
    const fetchMajors = async () => {
      if (isCreate) return

      try {
        const res = await authApis.get(endpoints['major'](id))
        setMajor(res.data.result)
      } catch (e) {
        console.error(e)
      }
    }

    const fetchFaculties = async () => {
      try {
        const res = await authApis.get(endpoints.facultiesSelectOptions)
        setFaculties(res.data.result)
      } catch (e) {
        console.error(e)
      }
    }

    fetchMajors()
    fetchFaculties()
  }, [id])

  const majorType = [
    { name: 'name', label: 'Tên' },
    { name: 'alias', label: 'Ký hiệu' },
    {
      name: 'facultyId',
      label: 'Khoa',
      values: faculties,
      type: 'select',
    },
    { name: 'specializeTuition', label: 'Học phí chuyên ngành' },
    { name: 'generalTuition', label: 'Học phí đại cương' },
  ]

  const handleSubmit = async (e) => {
    try {
      e.preventDefault()

      if (isCreate) await create()
      else await update()

      const majorListUrl = Urls['adminMajor']
      nav(majorListUrl)
    } catch (e) {
      console.error(e)
    }
  }

  const create = async () => {
    await authApis.post(endpoints['majors'], major)
  }

  const update = async () => {
    await authApis.put(endpoints['major'](id), major)
  }

  const handleChange = (e, field) => {
    setMajor({ ...major, [field]: e.target.value })
  }

  return (
    <>
      {major &&
        majorType.map((field, index) => (
          <BaseForm
            key={index}
            field={field}
            value={major[field.name]}
            handleChange={handleChange}
          />
        ))}

      <button onClick={handleSubmit} className='btn btn-primary'>
        Lưu
      </button>
    </>
  )
}

export { MajorEdit }
export default Major
