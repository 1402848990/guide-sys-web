import React from "react";
import { Icon, Tooltip } from "antd";
import "./index.less";
const Settings = (props) => {
  return (
    <div className="settings-container">
      <Tooltip placement="bottom" title="系统设置">
        <Icon type="setting"  />
      </Tooltip>
    </div>
  );
};

export default Settings;
