import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {closeSideMenu} from '../reducers/viewReducer';
import {Menu, Segment, Sidebar, SidebarPusher, SidebarPushable} from 'semantic-ui-react';
import {Streams, Slices, StreamInfo} from '.';

const StreamSliceView = () => {
  const dispatch = useDispatch();
  const slicesRef = React.useRef(); // used to close menu on click
  const {showSideMenu, streamSliceMain} = useSelector((i) => i.view);
  const {loadedId} = useSelector((i) => i.stream);

  return (
    <div className = 'menu-side-container'>
      <SidebarPushable
        as = {Segment}
        className = 'menu-side-style'>
        <Sidebar
          animation = 'overlay'
          as = {Menu}
          className = 'menu-side-style'
          onHide = {() => dispatch(closeSideMenu())}
          target = {slicesRef}
          vertical
          visible = {showSideMenu}
          width = 'thin'>
          <Streams />
        </Sidebar>
        <div ref = {slicesRef}>
          <SidebarPusher>
            {loadedId && streamSliceMain === 'slice' && <Slices/>}
            {loadedId && streamSliceMain === 'info' && <StreamInfo />}
          </SidebarPusher>
        </div>
      </SidebarPushable>
    </div>
  );
};

export default StreamSliceView;
