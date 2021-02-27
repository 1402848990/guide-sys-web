/**
 * 具备基本能力的表单
 */
import React from 'react'
import { Form, Input, Select } from 'antd'

class Index extends React.Component {
  renderForm = () => {
    const { columns = [], data = {} } = this.props
    const { getFieldDecorator } = this.props.form
    return columns.map((item) => (
      <Form.Item label={item.name}>
        {getFieldDecorator(item.field, {
          initialValue: data[item.field],
          rules: [
            item.required
              ? {
                  required: true,
                  message: `请输入${item.label}`,
                }
              : {},
          ],
        })(
          !item.type ? (
            <Input
              // className={detail ? 'hideField' : ''}
              placeholder={item.label}
            />
          ) : item.type === 'select' ? (
            <Select style={{width:'100%'}}>
              {item.option.map((item) => (
                <Select.Option key={item.value} key={item.value}>
                  {item.label}
                </Select.Option>
              ))}
            </Select>
          ) : null
        )}
        {/* {detail && <span className='stuValue'>{stuId}</span>} */}
      </Form.Item>
    ))
  }

  render() {
    const { columns = [] } = this.props
    return <>{this.renderForm()}</>
  }
}

export default Form.create()(Index)
