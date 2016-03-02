// originally from https://github.com/TylerLH/react-native-timeago
// but simplified as discussed on https://github.com/reactjs/react-timer-mixin/issues/4
// and using calendar() for the display method

import React  from 'react-native';
import Moment from 'moment';

export default class TimeAgo extends React.Component {
  constructor( props = { interval: 60000 }) {
    super(props);
  }

  componentDidMount() {
    this.timer = setTimeout(() => { this.forceUpdate() }, this.props.interval);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  render() {
    return (
      <React.Text {...this.props}>
        { Moment(this.props.time).calendar() }
      </React.Text>
    );
  }
}
