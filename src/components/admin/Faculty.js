import { useEffect, useState } from 'react'
import { authApis, endpoints } from '../../configs/Apis'
import Urls from '../../configs/Urls'
import { useNavigate, useParams } from 'react-router'
import BaseForm from '../BaseForm'
import BaseList from '../BaseList'

const Faculty = () => {
  const fields = [
    { field: 'id', label: 'ID' },
    { field: 'name', label: 'Tên' },
  ]

  return (
    <div>
      <BaseList
        fields={fields}
        url={Urls['adminFaculty']}
        endpoint={endpoints['faculties']}
      />
    </div>
  )
}

const FacultyEdit = () => {
  const { id } = useParams()
  const isCreate = !parseInt(id)

  const [faculty, setFaculty] = useState({})
  const nav = useNavigate()

  useEffect(() => {
    const fetchCourse = async () => {
      if (isCreate) return

      try {
        const res = await authApis.get(endpoints['faculty'](id))
        setFaculty(res.data)
      } catch (e) {
        console.error(e)
      }
    }

    fetchCourse()
  }, [id])

  const majorType = [
    { name: 'name', label: 'Tên' },
    { name: 'alias', label: 'Ký hiệu' },
  ]

  const handleSubmit = async (e) => {
    try {
      e.preventDefault()

      if (isCreate) await create()
      else await update()

      const listUrl = Urls['adminFaculty']
      nav(listUrl)
    } catch (e) {
      console.error(e)
    }
  }

  const create = async () => {
    await authApis.post(endpoints['faculties'], faculty)
  }

  const update = async () => {
    await authApis.put(endpoints['faculty'](id), faculty)
  }

  const handleChange = (e, field) => {
    setFaculty({ ...faculty, [field]: e.target.value })
  }

  return (
    <>
      {faculty &&
        majorType.map((field, index) => (
          <BaseForm
            key={index}
            field={field}
            value={faculty[field.name]}
            handleChange={handleChange}
          />
        ))}

      <button onClick={handleSubmit} className='btn btn-primary'>
        Lưu
      </button>
    </>
  )
}

export { FacultyEdit }
export default Faculty
