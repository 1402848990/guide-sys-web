import React, { useState, useEffect } from 'react'
import {
  Card,
  Row,
  Col,
  Input,
  Button,
  Rate,
  message,
  Descriptions,
  Tag,
} from 'antd'
import {AREA_LIST} from '@/utils'
import axios from '../../request/axiosConfig'
import { EditorState, convertToRaw, ContentBlock, ContentState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import draftToMarkdown from 'draftjs-to-markdown'
import htmlToDraft from 'html-to-draftjs'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import './index.less'
import moment from 'moment'

const HOST = 'http://localhost:8088/interface'
const { CheckableTag } = Tag

const RichTextEditor = () => {
  // 标题
  const [title, setTitle] = useState('')
  // 内容
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  // 重要等级
  const [level, setLevel] = useState(1)
  const [detail, setDetail] = useState(null)
  const [edit, setEdit] = useState(false)
  const [show, setShow] = useState(false)
  const [selectedTags, setSelectedTags] = useState([])

  // 获取数据
  const getDetail = async (id) => {
    // const
    const res = await axios.post(`${HOST}/User/detailCityNotice`, {
      id,
    })
    return res.data
  }

  useEffect(() => {
    async function fun() {
      const hash = window.location.hash
      console.log(hash)
      if (hash.includes('id')) {
        // 如果是编辑
        if (hash.includes('edit')) {
          // console.log(decodeURI(hash.split('=')[1]))
          const id = decodeURI(hash.split('=')[1].split('&')[0])
          const record = await getDetail(id)
          console.log('record', record)
          const contentBlock = htmlToDraft(record.content)
          const contentState = ContentState.createFromBlockArray(
            contentBlock.contentBlocks
          )
          setSelectedTags(record.areaName.split(','))
          setTitle(record.title)
          setLevel(record.level)
          setEditorState(EditorState.createWithContent(contentState))
          setDetail(record)
          setEdit(true)
        } else {
          // 如果是查看
          try {
            const id = decodeURI(hash.split('=')[1])
            const record = await getDetail(id)
            const contentBlock = htmlToDraft(record.content)
            const contentState = ContentState.createFromBlockArray(
              contentBlock.contentBlocks
            )
            setSelectedTags(record.areaName.split(','))
            setTitle(record.title)
            setLevel(record.level)
            setEditorState(EditorState.createWithContent(contentState))
            setDetail(record)
            setShow(true)
          } catch (err) {
            console.log('err', err)
          }
        }
      }
    }
    fun()
  }, [])

  const handleChange = (tag, checked) => {
    const nextSelectedTags = checked
      ? [...selectedTags, tag]
      : selectedTags.filter((t) => t !== tag)
    console.log('You are interested in: ', nextSelectedTags)
    setSelectedTags(nextSelectedTags)
  }

  const onEditorStateChange = (editorState) => setEditorState(editorState)

  // 提交
  const submit = async () => {
    console.log('title',title,'level',level,'selectTags',selectedTags)
    const res = await axios({
      url: edit
        ? 'http://localhost:8088/interface/User/updateCityNotice'
        : 'http://localhost:8088/interface/User/addCityNotice',
      method: 'post',
      data: edit
        ? {
            id: detail.id,
            title,
            level,
            areaName:selectedTags.join(','),
            content: draftToHtml(convertToRaw(editorState.getCurrentContent())),
          }
        : {
            title,
            level,
            areaName:selectedTags.join(','),
            content: draftToHtml(convertToRaw(editorState.getCurrentContent())),
          },
    })
    if (res.success) {
      message.success({ content: `提交成功！` })
    }
  }

  return (
    <div>
      <Card bordered={false} title='地区疫情信息播报'>
        {show ? (
          <Descriptions title='城市疫情播报基本信息'>
            <Descriptions.Item label='创建时间'>
              {moment(+detail.createdAt).format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
            <Descriptions.Item label='更新时间'>
              {moment(+detail.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
          </Descriptions>
        ) : null}
        <h1 style={{ marginTop: '10px' }}>选择播报地区：</h1>
        <div>
          {AREA_LIST().map((tag) => (
            <CheckableTag
              style={{cursor:'pointer',fontSize:'14px',marginBottom:'8px'}}
              key={tag}
              checked={selectedTags.indexOf(tag) > -1}
              onChange={(checked) => handleChange(tag, checked)}
            >
              {tag}
            </CheckableTag>
          ))}
        </div>
        <br />
        <h1>疫情播报标题：</h1>
        {show ? (
          title
        ) : (
          <Input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
            }}
          />
        )}
        {/* 富文本编辑器 */}
        {!show && (
          <>
            <h1 style={{ marginTop: '10px' }}>疫情播报内容：</h1>
            <Editor
              editorState={editorState}
              onEditorStateChange={onEditorStateChange}
              wrapperClassName='wrapper-class'
              editorClassName='editor-class'
              toolbarClassName='toolbar-class'
              localization={{ locale: 'zh' }}
            />
          </>
        )}
        {show && (
          <>
            <h1 style={{ marginTop: '10px' }}>疫情播报内容：</h1>
            <div
              dangerouslySetInnerHTML={{
                __html: draftToHtml(
                  convertToRaw(editorState.getCurrentContent())
                ),
              }}
            ></div>
          </>
        )}
        {/* 重要等级 */}
        <h1 style={{ marginTop: '10px' }}>乐观等级：</h1>
        <Rate
          value={level}
          onChange={(val) => {
            setLevel(val)
          }}
        />
        <br />
        {!show && (
          <Button
            type='primary'
            onClick={submit}
            style={{ marginTop: '20px', width: '200px' }}
          >
            提交
          </Button>
        )}
      </Card>
      <br />
      {/* <Row gutter={10}>
        <Col span={12}>
          <Card
            title='同步转换HTML'
            bordered={false}
            style={{ minHeight: 200 }}
          >
            {editorState &&
              draftToHtml(convertToRaw(editorState.getCurrentContent()))}
          </Card>
        </Col>
      </Row> */}
    </div>
  )
}

export default RichTextEditor
