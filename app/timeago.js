// originally from https://github.com/TylerLH/react-native-timeago
// but simplified a lot and using calendar() for the display method

import React  from 'react-native';
import Moment from 'moment';

export default class TimeAgo extends React.Component {
  constructor( props = { interval: 60000 }) {
    super(props);
  }

  componentDidMount() {
    if (this.props.interval > 0) {
      setInterval(this.update, this.props.interval);
    }
  }

  componentWillUnmount() {
    if (this.update) {
      clearInterval(this.update);
    }
  }

  render() {
    return (
      <React.Text {...this.props}>
        { Moment(this.props.time).calendar() }
      </React.Text>
    );
  }
}
