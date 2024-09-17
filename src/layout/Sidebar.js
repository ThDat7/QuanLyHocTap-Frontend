import { StudentFeatures, TeacherFeatures, AdminFeatures } from './Features'
import UserInfo from '../components/UserInfo'

const Sidebar = () => {
  return (
    <>
      <UserInfo />
      {/* <TeacherFeatures /> */}
      {/* <StudentFeatures /> */}
      <AdminFeatures />
    </>
  )
}

export default Sidebar
