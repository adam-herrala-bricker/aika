import Entry from './Entry'; // log in or create new user
import StreamSliceView from './StreamSliceView'; // menu component for main stream/slice view;

import LogIn from './LogIn'; // component to log in
import Register from './Register'; // component to register as a new user

import MenuBar from './MenuBar'; // menu bar component for top of app;
import SliceMenu from './SliceMenu'; // menu bar for Slices component;

import Slices from './Slices'; // component for viewing slices
import Streams from './Streams'; // displays streams in the side menu

import StreamInfo from './StreamInfo'; // view info for a stream, set permissions, delete
import ShareForm from './ShareForm'; // form used to share stream with new user

import Settings from './Settings'; // component for user + app settings
import SettingsButton from './SettingsButton'; // used on *Streams* to direct to settings

import CreateSlice from './CreateSlice'; // component to create new slice
import CreateStream from './CreateStream'; // component to create new stream

import NavButton from './NavButton'; // button specifically for nagivating via a route
import ToggleSideMenu from './ToggleSideMenu'; // button just to toggle side menu

import ExpandBox from './ExpandBox'; // wrapper for a box, which expands

export {
  CreateSlice,
  CreateStream,
  Entry,
  ExpandBox,
  LogIn,
  MenuBar,
  NavButton,
  Register,
  Settings,
  SettingsButton,
  ShareForm,
  SliceMenu,
  Slices,
  StreamInfo,
  Streams,
  StreamSliceView,
  ToggleSideMenu
};
