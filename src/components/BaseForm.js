import { Form } from 'react-bootstrap'

const BaseForm = ({ field, value, handleChange }) => {
  if (field.type === 'select') {
    return (
      <FormSelect
        field={field}
        value={value}
        values={field.values}
        handleChange={handleChange}
      />
    )
  }
  return <FormInput field={field} value={value} handleChange={handleChange} />
}

const FormInput = ({ field, value, handleChange }) => {
  return (
    <>
      <label htmlFor={field.name}>{field.label}</label>
      <Form.Control
        {...field.inputProps}
        id={field.fienameld}
        value={value}
        onChange={(e) => handleChange(e, field.name)}
      />
    </>
  )
}
const FormSelect = ({ field, value, values, handleChange }) => {
  return (
    <>
      <label htmlFor={field.name}>{field.label}</label>
      <Form.Select
        id={field.name}
        type={field.type}
        value={value}
        onChange={(e) => handleChange(e, field.name)}
      >
        {values.map((item, index) => (
          <option key={index} value={item.value}>
            {item.label}
          </option>
        ))}
      </Form.Select>
    </>
  )
}

export { FormInput, FormSelect }
export default BaseForm
