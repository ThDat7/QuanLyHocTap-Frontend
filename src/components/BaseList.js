import { Button, Table } from 'react-bootstrap'
import { Link, useSearchParams } from 'react-router-dom'
import Page from './Pagination'
import { useEffect, useState } from 'react'
import { authApis } from '../configs/Apis'

const BaseList = ({
  fields,
  url,
  endpoint,
  canCreate = true,
  canDelete = true,
}) => {
  const [list, setList] = useState([])
  const [total, setTotal] = useState()
  const [searchParam] = useSearchParams()
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParam.get('page') || 1)
  )

  useEffect(() => {
    fetchList()
  }, [currentPage])

  const handleDelete = async (id) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa id: ${id}?`)) {
      return
    }

    try {
      const deleteEndpoint = `${endpoint}/${id}`
      await authApis.delete(deleteEndpoint)
      await fetchList()
    } catch (error) {
      console.error(error)
    }
  }

  const fetchList = async () => {
    try {
      const url = endpoint + `?page=${currentPage}`
      const response = await authApis.get(url)
      const data = response.data.result
      setTotal(data.total)
      setList(data.data)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      {canCreate && (
        <Link className='btn btn-success' to={`${url}create`}>
          Tạo mới
        </Link>
      )}
      {list && (
        <>
          <Table hover bordered striped>
            <thead>
              <tr>
                {fields.map((_, index) => (
                  <th key={index}>{_.label}</th>
                ))}
                <th></th>
              </tr>
            </thead>

            <tbody>
              {list.map((_, dIndex) => {
                let urlView = `${url}${_.id}`

                return (
                  <tr key={dIndex}>
                    {fields.map((f, fIndex) => (
                      <td key={fIndex}>{_[f.field]}</td>
                    ))}
                    <td>
                      <Link className='btn btn-success' to={urlView}>
                        Chi tiết
                      </Link>
                      {canDelete && (
                        <Button
                          className='btn btn-danger'
                          onClick={() => handleDelete(_.id)}
                        >
                          Xóa
                        </Button>
                      )}
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
      )}
    </>
  )
}

export default BaseList
