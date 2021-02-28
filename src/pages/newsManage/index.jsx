/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react'
import './form.less'
import moment from 'moment'
import axios from '../../request/axiosConfig'
import {
  Row,
  Col,
  Input,
  Icon,
  Button,
  Divider,
  Rate,
  Modal,
  message,
  Select,
  List,
  Card,
  Tag,
} from 'antd'

import BaseTable from '../../components/BaseTable'

const { Meta } = Card

const Search = Input.Search

const HOST = 'http://localhost:8088/interface'

export default class UForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      filter: {},
      dataSource: [],
      loading: true,
    }
  }
  // 获取数据
  getData = async () => {
    const res = await axios.post(`${HOST}/User/newsList`, {
      filter: this.state.filter,
      from: 'pentient',
    })
    this.setState(
      {
        dataSource: res.data,
      },
      () => {
        this.setState({
          loading: false,
        })
      }
    )
  }
  //姓名输入
  onChangeUserName = (e, field) => {
    console.log(e)
    if (e) {
      const value = !isNaN(+e) ? e : e?.target?.value
      const _filter = this.state.filter
      this.setState({
        filter: {
          ..._filter,
          [field]: value,
        },
      })
    }
  }

  //渲染
  componentDidMount() {
    this.getData()
  }
  //搜索按钮
  btnSearch_Click = () => {
    this.getData()
  }
  //重置按钮
  btnClear_Click = () => {
    this.setState(
      {
        filter: {},
      },
      () => {
        this.getData()
      }
    )
  }

  //单选框改变选择
  checkChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys: selectedRowKeys })
  }

  clickDetail = (record) => {
    window.open(`#baseNews?id=${record.id}`)
  }

  clickEdit = (record) => {
    window.open(`#baseNews?id=${record.id}&edit`)
  }

  clickDelete = (item) => {
    const _this = this
    Modal.confirm({
      title: `确定删除这条资讯吗`,
      content: '',
      async onOk() {
        await axios({
          url: 'http://localhost:8088/interface/User/deletePlan',
          method: 'post',
          data: { id: item.id },
        })
        message.success('删除成功！')
        _this.getData()
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
      sorter: (a, b) => +a.id - +b.id,
    },
    {
      title: '资讯标题',
      dataIndex: 'title',
      width: 180,
    },
    {
      title: '所属版块',
      dataIndex: 'section',
      width: 180,
    },
    {
      title: '推荐指数',
      dataIndex: 'level',
      width: 150,
      render: (value) => (
        <Rate character={<Icon type='heart' />} disabled value={value} />
      ),
    },
    {
      title: '发布时间',
      dataIndex: 'createdAt',
      sorter: (a, b) => +a.createdAt - +b.createdAt,
      width: 200,
      render: (value) => moment(+value).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      sorter: (a, b) => +a.updatedAt - +b.updatedAt,
      width: 200,
      render: (value) => moment(+value).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 140,
      render: (_, record) => (
        <>
          <a onClick={() => this.clickDetail(record)}>查看</a>
          <Divider type='vertical' />
          <a onClick={() => this.clickEdit(record)}>编辑</a>
          <Divider type='vertical' />
          <a onClick={() => this.clickDelete(record)}>删除</a>
        </>
      ),
    },
  ]

  render() {
    const { filter, dataSource, loading } = this.state
    console.log(filter)
    return (
      <div>
        <div className='formBody'>
          <Row gutter={16}>
            <Col className='gutter-row' sm={8}>
              <Search
                placeholder='请输入资讯标题'
                prefix={<Icon type='user' />}
                value={filter.title}
                onChange={(e) => this.onChangeUserName(e, 'title')}
              />
            </Col>
            <Col className='gutter-row' sm={8}>
              <Select
                placeholder='请选择推荐指数'
                style={{ width: '100%' }}
                prefix={<Icon type='user' />}
                value={filter.level}
                onChange={(e) => this.onChangeUserName(e, 'level')}
              >
                <Select.Option value={1}>1</Select.Option>
                <Select.Option value={2}>2</Select.Option>
                <Select.Option value={3}>3</Select.Option>
                <Select.Option value={4}>4</Select.Option>
                <Select.Option value={5}>5</Select.Option>
              </Select>
            </Col>
          </Row>
          <Row gutter={16}>
            <div className='btnOpera'>
              <Button
                type='primary'
                onClick={this.btnSearch_Click}
                style={{ marginRight: '10px' }}
              >
                查询
              </Button>
              <Button
                type='primary'
                onClick={this.btnClear_Click}
                style={{
                  background: '#f8f8f8',
                  color: '#108ee9',
                  marginRight: '10px',
                }}
              >
                重置
              </Button>
            </div>
          </Row>
                <br/>
          <List
            grid={{
              gutter: 16,
              xs: 1,
              sm: 2,
              md: 4,
              lg: 4,
              xl: 6,
              xxl: 3,
            }}
            className='demo-loadmore-list'
            // loading={initLoading}
            itemLayout='horizontal'
            pagination={{
              pageSize: 10,
            }}
            dataSource={dataSource}
            renderItem={(item) => (
              <List.Item>
                <Card
                  className='noteCard'
                  hoverable
                  actions={[<span onClick={() => this.clickDetail(item)}>查看详情</span>]}
                  title={
                    <>
                      {item.title}
                      <Rate
                        style={{ float: 'right' }}
                        character={<Icon type='heart' />}
                        value={item.level}
                        disabled
                      />
                    </>
                  }
                >
                  {/* <div style={{ marginBottom: '10px' }}>
                    所属板块：<Tag color='#87d068'>{item.section}</Tag>
                  </div> */}
                  <div style={{ marginBottom: '10px' }}>
                    发布人：{item.userName}
                  </div>
                  <div style={{ marginBottom: '10px' }}>
                    发布时间：
                    {moment(+item.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                  </div>
                  <div style={{ marginBottom: '10px' }}>
                    更新时间：
                    {moment(+item.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
                  </div>
                  <Meta
                    className='meta'
                    description={<Tag style={{ marginTop: '10px' }} color='#87d068'>{item.section}</Tag>}
                  />
                </Card>
              </List.Item>
            )}
          />
        </div>
      </div>
    )
  }
}
