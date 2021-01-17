import React from "react";
import Content from "./Content";
import Header from "./Header";
import Sider from "./Sider";
import { Layout } from "antd";
const Main = (props) => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* 左侧菜单栏 */}
      <Sider />
      <Layout>
        {/* 头部 */}
        <Header />
        {/* 主要内容区 */}
        <Content />
      </Layout>
    </Layout>
  );
};
export default Main;
