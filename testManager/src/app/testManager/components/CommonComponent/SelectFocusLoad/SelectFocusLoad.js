import React, { Component } from 'react';
import { Table, Button, Icon, Card, Select, Spin, Upload, Tooltip } from 'choerodon-ui';
const Option = Select.Option;
const styles = {
  cardTitle: {
    fontWeight: 'bold',
    display: 'flex',
  },
  cardTitleText: {
    lineHeight: '20px',
    marginLeft: '5px',
  },
  cardBodyStyle: {
    // maxHeight: '100%',
    padding: 12,
    overflow: 'hidden',
  },
  cardContent: {

  },
  carsContentItemPrefix: {
    width: 105,
    color: 'rgba(0,0,0,0.65)',
    fontSize: 13,
  },
  cardContentItem: {
    display: 'flex',
    marginLeft: 24,
    marginTop: 10,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontSize: 13,
    lineHeight: '20px',
    color: 'rgba(0, 0, 0, 0.65)',
  },
  statusOption: {
    width: 60,
    textAlign: 'center',
    borderRadius: '100px',
    display: 'inline-block',
    color: 'white',
  },
  userOption: {
    background: '#c5cbe8',
    color: '#6473c3',
    width: '20px',
    height: '20px',
    textAlign: 'center',
    lineHeight: '20px',
    borderRadius: '50%',
    marginRight: '8px',
  },
};
class SelectFocusLoad extends Component {
  state = {
    loading: false,
    List: [],
  }
  render() {
    const { onChange, request } = this.props;
    const { loading,List } = this.state;
    const Options = List.map(item =>
      (<Option key={item.id} value={item.realName}>
        <div style={{ display: 'inline-flex', alignItems: 'center', padding: '2px' }}>
          <div style={styles.userOption}>
            {item.imageUrl ? <img src={item.imageUrl} alt="" /> : item.realName.slice(0, 1)}
          </div>
          <span>{`${item.loginName} ${item.realName}`}</span>
        </div>
      </Option>),
    );
    return (<Select
      {...this.props}      
      loading={loading}
      onFocus={() => {
        this.setState({
          loading: true,
        });
        request().then((Data) => {
          this.setState({
            List: Data.content,
            loading: false,
          });
        });
      }}
    >
      {Options}
    </Select>);
  }
}

SelectFocusLoad.propTypes = {

};

export default SelectFocusLoad;
