import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Menu, Dropdown, Icon,  
} from 'choerodon-ui';
import {
  Page, Header, Content, stores, 
} from 'choerodon-front-boot';
import { FormattedMessage } from 'react-intl';
import './ReportHome.less';
import Pic from './pic.svg';
import Pic2 from './pic2.svg';


const { AppState } = stores;
const styles = {
  itemContainer: {
    marginRight: 24,
    width: 280, 
    height: 296, 
    background: '#FAFAFA', 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center',
    padding: 18,
    fontSize: '13px',
  },
  imgContainer: {                
    width: 220,
    height: 154,
    textAlign: 'center',
    lineHeight: '154px',
    // padding: '30px 10px',
    boxShadow: '0 1px 0 0 rgba(0,0,0,0.16), 0 0 0 1px rgba(0,0,0,0.12), 0 2px 1px -1px rgba(0,0,0,0.12)',
    borderRadius: 2, 
    background: 'white',
  },
  itemTextBold: { 
    color: 'black',
    width: '100%', 
    margin: '18px 0', 
    fontWeight: 500, 
  },
};
class ReportHome extends Component {
  render() {
    const urlParams = AppState.currentMenuType;
    const menu = (
      <Menu style={{ marginTop: 35 }}>
        <Menu.Item key="0">
          <Link to={`/testManager/report/story?type=${urlParams.type}&id=${urlParams.id}&name=${urlParams.name}`}>
            <FormattedMessage id="report_dropDown_demand" /> 
          </Link>
        </Menu.Item>
        <Menu.Item key="1">
          <Link to={`/testManager/report/test?type=${urlParams.type}&id=${urlParams.id}&name=${urlParams.name}`}>
            <FormattedMessage id="report_dropDown_defect" /> 
          </Link>
        </Menu.Item>      
      </Menu>
    );
    
    return (
      <Page className="c7n-report-home">
        <Header title={<FormattedMessage id="report_title" />}>
          <Dropdown overlay={menu} trigger={['click']}>
            <a className="ant-dropdown-link" href="#">
              <FormattedMessage id="report_switch" /> 
              <Icon type="arrow_drop_down" />
            </a>
          </Dropdown>          
          {/* <Button onClick={this.getInfo}>
            <Icon type="autorenew icon" />
            <span><FormattedMessage id="refresh" /></span>
          </Button> */}
        </Header>
        <Content
          // style={{
          //   padding: '0 0 10px 0',
          // }}
          title={<FormattedMessage id="report_content_title" />}
          description={<FormattedMessage id="report_content_description" />}
          link="http://v0-8.choerodon.io/zh/docs/user-guide/test-management/test-report/report/"
        >
          <div style={{ display: 'flex' }}>
            <Link to={`/testManager/report/story?type=${urlParams.type}&id=${urlParams.id}&name=${urlParams.name}`}>
              <div style={styles.itemContainer}>
                <div style={styles.imgContainer}>
                  <img src={Pic} alt="" />
                </div>
                <div style={styles.itemTextBold}><FormattedMessage id="report_demandToDefect" /></div>
                <div style={{ color: 'rgba(0,0,0,0.65)' }}><FormattedMessage id="report_demandToDefect_description" /></div>
              </div>
            </Link>
            <Link to={`/testManager/report/test?type=${urlParams.type}&id=${urlParams.id}&name=${urlParams.name}`}>
              <div style={styles.itemContainer}>
                <div style={styles.imgContainer}>
                  <img src={Pic2} alt="" />
                </div>
                <div style={styles.itemTextBold}><FormattedMessage id="report_defectToDemand" /></div>
                <div style={{ color: 'rgba(0,0,0,0.65)' }}><FormattedMessage id="report_defectToDemand_description" /></div>
              </div>
            </Link>
          </div>
        </Content>
      </Page>
    );
  }
}

ReportHome.propTypes = {

};

export default ReportHome;
