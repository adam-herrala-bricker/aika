import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {closeSideMenu} from '../reducers/viewReducer';
import {Menu, Segment, Sidebar, SidebarPusher, SidebarPushable} from 'semantic-ui-react';
import {Streams, Slices} from '.';

const MenuSide = () => {
  const dispatch = useDispatch();
  const slicesRef = React.useRef(); // used to close menu on click
  const {showSideMenu} = useSelector((i) => i.view);

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
            <Slices/>
          </SidebarPusher>
        </div>
      </SidebarPushable>
    </div>
  );
};

export default MenuSide;
