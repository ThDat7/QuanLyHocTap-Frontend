import { useEffect, useState } from 'react'
import { authApis, endpoints } from '../../configs/Apis'
import Urls from '../../configs/Urls'
import { useNavigate, useParams } from 'react-router'
import BaseForm from '../BaseForm'
import BaseList from '../BaseList'

const Setting = () => {
  const fields = [
    { field: 'key', label: 'Tên' },
    { field: 'value', label: 'Giá trị' },
  ]

  return (
    <>
      <BaseList
        fields={fields}
        url={Urls['adminSetting']}
        endpoint={endpoints['settings']}
        canCreate={false}
        canDelete={false}
      />
    </>
  )
}

const SettingEdit = () => {
  const { id } = useParams()

  const [setting, setSetting] = useState()
  const nav = useNavigate()

  useEffect(() => {
    const fetchSetting = async () => {
      try {
        const res = await authApis.get(endpoints['setting'](id))
        setSetting(res.data.result)
      } catch (e) {
        console.error(e)
      }
    }

    fetchSetting()
  }, [id])

  const settingType = [
    { name: 'key', label: 'Tên', inputProps: { disabled: true } },
    { name: 'value', label: 'Giá trị' },
  ]

  const handleSubmit = async (e) => {
    try {
      e.preventDefault()
      await authApis.put(endpoints['setting'](id), setting)

      const listUrl = Urls['adminSetting']
      nav(listUrl)
    } catch (e) {
      console.error(e)
    }
  }

  const handleChange = (e, field) => {
    setSetting({ ...setting, [field]: e.target.value })
  }

  return (
    <>
      {setting &&
        settingType.map((field, index) => (
          <BaseForm
            key={index}
            field={field}
            value={setting[field.name]}
            handleChange={handleChange}
          />
        ))}

      <button onClick={handleSubmit} className='btn btn-primary'>
        Lưu
      </button>
    </>
  )
}

export { SettingEdit }
export default Setting
