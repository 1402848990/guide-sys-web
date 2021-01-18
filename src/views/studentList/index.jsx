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
  Card,
} from 'antd'
import CourseTag from '../../components/CourseTag'
import BaseTable from '../../components/BaseTable'
import ExportExcel from '../../components/ExportExcel'

const Search = Input.Search

const HOST = 'http://localhost:8088/interface'

const tHeader = ['学号', '姓名', '班级', '性别', '职务']
const filterVal = ['stuId', 'name', 'garde', 'sex', 'level']

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
    const res = await axios.post(`${HOST}/Stu/list`, {
      filter: this.state.filter,
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
      const value = !e?.target ? e : e?.target?.value
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
    window.open(`#addStudent?id=${record.stuId}`)
  }

  clickEdit = (record) => {
    window.open(`#addStudent?edit&id=${record.stuId}`)
  }

  clickDelete = (item) => {
    const _this = this
    Modal.confirm({
      title: `确定删除学生【${item.name}】吗`,
      content: '',
      async onOk() {
        await axios({
          url: 'http://localhost:8088/interface/Stu/delete',
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
      title: '学号',
      dataIndex: 'stuId',
      width: 80,
      sorter: (a, b) => +a.id - +b.id,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 180,
    },
    {
      title: '班级',
      dataIndex: 'garde',
      width: 180,
      filters: [
        { text: '一班', value: '一班' },
        { text: '二班', value: '二班' },
        { text: '三班', value: '三班' },
      ],
      onFilter: (value, record) => record.garde === value,
    },
    {
      title: '性别',
      dataIndex: 'sex',
      width: 180,
      filters: [
        { text: '男', value: '男' },
        { text: '女', value: '女' },
      ],
      onFilter: (value, record) => record.sex === value,
    },
    {
      title: '职务',
      dataIndex: 'level',
      width: 150,
    },
    {
      title: '创建时间',
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
      fixed: 'right',
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
        <Card title='课程管理'>
          <CourseTag />
        </Card>
        <div className='formBody'>
          <Row gutter={16}>
            <Col className='gutter-row' sm={8}>
                  <span className='filterTitle'>姓名：</span>
                  <Search
                    placeholder='请输入姓名'
                    prefix={<Icon type='user' />}
                    value={filter.name}
                    onChange={(e) => this.onChangeUserName(e, 'name')}
                  />
            </Col>
            <Col className='gutter-row' sm={8}>
            <span className='filterTitle'>班级：</span>
              <Select
                placeholder='请选择班级'
                style={{ width: '100%' }}
                prefix={<Icon type='user' />}
                value={filter.garde}
                onChange={(e) => this.onChangeUserName(e, 'garde')}
              >
                <Select.Option value='一班'>一班</Select.Option>
                <Select.Option value='二班'>二班</Select.Option>
                <Select.Option value='三班'>三班</Select.Option>
              </Select>
            </Col>
            <Col className='gutter-row' sm={8}>
            <span className='filterTitle'>职务：</span>
              <Search
                placeholder='请输入职务'
                prefix={<Icon type='user' />}
                value={filter.level}
                onChange={(e) => this.onChangeUserName(e, 'level')}
              />
            </Col>
          </Row>
          <Row gutter={16}>
            <Button
              type='primary'
              onClick={() => {
                window.open('#addStudent')
              }}
              style={{ marginLeft: '8px' }}
            >
              添加学生
            </Button>
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
          {/* <BaseTable
            columns={this.columns}
            dataSource={dataSource}
            checkChange={this.checkChange}
            onDelete={this.onDelete}
            editClick={this.editClick}
            loading={loading}
          /> */}
          <ExportExcel
            loading={loading}
            tHeader={tHeader}
            filterVal={filterVal}
            columns={this.columns}
            data={dataSource}
          />
        </div>
      </div>
    )
  }
}
