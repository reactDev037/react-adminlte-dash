/* eslint-disable no-alert */
import React from 'react';

import pkgInfo from '../package.json';
import {
  Dashboard,
  Header,
  Sidebar,
} from '../src/index';

const navMenu = () => ([
  <Header.Item
    href={`https://github.com/${pkgInfo.user}/${pkgInfo.name}`}
    image="/demo/img/GitHub-Mark-120px-plus.png"
    key={1}
  >
    Github
  </Header.Item>,
  <Header.UserMenu
    name="Alexander Pierce"
    image="/demo/img/user2-160x160.jpg"
    signOutAction={() => alert('Sign out')}
    key={2}
  />,
]);

const sb = () => ([
  <Sidebar.UserPanel
    name="Alexander Pierce"
    image="/demo/img/user2-160x160.jpg"
    online
    key={1}
  />,
  <Sidebar.Search key={2} />,
  <Sidebar.Menu header="MAIN NAVIGATION" key={3}>
    <Sidebar.Menu.Item icon="fa-dashboard" title="Dashboard" >
      <Sidebar.Menu.Item title="Dashboard v1" />
      <Sidebar.Menu.Item title="Dashboard v2" />
    </Sidebar.Menu.Item>
    <Sidebar.Menu.Item icon="fa-files-o" title="Layout Options" >
      <Sidebar.Menu.Item title="Top Navigation" />
      <Sidebar.Menu.Item title="Boxed" />
      <Sidebar.Menu.Item title="Fixed" />
      <Sidebar.Menu.Item title="Collapsed Sidebar" />
    </Sidebar.Menu.Item>
    <Sidebar.Menu.Item icon="fa-th" title="Widgets" />
    <Sidebar.Menu.Item icon="fa-pie-chart" title="Charts" >
      <Sidebar.Menu.Item title="ChartJS" />
      <Sidebar.Menu.Item title="Morris" />
      <Sidebar.Menu.Item title="Flot" />
      <Sidebar.Menu.Item title="Inline Charts" />
    </Sidebar.Menu.Item>
    <Sidebar.Menu.Item icon="fa-laptop" title="UI Elements" >
      <Sidebar.Menu.Item title="General" />
      <Sidebar.Menu.Item title="Icons" />
      <Sidebar.Menu.Item title="Buttons" />
      <Sidebar.Menu.Item title="Sliders" />
      <Sidebar.Menu.Item title="Timeline" />
      <Sidebar.Menu.Item title="Modals" />
    </Sidebar.Menu.Item>
    <Sidebar.Menu.Item icon="fa-edit" title="Forms" >
      <Sidebar.Menu.Item title="General Elements" />
      <Sidebar.Menu.Item title="Advanced Elements" />
      <Sidebar.Menu.Item title="Editors" />
    </Sidebar.Menu.Item>
    <Sidebar.Menu.Item icon="fa-table" title="Tables" >
      <Sidebar.Menu.Item title="Simple tables" />
      <Sidebar.Menu.Item title="Data tables" />
    </Sidebar.Menu.Item>
    <Sidebar.Menu.Item icon="fa-calendar" title="Calendar" />
    <Sidebar.Menu.Item icon="fa-envelope" title="Mailbox" />
    <Sidebar.Menu.Item icon="fa-folder" title="Examples" >
      <Sidebar.Menu.Item title="Invoice" />
      <Sidebar.Menu.Item title="Profile" />
      <Sidebar.Menu.Item title="Login" />
      <Sidebar.Menu.Item title="Register" />
      <Sidebar.Menu.Item title="Lockscreen" />
      <Sidebar.Menu.Item title="404 Error" />
      <Sidebar.Menu.Item title="500 Error" />
      <Sidebar.Menu.Item title="Blank Page" />
      <Sidebar.Menu.Item title="Pace Page" />
    </Sidebar.Menu.Item>
    <Sidebar.Menu.Item icon="fa-share" title="Multilevel">
      <Sidebar.Menu.Item icon="fa-circle-o" title="Level One" />
      <Sidebar.Menu.Item icon="fa-circle-o" title="Level One" >
        <Sidebar.Menu.Item icon="fa-circle-o" title="Level Two" />
        <Sidebar.Menu.Item icon="fa-circle-o" title="Level Two" >
          <Sidebar.Menu.Item icon="fa-circle-o" title="Level Three" />
        </Sidebar.Menu.Item>
      </Sidebar.Menu.Item>
      <Sidebar.Menu.Item icon="fa-circle-o" title="Level One" />
    </Sidebar.Menu.Item>
    <Sidebar.Menu.Item active icon="fa-book" title="Documentation" />
  </Sidebar.Menu>,
  <Sidebar.Menu header="LABELS" key={4}>
    <Sidebar.Menu.Item title="Important" />
    <Sidebar.Menu.Item title="Warning" />
    <Sidebar.Menu.Item title="Information" />
  </Sidebar.Menu>,
]);

const App = ({ children }) => (
  <div>
    <Dashboard
      navbarChildren={navMenu()}
      sidebarChildren={sb()}
      sidebarMini
      theme="skin-blue"
    >
      {children}
    </Dashboard>
  </div>
);

App.propTypes = {
  children: React.PropTypes.node,
};

export default App;
