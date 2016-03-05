'use strict'

import React from 'react-native'

export default class ErrorBar extends React.Component {
  render() {
    let backgroundColor = '#f88080' // Pink
    if (this.props.green) {
      backgroundColor = '#108010'   // Green
    }
    return (
      <React.TouchableHighlight style={ [this.props.viewStyle, { backgroundColor: backgroundColor }]}
        onPress={ () => { typeof this.props.onPress === 'function'? this.props.onPress() : null} }>
        <React.Text style={this.props.textStyle}>
          { this.props.textMessage }
        </React.Text>
      </React.TouchableHighlight>
    );
  }
}

ErrorBar.defaultProps = {
  onPress:   null,
  green:     false,
  viewStyle: { height: 24, alignItems: 'center', justifyContent: 'center' },
  textStyle: { margin: 2, textAlign: 'center', fontFamily: 'System', fontSize: 14, color: 'white' },
}
