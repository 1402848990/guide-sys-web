import React from "react";
import { Row, Col, Icon } from "antd";
import CountUp from "react-countup";
import "./index.less";

const PanelGroup = (props) => {
  const { handleSetLineChartData,stuList,noteList,contactList,planList } = props;
  const chartList = [
    {
      type: "学生数量",
      icon: "team",
      num: stuList.length,
      color: "#40c9c6",
    },
    {
      type: "通讯录",
      icon: "solution",
      num: noteList.length,
      color: "#f6ab40",
    },
    {
      type: "备忘录",
      icon: "book",
      num: contactList.length,
      color: "#36a3f7",
    },
    {
      type: "工作计划",
      icon: "schedule",
      num: planList.length,
      color: "#f4516c",
    },
  ];
  return (
    <div className="panel-group-container">
      <Row gutter={40} className="panel-group">
        {chartList.map((chart, i) => (
          <Col
            key={i}
            lg={6}
            sm={12}
            xs={12}
            onClick={handleSetLineChartData.bind(this, chart.type)}
            className="card-panel-col"
          >
            <div className="card-panel">
              <div className="card-panel-icon-wrapper">
                <Icon
                  className={chart.type}
                  style={{ fontSize: 55, color: chart.color }}
                  type={chart.icon}
                />
              </div>
              <div className="card-panel-description">
                <p className="card-panel-text">{chart.type}</p>
                <CountUp end={chart.num} start={0} className="card-panel-num" />
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default PanelGroup;
