import React from "react";
import {mount} from "react-mounter";
import {FlowRouter} from "meteor/kadira:flow-router";
import connectionManager from "../imports/connection-manager";
import appUtils from "../imports/app-utils";

import Layout from "../imports/containers/layout-container";
import VisualExplorer from "../imports/containers/visual-explorer-container";
import TableExplorer from "../imports/containers/table-explorer-container";
import ScenarioPlanner from "../imports/containers/scenario-planner-container";
import BuildEditor from "../imports/containers/build-editor-container";
import PhysicalYoung from "../imports/containers/physical-young-container";


// Register a trigger to be called before every route.
FlowRouter.triggers.enter([function(context, redirect) {
  // If the connection manager hasn't established a DDP connection yet, do it now.
  if (!connectionManager.connected) {
    connectionManager.connect();
  }
  // If there is an access token on the query string, use it to authenticate the connection.
  if (context.queryParams.access_token) {
    connectionManager.useToken(context.queryParams.access_token);
    // Redirect to root page after authentication.
    redirect("/");
  }
}]);

const onToggleNav = () => {
  const qp = {};
  if (FlowRouter.getQueryParam(appUtils.constants.query.viewMode) === "w") {
    // Handle change in navigation bar docked state.
    const sideBarOpen = FlowRouter.getQueryParam(appUtils.constants.query.dockedSideBarOpen) || "1";
    qp[appUtils.constants.query.dockedSideBarOpen] = sideBarOpen === "0" ? 1 : 0;
    FlowRouter.setQueryParams(qp);
  } else {
    // Toggle floating navigation bar state.
    const sideBarOpen = FlowRouter.getQueryParam(appUtils.constants.query.floatingSideBarOpen) || "0";
    qp[appUtils.constants.query.floatingSideBarOpen] = sideBarOpen === "0" ? 1 : 0;
    FlowRouter.setQueryParams(qp);
  }  
};

const getRouteDefaults = function(queryParams) {
  const oldRoute = FlowRouter.current().oldRoute;
  const defaultViewMode = oldRoute ? oldRoute.getQueryParam(appUtils.constants.query.viewMode) : "w";
  const defaultDocked = oldRoute ? oldRoute.getQueryParam(appUtils.constants.query.dockedSideBarOpen) : "1";
  const defaultFloating = oldRoute ? oldRoute.getQueryParam(appUtils.constants.query.floatingSideBarOpen) : "0";
  
  const currentDocked = queryParams[appUtils.constants.query.dockedSideBarOpen] || defaultDocked;
  const currentFloating = queryParams[appUtils.constants.query.floatingSideBarOpen] || defaultFloating;
  const currentWideMode = queryParams[appUtils.constants.query.viewMode] || defaultViewMode;

  const routeProperties = {};
  routeProperties.dockedSideBarOpen = currentDocked !== "0";
  routeProperties.floatingSideBarOpen = currentFloating === "1";
  routeProperties.wideViewMode = currentWideMode === "w";
  routeProperties.activeSideBar = queryParams[appUtils.constants.query.sideBarView];
  routeProperties.onToggleNav = onToggleNav;

  return routeProperties;
};

// This is the default route - render the explorer
FlowRouter.route("/", {
  name: "root",
  action: function(params, queryParams) {
    mount(Layout, { onToggleNav: onToggleNav, content: function() {       
      return <VisualExplorer  scenarioPoplet={params.scenarioPoplet} {...getRouteDefaults(queryParams)} />; 
    }});
  }
});

FlowRouter.route("/view-scenario/:scenarioPoplet", {
  name: "scenarioexplore",
  action: function(params, queryParams) {
    mount(Layout, { content: function() { return <VisualExplorer scenarioPoplet={params.scenarioPoplet}/>; } });
  }
});

FlowRouter.route("/table-explorer", {
  name: "table",
  action: function(params, queryParams) {
    mount(Layout, { onToggleNav: onToggleNav, content: function() { 
      return <TableExplorer {...getRouteDefaults(queryParams)} />;
    }}); 
  }
});

FlowRouter.route("/scenario-planner", {
  name: "planner",
  action: function(params, queryParams) {
    mount(Layout, { onToggleNav: onToggleNav, content: function() { 
      return <ScenarioPlanner {...getRouteDefaults(queryParams)} />; 
    }});
  }
});

FlowRouter.route("/build-editor/:buildId", {
  name: "builder",
  action: function(params, queryParams) {
    mount(Layout, { content: function() { return <BuildEditor resourceId={params.buildId} options={{limit:5000}} />; } });
  }
});

FlowRouter.route("/demand-pack/physical-support-18-64", {
  name: "physicalYoung",
  action: function(params, queryParams) {
    mount(Layout, { content: function() { return <PhysicalYoung />; } });
  }
});


// Redirect to the TDX auth server - as configured in the "authServerURL" property in settings.json 
FlowRouter.route("/auth-server", {
  name: "authServerRedirect",
  triggersEnter: [function(context, redirect) {
    console.log("redirecting to auth server");
    window.location = Meteor.settings.public.authServerURL + "/auth/?rurl=" + window.location.href;        
  }]  
});

// Logout 
FlowRouter.route("/logout", {
  name: "logout",
  triggersEnter: [function(context, redirect) {
    connectionManager.logout();
    redirect("/");
  }]
});

