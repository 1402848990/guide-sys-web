/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react'
import './form.less'
import moment from 'moment'
import axios from '../../request/axiosConfig'
import { Column, Bar } from '@ant-design/charts'
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
  Radio,
} from 'antd'
import CourseTag from '../../components/CourseTag'
import BaseTable from '../../components/BaseTable'
import ExportExcel from '../../components/ExportExcel'
import { DATE } from '../../utils/index'
import { groupBy } from 'lodash'

const Search = Input.Search

const HOST = 'http://localhost:8088/interface'

export default class UForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      filter: {},
      dataSource: [],
      loading: true,
      examContent: [],
      courseList: [],
      currDate: '大一上学期',
    }
  }

  // 格式化及格人数数据
  fun = (data) => {
    console.log('data',data)
    const a =  data[0] ?JSON.parse(data[0].content) : []
    const courselist = Object.keys(a)
    const res = {}
    console.log('courselist',courselist)
    courselist.forEach((course) => {
      res[course] = []
    })
    data.forEach((i) => {
      courselist.forEach((course) => {
        const fen = +i[course]
        if (fen >= 60) {
          res[course] ? res[course].push(fen) : (res[course] = [fen])
        }
      })
    })
    console.log('res', res)
    const handledDate = Object.entries(res).map((item) => {
      console.log('item', item)
      const [course, numArr] = item
      return {
        class: data[0].garde,
        course,
        number: numArr.length,
      }
    })
    console.log('handledDate', handledDate)
    return handledDate
  }

  jisuan = arr=>{
    const res = arr.filter(i=>i>=60)
    return res.length/arr.length
  }

  // 格式化及格人数比例数据
  funBar = (data) => {
    const a =  data[0] ?JSON.parse(data[0].content) : []
    const courselist = Object.keys(a)
    const res = {}
    courselist.forEach((course) => {
      res[course] = []
    })
    data.forEach((i) => {
      courselist.forEach((course) => {
        const fen = +i[course]
          res[course] ? res[course].push(fen) : (res[course] = [fen])
      })
    })
    console.log('res', res)
    const handledDate = Object.entries(res).map((item) => {
      console.log('item', item)
      const [course, numArr] = item
      return {
        class: data[0].garde,
        course,
        number: this.jisuan(numArr).toFixed(2),
      }
    })
    console.log('handledDate', handledDate)
    return handledDate
  }

  formatData = (_handledData) => {
    const { currDate, courseList } = this.state

    // 各个班级当前学期的成绩
    const oneClass = _handledData.filter(
      (item) => item.garde === '一班' && item.date === currDate
    )
    const twoClass = _handledData.filter(
      (item) => item.garde === '二班' && item.date === currDate
    )
    const threeClass = _handledData.filter(
      (item) => item.garde === '三班' && item.date === currDate
    )

    const one = this.fun(oneClass)
    const two = this.fun(twoClass)
    const three = this.fun(threeClass)

    const onebar = this.funBar(oneClass)
    const twobar = this.funBar(twoClass)
    const threebar = this.funBar(threeClass)

    return {
      num: [...one, ...two, ...three],
      bar: [...onebar, ...twobar, ...threebar],
    }
  }

  // 获取数据
  getData = async () => {
    const { currDate } = this.state
    // 获取成绩列表
    const { data } = await axios.post(`${HOST}/Stu/examList`, {
      filter: this.state.filter,
    })
    const _examContent = []
    const courseNameList = []

    const { data: courseList } = await axios({
      url: 'http://localhost:8088/interface/Stu/courseList',
      method: 'post',
      // data: { id: ID },
    })

    courseList.forEach((item) => {
      courseNameList.push(item.name)
      _examContent.push({
        title: item.name,
        dataIndex: item.name,
        width: 180,
      })
    })

    const handledData = data.map((item) => {
      console.log('----item',item)
      const content = JSON.parse(item.content)
      for (let i in content) {
        item[i] = content[i]
      }
      return item
    })

    console.log('currDate', currDate)

    this.setState(
      {
        dataSource: handledData,
        examContent: _examContent,
        courseList,
        courseNameList,
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
    console.log(111)
    this.getData()
  }

  componentWillUpdate() {
    console.log(222)
    // this.getData()
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

  columns = () => [
    {
      title: '学号',
      dataIndex: 'stuId',
      width: 80,
      sorter: (a, b) => +a.id - +b.id,
    },
    {
      title: '姓名',
      dataIndex: 'stuName',
      width: 180,
    },
    {
      title: '学期',
      dataIndex: 'date',
      width: 180,
    },
    ...this.state.examContent,
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
      dataIndex: 'stuSex',
      width: 180,
      filters: [
        { text: '男', value: '男' },
        { text: '女', value: '女' },
      ],
      onFilter: (value, record) => record.sex === value,
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
          <a onClick={() => this.clickDetail(record)}>查看学生</a>
          {/* <Divider type='vertical' />
          <a onClick={() => this.clickEdit(record)}>编辑</a>
          <Divider type='vertical' />
          <a onClick={() => this.clickDelete(record)}>删除</a> */}
        </>
      ),
    },
  ]

  render() {
    const {
      filter,
      dataSource,
      loading,
      courseList,
      courseNameList = [],
      oneClass,
      twoClass,
      threeClass,
      currDate,
    } = this.state
    const tHeader = ['学号', '姓名', '学期', '班级', '性别'].concat(
      courseNameList
    )
    const filterVal = ['stuId', 'stuName', 'date', 'garde', 'stuSex'].concat(
      courseNameList
    )
    const numData = this.formatData(dataSource).num
    const barData = this.formatData(dataSource).bar
    console.log('barData', barData, 'currDate', currDate,'numData',numData)
    const config = {
      data: numData,
      isGroup: true,
      xField: 'class',
      yField: 'number',
      seriesField: 'course',
      label: {
        position: 'middle',
        layout: [
          { type: 'interval-adjust-position' },
          { type: 'interval-hide-overlap' },
          { type: 'adjust-color' },
        ],
      },
    }
    const barConfig = {
      smooth: true,
      data: barData,
      isGroup: true,
      xField: 'number',
      yField: 'class',
      seriesField: 'course',
      label: {
        content: function content(item) {
          return `${(item.number * 100).toFixed(2)}%`
        },
        style: { fill: '#fff' },
        position: 'middle',
        layout: [
          { type: 'interval-adjust-position' },
          { type: 'interval-hide-overlap' },
          { type: 'adjust-color' },
        ],
      },
    }
    console.log('twoClass', twoClass)
    return (
      <div>
        <div className='formBody'>
          <Row gutter={16}>
            <Col className='gutter-row' sm={8}>
              <span className='filterTitle'>姓名：</span>
              <Search
                placeholder='请输入姓名'
                prefix={<Icon type='user' />}
                value={filter.stuName}
                onChange={(e) => this.onChangeUserName(e, 'stuName')}
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
              <span className='filterTitle'>学期：</span>
              <Select
                placeholder='请选择学期'
                style={{ width: '100%' }}
                prefix={<Icon type='user' />}
                value={filter.date}
                onChange={(e) => this.onChangeUserName(e, 'date')}
              >
                {DATE.map((item) => (
                  <Select.Option value={item.value}>{item.label}</Select.Option>
                ))}
              </Select>
            </Col>
            {/* <Col className='gutter-row' sm={8}>
              <span className='filterTitle'>职务：</span>
              <Search
                placeholder='请输入职务'
                prefix={<Icon type='user' />}
                value={filter.level}
                onChange={(e) => this.onChangeUserName(e, 'level')}
              />
            </Col> */}
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
          <ExportExcel
            loading={loading}
            tHeader={tHeader}
            filterVal={filterVal}
            columns={this.columns()}
            data={dataSource}
          />
        </div>
        各班各科可视化分析
        <Card
          title={
            <>
              各班各科可视化分析&nbsp;&nbsp;{' '}
              <Radio.Group
                type='primary'
                value={currDate}
                onChange={(e) => this.setState({ currDate: e.target.value })}
              >
                {DATE.map((item) => (
                  <Radio.Button value={item.value}>{item.label}</Radio.Button>
                ))}
              </Radio.Group>
            </>
          }
        >
          <>
            <h4>JAVA、数据结构、高数及格人数对比</h4>
            <Column {...config} />
            <hr />
            <h4>JAVA、数据结构、高数及格率对比</h4>
            <Bar {...barConfig} />
          </>
        </Card>
      </div>
    )
  }
}
