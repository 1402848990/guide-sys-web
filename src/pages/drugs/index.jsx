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
  DatePicker,
} from 'antd'
import moment from 'moment'
import axios from '../../request/axiosConfig'
import { sample } from 'lodash'
import './index.less'

const { confirm } = Modal
const COLOR = ['#ff5722', '#795548', '#9c27b0', '#4caf50']

class drugs extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      visible: false,
      drugsDetail: {},
    }
  }

  async componentDidMount() {
    this.getUserInfo()
  }

  // 获取药品信息
  getUserInfo = async () => {
    const res = await axios({
      url: 'http://localhost:8088/interface/Drugs/drugsList',
      method: 'post',
    })
    this.setState({
      list: res.data,
    })
    console.log('res', res)
  }

  // 提交
  handleSubmit = () => {
    console.log(this.state.drugsDetail)
    const { validateFields, resetFields } = this.props.form
    const update = this.state.drugsDetail.name
    const { id } = this.state.drugsDetail
    validateFields(async (err, values) => {
      console.log('values', values)
      values.date = moment(values.date).format('YYYY-MM-DD')
      if (!err) {
        const res = await axios({
          url: update
            ? 'http://localhost:8088/interface/Drugs/updatedrugs'
            : 'http://localhost:8088/interface/Drugs/adddrugs',
          method: 'post',
          data: update ? { ...values, id } : values,
        })
        if (res.success) {
          message.success({
            content: update ? '药品更新成功！' : '药品创建成功！',
          })
          resetFields()
          this.setState(
            {
              drugsDetail: {},
            },
            () => {
              this.setState({
                visible: false,
              })
            }
          )
          this.setState({
            drugsDetail: {},
          })
          // 获取最新药品列表
          this.getUserInfo()
        }
      }
    })
  }

  renderTitle = () => (
    <Row type='flex' align='middle'>
      <Col span={18}>
        <h3>药品管理</h3>
      </Col>
      <Col style={{ textAlign: 'right' }} className='titleBtn' span={6}>
        <Button
          onClick={() => {
            this.setState({ drugsDetail: {} }, () => {
              this.setState({
                visible: true,
              })
            })
          }}
          type='primary'
        >
          +添加药品
        </Button>
      </Col>
    </Row>
  )

  delete = (item) => {
    const _this = this
    confirm({
      title: `确定删除药品 ${item.name} 吗`,
      content: '',
      async onOk() {
        await axios({
          url: 'http://localhost:8088/interface/Drugs/deletedrugs',
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
        drugsDetail: item,
      },
      () => {
        this.setState({
          visible: true,
        })
      }
    )
  }

  render() {
    const { getFieldDecorator, resetFields } = this.props.form
    const { list, drugsDetail } = this.state
    console.log('drugsDetail', drugsDetail)
    return (
      <div className='drugs'>
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
                      <Avatar
                        shape='square'
                        style={{ backgroundColor: sample(COLOR) }}
                        size={48}
                      >
                        {item.name}
                      </Avatar>
                    }
                    title={
                      <a href=''>
                        {`${item.name}`}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        {`编号：${item.id}`}
                      </a>
                    }
                    description={
                      <Row>
                        <Col span={6}>{`入库日期：${moment(item.credtedAt).format('YYYY-MM-DD HH:mm:ss') || '-'}`}</Col>
                        <Col span={6}>{`生产日期：${item.date || '-'}`}</Col>
                        <Col span={6}>{`保质期：${item.proDate || '-'}`}</Col>
                        <Col span={6}>{`生产厂家：${item.factory || '-'}`}</Col>
                        <Col span={6}>{`存放位置：${item.site || '-'}`}</Col>
                        <Col span={6}>{`采购员：${item.buyUserName || '-'}`}</Col>
                      </Row>
                    }
                  />
                  <div>
                    <Tag size='28px' color='magenta'>{item.num}</Tag>
                  </div>
                </Skeleton>
              </List.Item>
            )}
          />
          <Modal
            width={800}
            title='新建药品'
            visible={this.state.visible}
            onOk={this.handleSubmit}
            onCancel={() => {
              this.setState({ visible: false, drugsDetail: {} })
              resetFields()
            }}
          >
            <Form key={`${drugsDetail.name}`} onSubmit={this.handleSubmit}>
              <Row gutter={40}>
                <Col span={12}>
                  {' '}
                  <Form.Item label='药品名'>
                    {getFieldDecorator('name', {
                      rules: [
                        {
                          required: true,
                          message: '请输入药品名',
                        },
                      ],
                      initialValue: drugsDetail.name,
                    })(<Input placeholder='药品名' />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  {' '}
                  <Form.Item label='生产厂家'>
                    {getFieldDecorator('factory', {
                      rules: [
                        {
                          // required: true,
                          message: '请输入生产厂家',
                        },
                      ],
                      initialValue: drugsDetail.factory,
                    })(<Input placeholder='生产厂家' />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={40}>
                <Col span={12}>
                  {' '}
                  <Form.Item label='生产日期'>
                    {getFieldDecorator('date', {
                      initialValue: moment(drugsDetail.date),
                      rules: [
                        {
                          required: true,
                          message: '请输入生产日期',
                        },
                      ],
                    })(<DatePicker placeholder='生产日期' />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  {' '}
                  <Form.Item label='保质期'>
                    {getFieldDecorator('proDate', {
                      initialValue: drugsDetail.proDate,
                    })(<Input placeholder='保质期' />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={40}>
                <Col span={12}>
                  {' '}
                  <Form.Item label='存放位置'>
                    {getFieldDecorator('site', {
                      initialValue: drugsDetail.site,
                    })(<Input placeholder='存放位置' />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label='采购员'>
                    {getFieldDecorator('buyUserName', {
                      initialValue: drugsDetail.buyUserName,
                    })(<Input placeholder='采购员' />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={40}>
                <Col span={12}>
                  {' '}
                  <Form.Item label='数量'>
                    {getFieldDecorator('num', {
                      initialValue: drugsDetail.num || 100,
                    })(<Input placeholder='数量' />)}
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
export default Form.create()(drugs)
