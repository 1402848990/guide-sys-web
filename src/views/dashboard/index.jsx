import React, { useState,useEffect } from "react";
import { Row, Col } from "antd";
import "./index.less";
import PanelGroup from "./components/PanelGroup";
import LineChart from "./components/LineChart";
import BarChart from "./components/BarChart";
import RaddarChart from "./components/RaddarChart";
import PieChart from "./components/PieChart";
import TransactionTable from "./components/TransactionTable";
import BoxCard from "./components/BoxCard";
import axios from '../../request/axiosConfig'

const HOST = 'http://localhost:8088/interface'

const lineChartDefaultData = {
  "New Visits": {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145],
  },
  Messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130],
  },
  Purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130],
  },
  Shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130],
  },
};

const Dashboard = () => {
  const [lineChartData, setLineChartData] = useState(
    lineChartDefaultData["New Visits"]
  );
  const [stuList,setStuList] = useState([])
  const [noteList,setNoteList] = useState([])
  const [planList,setPlanList] = useState([])
  const [contactList,setContactList] = useState([])


    // 获取数据
    const getData = async () => {
      const {data:sList} = await axios.post(`${HOST}/Stu/list`)
      const {data:nList} = await axios.post(`${HOST}/User/noteList`)
      const {data:pList} = await axios.post(`${HOST}/User/planList`)
      const {data:cList} = await axios.post(`${HOST}/User/contactList`)
      setStuList(sList)
      setNoteList(nList)
      setPlanList(pList)
      setContactList(cList)
    }

  useEffect(() => {
    getData()
  }, [])

  const handleSetLineChartData = (type) => setLineChartData(lineChartDefaultData[type]);

  return (
    <div className="app-container">

      <PanelGroup stuList={stuList} noteList={noteList} planList={planList} contactList={contactList} handleSetLineChartData={handleSetLineChartData} />

      <LineChart
        chartData={lineChartData}
        styles={{
          padding: 12,
          backgroundColor: "#fff",
          marginBottom: "25px",
        }}
      />

      <Row gutter={32}>
        <Col xs={24} sm={24} lg={8}>
          <div className="chart-wrapper">
            <RaddarChart />
          </div>
        </Col>
        <Col xs={24} sm={24} lg={8}>
          <div className="chart-wrapper">
            <PieChart />
          </div>
        </Col>
        <Col xs={24} sm={24} lg={8}>
          <div className="chart-wrapper">
            <BarChart />
          </div>
        </Col>
      </Row>

      <Row gutter={8}>
        <Col
          xs={24}
          sm={24}
          md={24}
          lg={12}
          xl={12}
          style={{ paddingRight: "8px", marginBottom: "30px" }}
        >
          <TransactionTable />
        </Col>
        <Col
          xs={24}
          sm={24}
          md={24}
          lg={12}
          xl={12}
          style={{ marginBottom: "30px" }}
        >
          <BoxCard />
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
