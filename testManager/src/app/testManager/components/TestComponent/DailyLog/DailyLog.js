import React, { Component } from 'react';
import { stores, Content } from 'choerodon-front-boot';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import {
  Select, Form, DatePicker, Button, Modal, Radio, message, Icon, 
} from 'choerodon-ui';

import './DailyLog.scss';
import '../../../assets/main.scss';
import { NumericInput } from '../CommonComponent';
import { beforeTextUpload } from '../../../common/utils';
import { createWorklog } from '../../../api/IssueApi';
import WYSIWYGEditor from '../WYSIWYGEditor';
import FullEditor from '../FullEditor';

const DATA_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const { Sidebar } = Modal;
const { Option } = Select;
const { AppState } = stores;
const RadioGroup = Radio.Group;
const TYPE = {
  1: 'self_adjustment',
  2: 'no_set_prediction_time',
  3: 'set_to',
  4: 'reduce',
};

class DailyLog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dissipate: undefined,
      dissipateUnit: 'h',
      startTime: null,
      radio: 1,
      time: undefined,
      timeUnit: 'h',
      reduce: undefined,
      reduceUnit: 'h',
      delta: '',
      createLoading: false,
    };
  }

  componentDidMount() {
  }


  onRadioChange = (e) => {
    this.setState({
      radio: e.target.value,
    });
  }

  handleFullEdit = (delta) => {
    this.setState({
      delta,
      edit: false,
    });
  }

  transformTime(pro, unit) {
    const TIME = {
      h: 1,
      d: 8,
      w: 40,
    };
    if (!this.state[pro]) {
      return 0;
    } else {
      return this.state[pro] * TIME[this.state[unit]];
    }
  }

  handleCreateDailyLog = () => {
    const { dissipate, startTime } = this.state;
    if (typeof dissipate === 'undefined' || dissipate === '' || startTime == null) {
      message.warning('请输入耗费时间和工作日期');
      return;
    }
    this.setState({ createLoading: true });
    let num;
    if (this.state.radio === '3' || this.state.radio === 3) {
      num = this.transformTime('time', 'timeUnit');
    }
    if (this.state.radio === '4' || this.state.radio === 4) {
      num = this.transformTime('reduce', 'reduceUnit');
    }
    const extra = {
      issueId: this.props.issueId,
      projectId: AppState.currentMenuType.id,
      startDate: this.state.startTime.format('YYYY-MM-DD HH:mm:ss'),
      workTime: this.transformTime('dissipate', 'dissipateUnit'),
      residualPrediction: TYPE[this.state.radio],
      predictionTime: [3, 4].indexOf(this.state.radio) === -1 ? undefined : num,
    };
    const deltaOps = this.state.delta;
    if (deltaOps) {
      beforeTextUpload(deltaOps, extra, this.handleSave);
    } else {
      extra.description = '';
      this.handleSave(extra);
    }
  };

  handleSave = (data) => {
    createWorklog(data)
      .then((res) => {
        this.props.onOk();
      })
      .catch((error) => {
        window.console.error('创建工作日志失败');
      });
  };

  handleDissipateChange = (e) => {
    this.setState({ dissipate: e });
  }

  handleDissipateUnitChange = (value) => {
    this.setState({ dissipateUnit: value });
  }

  handleTimeChange = (e) => {
    this.setState({ time: e });
  }

  handleTimeUnitChange = (value) => {
    this.setState({ timeUnit: value });
  }

  handleReduceChange = (e) => {
    this.setState({ reduce: e });
  }

  handleReduceUnitChange = (value) => {
    this.setState({ reduceUnit: value });
  }

  changeEndTime = (value) => {
    const startTime = this.transTime(value);
    this.setState({
      startTime: value,
    });
  }

  isEmpty(data) {
    return data === '' || data === undefined || data === null;
  }

  formDate(data) {
    const temp = data ? new Date(data) : new Date();
    return `${temp.getFullYear()}-${temp.getMonth() + 1}-${temp.getDate()}`;
  }

  transTime(data) {
    if (this.isEmpty(data)) {
      return undefined;
    } else if (typeof data === 'string') {
      return moment(this.formDate(data), DATA_FORMAT);
    } else {
      return data.format('YYYY-MM-DD HH:mm:ss');
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      initValue, visible, onCancel, onOk, 
    } = this.props;
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };
    const tempAlignStyle = {
      lineHeight: '21px',
      marginBottom: 0,
      width: 100,
    };
    const callback = (value) => {
      this.setState({
        delta: value,
        edit: false,
      });
    };

    return (
      <Sidebar
        className="choerodon-modal-createSprint"
        title={<FormattedMessage id="issue_worklog_title" />}
        visible={visible || false}
        onOk={this.handleCreateDailyLog}
        onCancel={onCancel}
        okText={<FormattedMessage id="create" />}
        cancelText={<FormattedMessage id="cancel" />}
        confirmLoading={this.state.createLoading}
      >
        <Content
          style={{
            padding: '0 0 10px 0',
          }}
          title={<FormattedMessage id="issue_worklog_content_title" values={{ issueNum: this.props.issueNum }} />}
          description={<FormattedMessage id="issue_worklog_content_description" />}
          link="http://v0-8.choerodon.io/zh/docs/user-guide/agile/issue/create-issue/"
        >
        
          <section className="info">
            <div className="line-info">
              <NumericInput
                label={<FormattedMessage id="issue_worklog_time" />}
                style={tempAlignStyle}
                value={this.state.dissipate}
                onChange={this.handleDissipateChange.bind(this)}
              />
              <Select
                value={this.state.dissipateUnit}
                style={{ width: 100, marginLeft: 18 }}
                onChange={this.handleDissipateUnitChange.bind(this)}
              >
                {['h', 'd', 'w'].map(type => (
                  <Option key={`${type}`} value={`${type}`}>
                    {type}
                  </Option>))}
              </Select>
            </div>
            <div
              className="dataPicker"
              style={{
                width: 218, marginBottom: 32, display: 'flex', flexDirection: 'column', position: 'relative', 
              }}
            >
              <div style={{ marginTop: 20, width: 220, paddingBottom: 3 }}>
                <DatePicker
                  label={<FormattedMessage id="issue_worklog_workTime" />}
                  value={this.state.startTime}
                  // value={this.transTime(this.state.startTime)}
                  format={DATA_FORMAT}
                  onChange={this.changeEndTime}
                />
              </div>
            </div>

            <div className="line-info">
              <RadioGroup label={<FormattedMessage id="issue_worklog_lastTime" />} onChange={this.onRadioChange} value={this.state.radio}>
                <Radio style={radioStyle} value={1}>
                  <FormattedMessage id="issue_worklog_autoAdjust" />
                </Radio>
                <Radio style={radioStyle} value={2}>
                  <FormattedMessage id="issue_worklog_withoutTime" />
                </Radio>
                <Radio
                  style={{
                    ...radioStyle,
                    marginBottom: 20,
                  }}
                  value={3}
                >
                  <span style={{ display: 'inline-block', width: 52 }}>
                    <FormattedMessage id="issue_worklog_setTo" />
                  </span>
                  <NumericInput
                    style={tempAlignStyle}
                    disabled={this.state.radio !== 3}
                    value={this.state.time}
                    onChange={this.handleTimeChange.bind(this)}
                  />
                  <Select
                    disabled={this.state.radio !== 3}
                    style={{ width: 100, marginLeft: 18 }}
                    value={this.state.timeUnit}
                    onChange={this.handleTimeUnitChange.bind(this)}
                  >
                    {['h', 'd', 'w'].map(type => (
                      <Option key={`${type}`} value={`${type}`}>
                        {type}
                      </Option>))}
                  </Select>
                </Radio>
                <Radio style={radioStyle} value={4}>
                  <span style={{ display: 'inline-block', width: 52 }}>
                    <FormattedMessage id="issue_worklog_reduce" />
                  </span>
                  <NumericInput
                    style={tempAlignStyle}
                    disabled={this.state.radio !== 4}
                    value={this.state.reduce}
                    onChange={this.handleReduceChange.bind(this)}
                  />
                  <Select
                    disabled={this.state.radio !== 4}
                    style={{ width: 100, marginLeft: 18 }}
                    value={this.state.reduceUnit}
                    onChange={this.handleReduceUnitChange.bind(this)}
                  >
                    {['h', 'd', 'w'].map(type => (
                      <Option key={`${type}`} value={`${type}`}>
                        {type}
                      </Option>))}
                  </Select>
                </Radio>
              </RadioGroup>
            </div>

            <div className="c7n-sidebar-info">
              <div>
                <div style={{ display: 'flex', marginBottom: '13px', alignItems: 'center' }}>
                  <div style={{ fontWeight: 500 }}>
                    <FormattedMessage id="issue_worklog_workDescription" />
                  </div>
                  <div style={{ marginLeft: '80px' }}>
                    <Button className="leftBtn" funcType="flat" onClick={() => this.setState({ edit: true })} style={{ display: 'flex', alignItems: 'center' }}>
                      <Icon type="zoom_out_map" style={{ color: '#3f51b5', fontSize: '18px', marginRight: '12px' }} />
                      <span style={{ color: '#3f51b5' }}>
                        <FormattedMessage id="execute_edit_fullScreen" /> 
                      </span>
                    </Button>
                  </div>
                </div>
                {
                  !this.state.edit && (
                    <div className="clear-p-mw">
                      <WYSIWYGEditor
                        value={this.state.delta}
                        style={{ height: 200, width: '100%' }}
                        onChange={(value) => {
                          this.setState({ delta: value });
                        }}
                      />
                    </div>
                  )
                }
              </div>
            </div> 
          </section>
        </Content>
        {
          this.state.edit ? (
            <FullEditor
              initValue={this.state.delta}
              visible={this.state.edit}
              onCancel={() => this.setState({ edit: false })}
              onOk={callback}
            />
          ) : null
        }
      </Sidebar>
    );
  }
}
export default Form.create({})(withRouter(DailyLog));
