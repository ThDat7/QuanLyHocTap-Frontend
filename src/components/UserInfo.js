import React from 'react'
import { Card, Button } from 'react-bootstrap'

const UserInfo = () => {
  return (
    <Card className='mb-3'>
      <Card.Body>
        <Card.Title>Đăng Nhập</Card.Title>
        <Card.Text>
          Tài khoản: 2151053011
          <br />
          Họ và tên: Nguyễn Thành Đạt
        </Card.Text>
        <Button variant='warning'>Đăng xuất</Button>
      </Card.Body>
    </Card>
  )
}

export default UserInfo
