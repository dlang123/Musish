import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { DragSource } from 'react-dnd';
import cx from 'classnames';
import classes from './AlbumItem.scss';
import AlbumPanel from './AlbumPanel';
import ModalContext from '../../common/Modal/ModalContext';
import DragDropType from '../../../utils/Constants/DragDropType';

class AlbumItem extends Component {
  constructor(props) {
    super(props);

    this.handleOpen = this.handleOpen.bind(this);
  }

  handleOpen(push) {
    const id = this.props.id || this.props.album.id;

    if (this.props.navigate) {
      this.props.history.push(`/albums/${id}`);
    } else {
      push(<AlbumPanel id={id} />);
    }
  }

  render() {
    const { album, size, connectDragSource, isOver } = this.props;
    const artwork = MusicKit.formatArtworkURL(album.attributes.artwork, size, size);

    return connectDragSource(
      <div
        className={cx(classes.container, { [classes.droppable]: isOver })}
        style={{ width: size }}
      >
        <ModalContext.Consumer>
          {({ push }) => (
            <div onClick={() => this.handleOpen(push)}>
              <div className={classes.imageContainer} style={{ width: size, height: size }}>
                <img
                  src={artwork}
                  className={classes.image}
                  style={{ width: size, height: size }}
                  alt={album.attributes.name}
                  title={album.attributes.name}
                />
              </div>

              <div className={classes.descriptionContainer}>
                <span className={classes.albumName} style={{ width: size }}>
                  {album.attributes.name}
                </span>
                <span className={classes.artistName} style={{ width: size }}>
                  {album.attributes.artistName}
                </span>
              </div>
            </div>
          )}
        </ModalContext.Consumer>
      </div>
    );
  }
}

AlbumItem.propTypes = {
  navigate: PropTypes.bool,
  history: PropTypes.any.isRequired,
  album: PropTypes.any,
  id: PropTypes.any,
  size: PropTypes.number.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  isOver: PropTypes.bool,
};

AlbumItem.defaultProps = {
  navigate: false,
  album: null,
  id: null,
  isOver: false,
};

const dndSpec = {
  beginDrag(props) {
    return {
      album: props.id || props.album.id,
    };
  },
};

function dndCollect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  };
}

export default DragSource(DragDropType.ALBUM, dndSpec, dndCollect)(withRouter(AlbumItem));
