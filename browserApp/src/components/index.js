import Entry from './Entry'; // log in or create new user
import Welcome from './Welcome'; // welcome page once user logs in

import LogIn from './LogIn'; // component to log in
import Register from './Register'; // component to register as a new user

import MenuBar from './MenuBar'; // menu bar component for top of app;
import SliceMenu from './SliceMenu'; // menu bar for Slices component;

import StreamSliceView from './StreamSliceView'; // menu component for main stream/slice view;

import Slices from './Slices'; // component for viewing slices
import Streams from './Streams'; // displays streams in the side menu

import CreateSlice from './CreateSlice'; // component to create new slice
import CreateStream from './CreateStream'; // component to create new stream

import NavButton from './NavButton'; // button specifically for nagivating via a route
import ToggleSideMenu from './ToggleSideMenu'; // button just to toggle side menu

export {
  CreateSlice,
  CreateStream,
  Entry,
  LogIn,
  MenuBar,
  NavButton,
  Register,
  SliceMenu,
  Slices,
  Streams,
  StreamSliceView,
  ToggleSideMenu,
  Welcome
};
