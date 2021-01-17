/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import {
  Button,
  List,
  Skeleton,
  Avatar,
  Card,
  Row,
  Col,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  message,
} from 'antd'
import axios from '../../request/axiosConfig'
import './index.less'

const { confirm } = Modal

class Contact extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      visible: false,
      contactDetail: {},
    }
  }

  async componentDidMount() {
    this.getUserInfo()
  }

  // 获取联系人信息
  getUserInfo = async () => {
    const res = await axios({
      url: 'http://localhost:8088/interface/User/contactList',
      method: 'post',
    })
    this.setState({
      list: res.data,
    })
    console.log('res', res)
  }

  // 提交
  handleSubmit = () => {
    console.log(this.state.contactDetail)
    const { validateFields,resetFields } = this.props.form
    const update = this.state.contactDetail.name
    const { id } = this.state.contactDetail
    validateFields(async (err, values) => {
      if (!err) {
        const res = await axios({
          url: update
            ? 'http://localhost:8088/interface/User/updateContact'
            : 'http://localhost:8088/interface/User/addContact',
          method: 'post',
          data: update ? { ...values, id } : values,
        })
        if (res.success) {
          message.success({
            content: update ? '联系人更新成功！' : '联系人创建成功！',
          })
          resetFields()
          this.setState(
            {
              contactDetail: {},
            },
            () => {
              this.setState({
                visible: false,
              })
            }
          )
          this.setState({
            contactDetail: {},
          })
          // 获取最新联系人列表
          this.getUserInfo()
        }
      }
    })
  }

  renderTitle = () => (
    <Row type='flex' align='middle'>
      <Col span={18}>
        <h3>通讯录</h3>
      </Col>
      <Col style={{ textAlign: 'right' }} className='titleBtn' span={6}>
        <Button
          onClick={() => {
            this.setState({contactDetail:{} },()=>{
             this.setState({
              visible:true
             })
            })
          }}
          type='primary'
        >
          +新建联系人
        </Button>
      </Col>
    </Row>
  )

  renderGroup = () => (
    <Select>
      <Select.Option key='班级' value='班级'>
        班级
      </Select.Option>
      <Select.Option key='院系' value='院系'>
        院系
      </Select.Option>
      <Select.Option key='校内' value='校内'>
        校内
      </Select.Option>
    </Select>
  )

  delete = (item) => {
    const _this = this
    confirm({
      title: `确定删除联系人 ${item.name} 吗`,
      content: '',
      async onOk() {
        await axios({
          url: 'http://localhost:8088/interface/User/deleteContact',
          method: 'post',
          data: { id: item.id },
        })
        message.success('删除成功！')
        _this.getUserInfo()
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  edit = (item) => {
    this.setState(
      {
        contactDetail: item,
      },
      () => {
        this.setState({
          visible: true,
        })
      }
    )
  }

  render() {
    const { getFieldDecorator,resetFields } = this.props.form
    const { list, contactDetail } = this.state
    console.log('contactDetail',contactDetail)
    return (
      <div className='contact'>
        <Card title={this.renderTitle()}>
          <List
            className='demo-loadmore-list'
            // loading={initLoading}
            itemLayout='horizontal'
            pagination={{
              pageSize: 10,
            }}
            dataSource={list}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <a key='list-loadmore-edit' onClick={() => this.edit(item)}>
                    编辑
                  </a>,
                  <a key='list-loadmore-more' onClick={() => this.delete(item)}>
                    删除
                  </a>,
                ]}
              >
                <Skeleton avatar title={false} loading={item.loading} active>
                  <List.Item.Meta
                    avatar={
                    <Avatar style={{ backgroundColor: '#87d068' }} size={48}>{item.name.split('')[0]}</Avatar>
                    }
                    title={
                      <a href=''>
                        {`${item.name}`}&nbsp;&nbsp;&nbsp;&nbsp;
                        {`${item.phone}`}
                      </a>
                    }
                    description={
                      <Row>
                        <Col span={6}>{`邮箱：${item.email || '-'}`}</Col>
                        <Col span={6}>{`地址：${item.address || '-'}`}</Col>
                        <Col span={6}>{`备注：${item.remark || '-'}`}</Col>
                      </Row>
                    }
                  />
                  <div>
                    <Tag color='magenta'>{item.group}</Tag>
                  </div>
                </Skeleton>
              </List.Item>
            )}
          />
          <Modal
            width={800}
            title='新建联系人'
            visible={this.state.visible}
            onOk={this.handleSubmit}
            onCancel={() => {
              this.setState({ visible: false, contactDetail: {} })
              resetFields()
            }}
          >
            <Form key={`${contactDetail.name}`} onSubmit={this.handleSubmit}>
              <Row gutter={40}>
                <Col span={12}>
                  {' '}
                  <Form.Item label='姓名'>
                    {getFieldDecorator('name', {
                      rules: [
                        {
                          required: true,
                          message: '请输入姓名',
                        },
                      ],
                      initialValue: contactDetail.name,
                    })(<Input placeholder='姓名' />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  {' '}
                  <Form.Item label='电话'>
                    {getFieldDecorator('phone', {
                      rules: [
                        {
                          required: true,
                          message: '请输入电话',
                        },
                      ],
                      initialValue: contactDetail.phone,
                    })(<Input placeholder='电话' />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={40}>
                <Col span={12}>
                  {' '}
                  <Form.Item label='邮箱'>
                    {getFieldDecorator('email', {
                      initialValue: contactDetail.email,
                      rules: [
                        {
                          required: true,
                          message: '请输入邮箱',
                        },
                      ],
                    })(<Input placeholder='邮箱' />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  {' '}
                  <Form.Item label='地址'>
                    {getFieldDecorator('address', {
                      initialValue: contactDetail.address,
                    })(<Input placeholder='地址' />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={40}>
                <Col span={12}>
                  {' '}
                  <Form.Item label='备注'>
                    {getFieldDecorator('remark', {
                      initialValue: contactDetail.remark,
                    })(<Input placeholder='备注' />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  {' '}
                  <Form.Item label='分组'>
                    {getFieldDecorator('group', {
                      initialValue: contactDetail.group,
                      rules: [
                        {
                          required: true,
                          whitespace: true,
                          message: '请选择分组',
                        },
                      ],
                    })(this.renderGroup())}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Modal>
        </Card>
      </div>
    )
  }
}
export default Form.create()(Contact)
